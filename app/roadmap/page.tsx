import Link from "next/link";
import learningModules from "@/data/learning-modules.json";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
  summary: string;
}

export default function RoadmapPage() {
  const modules = learningModules as Module[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">🗺️ Trilha de Aprendizado</h1>
        <p className="text-moon-400 mt-2">
          8 níveis — do laboratório à bancada, com rigor técnico e passo a passo prático
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod) => {
          const isAvailable = mod.status === "available";

          return (
            <Link
              key={mod.id}
              href={isAvailable ? `/roadmap/${mod.slug}` : "#"}
              className={`block p-6 rounded-xl border transition-all ${
                isAvailable
                  ? "bg-moon-700/30 border-moon-600 hover:border-moon-400 hover:bg-moon-700/50 hover:-translate-y-0.5"
                  : "bg-moon-800/30 border-moon-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Nível em hexágono */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 border border-moon-400 transform rotate-45 flex items-center justify-center">
                    <span className="text-xs font-mono text-moon-300 -rotate-45">{mod.level}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{mod.title}</h2>
                </div>
              </div>
              <p className="text-sm text-moon-400 mb-4 leading-relaxed">{mod.summary}</p>
              <div className="flex items-center">
                {isAvailable ? (
                  <span className="text-xs px-3 py-1.5 bg-moon-600 text-moon-200 rounded-full">
                    Acessar Módulo →
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1.5 border border-moon-600 text-moon-500 rounded-full">
                    Em Breve
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
