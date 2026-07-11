import { beforeEach, describe, expect, it, vi } from "vitest";
import { BATCH_STORAGE_KEY } from "@/lib/diario";
import { exportBackup, importBackup } from "@/lib/storage/backup";
import { invalidBackupFixtures, validBackupFixture } from "@/tests/fixtures/backups";
import { coldProcessBatch, currentBatchFixtures } from "@/tests/fixtures/batches";
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

describe("backup atual", () => {
  it("exporta um backup válido", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify(currentBatchFixtures));
    storage.setItem("moonrock:progress:v1", JSON.stringify({ version: 1, modules: {} }));
    const exported = JSON.parse(exportBackup()) as Record<string, unknown>;
    expect(exported).toMatchObject({ app: "moonrock-saboaria", version: 1 });
    expect(exported.batches).toEqual(currentBatchFixtures);
  });

  it("exporta e importa quando ainda não existe progresso", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    const exported = exportBackup();
    expect(importBackup(exported)).toEqual({ success: true });
  });

  it("recusa exportar armazenamento local estruturalmente inválido", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([{ id: "incompleto" }]));
    expect(() => exportBackup()).toThrow("registro 1 de lotes inválido");
  });

  it("importa um backup válido", () => {
    const result = importBackup(JSON.stringify(validBackupFixture));
    expect(result).toEqual({ success: true });
    expect(JSON.parse(storage.getItem(BATCH_STORAGE_KEY) ?? "[]")).toEqual(currentBatchFixtures);
  });

  it.each([
    ["envelope não objeto", invalidBackupFixtures.notAnObject],
    ["app incorreto", invalidBackupFixtures.wrongApp],
    ["batches ausente", invalidBackupFixtures.missingBatches],
  ])("rejeita backup inválido sem sobrescrever: %s", (_name, fixture) => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    const before = storage.getItem(BATCH_STORAGE_KEY);
    const result = importBackup(JSON.stringify(fixture));
    expect(result.success).toBe(false);
    expect(storage.getItem(BATCH_STORAGE_KEY)).toBe(before);
  });

  it("rejeita a importação inteira quando apenas um lote é inválido", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    const before = storage.getItem(BATCH_STORAGE_KEY);
    const result = importBackup(JSON.stringify(invalidBackupFixtures.invalidBatch));
    expect(result).toEqual({
      success: false,
      error: "Backup inválido no lote 2: batchCode é obrigatório.",
    });
    expect(storage.getItem(BATCH_STORAGE_KEY)).toBe(before);
  });
});
