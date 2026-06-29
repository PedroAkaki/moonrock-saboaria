"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalculatorInput,
  CalculatorResult,
  calculateSoap,
  validateInput,
  scaleToMold,
  calculateMold,
  MoldResult,
} from "@/lib/soap/calculator";
import { Oil, getOils } from "@/lib/soap/oils";
import GlossaryTerm from "@/components/GlossaryTerm";
import SafetyChecklist from "@/components/SafetyChecklist";

export default function CalculadoraPage() {
  const [oils, setOils] = useState<Oil[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Form state
  const [totalWeight, setTotalWeight] = useState(500);
  const [superfat, setSuperfat] = useState(8);
  const [waterRatio, setWaterRatio] = useState(2.2);
  const [moldVolume, setMoldVolume] = useState<number | "">("");
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

  const handleMoldScale = useCallback(() => {
    if (moldVolume && moldVolume > 0) {
      const weight = scaleToMold(moldVolume);
      setTotalWeight(weight);
    }
  }, [moldVolume]);

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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">🧮 Calculadora de Saponificação</h1>
        <p className="text-gray-500 mt-1">
          Calcule a quantidade exata de soda cáustica e água para sua receita
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {/* Mold scaler by dimensions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">📐 Tamanho da Forma</h2>
            <p className="text-xs text-gray-400">Informe as dimensões internas da forma em centímetros</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">Comprimento</label>
                <input
                  type="number"
                  placeholder="cm"
                  value={moldDims.length}
                  onChange={(e) => setMoldDims(prev => ({ ...prev, length: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  min={1}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Largura</label>
                <input
                  type="number"
                  placeholder="cm"
                  value={moldDims.width}
                  onChange={(e) => setMoldDims(prev => ({ ...prev, width: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  min={1}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Altura</label>
                <input
                  type="number"
                  placeholder="cm"
                  value={moldDims.height}
                  onChange={(e) => setMoldDims(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  min={1}
                />
              </div>
            </div>
            <button
              onClick={handleMoldByDimensions}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Calcular peso dos óleos
            </button>
            {moldResult && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Volume:</span>
                  <span className="font-medium">{moldResult.volumeCm3} cm³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Óleos necessários:</span>
                  <span className="font-medium text-purple-700">{moldResult.oilWeightGrams}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peso estimado do sabão:</span>
                  <span className="font-medium">{moldResult.estimatedSoapWeight}g</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                  <span className="text-gray-500">Rendimento:</span>
                  <span className="font-medium">{moldResult.bars100g} barras de 100g ou {moldResult.bars80g} de 80g</span>
                </div>
              </div>
            )}
          </div>

          {/* Total weight */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-semibold text-gray-700">Peso Total dos Óleos</h2>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold"
                min={50}
                max={50000}
              />
              <span className="text-gray-500">gramas</span>
            </div>
          </div>

          {/* Oils */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Óleos na Receita</h2>
              <div className="text-sm">
                Total:{" "}
                <span
                  className={`font-bold ${
                    percentageValid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {selectedOils.map((so) => {
                const oil = oils.find((o) => o.id === so.oilId);
                if (!oil) return null;
                return (
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
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {oils.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={so.percentage}
                      onChange={(e) =>
                        updatePercentage(so.oilId, Number(e.target.value))
                      }
                      className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center"
                      min={0}
                      max={100}
                      step={0.5}
                    />
                    <span className="text-gray-400 text-sm w-6">%</span>
                    <button
                      onClick={() => removeOil(so.oilId)}
                      className="text-red-400 hover:text-red-600 text-xl leading-none"
                      disabled={selectedOils.length <= 1}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addOil}
              disabled={selectedOils.length >= oils.length}
              className="text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-300"
            >
              + Adicionar óleo
            </button>
          </div>

          {/* Superfat & Water */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Superfat: {superfat}%
              </label>
              <input
                type="range"
                value={superfat}
                onChange={(e) => setSuperfat(Number(e.target.value))}
                className="w-full"
                min={0}
                max={30}
                step={0.5}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0% (Limpeza)</span>
                <span>8% (Cosmético)</span>
                <span>30% (Hidratação extra)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Razão Água:Soda: {waterRatio}:1
              </label>
              <input
                type="range"
                value={waterRatio}
                onChange={(e) => setWaterRatio(Number(e.target.value))}
                className="w-full"
                min={1.5}
                max={3}
                step={0.1}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1.5:1 (Concentrada)</span>
                <span>2.5:1 (Iniciante)</span>
              </div>
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl text-lg transition-colors"
          >
            Calcular 🧪
          </button>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="text-red-700 text-sm space-y-1">
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
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-red-800">Alerta de Segurança</h3>
                  <p className="text-red-700 text-sm mt-1">
                    Use óculos de proteção, luvas de nitrila e avental. Trabalhe em local 
                    ventilado. SEMPRE adicione a soda NA ÁGUA, nunca o contrário.
                  </p>
                </div>
              </div>
            </div>

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
                <div className={`rounded-xl p-4 ${hasDOSRisk ? "bg-red-50 border-2 border-red-400" : "bg-amber-50 border border-amber-300"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{hasDOSRisk ? "🔴" : "🟡"}</span>
                    <div>
                      <h3 className={`font-bold ${hasDOSRisk ? "text-red-800" : "text-amber-800"}`}>
                        {hasDOSRisk
                          ? "Alto Risco de DOS (Rancificação)"
                          : "Cuidado: Risco Moderado de DOS"}
                      </h3>
                      <p className={`text-sm mt-1 ${hasDOSRisk ? "text-red-700" : "text-amber-700"}`}>
                        {unstablePercent.toFixed(0)}% da receita é composta por óleos insaturados 
                        (índice de iodo &gt; 100). 
                        {hasDOSRisk
                          ? " Combinado com superfat elevado, há risco alto de aparecerem manchas alaranjadas (DOS) durante a cura. Considere reduzir o superfat ou adicionar antioxidantes (vitamina E, oleoresina de alecrim)."
                          : " Recomenda-se adicionar antioxidantes (vitamina E, oleoresina de alecrim) para prevenir oxidação."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Results card */}
            <div className="bg-white rounded-xl border-2 border-purple-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Resultado</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {result.naohWithSuperfat}g
                  </div>
                  <div className="text-sm text-purple-600">Soda Cáustica (NaOH)</div>
                  <div className="text-xs text-gray-400">
                    (sem superfat: {result.naoh}g)
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {result.waterGrams}g
                  </div>
                  <div className="text-sm text-blue-600">Água</div>
                </div>
                <div className={`rounded-lg p-3 text-center ${
                  result.ins >= 136 && result.ins <= 170
                    ? "bg-green-50"
                    : result.ins > 170
                    ? "bg-amber-50"
                    : "bg-red-50"
                }`}>
                  <div className={`text-2xl font-bold ${
                    result.ins >= 136 && result.ins <= 170
                      ? "text-green-700"
                      : result.ins > 170
                      ? "text-amber-700"
                      : "text-red-700"
                  }`}>
                    {result.ins}
                  </div>
                  <div className={`text-sm ${
                    result.ins >= 136 && result.ins <= 170
                      ? "text-green-600"
                      : result.ins > 170
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}>INS da Receita</div>
                  <div className="text-xs text-gray-400">
                    {result.ins < 136
                      ? "⚠️ Abaixo do ideal (macia demais)"
                      : result.ins > 170
                      ? "⚠️ Acima do ideal (muito dura)"
                      : "✅ Faixa ideal 136-170"}
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700">
                    {result.totalOilsGrams}g
                  </div>
                  <div className="text-sm text-amber-600">Total de Óleos</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {result.totalBatchWeight}g
                  </div>
                  <div className="text-sm text-green-600">Peso Total do Lote</div>
                </div>
              </div>

              {/* Oil breakdown */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Detalhamento por Óleo</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="text-left py-1">Óleo</th>
                      <th className="text-right py-1">%</th>
                      <th className="text-right py-1">Gramas</th>
                      <th className="text-right py-1">NaOH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.oils.map((o) => {
                      const naohItem = result.naohPerOil.find(
                        (n) => n.oilId === o.oilId
                      );
                      return (
                        <tr key={o.oilId} className="border-b border-gray-100">
                          <td className="py-1">{o.name}</td>
                          <td className="text-right py-1">{o.percentage}%</td>
                          <td className="text-right py-1 font-mono">{o.grams}g</td>
                          <td className="text-right py-1 font-mono text-purple-600">
                            {naohItem?.naoh ?? "-"}g
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>                <GlossaryTerm term="superfat">Superfat</GlossaryTerm>: {result.superfatPercent}% | Razão água:<GlossaryTerm term="lixívia">soda</GlossaryTerm> {result.waterRatio}:1</p>
              </div>
            </div>
          </SafetyChecklist>
          </div>
        )}
      </div>
    </div>
  );
}
