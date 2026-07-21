"use client";

import Link from "next/link";
import { Check, Lock, ChevronRight, FlaskConical } from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getModuleLearningProgress } from "@/lib/learning";
import { useProgressOrEmpty } from "@/lib/use-progress";

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

function statusStyle(status: string): string {
  switch (status) {
    case "done":
      return "border-green-400/60 bg-green-500/20 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.25)]";
    case "current":
      return "border-amber-300/60 bg-amber-400/20 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.25)]";
    case "available":
      return "border-moon-400/50 bg-moon-700/60 text-moon-200";
    default:
      return "border-moon-600/30 bg-moon-900/40 text-moon-500";
  }
}

function ringStyle(status: string): string {
  switch (status) {
    case "done": return "border-green-500/30";
    case "current": return "border-amber-300/20";
    case "available": return "border-moon-500/20";
    default: return "border-moon-600/10";
  }
}

export function VisualRoadmap() {
  const modules = learningModules as Module[];
  const progress = useProgressOrEmpty();

  const isModuleComplete = (slug: string) => progress.modules[slug]?.status === "completed";

  const getNextModule = () => {
    for (const m of modules) {
      if (m.status !== "available") return m;
      if (!isModuleComplete(m.slug)) return m;
    }
    return modules[modules.length - 1];
  };

  const nextModule = getNextModule();

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-moon-500/30 to-transparent hidden sm:block" />

      <div className="space-y-6">
        {modules.map((mod) => {
          const isAvailable = mod.status === "available";
          const complete = isModuleComplete(mod.slug);
          const isNext = nextModule.slug === mod.slug;
          const status = !isAvailable ? "locked" : complete ? "done" : isNext ? "current" : "available";

          const detail = isAvailable && !complete ? getModuleLearningProgress(mod as Module, progress) : null;

          return (
            <div key={mod.id} className="relative flex flex-col items-center sm:flex-row sm:items-stretch gap-4">
              {/* Planet column */}
              <div className="flex flex-col items-center w-full sm:w-20 shrink-0">
                <Link
                  href={isAvailable ? `/aprendizado/${mod.slug}` : "#"}
                  className="relative z-10"
                >
                  {/* Orbital ring */}
                  <div className={`absolute inset-[-8px] rounded-full border ${ringStyle(status)} hidden sm:block`} />
                  <div className={`absolute inset-[-14px] rounded-full border border-dashed ${ringStyle(status)} hidden sm:block`} />

                  {/* Planet */}
                  <div className={`relative flex aspect-square w-16 sm:w-20 flex-col items-center justify-center rounded-full border-2 text-center transition-all hover:scale-105 ${statusStyle(status)}`}>
                    {status === "done" ? (
                      <Check className="h-6 w-6 sm:h-7 sm:w-7" />
                    ) : status === "locked" ? (
                      <Lock className="h-5 w-5 text-moon-500" />
                    ) : (
                      <>
                        <FlaskConical className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5" />
                        <span className="text-[9px] sm:text-[10px] font-bold">{mod.level}</span>
                      </>
                    )}
                  </div>
                </Link>

                {/* Status label */}
                <span className="mt-2 text-[10px] text-moon-500 font-mono hidden sm:block">
                  {status === "done" ? "Concluído" : status === "current" ? "Atual" : status === "locked" ? "Em breve" : `NÍVEL ${mod.level}`}
                </span>
              </div>

              {/* Card */}
              <div className="flex-1 w-full sm:pt-3">
                <Link
                  href={isAvailable ? `/aprendizado/${mod.slug}` : "#"}
                  className={`block rounded-xl border p-4 transition-all ${
                    status === "done"
                      ? "border-green-700/30 bg-green-900/10 hover:border-green-500/50"
                      : status === "current"
                        ? "border-white/40 bg-white/10 hover:border-white/60 shadow-lg shadow-white/5"
                        : status === "available"
                          ? "border-moon-600 bg-moon-700/30 hover:border-moon-400 hover:bg-moon-700/50"
                          : "border-moon-700 bg-moon-800/20 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Mobile status indicator */}
                        <span className={`text-[10px] font-mono ${
                          status === "done" ? "text-green-400" :
                          status === "current" ? "text-amber-300" :
                          status === "locked" ? "text-moon-500" : "text-moon-500"
                        } block sm:hidden`}>
                          {status === "done" ? "✅ " : status === "current" ? "🟡 " : ""}NÍVEL {mod.level}
                        </span>
                        <span className="text-xs font-mono text-moon-500 hidden sm:inline">
                          {mod.status !== "available" && "🔒 "}
                        </span>
                      </div>

                      <h3 className={`font-semibold truncate ${
                        status === "done" ? "text-green-300" :
                        status === "current" ? "text-white" :
                        status === "available" ? "text-white" : "text-moon-400"
                      }`}>
                        {mod.title}
                      </h3>

                      {/* Progress bar */}
                      {detail && detail.progressPercent > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-moon-700 rounded-full overflow-hidden">
                            <div className="h-full bg-white/40 rounded-full transition-all duration-500" style={{ width: `${detail.progressPercent}%` }} />
                          </div>
                          <span className="text-[10px] text-moon-400 font-mono">{detail.progressPercent}%</span>
                        </div>
                      )}

                      {/* Micro-status */}
                      {detail && detail.microStatus.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {detail.microStatus.map((s, i) => (
                            <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              s.includes("✅") ? "bg-green-900/30 text-green-300" :
                              s.includes("disponível") ? "bg-purple-900/30 text-purple-300" :
                              "bg-moon-800 text-moon-400"
                            }`}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {isAvailable && (
                      <ChevronRight className={`w-5 h-5 shrink-0 mt-1 ${
                        status === "current" ? "text-white" : "text-moon-400"
                      }`} />
                    )}
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
