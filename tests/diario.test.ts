import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BATCH_STORAGE_KEY,
  createBatch,
  countBatchesByMethod,
  duplicateBatch,
  getAllBatches,
  updateBatch,
  updateBatchStatus,
  validateBatch,
  type UpdateBatchInput,
} from "@/lib/diario";
import { batchWithOptionalFields, coldProcessBatch, meltAndPourBatch } from "@/tests/fixtures/batches";
import { MemoryStorage } from "@/tests/test-storage";

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", {
    localStorage: storage,
    confirm: vi.fn(() => true),
    dispatchEvent: vi.fn(),
  });
});

describe("formato atual de Batch", () => {
  it("carrega um lote v1 válido", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    expect(getAllBatches()).toEqual([coldProcessBatch]);
  });

  it("rejeita um lote inválido", () => {
    const result = validateBatch({ ...coldProcessBatch, formula: null });
    expect(result).toEqual({ success: false, reason: "formula deve ser um objeto." });
  });

  it("rejeita a coleção local quando um lote é inválido sem regravá-la", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch, { id: "inválido" }]));
    storage.resetWriteCount();
    expect(getAllBatches()).toEqual([]);
    expect(storage.writes).toBe(0);
  });

  it("não sobrescreve dados locais inválidos ao tentar criar um lote", () => {
    const invalidStoredValue = JSON.stringify([{ id: "incompleto" }]);
    storage.setItem(BATCH_STORAGE_KEY, invalidStoredValue);
    expect(() => createBatch({
      name: "Não deve ser gravado",
      method: "cold_process",
      batchDate: "2026-01-21",
      source: { type: "free_formula" },
      formula: structuredClone(coldProcessBatch.formula),
    })).toThrow("dados locais inválidos");
    expect(storage.getItem(BATCH_STORAGE_KEY)).toBe(invalidStoredValue);
  });

  it("não regrava dados durante a leitura", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    storage.resetWriteCount();
    getAllBatches();
    expect(storage.writes).toBe(0);
  });
});

describe("mutações atuais", () => {
  it("edita sem alterar invariantes e preserva campos não modificados", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([batchWithOptionalFields]));
    const unsafeInput = {
      name: "Nome alterado",
      id: "id-tentativa",
      batchCode: "HP-999",
      createdAt: "2099-01-01T00:00:00.000Z",
      method: "hot_process",
      version: 999,
    } as unknown as UpdateBatchInput;

    const updated = updateBatch(batchWithOptionalFields.id, unsafeInput);

    expect(updated).toMatchObject({
      name: "Nome alterado",
      id: batchWithOptionalFields.id,
      batchCode: batchWithOptionalFields.batchCode,
      createdAt: batchWithOptionalFields.createdAt,
      method: batchWithOptionalFields.method,
      version: 1,
      process: batchWithOptionalFields.process,
      yield: batchWithOptionalFields.yield,
      result: batchWithOptionalFields.result,
    });
  });

  it("duplica com novo ID, novo código e snapshot independente", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([batchWithOptionalFields]));
    const duplicate = duplicateBatch(batchWithOptionalFields.id);

    expect(duplicate).not.toBeNull();
    expect(duplicate?.id).not.toBe(batchWithOptionalFields.id);
    expect(duplicate?.batchCode).not.toBe(batchWithOptionalFields.batchCode);
    expect(duplicate?.source).toEqual({
      type: "duplicate_batch",
      sourceBatchId: batchWithOptionalFields.id,
    });
    expect(duplicate?.status).toBe("draft");
    expect(duplicate?.formula).toEqual(batchWithOptionalFields.formula);
    expect(duplicate?.formula).not.toBe(batchWithOptionalFields.formula);
  });

  it("arquiva preservando os demais dados", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([batchWithOptionalFields]));
    const archived = updateBatchStatus(batchWithOptionalFields.id, "archived");
    expect(archived?.status).toBe("archived");
    expect(archived?.formula).toEqual(batchWithOptionalFields.formula);
    expect(archived?.process).toEqual(batchWithOptionalFields.process);
  });

  it("cria lote com o formato v1 atual", () => {
    const created = createBatch({
      name: "Novo lote",
      method: "cold_process",
      batchDate: "2026-01-21",
      source: { type: "free_formula" },
      formula: structuredClone(coldProcessBatch.formula),
    });
    expect(created.version).toBe(1);
    expect(validateBatch(created).success).toBe(true);
  });
});

describe("resumos de lotes", () => {
  it("conta apenas lotes do método que saíram de rascunho", () => {
    storage.setItem(
      BATCH_STORAGE_KEY,
      JSON.stringify([
        coldProcessBatch,
        { ...coldProcessBatch, id: "cp-2", batchCode: "CP-102", status: "ready" },
        { ...coldProcessBatch, id: "cp-3", batchCode: "CP-103", status: "draft" },
        meltAndPourBatch,
      ]),
    );

    expect(countBatchesByMethod("cold_process")).toBe(2);
    expect(countBatchesByMethod("hot_process")).toBe(0);
  });
});
