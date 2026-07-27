import { describe, expect, it } from "vitest";
import {
  calculateRecipeQualities,
  calculateSoap,
  type CalculatorInput,
} from "@/lib/soap/calculator";
import type { Oil } from "@/lib/soap/oils";

/** Óleos mínimos com apenas os campos que a calculadora consome. */
function oil(id: string, over: Partial<Oil>): Oil {
  return {
    id,
    name: id,
    inci: id,
    type: "oleo-liquido",
    sapNaOH: 0.135,
    sapKOH: 0.19,
    iodine: 0,
    ins: 0,
    hardness: 0,
    cleansing: 0,
    conditioning: 0,
    bubbly: 0,
    creamy: 0,
    fattyAcids: {},
    maxPercent: 100,
    stability: "alta",
    meltingPoint: null,
    availability: "alta",
    cost: "baixo",
    shelfLife: "12 meses",
    notes: "",
    ...over,
  };
}

const AZEITE = oil("azeite", { sapNaOH: 0.135, ins: 105, hardness: 2, cleansing: 1, conditioning: 5, bubbly: 1, creamy: 2 });
const COCO = oil("coco", { sapNaOH: 0.183, ins: 258, hardness: 5, cleansing: 5, conditioning: 1, bubbly: 5, creamy: 3 });
const LIBRARY = [AZEITE, COCO];

describe("qualidades estimadas da barra", () => {
  it("faz média ponderada pelo percentual", () => {
    const input: CalculatorInput = {
      totalOilWeight: 1000,
      superfat: 5,
      waterRatio: 2.5,
      oils: [
        { oilId: "azeite", percentage: 50 },
        { oilId: "coco", percentage: 50 },
      ],
    };
    // (2+5)/2 = 3,5 ; (1+5)/2 = 3 ; (5+1)/2 = 3 ; (1+5)/2 = 3 ; (2+3)/2 = 2,5
    expect(calculateRecipeQualities(input, LIBRARY)).toEqual({
      hardness: 3.5,
      cleansing: 3,
      conditioning: 3,
      bubbly: 3,
      creamy: 2.5,
    });
  });

  it("respeita o peso da proporção, não a contagem de óleos", () => {
    const input: CalculatorInput = {
      totalOilWeight: 1000,
      superfat: 5,
      waterRatio: 2.5,
      oils: [
        { oilId: "azeite", percentage: 80 },
        { oilId: "coco", percentage: 20 },
      ],
    };
    // hardness = (2*80 + 5*20)/100 = 2,6
    expect(calculateRecipeQualities(input, LIBRARY).hardness).toBe(2.6);
  });

  it("não muda com a ordem dos óleos na entrada", () => {
    const base = { totalOilWeight: 500, superfat: 5, waterRatio: 2.5 };
    const ab = calculateRecipeQualities(
      { ...base, oils: [{ oilId: "azeite", percentage: 70 }, { oilId: "coco", percentage: 30 }] },
      LIBRARY,
    );
    const ba = calculateRecipeQualities(
      { ...base, oils: [{ oilId: "coco", percentage: 30 }, { oilId: "azeite", percentage: 70 }] },
      LIBRARY,
    );
    expect(ab).toEqual(ba);
  });

  it("ignora óleo ausente da biblioteca sem diluir o resultado", () => {
    const input: CalculatorInput = {
      totalOilWeight: 1000,
      superfat: 5,
      waterRatio: 2.5,
      oils: [
        { oilId: "azeite", percentage: 50 },
        { oilId: "desconhecido", percentage: 50 },
      ],
    };
    // Só o azeite conta: resultado igual ao azeite puro.
    expect(calculateRecipeQualities(input, LIBRARY)).toEqual({
      hardness: 2,
      cleansing: 1,
      conditioning: 5,
      bubbly: 1,
      creamy: 2,
    });
  });

  it("retorna zeros quando nenhum óleo tem dado", () => {
    const input: CalculatorInput = {
      totalOilWeight: 1000,
      superfat: 5,
      waterRatio: 2.5,
      oils: [{ oilId: "desconhecido", percentage: 100 }],
    };
    expect(calculateRecipeQualities(input, LIBRARY)).toEqual({
      hardness: 0,
      cleansing: 0,
      conditioning: 0,
      bubbly: 0,
      creamy: 0,
    });
  });

  it("mantém as qualidades dentro da escala 0–5", () => {
    const input: CalculatorInput = {
      totalOilWeight: 1000,
      superfat: 5,
      waterRatio: 2.5,
      oils: [
        { oilId: "azeite", percentage: 60 },
        { oilId: "coco", percentage: 40 },
      ],
    };
    for (const value of Object.values(calculateRecipeQualities(input, LIBRARY))) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(5);
    }
  });
});

describe("calculateSoap — sanidade do núcleo", () => {
  const input: CalculatorInput = {
    totalOilWeight: 1000,
    superfat: 5,
    waterRatio: 2.5,
    oils: [
      { oilId: "azeite", percentage: 70 },
      { oilId: "coco", percentage: 30 },
    ],
  };

  it("aplica o superfat sobre o NaOH bruto", () => {
    const r = calculateSoap(input, LIBRARY);
    // bruto = 700*0,135 + 300*0,183 = 94,5 + 54,9 = 149,4
    expect(r.naoh).toBeCloseTo(149.4, 1);
    expect(r.naohWithSuperfat).toBeCloseTo(149.4 * 0.95, 1);
    expect(r.waterGrams).toBeCloseTo(r.naohWithSuperfat * 2.5, 1);
  });

  it("calcula o INS como média ponderada", () => {
    // (105*70 + 258*30)/100 = 150,9
    expect(calculateSoap(input, LIBRARY).ins).toBeCloseTo(150.9, 1);
  });

  it("inclui as qualidades no resultado completo", () => {
    expect(calculateSoap(input, LIBRARY).qualities).toEqual(
      calculateRecipeQualities(input, LIBRARY),
    );
  });
});
