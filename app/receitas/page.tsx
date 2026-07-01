import Link from "next/link";
import recipesData from "@/data/recipes.json";
import oilsData from "@/data/oils.json";
import UseRecipeInCalculatorButton from "@/components/UseRecipeInCalculatorButton";

const difficultyColors: Record<string, string> = {
  iniciante: "bg-green-900/50 text-green-300 border border-green-700",
  intermediario: "bg-amber-900/50 text-amber-300 border border-amber-700",
  avancado: "bg-red-900/50 text-red-300 border border-red-700",
};

const techniqueLabels: Record<string, string> = {
  "melt-and-pour": "Melt & Pour",
  "cleaning-soap": "Limpeza",
  "cold-process": "Cold Process (CP)",
};

const levelIcons: Record<string, string> = {
  "mix-pronto": "🧼",
  "oleo-usado": "♻️",
  "cold-process": "🧪",
};

const validOilIds = new Set(oilsData.oils.map((o) => o.id));

function getRecipeCalculatorProps(recipe: (typeof recipesData.recipes)[0]) {
  const oilsPayload: { oilId: string; percentage: number }[] = [];
  for (const ing of recipe.ingredients) {
    if (ing.oilId && validOilIds.has(ing.oilId) && typeof ing.percentage === "number" && ing.percentage > 0) {
      oilsPayload.push({ oilId: ing.oilId, percentage: ing.percentage });
    }
  }
  if (oilsPayload.length === 0) return null;
  const sum = oilsPayload.reduce((s, o) => s + o.percentage, 0);
  if (Math.abs(sum - 100) > 0.5) return null;
  const totalOilWeight = recipe.ingredients
    .filter((i) => i.oilId && validOilIds.has(i.oilId))
    .reduce((s, i) => s + (i.grams ?? 0), 0);
  return {
    recipeId: recipe.id,
    recipeName: recipe.name,
    totalOilWeight: totalOilWeight > 0 ? totalOilWeight : 500,
    superfat: recipe.superfat ?? 5,
    waterRatio: recipe.waterRatio ?? 2.2,
    oils: oilsPayload,
  };
}

export default function ReceitasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📖 Receitas</h1>
          <p className="text-moon-400 mt-1">
            Receitas testadas, do básico ao cold process
          </p>
        </div>
        <Link
          href="/calculadora"
          className="bg-white hover:bg-moon-200 text-moon-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          → Calculadora
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recipesData.recipes.map((recipe) => {
          const isCleaning = recipe.category === "cleaning";

          return (
            <div
              key={recipe.id}
              className={`bg-moon-700/50 backdrop-blur rounded-xl border p-6 space-y-4 ${
                isCleaning ? "border-red-700/50" : "border-moon-600"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {levelIcons[recipe.level] ?? "📄"}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {recipe.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Categoria */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCleaning
                            ? "bg-red-900/40 text-red-300"
                            : "bg-purple-900/40 text-purple-300"
                        }`}
                      >
                        {isCleaning ? "Limpeza" : "Cosmético"}
                      </span>
                      {/* Técnica */}
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-moon-800 text-moon-300">
                        {techniqueLabels[recipe.technique]}
                      </span>
                      {/* Dificuldade */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          difficultyColors[recipe.difficulty] ??
                          "bg-moon-800 text-moon-400"
                        }`}
                      >
                        {recipe.difficulty}
                      </span>
                      {/* Rendimento */}
                      <span className="text-xs text-moon-500">
                        {recipe.yield}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaning alert */}
              {isCleaning && (
                <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-sm text-red-300 font-medium">
                  ⚠️ Produto de limpeza doméstica. Não usar como sabonete
                  corporal.
                </div>
              )}

              {/* Calculator validation alert */}
              {recipe.requiresCalculatorValidation && (
                <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-3 text-sm text-amber-300">
                  ⚠️ Valide NaOH e água na Calculadora MoonRock antes de
                  produzir. SAP pode variar por lote, fornecedor e composição
                  real.
                  <Link
                    href="/calculadora"
                    className="block mt-1 font-semibold text-white underline"
                  >
                    Abrir Calculadora →
                  </Link>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h3 className="text-sm font-semibold text-moon-400 uppercase mb-2">
                  Ingredientes
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {recipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-moon-700 py-1"
                    >
                      <span className="text-moon-200">{ing.name}</span>
                      {ing.grams > 0 && (
                        <span className="font-mono text-moon-400">
                          {ing.grams}g
                        </span>
                      )}
                      {ing.percentage > 0 && (
                        <span className="text-moon-500">
                          {ing.percentage}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              {recipe.steps && (
                <div>
                  <h3 className="text-sm font-semibold text-moon-400 uppercase mb-2">
                    Modo de Fazer
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-moon-300">
                    {recipe.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Safety */}
              {recipe.safety && recipe.safety.length > 0 && (
                <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-sm text-amber-300">
                  <span className="font-semibold">⚠️ </span>
                  {recipe.safety.join(" | ")}
                </div>
              )}

              {/* Using calculator note */}
              {recipe.usingCalculator && (() => {
                const calcProps = getRecipeCalculatorProps(recipe);
                return (
                  <div className="bg-moon-800 border border-moon-500 rounded-lg p-3 text-sm text-moon-300">
                    Esta receita usa a calculadora — ajuste superfat e tamanho da
                    forma.
                    <div className="mt-2">
                      {calcProps ? (
                        <UseRecipeInCalculatorButton {...calcProps} />
                      ) : (
                        <Link
                          href="/calculadora"
                          className="font-semibold text-white underline"
                        >
                          Abrir Calculadora →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Notes */}
              {recipe.notes && (
                <p className="text-sm text-moon-500 italic">{recipe.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
