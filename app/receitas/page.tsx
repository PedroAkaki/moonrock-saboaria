import Link from "next/link";
import recipesData from "@/data/recipes.json";

const difficultyColors: Record<string, string> = {
  iniciante: "bg-green-100 text-green-800",
  intermediario: "bg-amber-100 text-amber-800",
  avancado: "bg-red-100 text-red-800",
};

const levelIcons: Record<string, string> = {
  "mix-pronto": "🧼",
  "oleo-usado": "♻️",
  "cold-process": "🧪",
};

export default function ReceitasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📖 Receitas</h1>
          <p className="text-gray-500 mt-1">
            Receitas testadas, do básico ao cold process
          </p>
        </div>
        <Link
          href="/calculadora"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          → Calculadora
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recipesData.recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{levelIcons[recipe.level] ?? "📄"}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{recipe.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        difficultyColors[recipe.difficulty] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{recipe.yield}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                Ingredientes
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 py-1">
                    <span className="text-gray-700">{ing.name}</span>
                    {ing.grams > 0 && (
                      <span className="font-mono text-gray-500">{ing.grams}g</span>
                    )}
                    {ing.percentage > 0 && (
                      <span className="text-gray-400">{ing.percentage}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            {recipe.steps && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                  Modo de Fazer
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.safety && recipe.safety.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <span className="font-semibold">⚠️ </span>
                {recipe.safety.join(" | ")}
              </div>
            )}

            {recipe.usingCalculator && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
                Esta receita usa a calculadora — ajuste superfat e tamanho da forma.
                <Link
                  href="/calculadora"
                  className="block mt-1 font-semibold underline"
                >
                  Abrir Calculadora →
                </Link>
              </div>
            )}

            {recipe.notes && (
              <p className="text-sm text-gray-500 italic">{recipe.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
