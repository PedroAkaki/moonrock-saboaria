"use client";

import { useId, useState } from "react";
import {
  ESTIMATED_QUALITY_KEYS,
  EVALUATION_MOMENTS,
  type BatchSensoryEvaluation,
  type EstimatedQualities,
  type EvaluationMoment,
  type SoapMethod,
} from "@/lib/diario";

interface SensoryEvaluationProps {
  method: SoapMethod;
  estimated?: EstimatedQualities;
  evaluations?: BatchSensoryEvaluation[];
  onSave: (evaluation: BatchSensoryEvaluation) => void;
}

const AXIS_LABELS: Record<keyof EstimatedQualities, string> = {
  hardness: "Dureza",
  cleansing: "Limpeza",
  conditioning: "Condicionamento",
  bubbly: "Espuma",
  creamy: "Cremosidade",
};

const MOMENT_LABELS: Record<EvaluationMoment, string> = {
  unmold: "No desenforme",
  day7: "7 dias",
  day30: "30 dias",
  in_use: "Depois de usar",
};

const SCORES = [0, 1, 2, 3, 4, 5] as const;

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Diferença entre o que a barra entregou e o que a Calculadora previa. */
function formatDelta(real: number, estimado: number): { texto: string; cor: string } {
  const delta = +(real - estimado).toFixed(1);
  if (delta === 0) return { texto: "igual à estimativa", cor: "text-moon-400" };
  const sinal = delta > 0 ? "+" : "";
  return {
    texto: `${sinal}${delta.toFixed(1)} vs. estimado`,
    cor: Math.abs(delta) >= 1 ? "text-amber-300" : "text-moon-400",
  };
}

/**
 * Avaliação da barra pronta nos mesmos eixos que a Calculadora estima.
 * Registrar nos mesmos eixos é o que permite, com o tempo, perceber se as
 * estimativas puxam sistematicamente para cima ou para baixo.
 */
