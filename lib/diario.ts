export type BatchStatus = "draft" | "made" | "curing" | "ready" | "failed" | "archived";

export type SoapMethod = "melt_and_pour" | "used_oil" | "cold_process" | "hot_process" | "other";

export type AlkaliType = "naoh" | "koh" | "mixed";

export interface BatchOil {
  oilId: string | null;
  name: string;
  grams: number;
  percentage: number;
  sapNaoh?: number;
  sapKoh?: number;
}

export interface BatchAdditive {
  name: string;
  grams?: number;
  type?: "fragrance" | "colorant" | "clay" | "botanical" | "other";
  notes?: string;
}

export interface Batch {
  id: string;
  batchCode: string;
  name: string;
  method: SoapMethod;
  createdAt: string;
  updatedAt: string;
  batchDate: string;
  source: {
    type: "recipe" | "calculator" | "free_formula" | "duplicate_batch";
    recipeId?: string | null;
    sourceBatchId?: string | null;
  };
  formula: {
    totalOilWeight: number;
    alkaliType: AlkaliType;
    naohGrams?: number;
    kohGrams?: number;
    waterGrams: number;
    superfatPercent: number;
    waterLyeRatio?: number;
    lyeConcentrationPercent?: number;
    oils: BatchOil[];
    additives?: BatchAdditive[];
    expectedBatchWeight?: number;
  };
  process?: {
    ambientTemp?: number;
    oilTemp?: number;
    lyeTemp?: number;
    mixingTemp?: number;
    traceTimeMinutes?: number;
    moldName?: string;
    notes?: string;
  };
  yield?: {
    barsCount?: number;
    cutDate?: string;
    unmoldDate?: string;
    finalWeightGrams?: number;
  };
  cure: {
    startDate: string;
    targetEndDate?: string;
    actualEndDate?: string;
    daysPlanned?: number;
  };
  result?: {
    ph?: number;
    observations?: string;
    rating?: 1 | 2 | 3 | 4 | 5;
    wouldRepeat?: boolean;
    failureReason?: string;
  };
  status: BatchStatus;
  tags?: string[];
  photoIds?: string[];
  version: 1;
}

export interface CreateBatchInput {
  name: string;
  method: SoapMethod;
  batchDate: string;
  source: Batch["source"];
  formula: Batch["formula"];
  process?: Batch["process"];
  yield?: Batch["yield"];
  cureDays?: number;
  observations?: string;
  status?: BatchStatus;
  tags?: string[];
}

const STORAGE_KEY = "moonrock:diario:batches:v1";

// ─── helpers ───────────────────────────────────────────

function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `batch_${ts}_${rand}`;
}

const METHOD_PREFIX: Record<SoapMethod, string> = {
  melt_and_pour: "MP",
  used_oil: "OU",
  cold_process: "CP",
  hot_process: "HP",
  other: "XX",
};

function defaultCureDays(method: SoapMethod): number {
  switch (method) {
    case "melt_and_pour": return 1;
    case "used_oil": return 28;
    case "cold_process": return 42;
    case "hot_process": return 14;
    default: return 30;
  }
}

function formatCode(n: number): string {
  return String(n).padStart(3, "0");
}

// ─── storage ───────────────────────────────────────────

function loadAll(): Batch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(batches: Batch[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

// ─── public API ────────────────────────────────────────

export function getAllBatches(): Batch[] {
  return loadAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getBatchById(id: string): Batch | null {
  return loadAll().find((b) => b.id === id) ?? null;
}

export function generateBatchCode(method: SoapMethod): string {
  const all = loadAll();
  const prefix = METHOD_PREFIX[method];
  const existing = all
    .filter((b) => b.batchCode.startsWith(prefix))
    .map((b) => parseInt(b.batchCode.split("-")[1] ?? "0", 10))
    .filter((n) => !isNaN(n));
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}-${formatCode(next)}`;
}

export function createBatch(input: CreateBatchInput): Batch {
  const cureDays = input.cureDays ?? defaultCureDays(input.method);
  const startDate = input.batchDate;
  const targetEnd = new Date(startDate);
  targetEnd.setDate(targetEnd.getDate() + cureDays);

  const batch: Batch = {
    id: generateId(),
    batchCode: generateBatchCode(input.method),
    name: input.name,
    method: input.method,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    batchDate: input.batchDate,
    source: input.source,
    formula: input.formula,
    process: input.process,
    yield: input.yield,
    cure: {
      startDate,
      targetEndDate: targetEnd.toISOString().slice(0, 10),
      daysPlanned: cureDays,
    },
    result: input.observations ? { observations: input.observations } : undefined,
    status: input.status ?? "made",
    tags: input.tags,
    photoIds: [],
    version: 1,
  };

  const all = loadAll();
  all.unshift(batch);
  saveAll(all);
  return batch;
}

export function updateBatch(id: string, patch: Partial<Batch>): Batch | null {
  const all = loadAll();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  saveAll(all);
  return all[idx];
}

export function updateBatchStatus(id: string, status: BatchStatus): Batch | null {
  const batch = getBatchById(id);
  if (!batch) return null;
  const patch: Partial<Batch> = { status };
  if (status === "ready" && !batch.cure.actualEndDate) {
    patch.cure = { ...batch.cure, actualEndDate: new Date().toISOString().slice(0, 10) };
  }
  return updateBatch(id, patch);
}

export function deleteBatch(id: string): void {
  const all = loadAll().filter((b) => b.id !== id);
  saveAll(all);
}

export function duplicateBatch(id: string): Batch | null {
  const original = getBatchById(id);
  if (!original) return null;
  const input: CreateBatchInput = {
    name: `${original.name} (cópia)`,
    method: original.method,
    batchDate: new Date().toISOString().slice(0, 10),
    source: { type: "duplicate_batch", sourceBatchId: original.id },
    formula: { ...original.formula, oils: (original.formula.oils ?? []).map((o) => ({ ...o })) },
    process: original.process ? { ...original.process } : undefined,
    yield: original.yield ? { ...original.yield } : undefined,
    cureDays: original.cure.daysPlanned,
    observations: original.result?.observations,
    status: "draft" as BatchStatus,
    tags: original.tags ? [...original.tags] : undefined,
  };
  return createBatch(input);
}

export function getBatchesByStatus(status: BatchStatus): Batch[] {
  return getAllBatches().filter((b) => b.status === status);
}

export function getCuringBatches(): Batch[] {
  return getAllBatches().filter((b) => b.status === "curing");
}
