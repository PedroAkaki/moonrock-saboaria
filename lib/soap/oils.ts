export type OilType = "oleo-liquido" | "gordura-solida" | "manteiga" | "cera-liquida" | "gordura-animal";
export type Availability = "alta" | "media" | "dificil" | "muito-baixa";
export type Stability = "alta" | "media" | "baixa" | "muito-baixa";

export interface Oil {
  id: string;
  name: string;
  inci: string;
  type: OilType;
  sapNaOH: number;
  sapKOH: number;
  iodine: number;
  ins: number;
  hardness: number;
  cleansing: number;
  conditioning: number;
  bubbly: number;
  creamy: number;
  fattyAcids: Record<string, string>;
  maxPercent: number;
  stability: Stability;
  meltingPoint: string | null;
  availability: Availability;
  cost: string;
  shelfLife: string;
  notes: string;
}

export interface OilsData {
  description: string;
  lastUpdated: string;
  oils: Oil[];
}

let oilsCache: Oil[] | null = null;

/**
 * Load oils from the static JSON file.
 * Cached after first load.
 */
export async function getOils(): Promise<Oil[]> {
  if (oilsCache) return oilsCache;

  const data: OilsData = await import("@/data/oils.json").then((m) => m.default as unknown as OilsData);
  oilsCache = data.oils;
  return oilsCache;
}

/**
 * Find an oil by ID
 */
export function getOilById(oils: Oil[], id: string): Oil | undefined {
  return oils.find((o) => o.id === id);
}

/**
 * Get the recommended max percentage for an oil in a recipe
 */
export function getRecommendedMax(oilId: string): number {
  // Use maxPercent from the oil data directly
  return 100;
}

/**
 * Get the difficulty level of using an oil based on properties
 */
export function getOilDifficulty(oil: Oil): "iniciante" | "intermediario" | "avancado" {
  if (oil.stability === "muito-baixa") return "avancado";
  if (oil.availability === "dificil" || oil.availability === "muito-baixa") return "intermediario";
  if (oil.maxPercent < 10) return "intermediario";
  return "iniciante";
}

/**
 * Get the oil type translated to Portuguese
 */
export function getOilTypeName(type: OilType): string {
  const names: Record<OilType, string> = {
    "oleo-liquido": "Óleo Líquido",
    "gordura-solida": "Gordura Sólida",
    "manteiga": "Manteiga",
    "cera-liquida": "Cera Líquida",
    "gordura-animal": "Gordura Animal",
  };
  return names[type] ?? type;
}

/**
 * Get the stability translated
 */
export function getStabilityName(stability: Stability): string {
  const names: Record<Stability, string> = {
    alta: "Alta",
    media: "Média",
    baixa: "Baixa",
    "muito-baixa": "Muito Baixa",
  };
  return names[stability] ?? stability;
}

/**
 * Get the availability translated
 */
export function getAvailabilityName(av: Availability): string {
  const names: Record<Availability, string> = {
    alta: "Fácil",
    media: "Média",
    dificil: "Difícil",
    "muito-baixa": "Importação",
  };
  return names[av] ?? av;
}
