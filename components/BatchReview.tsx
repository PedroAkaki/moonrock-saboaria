"use client";

import { useId, useState } from "react";
import type { SoapMethod } from "@/lib/diario";
import type { BatchResult } from "@/lib/batch/types";
import type { UpdateBatchReviewInput } from "@/lib/batch/repository";

interface BatchReviewProps {
  result?: BatchResult;
  /** Muda só o vocabulário: CP se julga após a cura, M&P após firmar e usar. */
  method: SoapMethod;
  onSave: (review: UpdateBatchReviewInput) => void;
}

const RATING_VALUES = [1, 2, 3, 4, 5] as const;

/** O que a avaliação significa em cada método. */
const REVIEW_COPY: Partial<Record<SoapMethod, {
  badge: string;
  open: string;
  reopen: string;
  question: string;
  placeholder: string;
}>> = {
  cold_process: {
    badge: "Avaliação após cura",
    open: "Avaliar depois da cura",
    reopen: "Revisar avaliação",
    question: "Como ficou este lote depois da cura?",
    placeholder: "Dureza percebida, espuma, sensação no uso e o que você aprendeu...",
  },
  melt_and_pour: {
    badge: "Avaliação do lote",
    open: "Avaliar este lote",
    reopen: "Revisar avaliação",
    question: "Como ficou este lote depois de firmar e usar?",
    placeholder: "Transparência, fixação do aroma, suor, espuma e o que você aprendeu...",
  },
};

const FALLBACK_COPY = REVIEW_COPY.cold_process!;

function ratingLabel(rating: number): string {
  return `${rating} de 5`;
}

export function BatchReview({ result, method, onSave }: BatchReviewProps) {
  const copy = REVIEW_COPY[method] ?? FALLBACK_COPY;
  const fieldId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<UpdateBatchReviewInput["rating"] | null>(null);
  const [wouldRepeat, setWouldRepeat] = useState<boolean | null>(null);
  const [failureReason, setFailureReason] = useState("");
  const [observations, setObservations] = useState("");

  const openReview = () => {
    setRating(result?.rating ?? null);
    setWouldRepeat(result?.wouldRepeat ?? null);
    setFailureReason(result?.failureReason ?? "");
    setObservations(result?.observations ?? "");
    setIsEditing(true);
  };

  const saveReview = () => {
    if (rating === null) return;
    onSave({
      rating,
      wouldRepeat,
      failureReason,
      observations,
    });
    setIsEditing(false);
  };

  return (
    <section className="rounded-lg border border-emerald-800/70 bg-emerald-950/20 px-3 py-3 text-xs text-emerald-50">
      {result?.rating !== undefined && (
        <p className="font-semibold">
          {copy.badge} · {ratingLabel(result.rating)}
          {result.wouldRepeat !== undefined && ` · ${result.wouldRepeat ? "faria novamente" : "não faria novamente"}`}
        </p>
      )}

      {!isEditing ? (
        <button
          type="button"
          onClick={openReview}
          className="mt-1 text-emerald-200 underline decoration-emerald-500/70 underline-offset-2 hover:text-white"
        >
          {result?.rating === undefined ? copy.open : copy.reopen}
        </button>
      ) : (
        <div className="mt-3 space-y-4">
          <div>
            <p className="font-semibold text-emerald-100">{copy.question}</p>
            <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Nota geral do lote">
              {RATING_VALUES.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={ratingLabel(value)}
                  onClick={() => setRating(value)}
                  className={`h-9 w-9 rounded-lg border text-base transition-colors ${rating === value ? "border-amber-300 bg-amber-300 text-moon-900" : "border-emerald-800 bg-moon-900/40 text-emerald-200 hover:border-emerald-500"}`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating === null && <p className="mt-1 text-[11px] text-emerald-300">Escolha uma nota para salvar a avaliação.</p>}
          </div>

          <div>
            <p className="font-semibold text-emerald-100">Você faria este lote novamente?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <ReviewChoice label="Sim" selected={wouldRepeat === true} onClick={() => setWouldRepeat(true)} />
              <ReviewChoice label="Não" selected={wouldRepeat === false} onClick={() => setWouldRepeat(false)} />
              <ReviewChoice label="Ainda não sei" selected={wouldRepeat === null} onClick={() => setWouldRepeat(null)} />
            </div>
          </div>

          {wouldRepeat === false && (
            <div>
              <label className="block font-semibold text-emerald-100" htmlFor={`${fieldId}-reason`}>O que você mudaria?</label>
              <input
                id={`${fieldId}-reason`}
                type="text"
                value={failureReason}
                onChange={(event) => setFailureReason(event.target.value)}
                placeholder="Ex.: espuma abaixo do esperado"
                className="mt-1 w-full rounded-lg border border-moon-500 bg-moon-900/70 px-3 py-2 text-sm text-white placeholder-moon-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-emerald-100" htmlFor={`${fieldId}-observations`}>Conclusão e observações</label>
            <textarea
              id={`${fieldId}-observations`}
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={3}
              placeholder={copy.placeholder}
              className="mt-1 w-full rounded-lg border border-moon-500 bg-moon-900/70 px-3 py-2 text-sm text-white placeholder-moon-500"
            />
          </div>

          <p className="text-[11px] leading-relaxed text-emerald-200/80">Esta é uma observação prática do lote; não confirma segurança nem substitui boas práticas de formulação.</p>

          <div className="flex gap-2">
            <button type="button" onClick={saveReview} disabled={rating === null} className="rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-moon-900 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40">
              Salvar avaliação
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg border border-emerald-800 px-3 py-2 text-xs font-medium text-emerald-100 hover:border-emerald-500">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ReviewChoice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${selected ? "border-emerald-300 bg-emerald-300 text-moon-900" : "border-emerald-800 bg-moon-900/40 text-emerald-100 hover:border-emerald-500"}`}
    >
      {label}
    </button>
  );
}
