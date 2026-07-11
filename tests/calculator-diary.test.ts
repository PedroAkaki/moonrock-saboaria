import { beforeEach, describe, expect, it, vi } from "vitest";
import { BATCH_STORAGE_KEY, createBatch } from "@/lib/diario";
import {
  CALCULATOR_DIARY_STORAGE_KEY,
  clearCalculatorFormulaForDiary,
  readCalculatorFormulaForDiary,
  saveCalculatorFormulaForDiary,
  type CalculatorDiaryFormula,
} from "@/lib/storage/calculator-diary";
import { MemoryStorage } from "@/tests/test-storage";

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
});

describe("contrato Calculadora para Diário", () => {
  it("preserva a fórmula até o lote ser criado e a limpeza ser explícita", () => {
    const formula: CalculatorDiaryFormula = {
      totalOilWeight: 500,
      alkaliType: "naoh",
      naohGrams: 68,
      waterGrams: 150,
      superfatPercent: 5,
      oils: [{ oilId: "oil-coconut", name: "Óleo de coco", grams: 500, percentage: 100, sapNaoh: 0.183 }],
    };
    saveCalculatorFormulaForDiary(formula);
    const pending = readCalculatorFormulaForDiary();
    expect(pending).toEqual(formula);

    const created = createBatch({
      name: "Lote da calculadora",
      method: "cold_process",
      batchDate: "2026-01-21",
      source: { type: "calculator" },
      formula: {
        totalOilWeight: pending?.totalOilWeight ?? 0,
        alkaliType: "naoh",
        naohGrams: pending?.naohGrams,
        waterGrams: pending?.waterGrams ?? 0,
        superfatPercent: pending?.superfatPercent ?? 0,
        oils: pending?.oils ?? [],
      },
    });

    expect(created.formula).toEqual(formula);
    expect(storage.getItem(CALCULATOR_DIARY_STORAGE_KEY)).not.toBeNull();
    expect(storage.getItem(BATCH_STORAGE_KEY)).not.toBeNull();

    clearCalculatorFormulaForDiary();
    expect(storage.getItem(CALCULATOR_DIARY_STORAGE_KEY)).toBeNull();
  });

  it("rejeita payload inválido sem apagá-lo ou regravá-lo", () => {
    storage.setItem(CALCULATOR_DIARY_STORAGE_KEY, JSON.stringify({ totalOilWeight: "500" }));
    storage.resetWriteCount();
    expect(readCalculatorFormulaForDiary()).toBeNull();
    expect(storage.writes).toBe(0);
    expect(storage.getItem(CALCULATOR_DIARY_STORAGE_KEY)).not.toBeNull();
  });
});

