import { describe, expect, it } from "vitest";
import learningModules from "@/data/learning-modules.json";
import recipesData from "@/data/recipes.json";

function getModule(slug: string) {
  const learningModule = learningModules.find((item) => item.slug === slug);
  if (!learningModule) throw new Error(`Módulo ${slug} não encontrado.`);
  return learningModule;
}

describe("contratos de conteúdo de Cold Process", () => {
  it("mantém os módulos básico e avançado publicáveis e com atividades práticas", () => {
    for (const slug of ["cold-process-basico", "cold-process-avancado"]) {
      const learningModule = getModule(slug);
      expect(learningModule.status).toBe("available");
      expect(learningModule.quiz?.length).toBeGreaterThan(0);
      expect(learningModule.beforePracticeChecklist?.length).toBeGreaterThan(0);
      expect(learningModule.conclusion_criteria?.length).toBeGreaterThan(0);
    }
  });

  it("mantém diagnóstico específico para o CP avançado", () => {
    const diagnosis = getModule("cold-process-avancado").trace_diagnosis;
    expect(diagnosis).toMatchObject({
      emulsao_estavel: expect.any(String),
      seize: expect.any(String),
      ricing: expect.any(String),
      gel_parcial: expect.any(String),
    });
  });

  it("liga cada receita CP a um módulo existente e cada módulo CP a uma prática", () => {
    const moduleSlugs = new Set(learningModules.map((module) => module.slug));
    const coldProcessRecipes = recipesData.recipes.filter((recipe) => recipe.technique === "cold-process");

    expect(coldProcessRecipes.length).toBeGreaterThan(0);
    for (const recipe of coldProcessRecipes) {
      expect(recipe.relatedModuleSlugs?.length).toBeGreaterThan(0);
      for (const slug of recipe.relatedModuleSlugs ?? []) {
        expect(moduleSlugs.has(slug)).toBe(true);
      }
    }

    for (const slug of ["cold-process-basico", "cold-process-avancado"]) {
      expect(coldProcessRecipes.some((recipe) => recipe.relatedModuleSlugs?.includes(slug))).toBe(true);
    }
  });
});
