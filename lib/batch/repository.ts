import {
  BATCH_STORAGE_KEY,
  validateBatch,
  type BatchStatus,
  type CreateBatchInput,
  type SoapMethod,
} from "@/lib/diario";
import {
  decodeStoredBatch,
  decodeStoredBatchV2,
  normalizeStoredBatchV1,
} from "@/lib/batch/decoder";
import {
  getInitialBatchStatus,
  getInitialReadiness,
} from "@/lib/batch/method-rules";
import type {
  BatchResult,
  BatchV2,
  ColdProcessData,
  StoredBatch,
  StoredBatchV1,
} from "@/lib/batch/types";

export type StoredBatchArrayValidation =
  | { success: true; data: StoredBatch[] }
  | { success: false; index: number | null; reason: string };

export interface CreateDiaryBatchInput {
  name: string;
  method: SoapMethod;
  batchDate: string;
  source: CreateBatchInput["source"];
  formula: CreateBatchInput["formula"];
  observations?: string;
  processData?: ColdProcessData;
  status?: BatchStatus;
}

export interface UpdateDiaryBatchInput {
  name: string;
  batchDate: string;
  formula: CreateBatchInput["formula"];
  observations?: string;
  processData?: ColdProcessData;
}

function isBatchV2(batch: StoredBatch): batch is BatchV2 {
  return "schemaVersion" in batch && batch.schemaVersion === 2;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export { isBatchV2 };

export function validateStoredBatchArray(value: unknown): StoredBatchArrayValidation {
  if (!Array.isArray(value)) return { success: false, index: null, reason: "batches deve ser uma lista." };
  const batches: StoredBatch[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const result = decodeStoredBatch(value[index]);
    if (!result.success) {
      // Preserva mensagens úteis dos backups v1 já existentes, inclusive
      // quando o registro está incompleto e não alcança o discriminante version.
      const legacyResult = isRecord(value[index]) && value[index].schemaVersion === undefined
        ? validateBatch(value[index])
        : null;
      return {
        success: false,
        index,
        reason: legacyResult && !legacyResult.success ? legacyResult.reason : result.reason,
      };
    }
    batches.push(result.data);
  }
  return { success: true, data: batches };
}

function readStoredBatches(): StoredBatchArrayValidation {
  if (typeof window === "undefined") return { success: true, data: [] };
  try {
    const raw = window.localStorage.getItem(BATCH_STORAGE_KEY);
    if (!raw) return { success: true, data: [] };
    return validateStoredBatchArray(JSON.parse(raw) as unknown);
  } catch {
    return { success: false, index: null, reason: "o JSON armazenado é inválido." };
  }
}

function saveStoredBatches(batches: StoredBatch[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batches));
}

function throwForInvalidStorage(validation: StoredBatchArrayValidation): asserts validation is { success: true; data: StoredBatch[] } {
  if (!validation.success) {
    const record = validation.index === null ? "coleção" : `registro ${validation.index + 1}`;
    throw new Error(`Não foi possível alterar o lote: dados locais inválidos (${record}: ${validation.reason})`);
  }
}

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

function formatCode(value: number): string {
  return String(value).padStart(3, "0");
}

function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function defaultCureDays(method: SoapMethod): number {
  switch (method) {
    case "melt_and_pour": return 1;
    case "used_oil": return 28;
    case "cold_process": return 42;
    case "hot_process": return 14;
    case "other": return 30;
  }
}

function cloneFormula(formula: CreateBatchInput["formula"]): CreateBatchInput["formula"] {
  return {
    ...formula,
    oils: formula.oils.map((oil) => ({ ...oil })),
    ...(formula.additives === undefined ? {} : { additives: formula.additives.map((additive) => ({ ...additive })) }),
  };
}

function cloneProcessData(processData: ColdProcessData): ColdProcessData {
  return { ...processData };
}

function withObservations(result: BatchResult | undefined, observations: string | undefined): BatchResult | undefined {
  if (observations === undefined) return result === undefined ? undefined : { ...result };
  if (observations.trim()) return { ...(result ?? {}), observations: observations.trim() };
  if (!result) return undefined;
  const rest = { ...result };
  delete rest.observations;
  return Object.keys(rest).length > 0 ? rest : undefined;
}

