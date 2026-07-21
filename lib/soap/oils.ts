export type OilType = "oleo-liquido" | "gordura-solida" | "manteiga" | "cera-liquida" | "gordura-animal";
export type Availability = "alta" | "media" | "dificil" | "muito-baixa";
export type Stability = "alta" | "media" | "baixa" | "muito-baixa";
export type OilEvidenceField = "sapNaOH" | "sapKOH" | "iodine" | "ins" | "fattyAcids";

export type OilSourceType =
  | "reference_database"
  | "scientific_paper"
  | "book"
  | "standard"
  | "supplier"
  | "educational";

export interface OilDataSource {
  id: string;
  name: string;
  url: string;
  accessedAt: string;
  /** O que esta fonte se propõe a sustentar — e o que ela explicitamente não cobre. */
  scope: string;
  sourceType?: OilSourceType;
  publisher?: string;
  publicationDate?: string;
}

/**
 * O que uma fonte informou para um conjunto de campos. Texto é aceito para
 * preservar faixas publicadas ("80-85") sem convertê-las em precisão falsa.
 */
export interface OilEvidenceObservation {
  sourceId: string;
  /** Tabela, linha ou página exata dentro da fonte. */
  locator?: string;
  values: Partial<Record<OilEvidenceField, number | string>>;
}

/**
 * `supported`: a fonte confirma o valor que o MoonRock usa.
 * `conflicting`: a fonte diverge do valor adotado, que foi mantido por decisão editorial.
 * `estimated`: o valor adotado foi derivado das observações, não copiado de uma delas.
 */
export type OilEvidenceStatus = "supported" | "conflicting" | "estimated";

export type OilEvidenceDecision =
  | "direct_match"
  | "selected_reference"
  | "consensus"
  | "range_midpoint"
  | "editorial_default";

/**
 * Proveniência de um conjunto de campos. O valor canônico continua sendo o do
 * próprio óleo: repetí-lo aqui criaria justamente a divergência silenciosa que
 * este modelo existe para evitar.
 */
export interface OilEvidenceClaim {
  fields: OilEvidenceField[];
  observations: OilEvidenceObservation[];
  status: OilEvidenceStatus;
  decision: OilEvidenceDecision;
  /** Por que este valor foi adotado — obrigatório quando não é `direct_match`. */
  rationale?: string;
  reviewedAt: string;
}

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
  /** Função prática do óleo na fórmula (ex: "Dá dureza e cremosidade") */
  formulaRole?: string;
  /** Risco de DOS derivado do iodine + stability */
  dosRisk?: "baixo" | "medio" | "alto";
  /** Nível de confiança do óleo para uso (classificação da Deep Research) */
  confidenceLevel?: "liberado" | "alerta" | "bloqueado";
  /** Array de substituições possíveis */
  substitutions?: string[];
  /** Nota explicativa sobre substituições */
  substitutionNotes?: string;
  /** Nota para iniciante sobre uso */
  beginnerNote?: string;
  /** Uso recomendado resumido */
  recommendedUse?: string;
  /** Proveniência por afirmação; campos ausentes seguem não revisados. */
  evidence?: OilEvidenceClaim[];
}

export interface OilsData {
  description: string;
  lastUpdated: string;
  sources?: OilDataSource[];
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
