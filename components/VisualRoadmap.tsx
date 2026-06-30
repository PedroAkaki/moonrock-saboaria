"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Lock, ChevronRight, BookOpen } from "lucide-react";
import learningModules from "@/data/learning-modules.json";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
}

export function VisualRoadmap() {
  const modules = learningModules as Module[];
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const all: Record<string, Record<string, boolean>> = {};
    for (const m of modules) {
      const saved = localStorage.getItem(`moonrock-progress-${m.slug}`);
      if (saved) {
        try { all[m.slug] = JSON.parse(saved); } catch {}
      }
    }
    setProgress(all);
  }, []);

  const isModuleComplete = (slug: string) => {
    const mod = modules.find((m) => m.slug === slug);
    if (!mod || !(mod as any).conclusion_criteria) return false;
    const criteria = (mod as any).conclusion_criteria as string[];
    const checked = progress[slug] ?? {};
    return criteria.length > 0 && criteria.every((c: string) => checked[c]);
  };

  const getNextModule = () => {
    for (const m of modules) {
      if (m.status !== "available") return m;
      if (!isModuleComplete(m.slug)) return m;
    }
    return modules[modules.length - 1];
  };

  const nextModule = getNextModule();

  return (
    <div className="space-y-0">
      {modules.map((mod, idx) => {
        const isAvailable = mod.status === "available";
        const complete = isModuleComplete(mod.slug);
        const isNext = nextModule.slug === mod.slug;
        const status = !isAvailable ? "locked" : complete ? "done" : isNext ? "current" : "available";

        return (
          <div key={mod.id} className="flex items-stretch">
            {/* Timeline column */}
            <div className="flex flex-col items-center w-10 shrink-0">
              {/* Connector line (top) */}
              {idx > 0 && <div className={`w-0.5 h-6 ${status === "done" ? "bg-green-500" : "bg-moon-600"}`} />}

              {/* Node */}
              <Link
                href={isAvailable ? `/aprendizado/${mod.slug}` : "#"}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all shrink-0
                  ${status === "done" ? "bg-green-500" :
                    status === "current" ? "bg-white ring-2 ring-white/30" :
                    status === "available" ? "bg-moon-600 hover:bg-moon-500" :
                    "bg-moon-800 border border-moon-600"}
                `}
              >
                {status === "done" ? (
                  <Check className="w-5 h-5 text-black" />
                ) : status === "locked" ? (
                  <Lock className="w-4 h-4 text-moon-500" />
                ) : (
                  <span className={`text-sm font-bold ${status === "current" ? "text-black" : "text-white"}`}>
                    {mod.level}
                  </span>
                )}
              </Link>

              {/* Connector line (bottom) */}
              {idx < modules.length - 1 && <div className={`w-0.5 flex-1 ${status === "done" ? "bg-green-500" : "bg-moon-600"}`} />}
            </div>

            {/* Content card */}
            <div className="ml-4 pb-8 flex-1">
              <Link
                href={isAvailable ? `/aprendizado/${mod.slug}` : "#"}
                className={`
                  block p-4 rounded-xl border transition-all
                  ${status === "done"
                    ? "bg-green-900/10 border-green-700/30 hover:border-green-500/50"
                    : status === "current"
                    ? "bg-white/10 border-white/40 hover:border-white/60 shadow-lg shadow-white/5"
                    : status === "available"
                    ? "bg-moon-700/30 border-moon-600 hover:border-moon-400 hover:bg-moon-700/50"
                    : "bg-moon-800/20 border-moon-700 opacity-50 cursor-not-allowed"}
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-moon-500">NÍVEL {mod.level}</span>
                      {status === "done" && <span className="text-xs text-green-400">✅ Concluído</span>}
                      {status === "current" && <span className="text-xs text-white bg-white/10 px-2 py-0.5 rounded-full">Próximo</span>}
                    </div>
                    <h3 className={`font-semibold ${status === "done" ? "text-green-300" : "text-white"}`}>
                      {mod.title}
                    </h3>
                  </div>
                  {isAvailable && (
                    <ChevronRight className={`w-5 h-5 shrink-0 ${status === "current" ? "text-white" : "text-moon-400"}`} />
                  )}
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