function generateCodeFrom(batches: StoredBatch[], method: SoapMethod): string {
  const prefix = METHOD_PREFIX[method];
  const existing = batches
    .filter((batch) => batch.batchCode.startsWith(prefix))
    .map((batch) => Number.parseInt(batch.batchCode.split("-")[1] ?? "0", 10))
    .filter((value) => Number.isFinite(value));
  return `${prefix}-${formatCode(existing.length > 0 ? Math.max(...existing) + 1 : 1)}`;
}

function createLegacyBatch(input: CreateDiaryBatchInput, batches: StoredBatch[]): StoredBatchV1 {
  const cureDays = defaultCureDays(input.method);
  const now = new Date().toISOString();
  return {
    id: generateId(),
    batchCode: generateCodeFrom(batches, input.method),
    name: input.name,
    method: input.method,
    createdAt: now,
    updatedAt: now,
    batchDate: input.batchDate,
    source: { ...input.source },
    formula: cloneFormula(input.formula),
    cure: {
      startDate: input.batchDate,
      targetEndDate: addDays(input.batchDate, cureDays),
      daysPlanned: cureDays,
    },
    result: withObservations(undefined, input.observations),
    status: input.status ?? "curing",
    photoIds: [],
    version: 1,
  };
}

function createColdProcessBatch(input: CreateDiaryBatchInput, batches: StoredBatch[]): BatchV2 {
  const now = new Date().toISOString();
  const readiness = getInitialReadiness("cold_process", input.batchDate, input.formula);
  const result = withObservations(undefined, input.observations);
  const batch: BatchV2 = {
    schemaVersion: 2,
    id: generateId(),
    batchCode: generateCodeFrom(batches, "cold_process"),
    name: input.name,
    method: "cold_process",
    createdAt: now,
    updatedAt: now,
    batchDate: input.batchDate,
    source: { ...input.source },
    formula: cloneFormula(input.formula),
    ...(input.processData === undefined ? {} : { processData: cloneProcessData(input.processData) }),
    ...(readiness === undefined ? {} : { readiness }),
    ...(result === undefined ? {} : { result }),
    status: input.status ?? getInitialBatchStatus("cold_process"),
    photoIds: [],
  };
  const decoded = decodeStoredBatchV2(batch);
  if (!decoded.success) throw new Error(`Não foi possível criar o lote: ${decoded.reason}`);
  return decoded.data;
}

export function getDiaryBatches(): StoredBatch[] {
  const result = readStoredBatches();
  return result.success
    ? [...result.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];
}

export function getDiaryBatchById(id: string): StoredBatch | null {
  const result = readStoredBatches();
  return result.success ? result.data.find((batch) => batch.id === id) ?? null : null;
}

export function countDiaryBatchesByMethod(method: SoapMethod): number {
  return getDiaryBatches().filter((batch) => batch.method === method && batch.status !== "draft").length;
}

export function generateDiaryBatchCode(method: SoapMethod): string {
  const result = readStoredBatches();
  return result.success ? generateCodeFrom(result.data, method) : `${METHOD_PREFIX[method]}-001`;
}

export function createDiaryBatch(input: CreateDiaryBatchInput): StoredBatch {
  const stored = readStoredBatches();
  throwForInvalidStorage(stored);
  const batch = input.method === "cold_process"
    ? createColdProcessBatch(input, stored.data)
    : createLegacyBatch(input, stored.data);
  saveStoredBatches([batch, ...stored.data]);
  return batch;
}

function updateLegacyBatch(batch: StoredBatchV1, patch: UpdateDiaryBatchInput): StoredBatch {
  if (batch.method === "cold_process") {
    if (!patch.processData) throw new Error("processData é obrigatório para atualizar Cold Process.");
    const normalized = normalizeStoredBatchV1(batch);
    return updateColdProcessBatch(normalized, patch);
  }
  return {
    ...batch,
    name: patch.name,
    batchDate: patch.batchDate,
    formula: cloneFormula(patch.formula),
    result: withObservations(batch.result, patch.observations),
    updatedAt: new Date().toISOString(),
  };
}

