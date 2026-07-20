import { describe, expect, it } from "vitest";
import {
  getLearningDiaryPractice,
  getLearningDiaryPracticeFromSearch,
  getLearningDiaryPracticeHref,
} from "@/lib/learning/diary-practice";

describe("ponte Aprendizado → Diário", () => {
  it("oferece contexto explícito para a prática progressiva de CP", () => {
    expect(getLearningDiaryPractice("cold-process-praticas-progressivas")).toEqual({
      slug: "cold-process-praticas-progressivas",
      method: "cold_process",
      suggestedName: "Prática CP — controle",
      observations: expect.stringContaining("Única variável em estudo"),
    });
    expect(getLearningDiaryPracticeHref("cold-process-praticas-progressivas"))
      .toBe("/diario?practice=cold-process-praticas-progressivas");
  });

  it("aceita somente práticas conhecidas na URL", () => {
    expect(getLearningDiaryPracticeFromSearch("?practice=cold-process-praticas-progressivas"))
      .toMatchObject({ method: "cold_process" });
    expect(getLearningDiaryPracticeFromSearch("?practice=nao-existe")).toBeNull();
    expect(getLearningDiaryPracticeFromSearch("?other=value")).toBeNull();
  });
});
