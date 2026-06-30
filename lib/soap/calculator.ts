import { Oil } from "./oils";

export interface CalculatorInput {
  /** Total weight of oils in grams */
  totalOilWeight: number;
  /** Oils with their percentage of the total (must sum to 100) */
  oils: { oilId: string; percentage: number }[];
  /** Superfat percentage (e.g., 5 for 5%) */
  superfat: number;
  /** Water-to-lye ratio (e.g., 2 means 2:1 water:NaOH) */
  waterRatio: number;
}

export interface CalculatorResult {
  oils: { oilId: string; name: string; grams: number; percentage: number }[];
  totalOilsGrams: number;
  naoh: number;
  naohWithSuperfat: number;
  waterGrams: number;
  totalBatchWeight: number;
  superfatPercent: number;
  waterRatio: number;
  /** INS number of the recipe — ideal range: 136-170 */
  ins: number;
  /** Per-oil breakdown of NaOH contribution */
  naohPerOil: { oilId: string; name: string; grams: number; sapNaoh: number; naoh: number; naohBeforeSuperfat: number }[];
}

/**
 * Validate calculator input
 */
export function validateInput(
  input: CalculatorInput,
  oilLibrary: Oil[]
): string[] {
  const errors: string[] = [];

  if (input.totalOilWeight <= 0) {
    errors.push("Peso total dos óleos deve ser maior que zero");
  }

  if (input.totalOilWeight > 50000) {
    errors.push("Peso total muito alto (máximo 50kg)");
  }

  if (input.oils.length === 0) {
    errors.push("Adicione pelo menos um óleo");
  }

  const totalPercentage = input.oils.reduce((sum, o) => sum + o.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.5) {
    errors.push(`A soma dos percentuais é ${totalPercentage.toFixed(1)}% — deve ser 100%`);
  }

  if (input.superfat < 0 || input.superfat > 30) {
    errors.push("Superfat deve estar entre 0% e 30%");
  }

  if (input.waterRatio < 1.5 || input.waterRatio > 3) {
    errors.push("Razão água:soda deve estar entre 1.5:1 e 3:1");
  }

  // Check all oils exist in library
  for (const oilInput of input.oils) {
    const found = oilLibrary.find((o) => o.id === oilInput.oilId);
    if (!found) {
      errors.push(`Óleo "${oilInput.oilId}" não encontrado na biblioteca`);
    } else if (oilInput.percentage <= 0) {
      errors.push(`Percentual do óleo ${found.name} deve ser maior que zero`);
    }
  }

  return errors;
}

/**
 * Calculate NaOH and water amounts for a soap recipe.
 * 
 * Formula:
 *   NaOH_bruto = Σ (gramas_óleo_i × SAP_NaOH_i)
 *   NaOH_final = NaOH_bruto × (1 - superfat/100)
 *   Água = NaOH_final × waterRatio
 */
export function calculateSoap(
  input: CalculatorInput,
  oilLibrary: Oil[]
): CalculatorResult {
  const oilMap = new Map(oilLibrary.map((o) => [o.id, o]));

  // Calculate grams per oil
  const oilDetails = input.oils.map((o) => {
    const oil = oilMap.get(o.oilId)!;
    return {
      oilId: o.oilId,
      name: oil.name,
      grams: (input.totalOilWeight * o.percentage) / 100,
      percentage: o.percentage,
      sapNaOH: oil.sapNaOH,
    };
  });

  // NaOH per oil
  const naohPerOil = oilDetails.map((o) => {
    const naohBruto = o.grams * o.sapNaOH;
    return {
      oilId: o.oilId,
      name: o.name,
      grams: +o.grams.toFixed(1),
      sapNaoh: o.sapNaOH,
      naohBeforeSuperfat: +naohBruto.toFixed(2),
      naoh: +(naohBruto * (1 - input.superfat / 100)).toFixed(2),
    };
  });

  const totalNaOH = naohPerOil.reduce((sum, o) => sum + o.naohBeforeSuperfat, 0);
  const naohWithSuperfat = +(totalNaOH * (1 - input.superfat / 100)).toFixed(2);
  const waterGrams = +(naohWithSuperfat * input.waterRatio).toFixed(1);

  // Calculate INS number: Σ (% × INS) / 100
  const ins = +(
    input.oils.reduce((sum, o) => {
      const oil = oilMap.get(o.oilId);
      return sum + (oil?.ins ?? 0) * o.percentage;
    }, 0) / 100
  ).toFixed(1);

  return {
    oils: oilDetails.map((o) => ({
      oilId: o.oilId,
      name: o.name,
      grams: +o.grams.toFixed(1),
      percentage: o.percentage,
    })),
    totalOilsGrams: +input.totalOilWeight.toFixed(1),
    naoh: +totalNaOH.toFixed(2),
    naohWithSuperfat,
    waterGrams,
    totalBatchWeight: +(
      input.totalOilWeight + naohWithSuperfat + waterGrams
    ).toFixed(1),
    superfatPercent: input.superfat,
    waterRatio: input.waterRatio,
    ins,
    naohPerOil,
  };
}

export interface MoldResult {
  volumeCm3: number;
  oilWeightGrams: number;
  estimatedSoapWeight: number;
  bars100g: number;
  bars80g: number;
}

/**
 * Scale a recipe to fit a specific mold volume.
 * Rule of thumb from saboaria artesanal:
 *   Volume (cm³) × 0.40 = Peso Total dos Óleos
 *   Peso final do sabão ≈ Peso dos óleos × 1.45
 */
export function scaleToMold(
  moldVolumeMl: number,
): number {
  return +(moldVolumeMl * 0.40).toFixed(1);
}

/**
 * Calculate full mold details
 */
export function calculateMold(
  lengthCm: number,
  widthCm: number,
  heightCm: number
): MoldResult {
  const volumeCm3 = lengthCm * widthCm * heightCm;
  const oilWeightGrams = +(volumeCm3 * 0.40).toFixed(1);
  const estimatedSoapWeight = +(oilWeightGrams * 1.45).toFixed(1);

  return {
    volumeCm3,
    oilWeightGrams,
    estimatedSoapWeight,
    bars100g: Math.floor(estimatedSoapWeight / 100),
    bars80g: Math.floor(estimatedSoapWeight / 80),
  };
}

/**
 * Suggest water ratio based on experience level
 */
export function suggestWaterRatio(level: "iniciante" | "intermediario" | "avancado"): number {
  switch (level) {
    case "iniciante": return 2.5; // More water = safer, slower trace
    case "intermediario": return 2.2;
    case "avancado": return 2.0;
  }
}

/**
 * Suggest superfat based on oil blend
 */
export function suggestSuperfat(isCleaningSoap: boolean, isCosmetic: boolean): number {
  if (isCleaningSoap) return 0; // Cleaning soap: no superfat
  if (isCosmetic) return 8; // Cosmetic: 8% is the sweet spot for most blends
  return 5; // Default
}
