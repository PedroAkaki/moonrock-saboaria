import { describe, expect, it } from "vitest";
import {
  BLEND_GOALS,
  calculateBlendProfile,
  isMetricWithinGoal,
  suggestOilBlend,
} from "@/lib/soap/blend-profile";
import type { Oil } from "@/lib/soap/oils";

function oil(id: string, overrides: Partial<Oil> = {}): Oil {
  return {
    id,
    name: id,
    inci: id,
    type: "oleo-liquido",
    sapNaOH: 0.14,
    sapKOH: 0.2,
    iodine: 80,
    ins: 140,
    hardness: 3,
    cleansing: 2,
    conditioning: 3,
    bubbly: 2,
    creamy: 3,
    fattyAcids: {},
    maxPercent: 100,
    stability: "alta",
    meltingPoint: null,
    availability: "alta",
    cost: "",
    shelfLife: "",
    notes: "",
    ...overrides,
  };
}

const oils = [
  oil("azeite", { hardness: 2, cleansing: 1, conditioning: 5, bubbly: 1, creamy: 2, iodine: 80, ins: 105, maxPercent: 80 }),
  oil("coco", { hardness: 5, cleansing: 5, conditioning: 1, bubbly: 5, creamy: 3, iodine: 10, ins: 258, maxPercent: 30 }),
  oil("palma", { hardness: 4, cleansing: 2, conditioning: 3, bubbly: 3, creamy: 4, iodine: 52, ins: 145, maxPercent: 60 }),
];

describe("perfil e sugestão de mistura de óleos", () => {
  it("calcula propriedades ponderadas pela proporção da mistura", () => {
    const profile = calculateBlendProfile([
      { oilId: "azeite", percentage: 70 },
      { oilId: "coco", percentage: 20 },
      { oilId: "palma", percentage: 10 },
    ], oils);

    expect(profile).toMatchObject({
      percentageTotal: 100,
      hardness: 2.8,
      cleansing: 1.9,
      conditioning: 4,
      bubbly: 2,
      creamy: 2.4,
      iodine: 63.2,
      ins: 139.6,
    });
  });

  it("sugere uma mistura determinística que respeita o máximo de cada óleo", () => {
    const suggestion = suggestOilBlend("balanced", ["azeite", "coco", "palma"], oils);

    expect(suggestion).not.toBeNull();
    expect(suggestion?.selection.reduce((sum, item) => sum + item.percentage, 0)).toBe(100);
    for (const item of suggestion?.selection ?? []) {
      expect(item.percentage).toBeLessThanOrEqual(oils.find((current) => current.id === item.oilId)?.maxPercent ?? 0);
    }
    expect(suggestion && isMetricWithinGoal(suggestion.profile, BLEND_GOALS.balanced, "conditioning")).toBe(true);
  });

  it("não sugere mistura com óleo bloqueado ou mais de quatro opções", () => {
    expect(suggestOilBlend("balanced", ["azeite", "coco", "palma", "x", "y"], oils)).toBeNull();
    expect(suggestOilBlend("balanced", ["azeite", "coco", "bloqueado"], [...oils, oil("bloqueado", { confidenceLevel: "bloqueado" })])).toBeNull();
  });
});
