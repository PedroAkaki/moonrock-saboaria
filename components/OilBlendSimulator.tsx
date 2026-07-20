"use client";

import { useState } from "react";
import type { Oil } from "@/lib/soap/oils";
import {
  BLEND_GOALS,
  calculateBlendProfile,
  type BlendGoalId,
  type BlendMetric,
  type OilBlendItem,
  isMetricWithinGoal,
  suggestOilBlend,
} from "@/lib/soap/blend-profile";

interface OilBlendSimulatorProps {
  oils: Oil[];
  initialSelection: OilBlendItem[];
  onApply: (selection: OilBlendItem[]) => void;
}

const METRICS: { id: BlendMetric; label: string; color: string }[] = [
  { id: "hardness", label: "Dureza", color: "bg-sky-400" },
  { id: "cleansing", label: "Limpeza", color: "bg-amber-400" },
  { id: "conditioning", label: "Condicionamento", color: "bg-emerald-400" },
  { id: "bubbly", label: "Espuma", color: "bg-fuchsia-400" },
  { id: "creamy", label: "Cremosidade", color: "bg-violet-400" },
];

export function OilBlendSimulator({ oils, initialSelection, onApply }: OilBlendSimulatorProps) {
  const [selection, setSelection] = useState<OilBlendItem[]>(() => initialSelection.map((item) => ({ ...item })));
  const [goalId, setGoalId] = useState<BlendGoalId>("balanced");
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);
  const goal = BLEND_GOALS[goalId];
  const profile = calculateBlendProfile(selection, oils);
  const total = selection.reduce((sum, item) => sum + item.percentage, 0);
  const totalIsValid = Math.abs(total - 100) < 0.5;
  const oilMap = new Map(oils.map((oil) => [oil.id, oil]));
  const exceedsLimit = selection.some((item) => item.percentage > (oilMap.get(item.oilId)?.maxPercent ?? 0));

  const updatePercentage = (oilId: string, value: number) => {
    const oil = oilMap.get(oilId);
    const percentage = Number.isFinite(value) ? Math.max(0, Math.min(value, oil?.maxPercent ?? 100)) : 0;
    setSelection((current) => current.map((item) => item.oilId === oilId ? { ...item, percentage } : item));
    setSuggestionMessage(null);
  };

  const updateOil = (currentOilId: string, nextOilId: string) => {
    setSelection((current) => current.map((item) => item.oilId === currentOilId ? { ...item, oilId: nextOilId } : item));
    setSuggestionMessage(null);
  };

  const addOil = () => {
    const available = oils.find((oil) => !selection.some((item) => item.oilId === oil.id) && oil.confidenceLevel !== "bloqueado");
    if (!available || selection.length >= 4) return;
    setSelection((current) => [...current, { oilId: available.id, percentage: 5 }]);
    setSuggestionMessage(null);
  };

  const removeOil = (oilId: string) => {
    if (selection.length <= 1) return;
    setSelection((current) => current.filter((item) => item.oilId !== oilId));
    setSuggestionMessage(null);
  };

  const handleSuggest = () => {
    const suggestion = suggestOilBlend(goalId, selection.map((item) => item.oilId), oils);
    if (!suggestion) {
      setSuggestionMessage("Não encontrei uma mistura viável com estes óleos e limites. Troque uma opção ou reduza a quantidade de óleos.");
      return;
    }
    setSelection(suggestion.selection);
    setSuggestionMessage("Ponto de partida aplicado ao simulador. Compare o perfil e ajuste se quiser.");
  };

  const topContributor = (metric: BlendMetric) => [...selection]
    .map((item) => ({ oil: oilMap.get(item.oilId), influence: (oilMap.get(item.oilId)?.[metric] ?? 0) * item.percentage }))
    .sort((left, right) => right.influence - left.influence)[0]?.oil;

  const hardnessOil = topContributor("hardness");
  const conditioningOil = topContributor("conditioning");

  return (
    <section className="space-y-5" aria-labelledby="simulador-title">
      <header className="rounded-2xl border border-sky-700/60 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_40%),rgba(15,23,42,0.55)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Laboratório de formulação</p>
        <h2 id="simulador-title" className="mt-1 text-2xl font-bold text-white">Simulador de mistura de óleos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-moon-300">
          Monte uma mistura, veja o perfil estimado mudar e peça um ponto de partida explicável. A sugestão não cria receita nem lote.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <section className="rounded-xl border border-moon-600 bg-moon-700/40 p-4">
            <h3 className="text-sm font-semibold text-moon-100">Qual perfil você quer explorar?</h3>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Objetivo da mistura">
              {(Object.keys(BLEND_GOALS) as BlendGoalId[]).map((id) => {
                const item = BLEND_GOALS[id];
                const selected = id === goalId;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => { setGoalId(id); setSuggestionMessage(null); }}
                    className={`rounded-lg border p-3 text-left transition-colors ${selected ? "border-sky-400 bg-sky-500/15" : "border-moon-600 bg-moon-800/60 hover:border-moon-400"}`}
                  >
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-moon-400">{item.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-moon-600 bg-moon-700/40 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-moon-100">Sua mistura</h3>
              <span className={`font-mono text-xs ${totalIsValid ? "text-emerald-300" : "text-amber-300"}`}>{total.toFixed(0)}%</span>
            </div>
            <p className="mt-1 text-xs text-moon-400">Até quatro óleos. Ajuste os controles e veja o perfil responder em tempo real.</p>

            <div className="mt-4 space-y-4">
              {selection.map((item) => {
                const oil = oilMap.get(item.oilId);
                if (!oil) return null;
                return (
                  <div key={item.oilId} className="rounded-lg border border-moon-600 bg-moon-800/70 p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.oilId}
                        onChange={(event) => updateOil(item.oilId, event.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none"
                        aria-label="Óleo da mistura"
                      >
                        {oils.map((option) => (
                          <option key={option.id} value={option.id} disabled={option.confidenceLevel === "bloqueado" || selection.some((selected) => selected.oilId === option.id && selected.oilId !== item.oilId)}>
                            {option.name}{option.confidenceLevel === "bloqueado" ? " — indisponível" : ""}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => removeOil(item.oilId)} disabled={selection.length <= 1} className="rounded p-1 text-moon-400 hover:text-red-300 disabled:opacity-40" aria-label={`Remover ${oil.name}`}>×</button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={oil.maxPercent}
                        step="1"
                        value={item.percentage}
                        onChange={(event) => updatePercentage(item.oilId, Number(event.target.value))}
                        className="min-w-0 flex-1 accent-sky-400"
                        aria-label={`Percentual de ${oil.name}`}
                      />
                      <label className="w-16 text-right font-mono text-sm text-sky-200">
                        <input type="number" min="0" max={oil.maxPercent} value={item.percentage} onChange={(event) => updatePercentage(item.oilId, Number(event.target.value))} className="w-11 bg-transparent text-right outline-none" aria-label={`Valor percentual de ${oil.name}`} />%
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-moon-500">Máximo recomendado: {oil.maxPercent}% · {oil.formulaRole ?? oil.recommendedUse ?? "papel a revisar"}</p>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={addOil} disabled={selection.length >= 4} className="mt-3 w-full rounded-lg border border-dashed border-moon-500 px-3 py-2 text-sm text-moon-300 hover:border-sky-400 hover:text-sky-200 disabled:opacity-40">
              + Adicionar óleo
            </button>
            {!totalIsValid && <p className="mt-3 text-xs text-amber-300">A mistura precisa somar 100% antes de ir para a Calculadora.</p>}
            {exceedsLimit && <p className="mt-3 text-xs text-red-300">Há um óleo acima do limite recomendado.</p>}
          </section>

          <div className="sticky bottom-3 z-10 rounded-xl border border-sky-700/60 bg-moon-900/95 p-3 backdrop-blur">
            <button type="button" onClick={handleSuggest} className="w-full rounded-lg bg-sky-300 px-4 py-2.5 text-sm font-semibold text-moon-900 hover:bg-sky-200">
              Encontrar ponto de partida
            </button>
            <button type="button" onClick={() => onApply(selection)} disabled={!totalIsValid || exceedsLimit} className="mt-2 w-full rounded-lg border border-moon-500 px-4 py-2.5 text-sm font-semibold text-moon-100 hover:border-white disabled:cursor-not-allowed disabled:opacity-40">
              Aplicar à Calculadora para revisar NaOH
            </button>
            {suggestionMessage && <p className="mt-2 text-xs leading-relaxed text-sky-100">{suggestionMessage}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-moon-600 bg-moon-700/40 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-moon-100">Perfil estimado</h3>
              <span className="text-xs text-moon-500">meta: {goal.label}</span>
            </div>
            {profile ? (
              <div className="mt-4 space-y-4">
                {METRICS.map((metric) => (
                  <ProfileMeter key={metric.id} label={metric.label} color={metric.color} value={profile[metric.id]} target={goal.metrics[metric.id]} withinGoal={isMetricWithinGoal(profile, goal, metric.id)} />
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <MetricChip label="Iodo" value={profile.iodine} detail={`meta até ${goal.iodineMax}`} warning={profile.iodine > goal.iodineMax} />
                  <MetricChip label="INS" value={profile.ins} detail={`meta ${goal.insMin}–${goal.insMax}`} warning={profile.ins < goal.insMin || profile.ins > goal.insMax} />
                </div>
              </div>
            ) : <p className="mt-3 text-sm text-moon-400">Adicione ao menos um óleo com percentual válido para ver o perfil.</p>}
          </section>

          <section className="rounded-xl border border-violet-700/60 bg-violet-900/15 p-4">
            <h3 className="text-sm font-semibold text-violet-100">Por que ficou assim?</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-violet-100/80">
              {hardnessOil && <li><span className="font-medium text-violet-100">{hardnessOil.name}</span> é a maior contribuição desta mistura para dureza.</li>}
              {conditioningOil && <li><span className="font-medium text-violet-100">{conditioningOil.name}</span> é a maior contribuição desta mistura para condicionamento.</li>}
              <li>Os marcadores mostram a faixa educativa do objetivo, não uma garantia de resultado de bancada.</li>
            </ul>
          </section>

          <p className="rounded-lg border border-moon-600 bg-moon-800/60 p-3 text-xs leading-relaxed text-moon-400">
            Dureza, limpeza, espuma, condicionamento e cremosidade são estimativas heurísticas ponderadas pelos dados da biblioteca. Teste prático, cura e registro no Diário continuam indispensáveis.
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfileMeter({ label, color, value, target, withinGoal }: { label: string; color: string; value: number; target: { min: number; max: number }; withinGoal: boolean }) {
  const valuePercent = Math.max(0, Math.min(100, (value / 5) * 100));
  const targetStart = (target.min / 5) * 100;
  const targetWidth = ((target.max - target.min) / 5) * 100;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-moon-300">{label}</span>
        <span className={withinGoal ? "font-mono text-emerald-300" : "font-mono text-amber-300"}>{value.toFixed(1)} <span className="text-moon-500">· meta {target.min}–{target.max}</span></span>
      </div>
      <div className="relative h-2 rounded-full bg-moon-800">
        <span className="absolute top-0 h-full rounded-full bg-white/15" style={{ left: `${targetStart}%`, width: `${targetWidth}%` }} />
        <span className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-moon-900 ${color}`} style={{ left: `calc(${valuePercent}% - 6px)` }} />
      </div>
    </div>
  );
}

function MetricChip({ label, value, detail, warning }: { label: string; value: number; detail: string; warning: boolean }) {
  return (
    <div className={`rounded-lg border p-2 ${warning ? "border-amber-700 bg-amber-900/20" : "border-moon-600 bg-moon-800/60"}`}>
      <p className="text-xs text-moon-400">{label}</p>
      <p className={`font-mono text-lg font-semibold ${warning ? "text-amber-300" : "text-white"}`}>{value.toFixed(1)}</p>
      <p className="text-[11px] text-moon-500">{detail}</p>
    </div>
  );
}
