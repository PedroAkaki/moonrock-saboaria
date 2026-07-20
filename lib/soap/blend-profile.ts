import type { Oil } from "@/lib/soap/oils";

export type BlendMetric = "hardness" | "cleansing" | "conditioning" | "bubbly" | "creamy";
export type BlendGoalId = "balanced" | "firm" | "creamy";
export type BlendGoalCriterion = BlendMetric | "iodine" | "ins";

export interface OilBlendItem {
  oilId: string;
  percentage: number;
}

export interface BlendProfile {
  percentageTotal: number;
  hardness: number;
  cleansing: number;
  conditioning: number;
  bubbly: number;
  creamy: number;
  iodine: number;
  ins: number;
}

export interface BlendGoalAssessment {
  meetsGoal: boolean;
  unmetCriteria: BlendGoalCriterion[];
}

interface BlendGoalMetric {
  min: number;
  max: number;
  weight: number;
}

export interface BlendGoal {
  id: BlendGoalId;
  label: string;
  description: string;
  metrics: Record<BlendMetric, BlendGoalMetric>;
  iodineMax: number;
  insMin: number;
  insMax: number;
}

export const BLEND_GOALS: Record<BlendGoalId, BlendGoal> = {
  balanced: {
    id: "balanced",
    label: "Equilibrada",
    description: "Uma barra de referência para comparar ajustes.",
    metrics: {
      hardness: { min: 2.5, max: 3.7, weight: 1 },
      cleansing: { min: 1.5, max: 2.8, weight: 1.1 },
      conditioning: { min: 3, max: 4.5, weight: 1 },
      bubbly: { min: 2, max: 3.5, weight: 0.8 },
      creamy: { min: 2.5, max: 4, weight: 0.9 },
    },
    iodineMax: 100,
    insMin: 136,
    insMax: 170,
  },
  firm: {
    id: "firm",
    label: "Mais firme",
    description: "Prioriza estrutura sem ignorar condicionamento.",
    metrics: {
      hardness: { min: 3.4, max: 4.5, weight: 1.4 },
      cleansing: { min: 1.5, max: 3, weight: 0.8 },
      conditioning: { min: 2.5, max: 4.2, weight: 0.8 },
      bubbly: { min: 2, max: 3.5, weight: 0.6 },
      creamy: { min: 2.8, max: 4.5, weight: 1 },
    },
    iodineMax: 90,
    insMin: 136,
    insMax: 175,
  },
  creamy: {
    id: "creamy",
    label: "Mais cremosa",
    description: "Prioriza cremosidade e condicionamento.",
    metrics: {
      hardness: { min: 2.5, max: 3.8, weight: 0.8 },
      cleansing: { min: 1.5, max: 2.5, weight: 1 },
      conditioning: { min: 3.2, max: 4.8, weight: 1.1 },
      bubbly: { min: 2, max: 3.6, weight: 0.7 },
      creamy: { min: 3.5, max: 4.8, weight: 1.4 },
    },
    iodineMax: 100,
    insMin: 130,
    insMax: 170,
  },
};

function round(value: number): number {
  return Number(value.toFixed(1));
}

const COMPARISON_EPSILON = 1e-9;

function calculateRawBlendProfile(selection: OilBlendItem[], oilLibrary: Oil[]): BlendProfile | null {
  const oilMap = new Map(oilLibrary.map((oil) => [oil.id, oil]));
  const percentageTotal = selection.reduce((sum, item) => sum + item.percentage, 0);
  if (!Number.isFinite(percentageTotal) || percentageTotal <= 0 || selection.length === 0) return null;

  const totals = {
    hardness: 0,
    cleansing: 0,
    conditioning: 0,
    bubbly: 0,
    creamy: 0,
    iodine: 0,
    ins: 0,
  };

  // A ordem em que a pessoa seleciona os óleos não pode mudar a sugestão.
  for (const item of [...selection].sort((left, right) => left.oilId.localeCompare(right.oilId))) {
    const oil = oilMap.get(item.oilId);
    if (!oil || !Number.isFinite(item.percentage) || item.percentage < 0) return null;
    const factor = item.percentage / percentageTotal;
    totals.hardness += oil.hardness * factor;
    totals.cleansing += oil.cleansing * factor;
    totals.conditioning += oil.conditioning * factor;
    totals.bubbly += oil.bubbly * factor;
    totals.creamy += oil.creamy * factor;
    totals.iodine += oil.iodine * factor;
    totals.ins += oil.ins * factor;
  }

  return {
    percentageTotal,
    hardness: totals.hardness,
    cleansing: totals.cleansing,
    conditioning: totals.conditioning,
    bubbly: totals.bubbly,
    creamy: totals.creamy,
    iodine: totals.iodine,
    ins: totals.ins,
  };
}

function roundBlendProfile(profile: BlendProfile): BlendProfile {
  return {
    percentageTotal: round(profile.percentageTotal),
    hardness: round(profile.hardness),
    cleansing: round(profile.cleansing),
    conditioning: round(profile.conditioning),
    bubbly: round(profile.bubbly),
    creamy: round(profile.creamy),
    iodine: round(profile.iodine),
    ins: round(profile.ins),
  };
}

