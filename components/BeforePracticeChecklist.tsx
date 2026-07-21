"use client";

import { useEffect } from "react";
import { getProgress, updateChecklist } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";

export default function BeforePracticeChecklist({
  items,
  slug,
}: {
  items: string[];
  slug: string;
}) {
  const progress = useProgress();
  const saved = progress?.modules[slug]?.beforePractice;
  const checked = items.map((item) => !!saved?.[item]);
  const storageKey = `moonrock-before-practice-${slug}`;

  // Migra a chave antiga (lista posicional) para o progresso centralizado.
  useEffect(() => {
    const p = getProgress();
    if (Object.keys(p.modules[slug]?.beforePractice ?? {}).length > 0) return;

    const legacy = localStorage.getItem(storageKey);
    if (!legacy) return;
    try {
      const parsed: unknown = JSON.parse(legacy);
      if (!Array.isArray(parsed)) return;
      items.forEach((item, i) => {
        updateChecklist(slug, "beforePractice", item, parsed[i] === true);
      });
    } catch {}
  }, [slug, storageKey, items]);

  const toggle = (index: number) => {
    const item = items[index];
    updateChecklist(slug, "beforePractice", item, !checked[index]);
  };

  const allDone = checked.every(Boolean);
  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="bg-amber-900/15 border-l-2 border-amber-500 rounded-xl p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
        ⚠️ Antes de ir para a bancada
      </h3>

      <div className="space-y-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 w-full text-left group"
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                checked[i]
                  ? "bg-amber-500 border-amber-500"
                  : "border-moon-500 group-hover:border-moon-300"
              }`}
            >
              {checked[i] && (
                <svg className="w-3 h-3 text-moon-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                checked[i] ? "text-moon-500 line-through" : "text-moon-200"
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>

      {allDone && items.length > 0 && (
        <p className="mt-4 text-sm text-green-400 font-medium text-center">
          ✅ Preparada para a bancada!
        </p>
      )}
      <p className="mt-3 text-xs text-moon-500">{doneCount}/{items.length} itens marcados</p>
    </div>
  );
}
