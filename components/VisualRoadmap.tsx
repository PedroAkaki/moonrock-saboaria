"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Lock, ChevronRight, BookOpen, CircleDot } from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";
import { getModuleLearningProgress, getClientProgress } from "@/lib/learning";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
  summary?: string;
  quiz?: unknown[];
  conclusion_criteria?: string[];
  beforePracticeChecklist?: string[];
  studyCards?: unknown[];
}

export function VisualRoadmap() {
  const modules = learningModules as Module[];
  const [progress, setProgress] = useState(getClientProgress());

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const isModuleComplete = (slug: string) => {
    return progress.modules[slug]?.status === "completed";
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
        const status = !isAvailable
          ? "locked"
          : complete
            ? "done"
            : isNext
              ? "current"
              : "available";

        // Get granular progress for available modules
        const detail =
          isAvailable && !complete
            ? getModuleLearningProgress(mod as Module, progress)
            : null;

        return (
          <div key={mod.id} className="flex items-stretch">
            {/* Timeline column */}
            <div className="flex flex-col items-center w-10 shrink-0">
              {idx > 0 && (
                <div
                  className={`w-0.5 h-6 ${status === "done" ? "bg-green-500" : "bg-moon-600"}`}
                />
              )}

              {/* Node */}
              <Link
                href={isAvailable ? `/aprendizado/${mod.slug}` : "#"}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all shrink-0
                  ${status === "done"
                    ? "bg-green-500"
                    : status === "current"
                      ? "bg-white ring-2 ring-white/30"
                      : status === "available"
                        ? "bg-moon-600 hover:bg-moon-500"
                        : "bg-moon-800 border border-moon-600"
                  }`}
              >
                {status === "done" ? (
                  <Check className="w-5 h-5 text-black" />
                ) : status === "locked" ? (
                  <Lock className="w-4 h-4 text-moon-500" />
                ) : (
                  <span
                    className={`text-sm font-bold ${status === "current" ? "text-black" : "text-white"}`}
                  >
                    {mod.level}
                  </span>
                )}
              </Link>

              {/* Connector line (bottom) */}
              {idx < modules.length - 1 && (
                <div
                  className={`w-0.5 flex-1 ${status === "done" ? "bg-green-500" : "bg-moon-600"}`}
                />
              )}
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
                        : "bg-moon-800/20 border-moon-700 opacity-50 cursor-not-allowed"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-moon-500">
                        NÍVEL {mod.level}
                      </span>
                      {status === "done" && (
                        <span className="text-xs text-green-400">✅ Concluído</span>
                      )}
                      {status === "current" && (
                        <span className="text-xs text-white bg-white/10 px-2 py-0.5 rounded-full">
                          Próximo
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-semibold ${status === "done" ? "text-green-300" : "text-white"} truncate`}
                    >
                      {mod.title}
                    </h3>

                    {/* Progress bar for in-progress modules */}
                    {detail && detail.progressPercent > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-moon-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/40 rounded-full transition-all duration-500"
                            style={{ width: `${detail.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-moon-400 font-mono">
                          {detail.progressPercent}%
                        </span>
                      </div>
                    )}

                    {/* Micro-status */}
                    {detail && detail.microStatus.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {detail.microStatus.map((s, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              s.includes("✅")
                                ? "bg-green-900/30 text-green-300"
                                : s.includes("disponível")
                                  ? "bg-purple-900/30 text-purple-300"
                                  : "bg-moon-800 text-moon-400"
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAvailable && (
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 mt-1 ${status === "current" ? "text-white" : "text-moon-400"}`}
                    />
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
