import { AppProgress, getProgress } from "./progress";

interface RecipeLike {
  id: string;
  relatedModuleSlugs?: string[];
}

interface ModuleLike {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
  summary?: string;
  quiz?: unknown[];
  conclusion_criteria?: string[];
  beforePracticeChecklist?: string[];
  studyCards?: unknown[];
}

export interface ModuleLearningProgress {
  slug: string;
  title: string;
  level: number;
  status: string;
  /** Overall progress 0-100 */
  progressPercent: number;
  /** Quiz answered / total */
  quizDone: number;
  quizTotal: number;
  /** Conclusion criteria checked / total */
  checklistDone: number;
  checklistTotal: number;
  /** Before-practice items checked / total */
  bpDone: number;
  bpTotal: number;
  /** Whether a related recipe exists in recipes.json */
  hasRelatedRecipe: boolean;
  microStatus: string[];
}

export interface NextAction {
  slug: string;
  label: string;
  href: string;
}

export interface LearningStats {
  total: number;
  available: number;
  inProgress: number;
  completed: number;
  locked: number;
}

export interface Achievement {
  id: string;
  label: string;
  earned: boolean;
}

/**
 * Check if a module slug has a related recipe.
 * Uses a direct require to avoid JSON module resolution issues in lib/.
 */
function hasRelatedRecipeForSlug(slug: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require("@/data/recipes.json") as { recipes: RecipeLike[] };
    return data.recipes.some((r) => r.relatedModuleSlugs?.includes(slug));
  } catch {
    return false;
  }
}

/**
 * Get granular progress for a single module.
 */
export function getModuleLearningProgress(
  mod: ModuleLike,
  progress: AppProgress
): ModuleLearningProgress {
  const mp = progress.modules[mod.slug];
  const quizTotal = (mod.quiz as any[])?.length ?? 0;
  const checklistTotal = mod.conclusion_criteria?.length ?? 0;
  const bpTotal = mod.beforePracticeChecklist?.length ?? 0;

  // Quiz: count answered (non-empty)
  let quizDone = 0;
  if (mp?.quizAnswers) {
    quizDone = Object.values(mp.quizAnswers).filter(
      (v: any) => v !== undefined && v !== ""
    ).length;
  }

  // Checklist: count checked
  let checklistDone = 0;
  if (mp?.checklist) {
    checklistDone = Object.values(mp.checklist).filter(Boolean).length;
  }

  // Before-practice: count checked
  let bpDone = 0;
  if (mp?.beforePractice) {
    bpDone = Object.values(mp.beforePractice).filter(Boolean).length;
  }

  // Related recipe check
  const hasRelatedRecipe = hasRelatedRecipeForSlug(mod.slug);

  // Micro-status text
  const microStatus: string[] = [];
  if (quizTotal > 0 && quizDone < quizTotal) {
    microStatus.push(`Quiz: ${quizDone}/${quizTotal}`);
  }
  if (quizTotal > 0 && quizDone >= quizTotal) {
    microStatus.push("Quiz ✅");
  }
  if (checklistTotal > 0 && checklistDone >= checklistTotal) {
    microStatus.push("Concluído ✅");
  } else if (checklistDone > 0) {
    microStatus.push(`Checklist: ${checklistDone}/${checklistTotal}`);
  }
  if (bpTotal > 0 && bpDone < bpTotal) {
    microStatus.push(`Pré-bancada: ${bpDone}/${bpTotal}`);
  } else if (bpTotal > 0 && bpDone >= bpTotal) {
    microStatus.push("Pré-bancada ✅");
  }
  if (hasRelatedRecipe && mp?.status !== "completed") {
    microStatus.push("Receita disponível");
  }

  // Overall percent
  const totalItems = quizTotal + checklistTotal + bpTotal;
  const doneItems = quizDone + checklistDone + bpDone;
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((doneItems / totalItems) * 100)) : 0;

  return {
    slug: mod.slug,
    title: mod.title,
    level: mod.level,
    status: mod.status,
    progressPercent,
    quizDone,
    quizTotal,
    checklistDone,
    checklistTotal,
    bpDone,
    bpTotal,
    hasRelatedRecipe,
    microStatus,
  };
}

/**
 * Determine the single next learning action for a module.
 */
