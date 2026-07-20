import type { Oil } from "@/lib/soap/oils";

export type BlendMetric = "hardness" | "cleansing" | "conditioning" | "bubbly" | "creamy";
export type BlendGoalId = "balanced" | "firm" | "creamy";

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

export function calculateBlendProfile(selection: OilBlendItem[], oilLibrary: Oil[]): BlendProfile | null {
  const oilMap = new Map(oilLibrary.map((oil) => [oil.id, oil]));
  const percentageTotal = selection.reduce((sum, item) => sum + item.percentage, 0);
  if (percentageTotal <= 0 || selection.length === 0) return null;

  const totals = {
    hardness: 0,
    cleansing: 0,
    conditioning: 0,
    bubbly: 0,
    creamy: 0,
    iodine: 0,
    ins: 0,
  };

  for (const item of selection) {
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
    percentageTotal: round(percentageTotal),
    hardness: round(totals.hardness),
    cleansing: round(totals.cleansing),
    conditioning: round(totals.conditioning),
    bubbly: round(totals.bubbly),
    creamy: round(totals.creamy),
    iodine: round(totals.iodine),
    ins: round(totals.ins),
  };
}

export function isMetricWithinGoal(profile: BlendProfile, goal: BlendGoal, metric: BlendMetric): boolean {
  const range = goal.metrics[metric];
  return profile[metric] >= range.min && profile[metric] <= range.max;
}

function normalizedDistance(value: number, min: number, max: number): number {
  if (value >= min && value <= max) return 0;
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
  return Number((score + (highDosPercent / 100) * 0.8).toFixed(4));
}

export interface BlendSuggestion {
  selection: OilBlendItem[];
  profile: BlendProfile;
  score: number;
}

/**
 * Busca determinística em incrementos de 5%. É intencionalmente pequena e
 * explicável: até quatro óleos já escolhidos pela usuária, sem otimizador geral.
 */
export function suggestOilBlend(goalId: BlendGoalId, oilIds: string[], oilLibrary: Oil[]): BlendSuggestion | null {
  const uniqueOilIds = [...new Set(oilIds)];
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
      const profile = calculateBlendProfile(selection, oilLibrary);
      if (!profile) return;
      const score = scoreBlendForGoal(profile, goal, selection, oilLibrary);
      if (!best || score < best.score) best = { selection, profile, score };
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
