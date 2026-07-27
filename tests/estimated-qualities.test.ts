import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBatch, validateBatch, type EstimatedQualities } from "@/lib/diario";
import { decodeStoredBatchV2 } from "@/lib/batch/decoder";
import {
  readCalculatorFormulaForDiary,
  saveCalculatorFormulaForDiary,
  validateCalculatorDiaryFormula,
  type CalculatorDiaryFormula,
} from "@/lib/storage/calculator-diary";
import { coldProcessBatch } from "@/tests/fixtures/batches";
import { coldProcessBatchV2 } from "@/tests/fixtures/batches-v2";
import { MemoryStorage } from "@/tests/test-storage";

const QUALITIES: EstimatedQualities = {
  hardness: 3.4,
  cleansing: 3,
  conditioning: 2.9,
  bubbly: 3.4,
  creamy: 2.7,
};

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
});

describe("snapshot das qualidades estimadas", () => {
  it("atravessa a ponte Calculadora → Diário sem perder valores", () => {
    const formula: CalculatorDiaryFormula = {
      totalOilWeight: 500,
      alkaliType: "naoh",
      naohGrams: 68,
      waterGrams: 150,
      superfatPercent: 5,
      estimatedQualities: QUALITIES,
    };
    saveCalculatorFormulaForDiary(formula);

    expect(readCalculatorFormulaForDiary()?.estimatedQualities).toEqual(QUALITIES);
  });

  it("continua aceitando fórmula sem estimativa", () => {
    const semQualidades = validateCalculatorDiaryFormula({
      totalOilWeight: 500,
      alkaliType: "naoh",
      waterGrams: 150,
      superfatPercent: 5,
    });

    expect(semQualidades).not.toBeNull();
    expect(semQualidades?.estimatedQualities).toBeUndefined();
  });

  it("rejeita estimativa fora da escala 0–5 na ponte", () => {
    const foraDaEscala = validateCalculatorDiaryFormula({
      totalOilWeight: 500,
      alkaliType: "naoh",
      waterGrams: 150,
      superfatPercent: 5,
      estimatedQualities: { ...QUALITIES, hardness: 7 },
    });

    expect(foraDaEscala).toBeNull();
  });

  it("rejeita estimativa incompleta na ponte", () => {
    const semUmCampo = validateCalculatorDiaryFormula({
      totalOilWeight: 500,
      alkaliType: "naoh",
      waterGrams: 150,
      superfatPercent: 5,
      estimatedQualities: { hardness: 3, cleansing: 2, conditioning: 4, bubbly: 1 },
    });

    expect(semUmCampo).toBeNull();
  });

  it("persiste a estimativa no lote criado", () => {
    const batch = createBatch({
      name: "Lote com estimativa",
      method: "cold_process",
      batchDate: "2026-07-27",
      source: { type: "calculator" },
      formula: { ...coldProcessBatch.formula, estimatedQualities: QUALITIES },
    });

    expect(batch.formula.estimatedQualities).toEqual(QUALITIES);
    expect(validateBatch(batch)).toEqual({ success: true, data: batch });
  });

  it("valida a escala no domínio v1", () => {
    const invalido = validateBatch({
      ...coldProcessBatch,
      formula: { ...coldProcessBatch.formula, estimatedQualities: { ...QUALITIES, creamy: -1 } },
    });

    expect(invalido).toEqual({
      success: false,
      reason: "formula.estimatedQualities.creamy deve estar entre 0 e 5.",
    });
  });

  it("aceita e valida a estimativa no decoder v2", () => {
    const comQualidades = {
      ...coldProcessBatchV2,
      formula: { ...coldProcessBatchV2.formula, estimatedQualities: QUALITIES },
    };
    expect(decodeStoredBatchV2(comQualidades)).toEqual({ success: true, data: comQualidades });

    expect(
      decodeStoredBatchV2({
        ...coldProcessBatchV2,
        formula: { ...coldProcessBatchV2.formula, estimatedQualities: { ...QUALITIES, bubbly: "alta" } },
      }),
    ).toEqual({ success: false, reason: "formula.estimatedQualities.bubbly deve ser um número." });
  });

  it("mantém lotes antigos sem estimativa válidos nas duas versões", () => {
    expect(validateBatch(coldProcessBatch).success).toBe(true);
    expect(decodeStoredBatchV2(coldProcessBatchV2).success).toBe(true);
  });
});
