import { beforeEach, describe, expect, it, vi } from "vitest";
import { BATCH_STORAGE_KEY, validateBatch, type BatchSensoryEvaluation } from "@/lib/diario";
import { addBatchEvaluation } from "@/lib/batch/repository";
import { decodeStoredBatchV2 } from "@/lib/batch/decoder";
import { coldProcessBatch, meltAndPourBatch, usedOilBatch } from "@/tests/fixtures/batches";
import { coldProcessBatchV2 } from "@/tests/fixtures/batches-v2";
import { MemoryStorage } from "@/tests/test-storage";

const NO_DESENFORME: BatchSensoryEvaluation = {
  evaluatedAt: "2026-07-27",
  moment: "unmold",
  scores: { hardness: 3, bubbly: 2 },
  notes: "Firme ao toque.",
};

const AOS_7_DIAS: BatchSensoryEvaluation = {
  evaluatedAt: "2026-08-03",
  moment: "day7",
  scores: { hardness: 4, bubbly: 3, creamy: 3 },
};

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
});

describe("avaliação sensorial multi-momento", () => {
  it("acumula avaliações de momentos diferentes em ordem cronológica", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatchV2]));

    addBatchEvaluation(coldProcessBatchV2.id, AOS_7_DIAS);
    const atualizado = addBatchEvaluation(coldProcessBatchV2.id, NO_DESENFORME);

    // Registrado fora de ordem, mas guardado na ordem em que a barra evolui.
    expect(atualizado?.result?.evaluations?.map((item) => item.moment)).toEqual(["unmold", "day7"]);
  });

  it("substitui a avaliação quando o mesmo momento é reavaliado", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatchV2]));

    addBatchEvaluation(coldProcessBatchV2.id, NO_DESENFORME);
    const atualizado = addBatchEvaluation(coldProcessBatchV2.id, {
      ...NO_DESENFORME,
      scores: { hardness: 5 },
      notes: "Revisto: mais firme do que anotei.",
    });

    expect(atualizado?.result?.evaluations).toHaveLength(1);
    expect(atualizado?.result?.evaluations?.[0]).toMatchObject({
      moment: "unmold",
      scores: { hardness: 5 },
      notes: "Revisto: mais firme do que anotei.",
    });
  });

  it("preserva campos de resultado já existentes", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([{
      ...coldProcessBatchV2,
      result: { rating: 4, wouldRepeat: true, observations: "Nota anterior." },
    }]));

    const atualizado = addBatchEvaluation(coldProcessBatchV2.id, NO_DESENFORME);

    expect(atualizado?.result).toMatchObject({
      rating: 4,
      wouldRepeat: true,
      observations: "Nota anterior.",
    });
    expect(atualizado?.result?.evaluations).toHaveLength(1);
  });

  it("aceita Melt & Pour com suor de glicerina", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([meltAndPourBatch]));

    const atualizado = addBatchEvaluation(meltAndPourBatch.id, {
      evaluatedAt: "2026-07-27",
      moment: "day7",
      scores: { hardness: 4 },
      sweating: 2,
    });

    expect(atualizado?.result?.evaluations?.[0]).toMatchObject({ sweating: 2 });
  });

  it("recusa método sem ponto claro de julgamento, sem gravar", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([usedOilBatch]));
    storage.resetWriteCount();

    expect(addBatchEvaluation(usedOilBatch.id, NO_DESENFORME)).toBeNull();
    expect(storage.writes).toBe(0);
  });

  it("promove lote v1 ao avaliar, preservando identidade", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));

    const atualizado = addBatchEvaluation(coldProcessBatch.id, NO_DESENFORME);

    expect(atualizado).toMatchObject({
      schemaVersion: 2,
      id: coldProcessBatch.id,
      batchCode: coldProcessBatch.batchCode,
    });
  });
});

describe("validação da avaliação sensorial", () => {
  it("aceita e rejeita nas duas versões do schema", () => {
    const comAvaliacao = {
      ...coldProcessBatchV2,
      result: { evaluations: [NO_DESENFORME] },
    };
    expect(decodeStoredBatchV2(comAvaliacao)).toEqual({ success: true, data: comAvaliacao });

    expect(
      decodeStoredBatchV2({
        ...coldProcessBatchV2,
        result: { evaluations: [{ ...NO_DESENFORME, moment: "depois-de-um-mes" }] },
      }),
    ).toEqual({ success: false, reason: "result.evaluations[0].moment não é reconhecido." });

    expect(
      validateBatch({
        ...coldProcessBatch,
        result: { evaluations: [{ ...NO_DESENFORME, scores: { hardness: 9 } }] },
      }),
    ).toEqual({
      success: false,
      reason: "result.evaluations[0].scores.hardness deve estar entre 0 e 5.",
    });
  });

  it("recusa suor fora da escala", () => {
    expect(
      decodeStoredBatchV2({
        ...coldProcessBatchV2,
        result: { evaluations: [{ ...NO_DESENFORME, sweating: 7 }] },
      }),
    ).toEqual({ success: false, reason: "result.evaluations[0].sweating deve estar entre 0 e 5." });
  });

  it("mantém lotes sem avaliação válidos", () => {
    expect(validateBatch(coldProcessBatch).success).toBe(true);
    expect(decodeStoredBatchV2(coldProcessBatchV2).success).toBe(true);
  });
});
