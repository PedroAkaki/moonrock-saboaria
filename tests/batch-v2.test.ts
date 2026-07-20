import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  decodeStoredBatch,
  decodeStoredBatchV1,
  decodeStoredBatchV2,
  normalizeBatch,
} from "@/lib/batch/decoder";
import {
  getInitialBatchStatus,
  getInitialReadiness,
  getSuggestedReadinessDays,
} from "@/lib/batch/method-rules";
import { BATCH_STORAGE_KEY } from "@/lib/diario";
import type { TransitionalBatchFormula } from "@/lib/batch/types";
import {
  batchWithOptionalFields,
  coldProcessBatch,
  meltAndPourBatch,
} from "@/tests/fixtures/batches";
import {
  coldProcessBatchV2,
  hotProcessBatchV2,
  meltAndPourBatchV2,
  usedOilBatchV2,
} from "@/tests/fixtures/batches-v2";
import { MemoryStorage } from "@/tests/test-storage";

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
});

describe("decoders de Batch v1 e v2", () => {
  it("mantém o decoder v1 aceitando fixture válida", () => {
    const decoded = decodeStoredBatchV1(coldProcessBatch);
    expect(decoded).toEqual({ success: true, data: coldProcessBatch });
  });

  it("mantém o decoder v1 rejeitando fixture inválida", () => {
    const decoded = decodeStoredBatchV1({ ...coldProcessBatch, formula: null });
    expect(decoded).toEqual({ success: false, reason: "formula deve ser um objeto." });
  });

  it.each([
    ["Cold Process", coldProcessBatchV2],
    ["Hot Process", hotProcessBatchV2],
    ["Melt and Pour", meltAndPourBatchV2],
    ["óleo usado", usedOilBatchV2],
  ])("aceita Batch v2 válido de %s", (_method, fixture) => {
    const decoded = decodeStoredBatchV2(fixture);
    expect(decoded).toEqual({ success: true, data: fixture });
  });

  it("rejeita processData com método incompatível", () => {
    const decoded = decodeStoredBatchV2({
      ...meltAndPourBatchV2,
      processData: { method: "cold_process", ambientTempC: 25 },
    });
    expect(decoded).toEqual({
      success: false,
      reason: "processData.method (cold_process) não corresponde ao método do lote (melt_and_pour).",
    });
  });

  it("rejeita readiness incompatível", () => {
    const decoded = decodeStoredBatchV2({
      ...coldProcessBatchV2,
      readiness: { kind: "unmold", expectedAt: "2026-02-02" },
    });
    expect(decoded).toEqual({
      success: false,
      reason: "readiness.kind (unmold) não é compatível com o método do lote (cold_process).",
    });
  });

  it("identifica versões desconhecidas", () => {
    expect(decodeStoredBatch({ id: "sem-versão" })).toEqual({
      success: false,
      reason: "versão de schema do lote não é reconhecida.",
    });
  });
});

describe("normalização v1 para domínio v2", () => {
  it("preserva ID e batchCode sem gravar no storage", () => {
    storage.setItem(BATCH_STORAGE_KEY, JSON.stringify([coldProcessBatch]));
    storage.resetWriteCount();
    const normalized = normalizeBatch(coldProcessBatch);
    expect(normalized.success).toBe(true);
    if (!normalized.success) return;
    expect(normalized.data).toMatchObject({
      schemaVersion: 2,
      id: coldProcessBatch.id,
      batchCode: coldProcessBatch.batchCode,
    });
    expect(storage.writes).toBe(0);
  });

  it("mapeia somente campos seguros de processo Cold Process", () => {
    const normalized = normalizeBatch(batchWithOptionalFields);
    expect(normalized.success).toBe(true);
    if (!normalized.success) return;
    expect(normalized.data.processData).toEqual({
      method: "cold_process",
      ambientTempC: 27,
      oilTempC: 38,
      lyeTempC: 36,
      mixingTempC: 37,
      traceTimeMinutes: 8,
      moldName: "Molde de teste",
      notes: "Processo registrado na fixture.",
    });
    expect(normalized.data.readiness).toEqual({
      kind: "cure",
      ...batchWithOptionalFields.cure,
    });
    expect(normalized.data.result).toEqual(batchWithOptionalFields.result);
  });

  it("não inventa processo ou readiness para Melt and Pour legado", () => {
    const legacyMeltAndPour = {
      ...meltAndPourBatch,
      process: { ambientTemp: 24, notes: "Campo genérico legado" },
    };
    const normalized = normalizeBatch(legacyMeltAndPour);
    expect(normalized.success).toBe(true);
    if (!normalized.success) return;
    expect(normalized.data.processData).toBeUndefined();
    expect(normalized.data.readiness).toBeUndefined();
    expect(normalized.data.formula).toEqual(legacyMeltAndPour.formula);
    expect(normalized.data.legacyData).toMatchObject({
      sourceSchemaVersion: 1,
      unmappedProcess: legacyMeltAndPour.process,
      unmappedCure: legacyMeltAndPour.cure,
    });
  });

  it("preserva campos legados não mapeados", () => {
    const withLegacyFields = {
      ...batchWithOptionalFields,
      process: { ...batchWithOptionalFields.process, experimentalField: "manter" },
      futureV1Field: { keep: true },
    };
    const normalized = normalizeBatch(withLegacyFields);
    expect(normalized.success).toBe(true);
    if (!normalized.success) return;
    expect(normalized.data.legacyData).toMatchObject({
      sourceSchemaVersion: 1,
      unmappedProcess: { experimentalField: "manter" },
      unmappedFields: { futureV1Field: { keep: true } },
    });
  });

  it("retorna domínio v2 exibível sem persistência automática", () => {
    const normalized = normalizeBatch(coldProcessBatch);
    expect(normalized).toMatchObject({
      success: true,
      data: {
        schemaVersion: 2,
        name: coldProcessBatch.name,
        status: coldProcessBatch.status,
      },
    });
    expect(storage.writes).toBe(0);
  });
});

