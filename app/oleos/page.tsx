import Link from "next/link";
import oilsData from "@/data/oils.json";
import GlossaryTerm from "@/components/GlossaryTerm";

export default function OleosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🫒 Biblioteca de Óleos</h1>
          <p className="text-gray-500 mt-1">
            {oilsData.oils.length} óleos com valores de <GlossaryTerm term="saponificação">saponificação</GlossaryTerm> e <GlossaryTerm term="índice de iodo">propriedades</GlossaryTerm>
          </p>
        </div>
        <Link
          href="/calculadora"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          → Calculadora
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {oilsData.oils.map((oil) => (
          <div
            key={oil.id}
            className="bg-white rounded-xl border border-gray-200 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{oil.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-purple-50 rounded p-2 text-center">
                <div className="font-bold text-purple-700">{oil.sapNaOH}</div>
                <div className="text-xs text-gray-500"><GlossaryTerm term="saponificação">SAP NaOH</GlossaryTerm></div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-center">
                <div className="font-bold text-blue-700">{oil.sapKOH}</div>
                <div className="text-xs text-gray-500">SAP KOH</div>
              </div>
            </div>

            {/* Property bars */}
            <div className="space-y-1">
              {[
                { label: "Dureza", value: oil.hardness, color: "bg-blue-500" },
                { label: "Limpeza", value: oil.cleansing, color: "bg-green-500" },
                { label: "Condicionamento", value: oil.conditioning, color: "bg-purple-500" },
                { label: "Espuma", value: oil.bubbly, color: "bg-amber-500" },
                { label: "Cremosidade", value: oil.creamy, color: "bg-pink-500" },
              ].map((prop) => (
                <div key={prop.label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-28">{prop.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${prop.color} rounded-full transition-all`}
                      style={{ width: `${(prop.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4 text-right">{prop.value}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 italic">{oil.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
