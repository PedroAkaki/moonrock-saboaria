"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Circle,
  Lock,
  ShieldCheck,
  Sparkles,
  Droplets,
  FlaskConical,
  Moon,
  Play,
  ArrowRight,
  BookOpen,
  Calculator,
} from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";
import { getContinueNowAction, getClientProgress } from "@/lib/learning";

type RoadmapStatus = "completed" | "current" | "in-progress" | "not-started" | "locked";

type MainNode = {
  slug: string;
  level: number;
  title: string;
  status: string;
  href?: string;
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  "base-glicerinada": <Droplets className="h-5 w-5" />,
  "sabao-de-oleo-usado": <Droplets className="h-5 w-5" />,
  "cold-process-basico": <FlaskConical className="h-5 w-5" />,
  "controle-de-formulacao": <FlaskConical className="h-5 w-5" />,
  "hot-process": <FlaskConical className="h-5 w-5" />,
  "cold-process-avancado": <Sparkles className="h-5 w-5" />,
  "saboaria-liquida-koh": <FlaskConical className="h-5 w-5" />,
  "syndet-avancado": <Sparkles className="h-5 w-5" />,
};

type SupportLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const LEFT_LINKS: SupportLink[] = [
  { label: "EPI & Boas Práticas", href: "/aprendizado/cold-process-basico", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Manipulação de Soda", href: "/aprendizado/cold-process-basico", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Segurança no Óleo Usado", href: "/aprendizado/sabao-de-oleo-usado", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Calculadora", href: "/calculadora", icon: <Calculator className="h-4 w-4" /> },
];

const RIGHT_LINKS: SupportLink[] = [
  { label: "Biblioteca de Óleos", href: "/oleos", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Receitas Práticas", href: "/receitas", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Diário de Lote", href: "/diario", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Controle de Formulação", href: "/aprendizado/controle-de-formulacao", icon: <FlaskConical className="h-4 w-4" /> },
];

function StatusDot({ status }: { status: RoadmapStatus }) {
  if (status === "completed") return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-green-400 bg-green-500/20 text-green-300"><Check className="h-3 w-3" /></span>;
  if (status === "current") return <span className="h-5 w-5 rounded-full border-2 border-amber-300 bg-amber-300/20 shadow-[0_0_18px_rgba(252,211,77,0.35)]" />;
  if (status === "in-progress") return <span className="h-5 w-5 rounded-full border-2 border-purple-400 bg-purple-500/20" />;
  if (status === "locked") return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-moon-500 text-moon-500"><Lock className="h-3 w-3" /></span>;
  return <span className="h-5 w-5 rounded-full border border-moon-500" />;
}

function statusClasses(status: RoadmapStatus): string {
  switch (status) {
    case "completed": return "border-green-500/50 bg-green-900/10 text-green-200";
    case "current": return "border-amber-300 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(252,211,77,0.22)]";
    case "in-progress": return "border-purple-500/60 bg-purple-900/20 text-purple-100";
    case "locked": return "border-moon-700 bg-moon-900/50 text-moon-500";
    default: return "border-moon-600 bg-moon-800/70 text-moon-200";
  }
}

function MainNodeCard({ node, status }: { node: MainNode; status: RoadmapStatus }) {
  const content = (
    <div className={`relative rounded-2xl border px-4 py-3 text-center transition-all ${statusClasses(status)}`}>
      <div className="mb-1.5 flex items-center justify-center gap-2">
        <span className={status === "current" ? "text-amber-200" : "text-moon-300"}>{MODULE_ICONS[node.slug] ?? <FlaskConical className="h-5 w-5" />}</span>
        <StatusDot status={status} />
      </div>
      <h3 className="text-sm font-bold leading-tight text-white">{node.title}</h3>
      <p className="mt-0.5 text-[10px] leading-tight text-moon-500 font-mono">NÍVEL {node.level}</p>
    </div>
  );
  if (node.href && status !== "locked") return <Link href={node.href} className="block hover:-translate-y-0.5 transition-transform">{content}</Link>;
  return content;
}

export default function RoadmapMap() {
  const [progress, setProgress] = useState(getClientProgress());

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const modules = learningModules as MainNode[];
  const modulesRaw = learningModules as { id: number; slug: string; level: number; title: string; status: string; summary?: string }[];
  const availableModules = modules.filter((m) => m.status === "available");
  const totalAvailable = availableModules.length;

  const moduleStatusBySlug = useMemo(() => {
    const firstIncomplete = availableModules.find((m) => progress.modules[m.slug]?.status !== "completed");
    const acc: Record<string, RoadmapStatus> = {};
    for (const node of modules) {
      const saved = progress.modules[node.slug]?.status;
      if (node.status !== "available") acc[node.slug] = "locked";
      else if (saved === "completed") acc[node.slug] = "completed";
      else if (saved === "in-progress") acc[node.slug] = "in-progress";
      else if (firstIncomplete?.slug === node.slug) acc[node.slug] = "current";
      else acc[node.slug] = "not-started";
    }
    return acc;
  }, [progress, availableModules, modules]);

  const continueAction = useMemo(() => getContinueNowAction(modulesRaw, progress), [modulesRaw, progress]);

  const completedCount = availableModules.filter((m) => moduleStatusBySlug[m.slug] === "completed").length;
  const progressPercent = totalAvailable > 0 ? Math.round((completedCount / totalAvailable) * 100) : 0;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="relative mx-auto min-w-[760px] max-w-[820px] px-4 py-6">
        {/* CTA — Continue now */}
        {continueAction && continueAction.slug !== "aprendizado" && (
          <Link
            href={continueAction.href}
            className="group mb-6 flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 hover:bg-amber-300/20 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300/20">
              <Play className="h-5 w-5 text-amber-200 ml-0.5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-200/80 uppercase tracking-wider font-medium">Continuar agora</p>
              <p className="text-sm font-semibold text-white">{continueAction.label}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Top backbone label */}
        <div className="relative mx-auto mb-8 flex w-72 items-center justify-center gap-3 rounded-2xl border border-amber-300/40 bg-moon-900/80 px-5 py-3 shadow-[0_0_28px_rgba(252,211,77,0.18)]">
          <Moon className="h-7 w-7 text-amber-200" />
          <span className="text-xl font-bold tracking-[0.24em] text-amber-200">TRILHA</span>
        </div>

        {/* Horizontal branch line */}
        <div className="absolute left-[120px] right-[120px] top-[86px] h-0.5 bg-amber-300/70 shadow-[0_0_18px_rgba(252,211,77,0.35)]" style={{ top: continueAction?.slug !== "aprendizado" ? "170px" : "86px" }} />
        <div className="absolute left-[150px]" style={{ top: continueAction?.slug !== "aprendizado" ? "170px" : "86px" }}>
          <div className="h-10 border-l border-dashed border-purple-400/80" />
        </div>
        <div className="absolute right-[150px]" style={{ top: continueAction?.slug !== "aprendizado" ? "170px" : "86px" }}>
          <div className="h-10 border-l border-dashed border-blue-400/80" />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-[220px_240px_220px] items-start gap-6">
          {/* Left column */}
          <div className="relative pt-12">
            <div className="absolute -right-6 top-28 w-6 border-t border-dashed border-purple-400/80" />
            <section className="rounded-2xl border border-purple-500/60 bg-moon-900/70 p-3 shadow-xl shadow-black/20">
              <div className="mb-3 flex items-start gap-2">
                <ShieldCheck className="h-6 w-6 text-purple-300" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-purple-300">Segurança</h3>
                  <p className="text-xs text-moon-400">Base essencial</p>
                </div>
              </div>
              <div className="space-y-2">
                {LEFT_LINKS.map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex min-h-10 items-center gap-2 rounded-xl border border-moon-700 bg-moon-800/70 px-3 py-2 hover:border-moon-500 transition-colors">
                    <span className="text-purple-300">{item.icon}</span>
                    <span className="text-xs leading-tight text-moon-200 flex-1">{item.label}</span>
                    <ArrowRight className="h-3 w-3 text-moon-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Center — backbone */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-amber-300/60 shadow-[0_0_20px_rgba(252,211,77,0.35)]" />
            <div className="relative z-10 space-y-4">
              {modules.map((node) => (
                <MainNodeCard key={node.slug} node={node} status={moduleStatusBySlug[node.slug]} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="relative pt-12">
            <div className="absolute -left-6 top-56 w-6 border-t border-dashed border-blue-400/80" />
            <section className="rounded-2xl border border-blue-500/60 bg-moon-900/70 p-3 shadow-xl shadow-black/20">
              <div className="mb-3 flex items-start gap-2">
                <BookOpen className="h-6 w-6 text-blue-300" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-blue-300">Ferramentas</h3>
                  <p className="text-xs text-moon-400">Apoio prático</p>
                </div>
              </div>
              <div className="space-y-2">
                {RIGHT_LINKS.map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex min-h-10 items-center gap-2 rounded-xl border border-moon-700 bg-moon-800/70 px-3 py-2 hover:border-moon-500 transition-colors">
                    <span className="text-blue-300">{item.icon}</span>
                    <span className="text-xs leading-tight text-moon-200 flex-1">{item.label}</span>
                    <ArrowRight className="h-3 w-3 text-moon-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Progress footer */}
        <div className="mt-8 rounded-2xl border border-moon-700 bg-moon-900/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-moon-400">{completedCount} de {totalAvailable} módulos concluídos</p>
            </div>
            <div className="h-2 flex-1 rounded-full bg-moon-800">
              <div className="h-2 rounded-full bg-purple-400" style={{ width: `${progressPercent}%` }} />
            </div>
            <Circle className="h-8 w-8 text-purple-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
