import { describe, expect, it } from "vitest";
import oilsData from "@/data/oils.json";
import type { OilEvidenceField, OilsData } from "@/lib/soap/oils";

const data = oilsData as OilsData;
const CORE_COLD_PROCESS_IDS = ["azeite", "coco", "palma", "mamona", "karite"];
const SAP_SOURCE_ID = "soapcalc-oil-chart-2026-07-21";

const NUMERIC_FIELDS: OilEvidenceField[] = ["sapNaOH", "sapKOH", "iodine", "ins"];

function claimsDe(oilId: string) {
  return data.oils.find((candidate) => candidate.id === oilId)?.evidence ?? [];
}

describe("evidência da biblioteca de óleos", () => {
  it("mantém uma fonte rastreável para os SAPs dos óleos-base CP curados", () => {
    expect(data.sources?.find((candidate) => candidate.id === SAP_SOURCE_ID)).toMatchObject({
      url: "https://soapcalc.net/oil-list",
      accessedAt: "2026-07-21",
    });

    for (const oilId of CORE_COLD_PROCESS_IDS) {
      const sapClaim = claimsDe(oilId).find((claim) => claim.fields.includes("sapNaOH"));
      expect(sapClaim).toMatchObject({ status: "supported", decision: "direct_match" });
      expect(sapClaim?.fields).toEqual(["sapNaOH", "sapKOH"]);
      expect(sapClaim?.observations[0]).toMatchObject({ sourceId: SAP_SOURCE_ID });
      expect(sapClaim?.observations[0]?.locator).toBeTruthy();
    }
  });

  it("não apresenta perfil graxo como conferido em nenhum óleo", () => {
    for (const oil of data.oils) {
      for (const claim of oil.evidence ?? []) {
        expect(claim.fields).not.toContain("fattyAcids");
      }
    }
  });

  it("não referencia fonte inexistente", () => {
    const conhecidas = new Set((data.sources ?? []).map((source) => source.id));

    for (const oil of data.oils) {
      for (const claim of oil.evidence ?? []) {
        expect(claim.observations.length).toBeGreaterThan(0);
        for (const observation of claim.observations) {
          expect(conhecidas.has(observation.sourceId)).toBe(true);
        }
      }
    }
  });

  it("cobre com observação cada campo que a afirmação declara", () => {
    for (const oil of data.oils) {
      for (const claim of oil.evidence ?? []) {
        for (const field of claim.fields) {
          const observado = claim.observations.some((observation) => observation.values[field] !== undefined);
          expect(observado).toBe(true);
        }
      }
    }
  });

  it("exige que 'supported' signifique valor idêntico ao publicado pela fonte", () => {
    for (const oil of data.oils) {
      for (const claim of oil.evidence ?? []) {
        if (claim.status !== "supported") continue;
        for (const field of claim.fields) {
          if (!NUMERIC_FIELDS.includes(field)) continue;
          for (const observation of claim.observations) {
            const publicado = observation.values[field];
            if (publicado === undefined) continue;
            expect(publicado).toBe(oil[field as "sapNaOH" | "sapKOH" | "iodine" | "ins"]);
          }
        }
      }
    }
  });

  it("exige que 'conflicting' registre divergência real e a justifique", () => {
    const conflitos = data.oils.flatMap((oil) =>
      (oil.evidence ?? [])
        .filter((claim) => claim.status === "conflicting")
        .map((claim) => ({ oil, claim })),
    );

    expect(conflitos.length).toBeGreaterThan(0);

    for (const { oil, claim } of conflitos) {
      expect(claim.rationale).toBeTruthy();
      expect(["selected_reference", "editorial_default"]).toContain(claim.decision);
      const divergeEmAlgumCampo = claim.fields.some((field) =>
        claim.observations.some((observation) => {
          const publicado = observation.values[field];
          return publicado !== undefined
            && publicado !== oil[field as "sapNaOH" | "sapKOH" | "iodine" | "ins"];
        }),
      );
      expect(divergeEmAlgumCampo).toBe(true);
    }
  });

  it("mantém status, decisão e justificativa semanticamente compatíveis", () => {
    for (const oil of data.oils) {
      for (const claim of oil.evidence ?? []) {
        if (claim.status === "supported") {
          expect(["direct_match", "consensus"]).toContain(claim.decision);
          continue;
        }

        expect(claim.rationale).toBeTruthy();
        if (claim.status === "conflicting") {
          expect(["selected_reference", "editorial_default"]).toContain(claim.decision);
        } else {
          expect(["consensus", "range_midpoint"]).toContain(claim.decision);
        }
      }
    }
  });

  it("mantém iodo e INS fora do que é exibido como conferido", () => {
    for (const oilId of CORE_COLD_PROCESS_IDS) {
      const camposSuportados = claimsDe(oilId)
        .filter((claim) => claim.status === "supported")
        .flatMap((claim) => claim.fields);

      expect(camposSuportados).toContain("sapNaOH");
      expect(camposSuportados).toContain("sapKOH");
    }

    // O karité diverge da fonte em iodo e INS: nenhum dos dois pode passar por conferido.
    const karite = claimsDe("karite")
      .filter((claim) => claim.status === "supported")
      .flatMap((claim) => claim.fields);
    expect(karite).not.toContain("iodine");
    expect(karite).not.toContain("ins");
  });
});
