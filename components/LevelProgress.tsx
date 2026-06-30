"use client";

import { useState, useEffect } from "react";
import { getProgress, updateChecklist, setModuleStatus } from "@/lib/progress";

interface LevelProgressProps {
  slug: string;
  checklist: string[];
}

export default function LevelProgress({ slug, checklist }: LevelProgressProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const storageKey = `moonrock-progress-${slug}`;

  // Load from centralized progress first, fallback to old key
  useEffect(() => {
    const p = getProgress();
    if (p.modules[slug]?.checklist && Object.keys(p.modules[slug].checklist).length > 0) {
      setCheckedItems(p.modules[slug].checklist);
    } else {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCheckedItems(parsed);
          // Migrate to centralized
          for (const [item, val] of Object.entries(parsed)) {
            updateChecklist(slug, "checklist", item, val as boolean);
          }
        } catch {}
      }
    }
  }, [slug]);

  const toggleCheck = (item: string) => {
    const newChecked = !checkedItems[item];
    const newState = { ...checkedItems, [item]: newChecked };
    setCheckedItems(newState);
    updateChecklist(slug, "checklist", item, newChecked);

    const completedCount = Object.values(newState).filter(Boolean).length;
    if (completedCount === checklist.length) {
      setModuleStatus(slug, "completed");
    } else if (completedCount > 0) {
      setModuleStatus(slug, "in-progress");
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="mt-8 p-5 border border-moon-600 rounded-xl bg-moon-800/50 backdrop-blur">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">✅ Critérios de Conclusão</h3>
        <span className="text-sm text-moon-400 font-mono">{completedCount}/{checklist.length}</span>
      </div>

      {checklist.length > 0 && (
        <div className="w-full bg-moon-700 rounded-full h-1.5 mb-5">
          <div
            className="bg-moon-100 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="space-y-2.5">
        {checklist.map((item, index) => (
          <button
            key={index}
            onClick={() => toggleCheck(item)}
            className="flex items-start gap-3 w-full text-left group"
          >
            <div
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                checkedItems[item]
                  ? "bg-white border-white"
                  : "border-moon-500 group-hover:border-moon-300"
              }`}
            >
              {checkedItems[item] && (
                <svg className="w-3 h-3 text-moon-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm transition-colors leading-relaxed ${
                checkedItems[item] ? "text-moon-500 line-through" : "text-moon-300"
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>

      {completedCount === checklist.length && checklist.length > 0 && (
        <p className="mt-4 text-sm text-green-400 font-medium text-center border border-green-700/50 bg-green-900/20 rounded-lg py-2">
          ✅ Módulo concluído! Pode avançar para o próximo nível.
        </p>
      )}
    </div>
  );
}
