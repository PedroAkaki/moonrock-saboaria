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

export interface UpdateBatchInput {
  name?: string;
  batchDate?: string;
  source?: Batch["source"];
  formula?: Batch["formula"];
  process?: Batch["process"];
  yield?: Batch["yield"];
  cure?: Batch["cure"];
  result?: Batch["result"];
  status?: BatchStatus;
  tags?: string[];
  photoIds?: string[];
}

export const BATCH_STORAGE_KEY = "moonrock:diario:batches:v1";

export type BatchArrayValidation =
  | { success: true; data: Batch[] }
  | { success: false; index: number | null; reason: string };

const SOAP_METHODS: readonly SoapMethod[] = [
  "melt_and_pour",
  "used_oil",
  "cold_process",
  "hot_process",
  "other",
];

const BATCH_STATUSES: readonly BatchStatus[] = [
  "draft",
  "made",
  "curing",
  "ready",
  "failed",
  "archived",
];

const ALKALI_TYPES: readonly AlkaliType[] = ["naoh", "koh", "mixed"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function optionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function optionalNumber(value: unknown): boolean {
  return value === undefined || isFiniteNumber(value);
}

function validateStringArray(value: unknown, path: string): string | null {
  if (!Array.isArray(value)) return `${path} deve ser uma lista.`;
  const invalidIndex = value.findIndex((item) => typeof item !== "string");
  return invalidIndex === -1 ? null : `${path}[${invalidIndex}] deve ser texto.`;
}

function validateSource(value: unknown): string | null {
  if (!isRecord(value)) return "source deve ser um objeto.";
  if (
    typeof value.type !== "string" ||
    !["recipe", "calculator", "free_formula", "duplicate_batch"].includes(value.type)
  ) {
    return "source.type não é reconhecido.";
  }
  if (value.recipeId !== undefined && value.recipeId !== null && typeof value.recipeId !== "string") {
    return "source.recipeId deve ser texto ou null.";
  }
  if (value.sourceBatchId !== undefined && value.sourceBatchId !== null && typeof value.sourceBatchId !== "string") {
    return "source.sourceBatchId deve ser texto ou null.";
  }
  return null;
}

function validateOil(value: unknown, path: string): string | null {
  if (!isRecord(value)) return `${path} deve ser um objeto.`;
  if (value.oilId !== null && typeof value.oilId !== "string") return `${path}.oilId deve ser texto ou null.`;
  if (typeof value.name !== "string") return `${path}.name deve ser texto.`;
  if (!isFiniteNumber(value.grams)) return `${path}.grams deve ser um número.`;
  if (!isFiniteNumber(value.percentage)) return `${path}.percentage deve ser um número.`;
  if (!optionalNumber(value.sapNaoh)) return `${path}.sapNaoh deve ser um número.`;
  if (!optionalNumber(value.sapKoh)) return `${path}.sapKoh deve ser um número.`;
  return null;
}

function validateAdditive(value: unknown, path: string): string | null {
  if (!isRecord(value)) return `${path} deve ser um objeto.`;
  if (typeof value.name !== "string") return `${path}.name deve ser texto.`;
  if (!optionalNumber(value.grams)) return `${path}.grams deve ser um número.`;
  if (
    value.type !== undefined &&
    (typeof value.type !== "string" ||
      !["fragrance", "colorant", "clay", "botanical", "other"].includes(value.type))
  ) {
    return `${path}.type não é reconhecido.`;
  }
  if (!optionalString(value.notes)) return `${path}.notes deve ser texto.`;
  return null;
}

function validateFormula(value: unknown): string | null {
  if (!isRecord(value)) return "formula deve ser um objeto.";
  if (!isFiniteNumber(value.totalOilWeight)) return "formula.totalOilWeight deve ser um número.";
  if (!ALKALI_TYPES.includes(value.alkaliType as AlkaliType)) return "formula.alkaliType não é reconhecido.";
  if (!optionalNumber(value.naohGrams)) return "formula.naohGrams deve ser um número.";
  if (!optionalNumber(value.kohGrams)) return "formula.kohGrams deve ser um número.";
  if (!isFiniteNumber(value.waterGrams)) return "formula.waterGrams deve ser um número.";
  if (!isFiniteNumber(value.superfatPercent)) return "formula.superfatPercent deve ser um número.";
  if (!optionalNumber(value.waterLyeRatio)) return "formula.waterLyeRatio deve ser um número.";
  if (!optionalNumber(value.lyeConcentrationPercent)) return "formula.lyeConcentrationPercent deve ser um número.";
  if (!optionalNumber(value.expectedBatchWeight)) return "formula.expectedBatchWeight deve ser um número.";
  if (!Array.isArray(value.oils)) return "formula.oils deve ser uma lista.";
  for (let index = 0; index < value.oils.length; index += 1) {
    const error = validateOil(value.oils[index], `formula.oils[${index}]`);
    if (error) return error;
  }
  if (value.additives !== undefined) {
    if (!Array.isArray(value.additives)) return "formula.additives deve ser uma lista.";
    for (let index = 0; index < value.additives.length; index += 1) {
      const error = validateAdditive(value.additives[index], `formula.additives[${index}]`);
      if (error) return error;
    }
  }
  return null;
}

function validateProcess(value: unknown): string | null {
  if (value === undefined) return null;
  if (!isRecord(value)) return "process deve ser um objeto.";
  for (const key of ["ambientTemp", "oilTemp", "lyeTemp", "mixingTemp", "traceTimeMinutes"] as const) {
    if (!optionalNumber(value[key])) return `process.${key} deve ser um número.`;
  }
  if (!optionalString(value.moldName)) return "process.moldName deve ser texto.";
  if (!optionalString(value.notes)) return "process.notes deve ser texto.";
  return null;
}

function validateYield(value: unknown): string | null {
  if (value === undefined) return null;
  if (!isRecord(value)) return "yield deve ser um objeto.";
  if (!optionalNumber(value.barsCount)) return "yield.barsCount deve ser um número.";
  if (!optionalString(value.cutDate)) return "yield.cutDate deve ser texto.";
  if (!optionalString(value.unmoldDate)) return "yield.unmoldDate deve ser texto.";
  if (!optionalNumber(value.finalWeightGrams)) return "yield.finalWeightGrams deve ser um número.";
  return null;
}

function validateCure(value: unknown): string | null {
  if (!isRecord(value)) return "cure deve ser um objeto.";
  if (typeof value.startDate !== "string") return "cure.startDate deve ser texto.";
  if (!optionalString(value.targetEndDate)) return "cure.targetEndDate deve ser texto.";
  if (!optionalString(value.actualEndDate)) return "cure.actualEndDate deve ser texto.";
  if (!optionalNumber(value.daysPlanned)) return "cure.daysPlanned deve ser um número.";
  return null;
}

function validateResult(value: unknown): string | null {
  if (value === undefined) return null;
  if (!isRecord(value)) return "result deve ser um objeto.";
  if (!optionalNumber(value.ph)) return "result.ph deve ser um número.";
  if (!optionalString(value.observations)) return "result.observations deve ser texto.";
  if (value.rating !== undefined && ![1, 2, 3, 4, 5].includes(value.rating as number)) {
    return "result.rating deve estar entre 1 e 5.";
  }
  if (value.wouldRepeat !== undefined && typeof value.wouldRepeat !== "boolean") {
    return "result.wouldRepeat deve ser booleano.";
  }
  if (!optionalString(value.failureReason)) return "result.failureReason deve ser texto.";
  return null;
}

export function validateBatch(value: unknown): { success: true; data: Batch } | { success: false; reason: string } {
  if (!isRecord(value)) return { success: false, reason: "o lote deve ser um objeto." };
  if (typeof value.id !== "string" || value.id.length === 0) return { success: false, reason: "id é obrigatório." };
  if (typeof value.batchCode !== "string" || value.batchCode.length === 0) {
    return { success: false, reason: "batchCode é obrigatório." };
  }
  if (typeof value.name !== "string") return { success: false, reason: "name deve ser texto." };
  if (!SOAP_METHODS.includes(value.method as SoapMethod)) return { success: false, reason: "method não é reconhecido." };
  if (typeof value.createdAt !== "string") return { success: false, reason: "createdAt deve ser texto." };
  if (typeof value.updatedAt !== "string") return { success: false, reason: "updatedAt deve ser texto." };
  if (typeof value.batchDate !== "string") return { success: false, reason: "batchDate deve ser texto." };

  const validators = [
    validateSource(value.source),
    validateFormula(value.formula),
    validateProcess(value.process),
    validateYield(value.yield),
    validateCure(value.cure),
    validateResult(value.result),
  ];
  const nestedError = validators.find((error): error is string => error !== null);
  if (nestedError) return { success: false, reason: nestedError };

  if (!BATCH_STATUSES.includes(value.status as BatchStatus)) return { success: false, reason: "status não é reconhecido." };
  if (value.tags !== undefined) {
    const error = validateStringArray(value.tags, "tags");
    if (error) return { success: false, reason: error };
  }
  if (value.photoIds !== undefined) {
    const error = validateStringArray(value.photoIds, "photoIds");
    if (error) return { success: false, reason: error };
  }
  if (value.version !== 1) return { success: false, reason: "version deve ser 1." };

  return { success: true, data: value as unknown as Batch };
}

export function validateBatchArray(value: unknown): BatchArrayValidation {
  if (!Array.isArray(value)) return { success: false, index: null, reason: "batches deve ser uma lista." };
  const batches: Batch[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const result = validateBatch(value[index]);
    if (!result.success) return { success: false, index, reason: result.reason };
    batches.push(result.data);
  }
  return { success: true, data: batches };
}

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

function readAll(): BatchArrayValidation {
  if (typeof window === "undefined") return { success: true, data: [] };
  try {
    const raw = localStorage.getItem(BATCH_STORAGE_KEY);
    if (!raw) return { success: true, data: [] };
    const parsed: unknown = JSON.parse(raw);
    return validateBatchArray(parsed);
  } catch {
    return { success: false, index: null, reason: "o JSON armazenado é inválido." };
  }
}

function loadAll(): Batch[] {
  const result = readAll();
  return result.success ? result.data : [];
}

function saveAll(batches: Batch[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batches));
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

  const stored = readAll();
  if (!stored.success) {
    throw new Error(`Não foi possível criar o lote: dados locais inválidos (${stored.reason})`);
  }
  const all = stored.data;
  all.unshift(batch);
  saveAll(all);
  return batch;
}

