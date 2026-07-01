"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CalculatorInput,
  CalculatorResult,
  calculateSoap,
  validateInput,
  calculateMold,
  MoldResult,
} from "@/lib/soap/calculator";
import { Oil, getOils } from "@/lib/soap/oils";
import GlossaryTerm from "@/components/GlossaryTerm";
import SafetyChecklist from "@/components/SafetyChecklist";
import InfoTooltip from "@/components/InfoTooltip";

const TOOLTIPS = {
  peso: "A pesagem precisa é essencial. Erros de massa alteram diretamente o cálculo de soda.",
  superfat: "Percentual de óleo planejado para permanecer não saponificado. Aumenta margem contra excesso de soda e pode deixar o sensorial mais suave, mas em excesso pode reduzir espuma, dureza e estabilidade.",
  aguaSoda: "Define a concentração da solução alcalina. Faixas comuns: 2:1 a 2,7:1. Menos água acelera endurecimento; mais água aumenta fluidez e tempo de cura.",
  sap: "Valor médio usado para estimar quanto NaOH um óleo exige para saponificação. Pode variar por lote, origem e fornecedor.",
  ins: "Índice empírico usado por calculadoras de sabão para comparar fórmulas. Faixas de referência ajudam, mas não são medição laboratorial nem garantia de qualidade.",
  dos: "Risco de oxidação/rancidez, especialmente com óleos insaturados, superfat alto, matéria-prima velha ou armazenamento ruim.",
  forma: "Volume estimado da forma. A calculadora converte cm³ em massa aproximada de sabão, mas o rendimento real varia com fórmula, água e perdas.",
};

