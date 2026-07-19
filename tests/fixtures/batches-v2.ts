import type { BatchV2 } from "@/lib/batch/types";
import { coldProcessBatch } from "@/tests/fixtures/batches";

function batchV2(overrides: Partial<BatchV2>): BatchV2 {
  return {
    schemaVersion: 2,
    id: "batch-v2-cp-001",
    batchCode: "CP-101",
    name: "Batch v2 de teste",
    method: "cold_process",
    createdAt: "2026-02-01T12:00:00.000Z",
    updatedAt: "2026-02-01T12:00:00.000Z",
    batchDate: "2026-02-01",
    source: { type: "free_formula" },
    formula: structuredClone(coldProcessBatch.formula),
    processData: {
      method: "cold_process",
      ambientTempC: 26,
      oilTempC: 38,
      traceTimeMinutes: 8,
      moldName: "Molde v2",
    },
    readiness: {
      kind: "cure",
      startDate: "2026-02-01",
      targetEndDate: "2026-03-15",
      daysPlanned: 42,
    },
    status: "curing",
    photoIds: [],
    ...overrides,
  };
}

export const coldProcessBatchV2 = batchV2({});

export const hotProcessBatchV2 = batchV2({
  id: "batch-v2-hp-001",
  batchCode: "HP-101",
  name: "Hot Process v2 de teste",
  method: "hot_process",
  processData: {
    method: "hot_process",
    heatingMethod: "slow_cooker",
    cookTimeMinutes: 75,
  },
  readiness: {
    kind: "stabilization",
    startDate: "2026-02-01",
    targetEndDate: "2026-02-15",
    daysPlanned: 14,
  },
  status: "made",
});

export const meltAndPourBatchV2 = batchV2({
  id: "batch-v2-mp-001",
  batchCode: "MP-101",
  name: "Melt and Pour v2 de teste",
  method: "melt_and_pour",
  processData: {
    method: "melt_and_pour",
    meltingMethod: "microwave",
    unmoldTimeHours: 6,
    bubblesObserved: false,
  },
  readiness: {
    kind: "unmold",
    expectedAt: "2026-02-02",
  },
  status: "made",
});

export const usedOilBatchV2 = batchV2({
  id: "batch-v2-ou-001",
  batchCode: "OU-101",
  name: "Óleo usado v2 de teste",
  method: "used_oil",
  processData: {
    method: "used_oil",
    oilSource: "Cozinha de teste",
    filtrationMethod: "Peneira fina",
    intendedUse: "household_cleaning",
  },
  readiness: {
    kind: "cure",
    startDate: "2026-02-01",
    targetEndDate: "2026-03-01",
    daysPlanned: 28,
  },
  status: "made",
});

