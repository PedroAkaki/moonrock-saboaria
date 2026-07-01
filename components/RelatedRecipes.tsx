import recipesData from "@/data/recipes.json";
import Link from "next/link";

interface RelatedRecipesProps {
  moduleSlug: string;
}

const techniqueLabels: Record<string, string> = {
  "melt-and-pour": "Melt & Pour",
  "cleaning-soap": "Limpeza",
  "cold-process": "Cold Process (CP)",
};

export default function RelatedRecipes({ moduleSlug }: RelatedRecipesProps) {
  const moduleRecipes = recipesData.recipes.filter((recipe) =>
    recipe.relatedModuleSlugs?.includes(moduleSlug)
  );

  if (moduleRecipes.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-white rounded-full" /> Receitas para praticar
        este módulo
      </h2>

      <div className="flex flex-col gap-4">
        {moduleRecipes.map((recipe) => {
          const isCleaning = recipe.category === "cleaning";

          return (
            <div
              key={recipe.id}
              className={`flex flex-col p-4 rounded-xl border bg-moon-700/30 ${
                isCleaning ? "border-red-700/50" : "border-moon-600"
              }`}
            >
              <h3 className="text-lg font-medium text-white mb-2">
                {recipe.name}
              </h3>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    isCleaning
                      ? "bg-red-900/40 text-red-300 border border-red-700"
                      : "bg-purple-900/40 text-purple-300 border border-purple-700"
                  }`}
                >
                  {isCleaning ? "Limpeza Doméstica" : "Cosmético"}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-moon-800 text-moon-300 border border-moon-600">
                  {techniqueLabels[recipe.technique]}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium border ${
                    recipe.safetyLevel === "alto"
                      ? "bg-orange-900/30 text-orange-300 border-orange-700"
                      : "bg-green-900/30 text-green-300 border-green-700"
                  }`}
                >
                  Segurança: {recipe.safetyLevel}
                </span>
              </div>

              {/* Study goal */}
              <p className="text-sm text-moon-400 mb-4 italic">
                🎯 {recipe.studyGoal}
              </p>

              {/* Cleaning alert */}
              {isCleaning && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-300 text-sm font-medium">
                  ⚠️ Produto de limpeza doméstica. Não usar como sabonete
                  corporal.
                </div>
              )}

              {/* Calculator validation alert */}
              {recipe.requiresCalculatorValidation && (
                <div className="mb-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg text-amber-300 text-sm font-medium">
                  ⚠️ Valide NaOH e água na Calculadora MoonRock antes de
                  produzir.
                </div>
              )}

              <Link
                href="/receitas"
                className="mt-auto text-center w-full px-4 py-2 rounded-lg bg-white hover:bg-moon-200 transition-colors text-moon-900 text-sm font-medium"
              >
                Ver no Catálogo de Receitas
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
