import { describe, expect, it } from "vitest";
import oilsData from "@/data/oils.json";
import type { OilsData } from "@/lib/soap/oils";

const data = oilsData as OilsData;
const CORE_COLD_PROCESS_IDS = ["azeite", "coco", "palma", "mamona", "karite"];
const SAP_SOURCE_ID = "soapcalc-oil-chart-2026-07-21";

describe("evidência da biblioteca de óleos", () => {
  it("mantém uma fonte rastreável para os SAPs dos óleos-base CP curados", () => {
    const source = data.sources?.find((candidate) => candidate.id === SAP_SOURCE_ID);

    expect(source).toMatchObject({
      url: "https://soapcalc.net/oil-list",
      accessedAt: "2026-07-21",
    });

    for (const oilId of CORE_COLD_PROCESS_IDS) {
      const oil = data.oils.find((candidate) => candidate.id === oilId);
      expect(oil?.evidence).toMatchObject({
        status: "partial",
        sourceIds: [SAP_SOURCE_ID],
        reviewedAt: "2026-07-21",
      });
      expect(oil?.evidence?.verifiedFields).toEqual(["sapNaOH", "sapKOH"]);
    }
  });

  it("não apresenta a curadoria parcial como validação de iodo, INS ou perfil graxo", () => {
    for (const oilId of CORE_COLD_PROCESS_IDS) {
      const verifiedFields = data.oils.find((candidate) => candidate.id === oilId)?.evidence?.verifiedFields ?? [];
      expect(verifiedFields).not.toContain("iodine");
      expect(verifiedFields).not.toContain("ins");
      expect(verifiedFields).not.toContain("fattyAcids");
    }
  });
});
