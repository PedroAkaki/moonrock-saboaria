import Link from "next/link";
import oilsData from "@/data/oils.json";
import GlossaryTerm from "@/components/GlossaryTerm";

export default function OleosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">🫒 Biblioteca de Óleos</h1>
          <p className="text-moon-400 mt-1">
            {oilsData.oils.length} óleos com valores de <GlossaryTerm term="saponificação">saponificação</GlossaryTerm> e propriedades
          </p>
        </div>
        <Link
          href="/calculadora"
          className="bg-white hover:bg-moon-200 text-moon-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          → Calculadora
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {oilsData.oils.map((oil) => {
          const stabilityColor =
            oil.stability === "alta" ? "text-green-400" :
            oil.stability === "media" ? "text-yellow-400" :
            "text-red-400";

          const availColor =
            oil.availability === "alta" ? "text-green-400" :
            oil.availability === "media" ? "text-yellow-400" :
            "text-red-400";

          return (
            <div
              key={oil.id}
              className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{oil.name}</h2>
                  <p className="text-xs text-moon-500 italic">{oil.inci}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stabilityColor} bg-moon-800`}>
                  {oil.stability === "alta" ? "Estável" : oil.stability === "media" ? "Média" : oil.stability === "baixa" ? "Instável" : "Muito instável"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-moon-800 rounded p-2 text-center border border-moon-600">
                  <div className="font-bold text-moon-100">{oil.sapNaOH}</div>
                  <div className="text-xs text-moon-400"><GlossaryTerm term="saponificação">SAP NaOH</GlossaryTerm></div>
                </div>
                <div className="bg-moon-800 rounded p-2 text-center border border-moon-600">
                  <div className="font-bold text-moon-100">{oil.sapKOH}</div>
                  <div className="text-xs text-moon-400">SAP KOH</div>
                </div>
              </div>

              {/* Property bars */}
              <div className="space-y-1">
                {[
                  { label: "Dureza", value: oil.hardness, color: "bg-blue-500" },
                  { label: "Limpeza", value: oil.cleansing, color: "bg-green-500" },
                  { label: "Condicionamento", value: oil.conditioning, color: "bg-purple-500" },
                  { label: "Espuma", value: oil.bubbly ?? oil.bubbly, color: "bg-amber-500" },
                  { label: "Cremosidade", value: oil.creamy, color: "bg-pink-500" },
                ].map((prop) => (
                  <div key={prop.label} className="flex items-center gap-2">
                    <span className="text-xs text-moon-400 w-28">{prop.label}</span>
                    <div className="flex-1 h-2 bg-moon-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${prop.color} rounded-full transition-all`}
                        style={{ width: `${((prop.value ?? 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-moon-500 w-4 text-right">{prop.value ?? 0}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-moon-800 rounded-full px-2 py-1 text-moon-400">
                  INS: {oil.ins}
                </span>
                <span className={`${availColor} bg-moon-800 rounded-full px-2 py-1`}>
                  {oil.availability === "alta" ? "Fácil no BR" : oil.availability === "media" ? "Médio no BR" : "Difícil no BR"}
                </span>
                <span className="bg-moon-800 rounded-full px-2 py-1 text-moon-400">
                  Máx: {oil.maxPercent}%
                </span>
              </div>

              <p className="text-sm text-moon-400 italic">{oil.notes}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