describe("regras iniciais por método", () => {
  it("varia status inicial por método", () => {
    expect(getInitialBatchStatus("cold_process")).toBe("curing");
    expect(getInitialBatchStatus("hot_process")).toBe("made");
    expect(getInitialBatchStatus("melt_and_pour")).toBe("made");
    expect(getInitialBatchStatus("used_oil")).toBe("made");
    expect(getInitialBatchStatus("other")).toBe("draft");
  });

  it("varia readiness inicial por método", () => {
    expect(getInitialReadiness("cold_process", "2026-02-01")).toMatchObject({ kind: "cure", daysPlanned: 42 });
    expect(getInitialReadiness("hot_process", "2026-02-01")).toMatchObject({ kind: "stabilization", daysPlanned: 14 });
    expect(getInitialReadiness("melt_and_pour", "2026-02-01")).toEqual({ kind: "unmold", expectedAt: "2026-02-02" });
    expect(getInitialReadiness("used_oil", "2026-02-01")).toMatchObject({ kind: "cure", daysPlanned: 28 });
    expect(getInitialReadiness("other", "2026-02-01")).toBeUndefined();
  });
});

function formulaWithOils(oils: { oilId: string | null; percentage: number }[]): TransitionalBatchFormula {
  return {
    totalOilWeight: 500,
    alkaliType: "naoh",
    naohGrams: 65,
    waterGrams: 150,
    superfatPercent: 5,
    oils: oils.map((oil, index) => ({
      oilId: oil.oilId,
      name: `Óleo ${index + 1}`,
      grams: (oil.percentage / 100) * 500,
      percentage: oil.percentage,
    })),
  };
}

describe("cura sugerida por formulação", () => {
  it("mantém 42 dias para CP com formulação equilibrada", () => {
    const formula = formulaWithOils([
      { oilId: "azeite", percentage: 40 },
      { oilId: "coco", percentage: 40 },
      { oilId: "mamona", percentage: 20 },
    ]);
    expect(getSuggestedReadinessDays("cold_process", formula)).toBe(42);
  });

  it("estende para 90 dias quando óleos alto oleico dominam (estilo Castela)", () => {
    const formula = formulaWithOils([
      { oilId: "azeite", percentage: 80 },
      { oilId: "coco", percentage: 20 },
    ]);
    expect(getSuggestedReadinessDays("cold_process", formula)).toBe(90);
    expect(getInitialReadiness("cold_process", "2026-02-01", formula)).toMatchObject({
      kind: "cure",
      daysPlanned: 90,
      targetEndDate: "2026-05-02",
    });
  });

  it("ignora a formulação para métodos que não são CP e óleos sem id", () => {
    const castileLike = formulaWithOils([{ oilId: "azeite", percentage: 100 }]);
    expect(getSuggestedReadinessDays("hot_process", castileLike)).toBe(14);
    const unknownOils = formulaWithOils([{ oilId: null, percentage: 100 }]);
    expect(getSuggestedReadinessDays("cold_process", unknownOils)).toBe(42);
  });
});

describe("processData de Cold Process Avançado", () => {
  it("aceita ponto de trace, gel phase e técnica de design", () => {
    const fixture = {
      ...coldProcessBatchV2,
      processData: {
        ...coldProcessBatchV2.processData,
        tracePointAtPour: "light",
        gelPhase: "full",
        designTechnique: "drop swirl",
      },
    };
    const decoded = decodeStoredBatchV2(fixture);
    expect(decoded).toEqual({ success: true, data: fixture });
  });

  it("rejeita ponto de trace desconhecido", () => {
    const decoded = decodeStoredBatchV2({
      ...coldProcessBatchV2,
      processData: { method: "cold_process", tracePointAtPour: "pudim" },
    });
    expect(decoded).toEqual({ success: false, reason: "processData.tracePointAtPour não é reconhecido." });
  });

  it("rejeita gel phase desconhecida", () => {
    const decoded = decodeStoredBatchV2({
      ...coldProcessBatchV2,
      processData: { method: "cold_process", gelPhase: "talvez" },
    });
    expect(decoded).toEqual({ success: false, reason: "processData.gelPhase não é reconhecido." });
  });

  it("aceita a conferência inicial de 24–48 horas", () => {
    const fixture = {
      ...coldProcessBatchV2,
      processData: {
        ...coldProcessBatchV2.processData,
        unmoldCheck: {
          checkedAt: "2026-02-03",
          unmolded: true,
          surfaceCondition: "firm" as const,
          sodaAsh: true,
          cracking: false,
          separation: false,
          notes: "Corte limpo.",
        },
      },
    };
    expect(decodeStoredBatchV2(fixture)).toEqual({ success: true, data: fixture });
  });

  it("rejeita conferência inicial sem estado de desmolde", () => {
    const decoded = decodeStoredBatchV2({
      ...coldProcessBatchV2,
      processData: {
        method: "cold_process",
        unmoldCheck: { checkedAt: "2026-02-03" },
      },
    });
    expect(decoded).toEqual({ success: false, reason: "processData.unmoldCheck.unmolded deve ser booleano." });
  });
});