function updateColdProcessBatch(batch: BatchV2, patch: UpdateDiaryBatchInput): BatchV2 {
  if (!patch.processData) throw new Error("processData é obrigatório para atualizar Cold Process.");
  const updated: BatchV2 = {
    ...batch,
    name: patch.name,
    batchDate: patch.batchDate,
    formula: cloneFormula(patch.formula),
    processData: cloneProcessData(patch.processData),
    result: withObservations(batch.result, patch.observations),
    updatedAt: new Date().toISOString(),
  };
  const decoded = decodeStoredBatchV2(updated);
  if (!decoded.success) throw new Error(`Não foi possível atualizar o lote: ${decoded.reason}`);
  return decoded.data;
}

function updateBatchV2Common(batch: BatchV2, patch: UpdateDiaryBatchInput): BatchV2 {
  const updated: BatchV2 = {
    ...batch,
    name: patch.name,
    batchDate: patch.batchDate,
    formula: cloneFormula(patch.formula),
    result: withObservations(batch.result, patch.observations),
    updatedAt: new Date().toISOString(),
  };
  const decoded = decodeStoredBatchV2(updated);
  if (!decoded.success) throw new Error(`Não foi possível atualizar o lote: ${decoded.reason}`);
  return decoded.data;
}

export function updateDiaryBatch(id: string, patch: UpdateDiaryBatchInput): StoredBatch | null {
  const stored = readStoredBatches();
  throwForInvalidStorage(stored);
  const index = stored.data.findIndex((batch) => batch.id === id);
  if (index === -1) return null;
  const current = stored.data[index];
  const updated = isBatchV2(current)
    ? current.method === "cold_process"
      ? updateColdProcessBatch(current, patch)
      : updateBatchV2Common(current, patch)
    : updateLegacyBatch(current, patch);
  const next = [...stored.data];
  next[index] = updated;
  saveStoredBatches(next);
  return updated;
}

export function updateColdProcessDiaryBatch(id: string, patch: UpdateDiaryBatchInput): BatchV2 | null {
  const updated = updateDiaryBatch(id, patch);
  return updated && isBatchV2(updated) ? updated : null;
}

export function updateDiaryBatchStatus(id: string, status: BatchStatus): StoredBatch | null {
  const stored = readStoredBatches();
  throwForInvalidStorage(stored);
  const index = stored.data.findIndex((batch) => batch.id === id);
  if (index === -1) return null;
  const current = stored.data[index];
  const today = new Date().toISOString().slice(0, 10);
  const updated = isBatchV2(current)
    ? {
        ...current,
        status,
        readiness: status === "ready" && current.readiness?.kind === "cure" && !current.readiness.actualEndDate
          ? { ...current.readiness, actualEndDate: today }
          : current.readiness,
        updatedAt: new Date().toISOString(),
      }
    : {
        ...current,
        status,
        cure: status === "ready" && !current.cure.actualEndDate
          ? { ...current.cure, actualEndDate: today }
          : current.cure,
        updatedAt: new Date().toISOString(),
      };
  const next = [...stored.data];
  next[index] = updated;
  saveStoredBatches(next);
  return updated;
}

export function deleteDiaryBatch(id: string): boolean {
  const stored = readStoredBatches();
  throwForInvalidStorage(stored);
  const next = stored.data.filter((batch) => batch.id !== id);
  if (next.length === stored.data.length) return false;
  saveStoredBatches(next);
  return true;
}

export function duplicateDiaryBatch(id: string): StoredBatch | null {
  const original = getDiaryBatchById(id);
  if (!original) return null;
  const normalized = isBatchV2(original) ? original : normalizeStoredBatchV1(original);
  const processData = normalized.method === "cold_process" ? normalized.processData : undefined;
  return createDiaryBatch({
    name: `${original.name} (cópia)`,
    method: original.method,
    batchDate: new Date().toISOString().slice(0, 10),
    source: { type: "duplicate_batch", sourceBatchId: original.id },
    formula: cloneFormula(original.formula),
    ...(processData?.method === "cold_process" ? { processData } : {}),
    observations: original.result?.observations,
    status: "draft",
  });
}
