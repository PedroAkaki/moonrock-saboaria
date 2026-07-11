import type { BatchOil } from "@/lib/diario";

export const CALCULATOR_DIARY_STORAGE_KEY = "moonrock:calculator:lastFormula:v1";

export interface CalculatorDiaryFormula {
  totalOilWeight: number;
  alkaliType: "naoh";
  naohGrams?: number;
  waterGrams: number;
  superfatPercent: number;
  oils?: BatchOil[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBatchOil(value: unknown): value is BatchOil {
  if (!isRecord(value)) return false;
  return (
    (value.oilId === null || typeof value.oilId === "string") &&
    typeof value.name === "string" &&
    isFiniteNumber(value.grams) &&
    isFiniteNumber(value.percentage) &&
    (value.sapNaoh === undefined || isFiniteNumber(value.sapNaoh)) &&
    (value.sapKoh === undefined || isFiniteNumber(value.sapKoh))
  );
}

export function validateCalculatorDiaryFormula(value: unknown): CalculatorDiaryFormula | null {
  if (!isRecord(value)) return null;
  if (!isFiniteNumber(value.totalOilWeight)) return null;
  if (value.alkaliType !== undefined && value.alkaliType !== "naoh") return null;
  if (value.naohGrams !== undefined && !isFiniteNumber(value.naohGrams)) return null;
  if (!isFiniteNumber(value.waterGrams)) return null;
  if (!isFiniteNumber(value.superfatPercent)) return null;
  if (value.oils !== undefined && (!Array.isArray(value.oils) || !value.oils.every(isBatchOil))) return null;

  return {
    totalOilWeight: value.totalOilWeight,
    alkaliType: "naoh",
    naohGrams: value.naohGrams as number | undefined,
    waterGrams: value.waterGrams,
    superfatPercent: value.superfatPercent,
    oils: value.oils as BatchOil[] | undefined,
  };
}

export function saveCalculatorFormulaForDiary(formula: CalculatorDiaryFormula): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CALCULATOR_DIARY_STORAGE_KEY, JSON.stringify(formula));
}

export function readCalculatorFormulaForDiary(): CalculatorDiaryFormula | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(CALCULATOR_DIARY_STORAGE_KEY);
  if (!saved) return null;
  try {
    const parsed: unknown = JSON.parse(saved);
    return validateCalculatorDiaryFormula(parsed);
  } catch {
    return null;
  }
}

export function clearCalculatorFormulaForDiary(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CALCULATOR_DIARY_STORAGE_KEY);
}

