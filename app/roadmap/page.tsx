import roadmapData from "@/data/roadmap.json";

const levelColors: Record<string, string> = {
  red: "border-red-700 bg-red-900/20",
  green: "border-green-700 bg-green-900/20",
  yellow: "border-yellow-700 bg-yellow-900/20",
  blue: "border-blue-700 bg-blue-900/20",
  purple: "border-purple-700 bg-purple-900/20",
};

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">🗺️ Roadmap de Aprendizado</h1>
        <p className="text-moon-400 mt-1">
          Sua jornada na saboaria — do básico à criação de receitas autorais
        </p>
      </div>

      {/* Safety first */}
      <div className="bg-red-900/20 border-2 border-red-700 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="font-bold text-red-300 text-lg">
              Nível 0: Segurança — É obrigatório!
            </h2>
            <p className="text-red-400 text-sm mt-1">
              Antes de qualquer receita com soda cáustica, leia e siga todas as regras de segurança.
            </p>
          </div>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-red-300 list-disc list-inside">
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
                levelColors[level.color] ?? "border-moon-600 bg-moon-700/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-moon-500 uppercase tracking-wider">
                    Nível {level.order}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {level.title}
                  </h2>
                </div>
                <span className="text-2xl">{level.icon}</span>
              </div>

              {level.description && (
                <p className="text-moon-400 mt-2">{level.description}</p>
              )}

              <ul className="mt-3 space-y-1 text-sm text-moon-300 list-disc list-inside">
                {level.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              {level.recipes && level.recipes.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-semibold text-moon-500 uppercase">
                    Receitas relacionadas:
                  </span>
                  <div className="flex gap-2 mt-1">
                    {level.recipes.map((r) => (
                      <span
                        key={r}
                        className="bg-moon-800 border border-moon-600 rounded-full px-3 py-1 text-xs text-moon-400"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {idx < roadmapData.levels.filter((l) => l.id !== "seguranca").length - 1 && (
                <div className="mt-4 flex justify-center">
                  <div className="w-0.5 h-6 bg-moon-600" />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
