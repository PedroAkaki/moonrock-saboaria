import { beforeEach, describe, expect, it, vi } from "vitest";
import { BATCH_STORAGE_KEY } from "@/lib/diario";
import {
  countDiaryBatchesByMethod,
  createDiaryBatch,
  deleteDiaryBatch,
  duplicateDiaryBatch,
  getDiaryBatches,
  isBatchV2,
  updateColdProcessCureReview,
  updateColdProcessDiaryBatch,
  updateDiaryBatchStatus,
} from "@/lib/batch/repository";
import { coldProcessBatch, batchWithOptionalFields, meltAndPourBatch } from "@/tests/fixtures/batches";
import { coldProcessBatchV2 } from "@/tests/fixtures/batches-v2";
import { MemoryStorage } from "@/tests/test-storage";

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
});

function coldProcessInput() {
  return {
    name: "Novo CP v2",
    method: "cold_process" as const,
    batchDate: "2026-03-01",
    source: { type: "free_formula" as const },
    formula: structuredClone(coldProcessBatch.formula),
    processData: {
      method: "cold_process" as const,
      ambientTempC: 25,
      oilTempC: 36,
      lyeTempC: 34,
      mixingTempC: 35,
      tracePointAtPour: "light" as const,
      gelPhase: "full" as const,
      designTechnique: "drop swirl",
      moldName: "Loaf",
      notes: "Registrado pelo formulário v2.",
    },
  };
}

describe("repositório de Diário com Batch v1 e v2", () => {
  it("lê lotes v1 e v2 sem regravar o armazenamento", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch, coldProcessBatchV2]));
    storage.resetWriteCount();

    const batches = getDiaryBatches();

    expect(batches).toHaveLength(2);
    expect(batches.some(isBatchV2)).toBe(true);
    expect(storage.writes).toBe(0);
  });

  it("cria Cold Process como Batch v2 com prontidão adequada", () => {
    const created = createDiaryBatch(coldProcessInput());

    expect(isBatchV2(created)).toBe(true);
    if (!isBatchV2(created)) return;
    expect(created).toMatchObject({
      schemaVersion: 2,
      method: "cold_process",
      status: "curing",
      processData: coldProcessInput().processData,
      readiness: {
        kind: "cure",
        startDate: "2026-03-01",
        targetEndDate: "2026-04-12",
        daysPlanned: 42,
      },
    });
    expect(countDiaryBatchesByMethod("cold_process")).toBe(1);
  });

  it("migra v1 Cold Process apenas ao editar, preservando identidade e dados legados", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([{
      ...batchWithOptionalFields,
      process: { ...batchWithOptionalFields.process, legacyOnly: "manter" },
    }]));
    storage.resetWriteCount();

    const updated = updateColdProcessDiaryBatch(batchWithOptionalFields.id, {
      ...coldProcessInput(),
      name: "CP migrado",
      batchDate: batchWithOptionalFields.batchDate,
      formula: structuredClone(batchWithOptionalFields.formula),
      observations: "Observação atualizada.",
    });

    expect(updated).toMatchObject({
      schemaVersion: 2,
      id: batchWithOptionalFields.id,
      batchCode: batchWithOptionalFields.batchCode,
      name: "CP migrado",
      legacyData: {
        sourceSchemaVersion: 1,
        unmappedProcess: { legacyOnly: "manter" },
      },
    });
    expect(storage.writes).toBe(1);
  });

  it("persiste a conferência inicial CP sem alterar identidade", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatchV2]));

    const updated = updateColdProcessDiaryBatch(coldProcessBatchV2.id, {
      ...coldProcessInput(),
      name: coldProcessBatchV2.name,
      batchDate: coldProcessBatchV2.batchDate,
      formula: structuredClone(coldProcessBatchV2.formula),
      processData: {
        ...coldProcessInput().processData,
        unmoldCheck: {
          checkedAt: "2026-02-03",
          unmolded: false,
          surfaceCondition: "soft",
          notes: "Aguardar mais um dia.",
        },
      },
    });

    expect(updated).toMatchObject({
      id: coldProcessBatchV2.id,
      batchCode: coldProcessBatchV2.batchCode,
      processData: {
        unmoldCheck: {
          checkedAt: "2026-02-03",
          unmolded: false,
          surfaceCondition: "soft",
        },
      },
    });
  });

  it("registra avaliação pós-cura de CP preservando dados de resultado existentes", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([{
      ...coldProcessBatchV2,
      result: { ph: 10.2, observations: "Anotação anterior." },
    }]));

    const updated = updateColdProcessCureReview(coldProcessBatchV2.id, {
      rating: 4,
      wouldRepeat: false,
      failureReason: "Espuma abaixo do esperado.",
      observations: "Barra firme e agradável depois da cura.",
    });

    expect(updated).toMatchObject({
      id: coldProcessBatchV2.id,
      batchCode: coldProcessBatchV2.batchCode,
      result: {
        ph: 10.2,
        rating: 4,
        wouldRepeat: false,
        failureReason: "Espuma abaixo do esperado.",
        observations: "Barra firme e agradável depois da cura.",
      },
    });
  });

  it("não registra avaliação pós-cura para outro método", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([meltAndPourBatch]));
    storage.resetWriteCount();

    const updated = updateColdProcessCureReview(meltAndPourBatch.id, {
      rating: 5,
      wouldRepeat: true,
      failureReason: "",
      observations: "",
    });

    expect(updated).toBeNull();
    expect(storage.writes).toBe(0);
  });

  it("promove CP v1 ao registrar a avaliação, sem alterar sua identidade", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([batchWithOptionalFields]));

    const updated = updateColdProcessCureReview(batchWithOptionalFields.id, {
      rating: 5,
      wouldRepeat: true,
      failureReason: "",
      observations: "Repetiria esta fórmula.",
    });

    expect(updated).toMatchObject({
      schemaVersion: 2,
      id: batchWithOptionalFields.id,
      batchCode: batchWithOptionalFields.batchCode,
      result: { rating: 5, wouldRepeat: true, observations: "Repetiria esta fórmula." },
    });
  });

  it("duplica, atualiza status e remove sem depender do formato armazenado", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatchV2, meltAndPourBatch]));

    const duplicate = duplicateDiaryBatch(coldProcessBatchV2.id);
    expect(duplicate).not.toBeNull();
    expect(duplicate?.id).not.toBe(coldProcessBatchV2.id);
    expect(duplicate?.batchCode).not.toBe(coldProcessBatchV2.batchCode);
    expect(duplicate?.status).toBe("draft");

    const ready = updateDiaryBatchStatus(coldProcessBatchV2.id, "ready");
    expect(ready?.status).toBe("ready");
    if (ready && isBatchV2(ready) && ready.readiness?.kind === "cure") {
      expect(ready.readiness.actualEndDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    expect(deleteDiaryBatch(meltAndPourBatch.id)).toBe(true);
    expect(getDiaryBatches().some((batch) => batch.id === meltAndPourBatch.id)).toBe(false);
  });

  it("rejeita coleção inválida sem sobrescrever dados ao criar", () => {
    const invalid = JSON.stringify([{ id: "incompleto" }]);
    storage.setItem(BATCH_STORAGE_KEY, invalid);

    expect(() => createDiaryBatch(coldProcessInput())).toThrow("dados locais");
    expect(storage.getItem(BATCH_STORAGE_KEY)).toBe(invalid);
  });
});
