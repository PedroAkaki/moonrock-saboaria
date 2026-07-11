import type { Batch } from "@/lib/diario";

const baseFormula: Batch["formula"] = {
  totalOilWeight: 500,
  alkaliType: "naoh",
  naohGrams: 68,
  waterGrams: 150,
  superfatPercent: 5,
  oils: [
    {
      oilId: "oil-coconut",
      name: "Óleo de coco",
      grams: 150,
      percentage: 30,
      sapNaoh: 0.183,
    },
    {
      oilId: "oil-olive",
      name: "Azeite",
      grams: 350,
      percentage: 70,
      sapNaoh: 0.134,
    },
  ],
};

function batch(overrides: Partial<Batch>): Batch {
  return {
    id: "batch-fixture",
    batchCode: "CP-001",
    name: "Lote de teste",
    method: "cold_process",
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-10T12:00:00.000Z",
    batchDate: "2026-01-10",
    source: { type: "free_formula" },
    formula: structuredClone(baseFormula),
    cure: {
      startDate: "2026-01-10",
      targetEndDate: "2026-02-21",
      daysPlanned: 42,
    },
    status: "curing",
    photoIds: [],
    version: 1,
    ...overrides,
  };
}

export const coldProcessBatch = batch({
  id: "batch-cp-001",
  batchCode: "CP-001",
  name: "Cold Process de teste",
});

export const meltAndPourBatch = batch({
  id: "batch-mp-001",
  batchCode: "MP-001",
  name: "Melt and Pour de teste",
  method: "melt_and_pour",
  cure: { startDate: "2026-01-11", targetEndDate: "2026-01-12", daysPlanned: 1 },
});

export const hotProcessBatch = batch({
  id: "batch-hp-001",
  batchCode: "HP-001",
  name: "Hot Process de teste",
  method: "hot_process",
  cure: { startDate: "2026-01-12", targetEndDate: "2026-01-26", daysPlanned: 14 },
});

export const usedOilBatch = batch({
  id: "batch-ou-001",
  batchCode: "OU-001",
  name: "Óleo usado de teste",
  method: "used_oil",
  cure: { startDate: "2026-01-13", targetEndDate: "2026-02-10", daysPlanned: 28 },
});

export const batchWithOptionalFields = batch({
  id: "batch-cp-optional",
  batchCode: "CP-005",
  name: "Lote completo de teste",
  source: { type: "recipe", recipeId: "recipe-fixture" },
  formula: {
    ...structuredClone(baseFormula),
    waterLyeRatio: 2.2,
    lyeConcentrationPercent: 31.25,
    expectedBatchWeight: 718,
    additives: [{ name: "Argila", grams: 5, type: "clay", notes: "Fixture" }],
  },
  process: {
    ambientTemp: 27,
    oilTemp: 38,
    lyeTemp: 36,
    mixingTemp: 37,
    traceTimeMinutes: 8,
    moldName: "Molde de teste",
    notes: "Processo registrado na fixture.",
  },
  yield: {
    barsCount: 8,
    cutDate: "2026-01-11",
    unmoldDate: "2026-01-11",
    finalWeightGrams: 690,
  },
  result: {
    ph: 9.5,
    observations: "Resultado registrado na fixture.",
    rating: 4,
    wouldRepeat: true,
  },
  tags: ["fixture", "completo"],
  photoIds: ["photo-fixture"],
});

export const currentBatchFixtures: Batch[] = [
  coldProcessBatch,
  meltAndPourBatch,
  hotProcessBatch,
  usedOilBatch,
  batchWithOptionalFields,
];