export default function SensoryEvaluation({ method, estimated, evaluations, onSave }: SensoryEvaluationProps) {
  const fieldId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [moment, setMoment] = useState<EvaluationMoment>("unmold");
  const [scores, setScores] = useState<Partial<EstimatedQualities>>({});
  const [sweating, setSweating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const registradas = evaluations ?? [];
  const isMeltAndPour = method === "melt_and_pour";

  const abrir = (existente?: BatchSensoryEvaluation) => {
    setMoment(existente?.moment ?? "unmold");
    setScores(existente?.scores ?? {});
    setSweating(existente?.sweating ?? null);
    setNotes(existente?.notes ?? "");
    setIsEditing(true);
  };

  const salvar = () => {
    if (Object.keys(scores).length === 0) return;
    onSave({
      evaluatedAt: hoje(),
      moment,
      scores,
      ...(sweating === null ? {} : { sweating }),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    });
    setIsEditing(false);
  };

  return (
    <section className="rounded-lg border border-sky-800/70 bg-sky-950/20 px-3 py-3 text-xs text-sky-50">
      <p className="font-semibold text-sky-100">
        Avaliação sensorial
        {registradas.length > 0 && <span className="font-normal text-sky-300"> · {registradas.length} registro(s)</span>}
      </p>

      {registradas.length > 0 && (
        <div className="mt-2 space-y-2">
          {registradas.map((avaliacao) => (
            <div key={avaliacao.moment} className="rounded-md border border-sky-900/70 bg-moon-900/40 px-2.5 py-2">
              <p className="font-medium text-sky-200">
                {MOMENT_LABELS[avaliacao.moment]} <span className="font-normal text-moon-500">· {avaliacao.evaluatedAt}</span>
              </p>
              <div className="mt-1.5 space-y-0.5">
                {ESTIMATED_QUALITY_KEYS.map((eixo) => {
                  const real = avaliacao.scores[eixo];
                  if (real === undefined) return null;
                  const prev = estimated?.[eixo];
                  const delta = prev === undefined ? null : formatDelta(real, prev);
                  return (
                    <div key={eixo} className="flex items-baseline gap-2">
                      <span className="w-28 text-[11px] text-moon-400">{AXIS_LABELS[eixo]}</span>
                      <span className="font-mono text-[11px] text-white">{real.toFixed(1)}</span>
                      {delta && <span className={`text-[11px] ${delta.cor}`}>{delta.texto}</span>}
                    </div>
                  );
                })}
                {avaliacao.sweating !== undefined && (
                  <div className="flex items-baseline gap-2">
                    <span className="w-28 text-[11px] text-moon-400">Suor de glicerina</span>
                    <span className="font-mono text-[11px] text-white">{avaliacao.sweating.toFixed(1)}</span>
                    <span className="text-[11px] text-moon-500">0 = nenhum</span>
                  </div>
                )}
              </div>
              {avaliacao.notes && <p className="mt-1 text-[11px] italic text-moon-400">{avaliacao.notes}</p>}
              <button
                type="button"
                onClick={() => abrir(avaliacao)}
                className="mt-1 text-[11px] text-sky-300 underline underline-offset-2 hover:text-white"
              >
                Revisar este momento
              </button>
            </div>
          ))}
        </div>
      )}

      {!isEditing ? (
        <button
          type="button"
          onClick={() => abrir()}
          className="mt-2 text-sky-200 underline decoration-sky-500/70 underline-offset-2 hover:text-white"
        >
          {registradas.length === 0 ? "Avaliar a barra" : "Registrar outro momento"}
        </button>
      ) : (
        <div className="mt-3 space-y-4">
          <div>
            <p className="font-semibold text-sky-100">Qual momento você está avaliando?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVALUATION_MOMENTS.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={moment === valor}
                  onClick={() => setMoment(valor)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${moment === valor ? "border-sky-300 bg-sky-300 text-moon-900" : "border-sky-800 bg-moon-900/40 text-sky-100 hover:border-sky-500"}`}
                >
                  {MOMENT_LABELS[valor]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sky-100">Como a barra se comporta?</p>
            <p className="text-[11px] text-moon-400">
              Mesma escala 0–5 da estimativa. Deixe em branco o que não dá para julgar agora.
            </p>
            <div className="mt-2 space-y-1.5">
              {ESTIMATED_QUALITY_KEYS.map((eixo) => (
                <div key={eixo} className="flex items-center gap-2">
                  <span className="w-28 text-[11px] text-moon-300">{AXIS_LABELS[eixo]}</span>
                  <div className="flex gap-1" role="radiogroup" aria-label={AXIS_LABELS[eixo]}>
                    {SCORES.map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        role="radio"
                        aria-checked={scores[eixo] === valor}
                        aria-label={`${AXIS_LABELS[eixo]} ${valor}`}
                        onClick={() =>
                          setScores((prev) =>
                            prev[eixo] === valor
                              ? Object.fromEntries(Object.entries(prev).filter(([chave]) => chave !== eixo))
                              : { ...prev, [eixo]: valor },
                          )
                        }
                        className={`h-6 w-6 rounded border text-[11px] transition-colors ${scores[eixo] === valor ? "border-sky-300 bg-sky-300 text-moon-900" : "border-moon-600 bg-moon-900/40 text-moon-400 hover:border-sky-500"}`}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                  {estimated?.[eixo] !== undefined && (
                    <span className="text-[11px] text-moon-500">est. {estimated[eixo].toFixed(1)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isMeltAndPour && (
            <div>
              <p className="font-semibold text-sky-100">Suor de glicerina</p>
              <p className="text-[11px] text-moon-400">0 = nenhum, 5 = intenso.</p>
              <div className="mt-1.5 flex gap-1" role="radiogroup" aria-label="Suor de glicerina">
                {SCORES.map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    role="radio"
                    aria-checked={sweating === valor}
                    aria-label={`Suor ${valor}`}
                    onClick={() => setSweating((prev) => (prev === valor ? null : valor))}
                    className={`h-6 w-6 rounded border text-[11px] transition-colors ${sweating === valor ? "border-sky-300 bg-sky-300 text-moon-900" : "border-moon-600 bg-moon-900/40 text-moon-400 hover:border-sky-500"}`}
                  >
                    {valor}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-sky-100" htmlFor={`${fieldId}-notes`}>Observações deste momento</label>
            <textarea
              id={`${fieldId}-notes`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              placeholder="O que mudou desde a última vez, o que surpreendeu..."
              className="mt-1 w-full rounded-lg border border-moon-500 bg-moon-900/70 px-3 py-2 text-sm text-white placeholder-moon-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={salvar}
              disabled={Object.keys(scores).length === 0}
              className="rounded-lg bg-sky-300 px-3 py-2 text-xs font-semibold text-moon-900 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Salvar avaliação
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-sky-800 px-3 py-2 text-xs font-medium text-sky-100 hover:border-sky-500"
            >
              Cancelar
            </button>
          </div>
          {Object.keys(scores).length === 0 && (
            <p className="text-[11px] text-sky-300">Pontue ao menos um eixo para salvar.</p>
          )}
        </div>
      )}
    </section>
  );
}
