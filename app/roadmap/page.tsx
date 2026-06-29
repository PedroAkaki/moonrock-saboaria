import roadmapData from "@/data/roadmap.json";

const levelColors: Record<string, string> = {
  red: "border-red-400 bg-red-50",
  green: "border-green-400 bg-green-50",
  yellow: "border-yellow-400 bg-yellow-50",
  blue: "border-blue-400 bg-blue-50",
  purple: "border-purple-400 bg-purple-50",
};

const levelTitleColors: Record<string, string> = {
  red: "text-red-800",
  green: "text-green-800",
  yellow: "text-yellow-800",
  blue: "text-blue-800",
  purple: "text-purple-800",
};

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">🗺️ Roadmap de Aprendizado</h1>
        <p className="text-gray-500 mt-1">
          Sua jornada na saboaria — do básico à criação de receitas autorais
        </p>
      </div>

      {/* Safety first */}
      <div className="bg-red-50 border-2 border-red-400 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="font-bold text-red-800 text-lg">
              Nível 0: Segurança — É obrigatório!
            </h2>
            <p className="text-red-700 text-sm mt-1">
              Antes de qualquer receita com soda cáustica, leia e siga todas as regras de segurança.
              Soda cáustica queima a pele, os olhos e as vias respiratórias.
            </p>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-red-700 list-disc list-inside">
          {roadmapData.levels
            .find((l) => l.id === "seguranca")
            ?.topics.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
        </ul>
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {roadmapData.levels
          .filter((l) => l.id !== "seguranca")
          .map((level, idx) => (
            <div
              key={level.id}
              className={`border-l-4 rounded-xl p-5 ${
                levelColors[level.color] ?? "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Nível {level.order}
                  </span>
                  <h2
                    className={`text-xl font-bold mt-1 ${
                      levelTitleColors[level.color] ?? "text-gray-800"
                    }`}
                  >
                    {level.title}
                  </h2>
                </div>
                <span className="text-2xl">{level.icon}</span>
              </div>

              {level.description && (
                <p className="text-gray-600 mt-2">{level.description}</p>
              )}

              <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc list-inside">
                {level.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              {level.recipes && level.recipes.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Receitas relacionadas:
                  </span>
                  <div className="flex gap-2 mt-1">
                    {level.recipes.map((r) => (
                      <span
                        key={r}
                        className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connector */}
              {idx < roadmapData.levels.filter((l) => l.id !== "seguranca").length - 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="w-0.5 h-6 bg-gray-300" />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
