"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Lock,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  AlertTriangle,
  Beaker,
  Calculator,
  Droplets,
  ChevronLeft,
} from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import recipesData from "@/data/recipes.json";
import { getProgress } from "@/lib/progress";
import { getModuleLearningProgress, getClientProgress } from "@/lib/learning";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
  summary?: string;
  chemical_fundamentals?: string[];
  safety?: string[];
  process?: string[];
  practical_exercise?: string;
  quiz?: unknown[];
  conclusion_criteria?: string[];
  beforePracticeChecklist?: string[];
  studyCards?: unknown[];
}

const MODULE_TOPICS: Record<string, { label: string; icon: React.ReactNode; href: string }[]> = {
  "base-glicerinada": [
    { label: "Fundamentos", icon: <FlaskConical className="w-3.5 h-3.5" />, href: "/aprendizado/base-glicerinada" },
    { label: "Temperatura", icon: <Beaker className="w-3.5 h-3.5" />, href: "/aprendizado/base-glicerinada" },
    { label: "Higroscopia", icon: <Droplets className="w-3.5 h-3.5" />, href: "/aprendizado/base-glicerinada" },
    { label: "Receita: Mel", icon: <BookOpen className="w-3.5 h-3.5" />, href: "/receitas" },
  ],
  "sabao-de-oleo-usado": [
    { label: "Degradação térmica", icon: <FlaskConical className="w-3.5 h-3.5" />, href: "/aprendizado/sabao-de-oleo-usado" },
    { label: "SAP variável", icon: <AlertTriangle className="w-3.5 h-3.5" />, href: "/aprendizado/sabao-de-oleo-usado" },
    { label: "Limpeza doméstica", icon: <AlertTriangle className="w-3.5 h-3.5" />, href: "/aprendizado/sabao-de-oleo-usado" },
    { label: "Receita: Óleo Usado", icon: <BookOpen className="w-3.5 h-3.5" />, href: "/receitas" },
  ],
  "cold-process-basico": [
    { label: "Saponificação", icon: <FlaskConical className="w-3.5 h-3.5" />, href: "/aprendizado/cold-process-basico" },
    { label: "NaOH + Água", icon: <Calculator className="w-3.5 h-3.5" />, href: "/calculadora" },
    { label: "Trace + Cura", icon: <Beaker className="w-3.5 h-3.5" />, href: "/aprendizado/cold-process-basico" },
    { label: "Receita: Azeite & Coco", icon: <BookOpen className="w-3.5 h-3.5" />, href: "/receitas" },
  ],
  "controle-de-formulacao": [
    { label: "INS", icon: <Calculator className="w-3.5 h-3.5" />, href: "/calculadora" },
    { label: "DOS", icon: <AlertTriangle className="w-3.5 h-3.5" />, href: "/calculadora" },
    { label: "Ácidos graxos", icon: <FlaskConical className="w-3.5 h-3.5" />, href: "/aprendizado/controle-de-formulacao" },
    { label: "Biblioteca de Óleos", icon: <Droplets className="w-3.5 h-3.5" />, href: "/oleos" },
  ],
};

export default function RoadmapMap() {
  const modules = learningModules as Module[];
  const [progress, setProgress] = useState(getClientProgress());
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const isModuleComplete = (slug: string) => progress.modules[slug]?.status === "completed";

  const toggle = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));

  return (
    <div className="relative">
      {/* Vertical line background */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-moon-600 hidden sm:block" />

      <div className="space-y-6">
        {modules.map((mod, idx) => {
          const isAvailable = mod.status === "available";
          const complete = isModuleComplete(mod.slug);
          const isExpanded = expanded[mod.slug] ?? (idx < 3);
          const topics = MODULE_TOPICS[mod.slug] ?? [];
          const relatedRecipes = recipesData.recipes.filter((r) =>
            r.relatedModuleSlugs?.includes(mod.slug)
          );

          const moduleBg = complete
            ? "border-green-700/50 bg-green-900/10"
            : isAvailable
              ? "border-moon-600 bg-moon-700/40"
              : "border-moon-700 bg-moon-800/20 opacity-50";

          const nodeBg = complete
            ? "bg-green-500"
            : isAvailable
              ? "bg-moon-500"
              : "bg-moon-700 border border-moon-600";

          return (
            <div key={mod.id} className="relative flex items-stretch gap-4">
              {/* Node + connector */}
              <div className="hidden sm:flex flex-col items-center w-12 shrink-0">
                {idx > 0 && <div className="w-0.5 h-6 bg-moon-600" />}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${nodeBg}`}
                >
                  {complete ? (
                    <Check className="w-5 h-5 text-black" />
                  ) : !isAvailable ? (
                    <Lock className="w-4 h-4 text-moon-500" />
                  ) : (
                    <span className="text-sm font-bold text-white">{mod.level}</span>
                  )}
                </div>
                {idx < modules.length - 1 && <div className="w-0.5 flex-1 bg-moon-600" />}
              </div>

              {/* Card */}
              <div className={`flex-1 rounded-xl border p-5 ${moduleBg}`}>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-moon-500">
                        NÍVEL {mod.level}
                      </span>
                      {complete && (
                        <span className="text-[10px] text-green-400 font-medium">
                          ✅ Concluído
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="text-[10px] text-moon-500 font-medium">
                          Em breve
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        complete ? "text-green-300" : isAvailable ? "text-white" : "text-moon-400"
                      }`}
                    >
                      {mod.title}
                    </h3>
                    {mod.summary && isAvailable && (
                      <p className="text-xs text-moon-400 mt-1 leading-relaxed">{mod.summary}</p>
                    )}
                  </div>

                  {/* Expand / link */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isAvailable && (
                      <Link
                        href={`/aprendizado/${mod.slug}`}
                        className="text-xs text-moon-400 hover:text-white underline transition-colors"
                      >
                        Abrir
                      </Link>
                    )}
                    {isAvailable && topics.length > 0 && (
                      <button
                        onClick={() => toggle(mod.slug)}
                        className="text-moon-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded topics */}
                {isExpanded && topics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-moon-700">
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic, i) => (
                        <Link
                          key={i}
                          href={topic.href}
                          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-moon-800 text-moon-300 hover:bg-moon-700 hover:text-white transition-colors border border-moon-600"
                        >
                          {topic.icon}
                          {topic.label}
                        </Link>
                      ))}
                    </div>

                    {/* Related recipes */}
                    {relatedRecipes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {relatedRecipes.map((r) => (
                          <Link
                            key={r.id}
                            href="/receitas"
                            className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors border border-purple-700/50"
                          >
                            <BookOpen className="w-3 h-3" />
                            {r.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-10 pt-6 border-t border-moon-700">
        <h4 className="text-xs font-semibold text-moon-500 uppercase tracking-wider mb-3">
          Legenda
        </h4>
        <div className="flex flex-wrap gap-4 text-xs text-moon-400">
          <span className="inline-flex items-center gap-1.5">
            <FlaskConical className="w-3 h-3" /> Fundamentos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calculator className="w-3 h-3" /> Calculadora
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" /> Receita
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Droplets className="w-3 h-3" /> Óleos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Segurança
          </span>
        </div>
      </div>
    </div>
  );
}