export function getNextAction(
  mod: ModuleLike,
  detail: ModuleLearningProgress,
  progress: AppProgress
): NextAction | null {
  if (mod.status !== "available") return null;
  const mp = progress.modules[mod.slug];

  // If already completed, suggest review
  if ((mp as any)?.status === "completed") {
    return { slug: mod.slug, label: "Revisar módulo", href: `/aprendizado/${mod.slug}` };
  }

  // 1. Quiz first — unfinished quiz
  if (detail.quizTotal > 0 && detail.quizDone < detail.quizTotal) {
    const remaining = detail.quizTotal - detail.quizDone;
    return {
      slug: mod.slug,
      label: `Responder ${remaining} pergunta(s) de fixação`,
      href: `/aprendizado/${mod.slug}`,
    };
  }

  // 2. Before-practice checklist
  if (detail.bpTotal > 0 && detail.bpDone < detail.bpTotal) {
    return {
      slug: mod.slug,
      label: `Marcar checklist de segurança (${detail.bpDone}/${detail.bpTotal})`,
      href: `/aprendizado/${mod.slug}`,
    };
  }

  // 3. Try a related recipe
  if (detail.hasRelatedRecipe && mp?.status !== "completed") {
    return {
      slug: mod.slug,
      label: "Praticar com receita relacionada",
      href: `/aprendizado/${mod.slug}`,
    };
  }

  // 4. Conclusion checklist
  if (detail.checklistTotal > 0 && detail.checklistDone < detail.checklistTotal) {
    return {
      slug: mod.slug,
      label: `Finalizar critérios de conclusão (${detail.checklistDone}/${detail.checklistTotal})`,
      href: `/aprendizado/${mod.slug}`,
    };
  }

  // 5. If module is new, suggest starting
  if (!mp || (detail.quizDone === 0 && detail.checklistDone === 0)) {
    return { slug: mod.slug, label: "Começar este módulo", href: `/aprendizado/${mod.slug}` };
  }

  return null;
}

/**
 * Get overall learning stats across all modules.
 */
export function getLearningStats(modules: ModuleLike[], progress: AppProgress): LearningStats {
  let available = 0;
  let inProgress = 0;
  let completed = 0;
  let locked = 0;

  for (const mod of modules) {
    if (mod.status !== "available") {
      locked++;
      continue;
    }
    const mp = progress.modules[mod.slug];
    if (mp?.status === "completed") {
      completed++;
    } else if (mp && (mp.status === "in-progress" || Object.keys(mp.checklist).length > 0)) {
      inProgress++;
    } else {
      available++;
    }
  }

  return {
    total: modules.length,
    available,
    inProgress,
    completed,
    locked,
  };
}

/**
 * Get list of earned achievements based on progress.
 */
export function getAchievements(modules: ModuleLike[], progress: AppProgress): Achievement[] {
  const achievements: Achievement[] = [];

  // Count completed modules
  const completedCount = modules.filter(
    (m) => m.status === "available" && progress.modules[m.slug]?.status === "completed"
  ).length;

  achievements.push({
    id: "first-module",
    label: "Primeiro módulo concluído",
    earned: completedCount >= 1,
  });

  // Check if at least one before-practice checklist has been fully checked
  const anyBpComplete = modules.some((m) => {
    const mp = progress.modules[m.slug];
    if (!mp?.beforePractice) return false;
    const items = Object.values(mp.beforePractice);
    return items.length > 0 && items.every(Boolean);
  });
  achievements.push({
    id: "safety-validated",
    label: "Segurança validada",
    earned: anyBpComplete,
  });

  // Check if cold-process is unlocked (Module 3)
  achievements.push({
    id: "cp-unlocked",
    label: "CP desbloqueado",
    earned: completedCount >= 2,
  });

  return achievements;
}

/**
 * Get the best "continue now" action for the current session.
 */
export function getContinueNowAction(
  modules: ModuleLike[],
  progress: AppProgress
): NextAction | null {
  // Try last visited module first
  if (progress.lastModuleSlug) {
    const lastMod = modules.find((m) => m.slug === progress.lastModuleSlug);
    if (lastMod && lastMod.status === "available" && progress.modules[lastMod.slug]?.status !== "completed") {
      const detail = getModuleLearningProgress(lastMod, progress);
      const action = getNextAction(lastMod, detail, progress);
      if (action) return action;
    }
  }

  // Fallback: first incomplete available module
  for (const mod of modules) {
    if (mod.status !== "available") break;
    const mp = progress.modules[mod.slug];
    if (mp?.status === "completed") continue;
    const detail = getModuleLearningProgress(mod, progress);
    const action = getNextAction(mod, detail, progress);
    if (action) return action;
  }

  // All done
  return { slug: "aprendizado", label: "Revisar estudo", href: "/aprendizado" };
}

/**
 * Safe wrapper: get progress (returns default on server).
 */
export function getClientProgress(): AppProgress {
  if (typeof window === "undefined") {
    return {
      version: 1,
      updatedAt: "",
      lastModuleSlug: null,
      modules: {},
    };
  }
  return getProgress();
}