export function calculateBlendProfile(selection: OilBlendItem[], oilLibrary: Oil[]): BlendProfile | null {
  const rawProfile = calculateRawBlendProfile(selection, oilLibrary);
  return rawProfile ? roundBlendProfile(rawProfile) : null;
}

export function isMetricWithinGoal(profile: BlendProfile, goal: BlendGoal, metric: BlendMetric): boolean {
  const range = goal.metrics[metric];
  return profile[metric] >= range.min - COMPARISON_EPSILON && profile[metric] <= range.max + COMPARISON_EPSILON;
}

export function assessBlendGoal(profile: BlendProfile, goal: BlendGoal): BlendGoalAssessment {
  const unmetCriteria: BlendGoalCriterion[] = (Object.keys(goal.metrics) as BlendMetric[])
    .filter((metric) => !isMetricWithinGoal(profile, goal, metric));

  if (profile.iodine > goal.iodineMax + COMPARISON_EPSILON) unmetCriteria.push("iodine");
  if (profile.ins < goal.insMin - COMPARISON_EPSILON || profile.ins > goal.insMax + COMPARISON_EPSILON) unmetCriteria.push("ins");

  return {
    meetsGoal: unmetCriteria.length === 0,
    unmetCriteria,
  };
}

function normalizedDistance(value: number, min: number, max: number): number {
  if (value >= min - COMPARISON_EPSILON && value <= max + COMPARISON_EPSILON) return 0;
  const width = max - min;
  return (value < min ? min - value : value - max) / width;
}

export function scoreBlendForGoal(profile: BlendProfile, goal: BlendGoal, selection: OilBlendItem[], oilLibrary: Oil[]): number {
  let score = 0;
  for (const metric of Object.keys(goal.metrics) as BlendMetric[]) {
    const target = goal.metrics[metric];
    score += normalizedDistance(profile[metric], target.min, target.max) * target.weight;
  }
  score += normalizedDistance(profile.iodine, 0, goal.iodineMax) * 0.8;
  score += normalizedDistance(profile.ins, goal.insMin, goal.insMax) * 0.6;

  const oilMap = new Map(oilLibrary.map((oil) => [oil.id, oil]));
  const highDosPercent = selection.reduce((sum, item) => (
    oilMap.get(item.oilId)?.dosRisk === "alto" ? sum + item.percentage : sum
  ), 0);
  return score + (highDosPercent / 100) * 0.8;
}

export interface BlendSuggestion {
  selection: OilBlendItem[];
  profile: BlendProfile;
  score: number;
  assessment: BlendGoalAssessment;
}

function selectionTieBreaker(selection: OilBlendItem[]): string {
  return selection
    .map((item) => `${item.oilId}:${item.percentage.toFixed(4).padStart(8, "0")}`)
    .join("|");
}

/**
 * Busca determinística em incrementos de 5%. É intencionalmente pequena e
 * explicável: até quatro óleos já escolhidos pela usuária, sem otimizador geral.
 */
export function suggestOilBlend(goalId: BlendGoalId, oilIds: string[], oilLibrary: Oil[]): BlendSuggestion | null {
  const uniqueOilIds = [...new Set(oilIds)].sort((left, right) => left.localeCompare(right));
  if (uniqueOilIds.length === 0 || uniqueOilIds.length > 4) return null;
  const oilMap = new Map(oilLibrary.map((oil) => [oil.id, oil]));
  const selectedOils = uniqueOilIds.map((oilId) => oilMap.get(oilId));
  if (selectedOils.some((oil) => oil === undefined || oil.confidenceLevel === "bloqueado")) return null;

  const goal = BLEND_GOALS[goalId];
  const step = 5;
  const minimum = uniqueOilIds.length === 1 ? 100 : step;
  let best: BlendSuggestion | null = null;

  const visit = (index: number, remaining: number, current: OilBlendItem[]) => {
    const oil = selectedOils[index];
    if (!oil) return;
    if (index === uniqueOilIds.length - 1) {
      if (remaining < minimum || remaining > oil.maxPercent || remaining % step !== 0) return;
      const selection = [...current, { oilId: oil.id, percentage: remaining }];
      const rawProfile = calculateRawBlendProfile(selection, oilLibrary);
      if (!rawProfile) return;
      const score = scoreBlendForGoal(rawProfile, goal, selection, oilLibrary);
      const profile = roundBlendProfile(rawProfile);
      const assessment = assessBlendGoal(rawProfile, goal);
      const candidate = { selection, profile, score, assessment };
      const candidateTieBreaker = selectionTieBreaker(selection);
      const currentTieBreaker = best ? selectionTieBreaker(best.selection) : "";
      if (!best || score < best.score || (score === best.score && candidateTieBreaker < currentTieBreaker)) {
        best = candidate;
      }
      return;
    }

    const maximum = Math.min(oil.maxPercent, remaining - minimum * (uniqueOilIds.length - index - 1));
    for (let percentage = minimum; percentage <= maximum; percentage += step) {
      visit(index + 1, remaining - percentage, [...current, { oilId: oil.id, percentage }]);
    }
  };

  visit(0, 100, []);
  return best;
}
