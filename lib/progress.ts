export type ModuleStatus = "not-started" | "in-progress" | "completed";

export interface ModuleProgress {
  status: ModuleStatus;
  checklist: Record<string, boolean>;
  beforePractice: Record<string, boolean>;
  quizAnswers: Record<string, string | boolean>;
}

export interface AppProgress {
  version: 1;
  updatedAt: string;
  lastModuleSlug: string | null;
  modules: Record<string, ModuleProgress>;
}

const STORAGE_KEY = "moonrock:progress:v1";

function createDefaultProgress(): AppProgress {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    lastModuleSlug: null,
    modules: {},
  };
}

function normalizeProgress(raw: any): AppProgress {
  const def = createDefaultProgress();
  if (!raw || typeof raw !== "object") return def;
  return {
    version: 1,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : def.updatedAt,
    lastModuleSlug:
      typeof raw.lastModuleSlug === "string" || raw.lastModuleSlug === null
        ? raw.lastModuleSlug
        : null,
    modules:
      raw.modules && typeof raw.modules === "object" && !Array.isArray(raw.modules)
        ? raw.modules
        : {},
  };
}

function parseMaybeJsonString(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return value;
  }
}

function migrateOldKeys(): AppProgress | null {
  if (typeof window === "undefined") return null;

  const progress = createDefaultProgress();
  let foundAny = false;

  // Scan all localStorage keys for old patterns
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key) continue;

    // LevelProgress: moonrock-progress-{slug}
    const checklistMatch = key.match(/^moonrock-progress-(.+)$/);
    if (checklistMatch) {
      try {
        const items = JSON.parse(window.localStorage.getItem(key) || "{}");
        const slug = checklistMatch[1];
        if (!progress.modules[slug]) {
          progress.modules[slug] = {
            status: "not-started",
            checklist: {},
            beforePractice: {},
            quizAnswers: {},
          };
        }
        progress.modules[slug].checklist = items;
        const vals = Object.values(items).filter(Boolean).length;
        progress.modules[slug].status = vals > 0 ? "in-progress" : "not-started";
        foundAny = true;
      } catch {}
      continue;
    }

    // BeforePracticeChecklist: moonrock-before-practice-{slug}
    const bpMatch = key.match(/^moonrock-before-practice-(.+)$/);
    if (bpMatch) {
      try {
        const items = JSON.parse(window.localStorage.getItem(key) || "{}");
        const slug = bpMatch[1];
        if (!progress.modules[slug]) {
          progress.modules[slug] = {
            status: "not-started",
            checklist: {},
            beforePractice: {},
            quizAnswers: {},
          };
        }
        progress.modules[slug].beforePractice = items;
        foundAny = true;
      } catch {}
    }
  }

  if (!foundAny) return null;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  // Clear old keys
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (
      key.startsWith("moonrock-progress-") ||
      key.startsWith("moonrock-before-practice-")
    ) {
      window.localStorage.removeItem(key);
    }
  }

  return progress;
}

export function getProgress(): AppProgress {
  if (typeof window === "undefined") return createDefaultProgress();
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      const migrated = migrateOldKeys();
      return migrated || createDefaultProgress();
    }
    return normalizeProgress(JSON.parse(item));
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: AppProgress): void {
  if (typeof window === "undefined") return;
  try {
    progress.updatedAt = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event("moonrock-progress-updated"));
  } catch {}
}

export function updateLastModule(slug: string | null): void {
  const p = getProgress();
  p.lastModuleSlug = slug;
  if (slug && !p.modules[slug]) {
    p.modules[slug] = {
      status: "not-started",
      checklist: {},
      beforePractice: {},
      quizAnswers: {},
    };
  }
  saveProgress(p);
}

export function updateChecklist(
  slug: string,
  type: "checklist" | "beforePractice",
  item: string,
  value: boolean
): void {
  const p = getProgress();
  if (!p.modules[slug]) {
    p.modules[slug] = {
      status: "not-started",
      checklist: {},
      beforePractice: {},
      quizAnswers: {},
    };
  }
  p.modules[slug][type][item] = value;

  // Auto-update status
  const checkedCount = Object.values(p.modules[slug].checklist).filter(Boolean).length;
  if (checkedCount > 0) {
    p.modules[slug].status = "in-progress";
  }
  saveProgress(p);
}

export function updateQuizAnswer(
  slug: string,
  questionId: string,
  answer: string | boolean
): void {
  const p = getProgress();
  if (!p.modules[slug]) {
    p.modules[slug] = {
      status: "not-started",
      checklist: {},
      beforePractice: {},
      quizAnswers: {},
    };
  }
  p.modules[slug].quizAnswers[questionId] = answer;
  saveProgress(p);
}

export function setModuleStatus(slug: string, status: ModuleStatus): void {
  const p = getProgress();
  if (!p.modules[slug]) {
    p.modules[slug] = {
      status: "not-started",
      checklist: {},
      beforePractice: {},
      quizAnswers: {},
    };
  }
  p.modules[slug].status = status;
  saveProgress(p);
}

export function getModuleProgressPercent(
  slug: string,
  totalCriteria: number,
  totalQuiz: number,
  totalBeforePractice: number
): number {
  const p = getProgress();
  const mp = p.modules[slug];
  if (!mp) return 0;

  const checklistDone = Object.values(mp.checklist).filter(Boolean).length;
  const quizDone = Object.values(mp.quizAnswers).filter(
    (v) => v !== undefined && v !== ""
  ).length;
  const bpDone = Object.values(mp.beforePractice).filter(Boolean).length;

  const total = totalCriteria + totalQuiz + totalBeforePractice;
  const done = checklistDone + quizDone + bpDone;

  if (total === 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

export function exportProgress(): string {
  return JSON.stringify(getProgress(), null, 2);
}

export function importProgress(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.version !== 1 || !parsed.modules) return false;
    saveProgress(normalizeProgress(parsed));
    return true;
  } catch {
    return false;
  }
}