export function updateBatch(id: string, patch: UpdateBatchInput): Batch | null {
  const stored = readAll();
  if (!stored.success) return null;
  const all = stored.data;
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx] };
  if (patch.name !== undefined) updated.name = patch.name;
  if (patch.batchDate !== undefined) updated.batchDate = patch.batchDate;
  if (patch.source !== undefined) updated.source = patch.source;
  if (patch.formula !== undefined) updated.formula = patch.formula;
  if ("process" in patch) updated.process = patch.process;
  if ("yield" in patch) updated.yield = patch.yield;
  if (patch.cure !== undefined) updated.cure = patch.cure;
  if ("result" in patch) updated.result = patch.result;
  if (patch.status !== undefined) updated.status = patch.status;
  if ("tags" in patch) updated.tags = patch.tags;
  if ("photoIds" in patch) updated.photoIds = patch.photoIds;
  updated.updatedAt = new Date().toISOString();
  all[idx] = updated;
  saveAll(all);
  return all[idx];
}

export function updateBatchStatus(id: string, status: BatchStatus): Batch | null {
  const batch = getBatchById(id);
  if (!batch) return null;
  const patch: UpdateBatchInput = { status };
  if (status === "ready" && !batch.cure.actualEndDate) {
    patch.cure = { ...batch.cure, actualEndDate: new Date().toISOString().slice(0, 10) };
  }
  return updateBatch(id, patch);
}

export function deleteBatch(id: string): void {
  const stored = readAll();
  if (!stored.success) return;
  const all = stored.data.filter((b) => b.id !== id);
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