export default function CalculadoraPage() {
  const router = useRouter();
  const [oils, setOils] = useState<Oil[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const [totalWeight, setTotalWeight] = useState(500);
  const [superfat, setSuperfat] = useState(8);
  const [waterRatio, setWaterRatio] = useState(2.2);
  const [moldDims, setMoldDims] = useState({ length: "", width: "", height: "" });
  const [moldResult, setMoldResult] = useState<MoldResult | null>(null);
  const [selectedOils, setSelectedOils] = useState<
    { oilId: string; percentage: number }[]
  >([{ oilId: "azeite", percentage: 70 }, { oilId: "coco", percentage: 20 }, { oilId: "mamona", percentage: 10 }]);

  useEffect(() => {
    getOils().then((o) => {
      setOils(o);
      setLoading(false);
    });
  }, []);

  const addOil = useCallback(() => {
    const available = oils.filter(
      (o) => !selectedOils.find((s) => s.oilId === o.id)
    );
    if (available.length > 0) {
      setSelectedOils((prev) => [...prev, { oilId: available[0].id, percentage: 10 }]);
    }
  }, [oils, selectedOils]);

  const removeOil = useCallback((oilId: string) => {
    setSelectedOils((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((o) => o.oilId !== oilId);
    });
  }, []);

  const updatePercentage = useCallback((oilId: string, percentage: number) => {
    setSelectedOils((prev) =>
      prev.map((o) => (o.oilId === oilId ? { ...o, percentage } : o))
    );
  }, []);

  const handleCalculate = useCallback(() => {
    const input: CalculatorInput = {
      totalOilWeight: totalWeight,
      oils: selectedOils,
      superfat,
      waterRatio,
    };

    const validationErrors = validateInput(input, oils);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      setResult(calculateSoap(input, oils));
    } else {
      setResult(null);
    }
  }, [totalWeight, selectedOils, superfat, waterRatio, oils]);

  const handleMoldByDimensions = useCallback(() => {
    const l = Number(moldDims.length);
    const w = Number(moldDims.width);
    const h = Number(moldDims.height);
    if (l > 0 && w > 0 && h > 0) {
      const result = calculateMold(l, w, h);
      setMoldResult(result);
      setTotalWeight(result.oilWeightGrams);
    }
  }, [moldDims]);

  const totalPercentage = selectedOils.reduce((sum, o) => sum + o.percentage, 0);
  const percentageValid = Math.abs(totalPercentage - 100) < 0.5;

  const handleSaveToDiario = useCallback(() => {
    if (!result) return;
    const formula = {
      totalOilWeight: result.totalOilsGrams,
      alkaliType: "naoh" as const,
      naohGrams: result.naohWithSuperfat,
      waterGrams: result.waterGrams,
      superfatPercent: result.superfatPercent,
      oils: result.oils.map((o) => {
        const oil = oils.find((x) => x.id === o.oilId);
        return {
          oilId: o.oilId,
          name: o.name,
          grams: o.grams,
          percentage: o.percentage,
          sapNaoh: oil?.sapNaOH,
        };
      }),
    };
    localStorage.setItem("moonrock:calculator:lastFormula:v1", JSON.stringify(formula));
    router.push("/diario");
  }, [result, oils, router]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-moon-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">🧮 Calculadora de Saponificação</h1>
        <p className="text-moon-400 mt-1">
          Calcule a quantidade exata de soda cáustica e água para sua receita
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          {/* Oils selection */}
          <div className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-4 space-y-3">
            <h2 className="font-semibold text-moon-100">
              Óleos
              <InfoTooltip text="Selecione os óleos da receita e ajuste os percentuais. A soma deve ser 100%." />
            </h2>

            <div className="space-y-2">
              {selectedOils.map((so) => (
                <div key={so.oilId} className="flex items-center gap-2">
                  <select
                    value={so.oilId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedOils((prev) =>
                        prev.map((o) =>
                          o.oilId === so.oilId ? { ...o, oilId: newId } : o
                        )
                      );
                    }}
                    className="flex-1 bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white appearance-none"
                  >
                    {oils.map((o) => (
                      <option key={o.id} value={o.id} disabled={!!selectedOils.find((s) => s.oilId === o.id && s.oilId !== so.oilId)}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={so.percentage}
                    onChange={(e) => updatePercentage(so.oilId, Number(e.target.value))}
                    className="w-20 bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white text-center"
                    min={1}
                    max={100}
                  />
                  <span className="text-xs text-moon-400 w-4">%</span>
                  <button
                    onClick={() => removeOil(so.oilId)}
                    disabled={selectedOils.length <= 1}
                    className="text-sm text-moon-400 hover:text-red-400 disabled:text-moon-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addOil}
              disabled={selectedOils.length >= oils.length}
              className="w-full bg-moon-600 hover:bg-moon-500 text-moon-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              + Adicionar Óleo
            </button>

            <div className="text-xs text-moon-500">
              {totalPercentage.toFixed(1)}% preenchido
              {!percentageValid && (
                <span className="text-red-400 ml-1">— a soma deve ser 100%</span>
              )}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-4 space-y-4">
            <h2 className="font-semibold text-moon-100">Parâmetros</h2>

            <div>
              <label className="block text-sm font-semibold text-moon-200 mb-1">
                Peso Total dos Óleos
                <InfoTooltip text={TOOLTIPS.peso} />
              </label>
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-lg font-bold text-white"
                min={100}
                max={50000}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-moon-200 mb-1">
                Superfat: {superfat}%
                <InfoTooltip text={TOOLTIPS.superfat} />
              </label>
              <input
                type="range"
                value={superfat}
                onChange={(e) => setSuperfat(Number(e.target.value))}
                className="w-full accent-white"
                min={0}
                max={30}
                step={0.5}
              />
              <div className="flex justify-between text-xs text-moon-500">
                <span>0% (Limpeza)</span>
                <span>8% (Cosmético)</span>
                <span>30% (Máximo)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-moon-200 mb-1">
                Razão Água:Soda: {waterRatio}:1
                <InfoTooltip text={TOOLTIPS.aguaSoda} />
              </label>
              <input
                type="range"
                value={waterRatio}
                onChange={(e) => setWaterRatio(Number(e.target.value))}
                className="w-full accent-white"
                min={1.5}
                max={3}
                step={0.1}
              />
              <div className="flex justify-between text-xs text-moon-500">
                <span>1.5:1 (Concentrada)</span>
                <span>2.5:1 (Iniciante)</span>
              </div>
            </div>
          </div>

          {/* Mold scaler */}
          <div className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-4 space-y-3">
            <h2 className="font-semibold text-moon-100">
              📐 Tamanho da Forma
              <InfoTooltip text={TOOLTIPS.forma} />
            </h2>
            <p className="text-xs text-moon-500">Informe as dimensões internas em centímetros</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-moon-500">Comp.</label>
                <input
                  type="number"
                  value={moldDims.length}
                  onChange={(e) => setMoldDims({ ...moldDims, length: e.target.value })}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="20"
                />
              </div>
              <div>
                <label className="text-xs text-moon-500">Larg.</label>
                <input
                  type="number"
                  value={moldDims.width}
                  onChange={(e) => setMoldDims({ ...moldDims, width: e.target.value })}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="text-xs text-moon-500">Alt.</label>
                <input
                  type="number"
                  value={moldDims.height}
                  onChange={(e) => setMoldDims({ ...moldDims, height: e.target.value })}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white"
                  placeholder="7"
                />
              </div>
            </div>
            <button
              onClick={handleMoldByDimensions}
              className="w-full bg-moon-600 hover:bg-moon-500 text-moon-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Calcular Pela Forma
            </button>
            {moldResult && (
              <div className="bg-moon-800 rounded-lg p-3 text-sm space-y-1 border border-moon-600">
                <p className="text-moon-300">Volume: {moldResult.volumeCm3} cm³</p>
                <p className="text-moon-200 font-semibold">Óleos: {moldResult.oilWeightGrams}g</p>
                <p className="text-moon-400">~{moldResult.bars100g} barras de 100g</p>
              </div>
            )}
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-white hover:bg-moon-200 text-moon-900 font-semibold py-3 px-6 rounded-xl text-lg transition-colors"
          >
            Calcular 🧪
          </button>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <ul className="text-red-400 text-sm space-y-1">
                {errors.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Safety warning */}
            <SafetyChecklist onAcknowledge={() => {}}>
              <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-red-300">Alerta de Segurança</h3>
                    <p className="text-red-400 text-sm mt-1">
                      Use óculos de proteção, luvas nitrílicas e avental. Trabalhe em local 
                      ventilado. SEMPRE adicione a soda NA ÁGUA, nunca o contrário.
                    </p>
                  </div>
                </div>
              </div>
            </SafetyChecklist>

            {/* DOS Alert */}
            {(() => {
              const unstablePercent = result.oils.reduce((sum, o) => {
                const oil = oils.find((x) => x.id === o.oilId);
                if (oil && oil.iodine > 100) return sum + o.percentage;
                return sum;
              }, 0);
              const hasDOSRisk = unstablePercent > 15 && result.superfatPercent > 8;
              const hasCaution = unstablePercent > 20;
              if (!hasDOSRisk && !hasCaution) return null;
              return (
                <div className={`rounded-xl p-4 ${hasDOSRisk ? "bg-red-900/30 border-2 border-red-500" : "bg-amber-900/30 border border-amber-600"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{hasDOSRisk ? "🔴" : "🟡"}</span>
                    <div>
                      <h3 className={`font-bold ${hasDOSRisk ? "text-red-300" : "text-amber-300"}`}>
                        {hasDOSRisk ? "Risco Alto de DOS (Rancificação)" : "Risco Moderado de DOS"}
                        <InfoTooltip text={TOOLTIPS.dos} />
                      </h3>
                      <p className={`text-sm mt-1 ${hasDOSRisk ? "text-red-400" : "text-amber-400"}`}>
                        {unstablePercent.toFixed(0)}% da receita é composta por óleos insaturados.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Results card */}
            <div className="bg-moon-700/50 backdrop-blur rounded-xl border-2 border-moon-500 p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">Resultado</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-moon-700 rounded-lg p-3 text-center border border-moon-600">
                  <div className="text-2xl font-bold text-white">
                    {result.naohWithSuperfat}g
                  </div>
                  <div className="text-sm text-moon-300">Soda Cáustica (NaOH)</div>
                  <div className="text-xs text-moon-500">
                    (sem superfat: {result.naoh.toFixed(2)}g)
                  </div>
                </div>
                <div className="bg-moon-700 rounded-lg p-3 text-center border border-moon-600">
                  <div className="text-2xl font-bold text-white">
                    {result.waterGrams}g
                  </div>
                  <div className="text-sm text-moon-300">Água</div>
                </div>
                <div className={`rounded-lg p-3 text-center border ${
                  result.ins >= 136 && result.ins <= 170
                    ? "bg-green-900/30 border-green-700"
                    : result.ins > 170
                    ? "bg-amber-900/30 border-amber-700"
                    : "bg-red-900/30 border-red-700"
                }`}>
                  <div className={`text-2xl font-bold ${
                    result.ins >= 136 && result.ins <= 170
                      ? "text-green-300" : result.ins > 170
                      ? "text-amber-300" : "text-red-300"
                  }`}>
                    {result.ins}
                  </div>
                  <div className={`text-sm ${
                    result.ins >= 136 && result.ins <= 170
                      ? "text-green-400" : result.ins > 170
                      ? "text-amber-400" : "text-red-400"
                  }`}>
                    INS da Receita
                    <InfoTooltip text={TOOLTIPS.ins} />
                  </div>
                  <div className="text-xs text-moon-500 mt-1">
                    {result.ins < 136
                      ? "Abaixo do ideal (macia demais)"
                      : result.ins > 170
                      ? "Acima do ideal (muito dura)"
                      : "Faixa de referência"}
                  </div>
                </div>
                <div className="bg-moon-700 rounded-lg p-3 text-center border border-moon-600">
                  <div className="text-2xl font-bold text-white">
                    {result.totalOilsGrams}g
                  </div>
                  <div className="text-sm text-moon-300">Total de Óleos</div>
                </div>
              </div>

              {/* Step-by-step calculation */}
              <details className="group">
                <summary className="text-sm font-semibold text-moon-300 cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  Ver cálculo passo a passo
                </summary>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-moon-400 font-mono text-xs">
                    NaOH = massa do óleo × SAP NaOH × (1 - superfat)
                  </p>
                  <div className="space-y-1.5">
                    {result.naohPerOil.map((item) => (
                      <div key={item.oilId} className="bg-moon-800 rounded-lg p-2.5 border border-moon-600">
                        <p className="text-moon-200 font-medium">{item.name}</p>
                        <p className="text-moon-400 font-mono text-xs mt-1">
                          {item.grams}g × {item.sapNaoh} × (1 - {result.superfatPercent / 100})
                        </p>
                        <p className="text-moon-400 font-mono text-xs">
                          NaOH bruto: {item.naohBeforeSuperfat}g → com superfat: <span className="text-white font-semibold">{item.naoh}g</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-moon-800 rounded-lg p-2.5 border border-moon-600">
                    <p className="text-moon-200 font-medium">Água</p>
                    <p className="text-moon-400 font-mono text-xs">
                      {result.naohWithSuperfat}g × {result.waterRatio} = {result.waterGrams}g
                    </p>
                  </div>
                  <p className="text-xs text-moon-500 italic">
                    Soma de valores arredondados pode diferir do total exato.
                  </p>
                </div>
              </details>

              {/* Oil breakdown table */}
              <div>
                <h3 className="font-semibold text-moon-200 mb-2">Detalhamento por Óleo</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-moon-500 border-b border-moon-700">
                      <th className="text-left py-1">Óleo</th>
                      <th className="text-right py-1">%</th>
                      <th className="text-right py-1">Gramas</th>
                      <th className="text-right py-1">
                        NaOH
                        <InfoTooltip text={TOOLTIPS.sap} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.oils.map((o) => {
                      const item = result.naohPerOil.find(
                        (n) => n.oilId === o.oilId
                      );
                      return (
                        <tr key={o.oilId} className="border-b border-moon-700">
                          <td className="py-1 text-moon-200">{o.name}</td>
                          <td className="text-right py-1 text-moon-400">{o.percentage}%</td>
                          <td className="text-right py-1 font-mono text-moon-300">{o.grams}g</td>
                          <td className="text-right py-1 font-mono text-moon-100">
                            {item?.naoh ?? "-"}g
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Heuristic disclaimer */}
              <div className="bg-moon-800 border border-moon-500 rounded-lg p-3 text-xs text-moon-400 leading-relaxed">
                INS, dureza, limpeza, espuma e condicionamento são <strong>estimativas heurísticas</strong> baseadas no perfil de ácidos graxos. 
                Ajudam na formulação, mas não substituem teste prático, cura adequada e avaliação do lote.
              </div>

              {/* Save to diary */}
              <button
                onClick={handleSaveToDiario}
                className="w-full bg-amber-300 hover:bg-amber-200 text-moon-900 font-semibold py-3 px-6 rounded-xl text-sm transition-colors"
              >
                📓 Salvar no Diário de Lote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
