import type {
  Batch,
  BatchStatus,
  SoapMethod,
} from "@/lib/diario";

export type StoredBatchV1 = Batch;

/**
 * Transitional formula contract for Batch v2. Formula becomes discriminated
 * in the next stage; v2 deliberately preserves the current v1 structure.
 */
export type TransitionalBatchFormula = Batch["formula"];
export type BatchSource = Batch["source"];
export type BatchYield = NonNullable<Batch["yield"]>;
export type BatchResult = NonNullable<Batch["result"]>;
export type LegacyBatchCure = Batch["cure"];

/** Ponto de trace em que a massa foi despejada no molde (Módulo CP Avançado). */
export type TracePointAtPour = "emulsion" | "light" | "medium" | "heavy";

/** Resultado da gel phase observado no corte. */
export type GelPhaseOutcome = "full" | "partial" | "none";

/** Estado da barra observado na primeira conferência, em geral entre 24 e 48 horas. */
export type UnmoldSurfaceCondition = "firm" | "soft" | "sticky" | "unknown";

/**
 * Uma conferência inicial de Cold Process. É deliberadamente um único registro,
 * não uma linha do tempo genérica: cobre o momento mais útil para decidir se o
 * lote pode ser desenformado e registrar sinais visuais iniciais.
 */
export interface ColdProcessUnmoldCheck {
  checkedAt: string;
  unmolded: boolean;
  surfaceCondition?: UnmoldSurfaceCondition;
  sodaAsh?: boolean;
  cracking?: boolean;
  separation?: boolean;
  notes?: string;
}

export interface ColdProcessData {
  method: "cold_process";
  ambientTempC?: number;
  oilTempC?: number;
  lyeTempC?: number;
  mixingTempC?: number;
  traceTimeMinutes?: number;
  tracePointAtPour?: TracePointAtPour;
  gelPhase?: GelPhaseOutcome;
  unmoldCheck?: ColdProcessUnmoldCheck;
  designTechnique?: string;
  moldName?: string;
  notes?: string;
}

export interface HotProcessData {
  method: "hot_process";
  heatingMethod?: "slow_cooker" | "stove" | "water_bath" | "other";
  cookTimeMinutes?: number;
  moldName?: string;
  notes?: string;
}

export interface MeltAndPourData {
  method: "melt_and_pour";
  meltingMethod?: "microwave" | "water_bath" | "other";
  pouringTemperatureC?: number;
  unmoldTimeHours?: number;
  bubblesObserved?: boolean;
  notes?: string;
}

export interface UsedOilProcessData {
  method: "used_oil";
  oilSource?: string;
  filtrationMethod?: string;
  intendedUse?: "household_cleaning" | "laundry" | "other";
  notes?: string;
}

export interface OtherProcessData {
  method: "other";
  notes?: string;
}

export type BatchProcessData =
  | ColdProcessData
  | HotProcessData
  | MeltAndPourData
  | UsedOilProcessData
  | OtherProcessData;

export interface CureReadiness {
  kind: "cure";
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string;
  daysPlanned?: number;
}

export interface StabilizationReadiness {
  kind: "stabilization";
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string;
  daysPlanned?: number;
}

export interface UnmoldReadiness {
  kind: "unmold";
  expectedAt: string;
  completedAt?: string;
}

export interface CustomReadiness {
  kind: "custom";
  label: string;
  targetDate?: string;
  completedDate?: string;
  notes?: string;
}

export type BatchReadiness =
  | CureReadiness
  | StabilizationReadiness
  | UnmoldReadiness
  | CustomReadiness;

export interface LegacyBatchData {
  sourceSchemaVersion: 1;
  unmappedProcess?: Record<string, unknown>;
  unmappedCure?: LegacyBatchCure;
  unmappedFields?: Record<string, unknown>;
}

export interface BatchV2 {
  schemaVersion: 2;
  id: string;
  batchCode: string;
  name: string;
  method: SoapMethod;
  createdAt: string;
  updatedAt: string;
  batchDate: string;
  source: BatchSource;
  formula: TransitionalBatchFormula;
  processData?: BatchProcessData;
  readiness?: BatchReadiness;
  yield?: BatchYield;
  result?: BatchResult;
  status: BatchStatus;
  tags?: string[];
  photoIds?: string[];
  legacyData?: LegacyBatchData;
}

export type StoredBatchV2 = BatchV2;
export type StoredBatch = StoredBatchV1 | StoredBatchV2;
