import { currentBatchFixtures } from "@/tests/fixtures/batches";

export const validBackupFixture = {
  version: 1,
  exportedAt: "2026-01-20T12:00:00.000Z",
  app: "moonrock-saboaria",
  progress: { version: 1, modules: {} },
  batches: structuredClone(currentBatchFixtures),
};

export const invalidBackupFixtures = {
  notAnObject: [],
  wrongApp: { ...validBackupFixture, app: "outro-app" },
  missingBatches: {
    version: 1,
    exportedAt: "2026-01-20T12:00:00.000Z",
    app: "moonrock-saboaria",
    progress: { version: 1 },
  },
  invalidBatch: {
    ...validBackupFixture,
    batches: [structuredClone(currentBatchFixtures[0]), { id: "incompleto" }],
  },
};

