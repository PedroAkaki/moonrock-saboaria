"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
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

type RoadmapItem =
  | { type: "module"; slug: string; title: string; level: number; status: string }
  | { type: "submodule"; id: string; title: string; subtitle: string };

type SupportLink = { label: string; href: string; icon: React.ReactNode };

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

const SUBMODULE_FLOW: RoadmapItem[] = [
  { type: "submodule", id: "temp-bolhas", title: "Temperatura, bolhas e umidade", subtitle: "Controle de fusão e acabamento" },
  { type: "submodule", id: "filtragem-sap", title: "Filtragem, SAP incerto e segurança", subtitle: "Óleo degradado e superfat de proteção" },
  { type: "submodule", id: "soda-trace-cura", title: "Soda, trace e cura", subtitle: "NaOH, emulsão e tempo de maturação" },
  { type: "submodule", id: "ins-dos-equilibrio", title: "INS, DOS e equilíbrio", subtitle: "Ácidos graxos e perfil da fórmula" },
];

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
  if (status === "completed") return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-green-400 bg-green-500/20 text-green-300"><Check className="h-2.5 w-2.5" /></span>;
  if (status === "current") return <span className="h-4 w-4 rounded-full border-2 border-amber-300 bg-amber-300/20 shadow-[0_0_12px_rgba(252,211,77,0.35)]" />;
  if (status === "in-progress") return <span className="h-4 w-4 rounded-full border-2 border-purple-400 bg-purple-500/20" />;
  if (status === "locked") return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-moon-500 text-moon-500"><Lock className="h-2.5 w-2.5" /></span>;
  return <span className="h-4 w-4 rounded-full border border-moon-500" />;
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

/** Segmento da linha amarela — só aparece entre elementos, nunca atrás */
function BackboneSegment({ height = 28 }: { height?: number }) {
  return (
    <div className="mx-auto w-1 shrink-0 rounded-full bg-amber-300/70 shadow-[0_0_16px_rgba(252,211,77,0.35)]" style={{ height }} />
  );
}

function MainNodeCard({ item, status }: { item: RoadmapItem & { type: "module" }; status: RoadmapStatus }) {
  const content = (
    <div className={`relative rounded-2xl border px-4 py-3 text-center transition-all ${statusClasses(status)}`}>
      <div className="mb-1.5 flex items-center justify-center gap-2">
        <span className={status === "current" ? "text-amber-200" : "text-moon-300"}>{MODULE_ICONS[item.slug] ?? <FlaskConical className="h-5 w-5" />}</span>
        <StatusDot status={status} />
      </div>
      <h3 className="text-sm font-bold leading-tight text-white">{item.title}</h3>
      <p className="mt-0.5 text-[10px] leading-tight text-moon-500 font-mono">NÍVEL {item.level}</p>
    </div>
  );
  if (status !== "locked") return <Link href={`/aprendizado/${item.slug}`} className="block hover:-translate-y-0.5 transition-transform">{content}</Link>;
  return content;
}

function SubmoduleNode({ item }: { item: RoadmapItem & { type: "submodule" } }) {
  return (
    <div className="rounded-xl border border-amber-300/30 bg-moon-900/60 px-4 py-2.5 text-center">
      <p className="text-xs font-semibold text-amber-100">{item.title}</p>
      <p className="text-[10px] text-moon-400 mt-0.5">{item.subtitle}</p>
    </div>
  );
}

function SupportPanel({ title, icon, items, accent }: {
  title: string; icon: React.ReactNode; items: SupportLink[]; accent: "purple" | "blue";
}) {
  const text = accent === "purple" ? "text-purple-300" : "text-blue-300";
  const border = accent === "purple" ? "border-purple-500/60" : "border-blue-500/60";

  return (
    <section className={`rounded-2xl border ${border} bg-moon-900/70 p-3 shadow-xl shadow-black/20`}>
      <div className="mb-3 flex items-start gap-2">
        <span className={text}>{icon}</span>
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${text}`}>{title}</h3>
          <p className="text-xs text-moon-400">Apoio prático</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.label} href={item.href}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-moon-700 bg-moon-800/70 px-3 py-2 hover:border-moon-500 transition-colors">
            <span className={text}>{item.icon}</span>
            <span className="text-xs leading-tight text-moon-200 flex-1">{item.label}</span>
            <ArrowRight className="h-3 w-3 text-moon-500 shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function RoadmapMap() {
  const [progress, setProgress] = useState(getClientProgress());

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const allModules = (learningModules as any[]) as (RoadmapItem & { type: "module"; slug: string; level: number; title: string; status: string })[];
  const modules: (RoadmapItem & { type: "module"; slug: string; level: number; title: string; status: string })[] = allModules.map(m => ({ ...m, type: "module" as const }));
  const modulesRaw = learningModules as { id: number; slug: string; level: number; title: string; status: string; summary?: string }[];
  const availableModules = modules.filter((m) => m.status === "available");
  const totalAvailable = availableModules.length;

  // Monta fluxo intercalado: módulo → submódulo → módulo → submódulo ...
  const flow = useMemo(() => {
    const items: (RoadmapItem & { type: "module" | "submodule" })[] = [];
    modules.forEach((mod, idx) => {
      items.push(mod);
      if (idx < SUBMODULE_FLOW.length) items.push(SUBMODULE_FLOW[idx]);
    });
    return items;
  }, [modules]);

  const moduleStatusBySlug = useMemo(() => {
    const firstIncomplete = availableModules.find((m) => progress.modules[m.slug]?.status !== "completed");
    const acc: Record<string, RoadmapStatus> = {};
    for (const mod of modules) {
      const saved = progress.modules[mod.slug]?.status;
      if (mod.status !== "available") acc[mod.slug] = "locked";
      else if (saved === "completed") acc[mod.slug] = "completed";
      else if (saved === "in-progress") acc[mod.slug] = "in-progress";
      else if (firstIncomplete?.slug === mod.slug) acc[mod.slug] = "current";
      else acc[mod.slug] = "not-started";
    }
    return acc;
  }, [progress, availableModules, modules]);

  const continueAction = useMemo(() => getContinueNowAction(modulesRaw, progress), [modulesRaw, progress]);
  const completedCount = availableModules.filter((m) => moduleStatusBySlug[m.slug] === "completed").length;
  const progressPercent = totalAvailable > 0 ? Math.round((completedCount / totalAvailable) * 100) : 0;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="relative mx-auto min-w-[760px] max-w-[820px] px-4 py-6">
        {/* CTA */}
        {continueAction && continueAction.slug !== "aprendizado" && (
          <Link href={continueAction.href}
            className="group mb-6 flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 hover:bg-amber-300/20 transition-colors">
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

        {/* FUNDAÇÃO label */}
        <div className="relative mx-auto mb-6 flex w-64 items-center justify-center gap-3 rounded-2xl border border-amber-300/40 bg-moon-900/80 px-5 py-3 shadow-[0_0_28px_rgba(252,211,77,0.18)]">
          <Moon className="h-6 w-6 text-amber-200" />
          <span className="text-lg font-bold tracking-[0.24em] text-amber-200">TRILHA</span>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-[200px_1fr_200px] gap-6">
          {/* Left column */}
          <div className="pt-2">
            <SupportPanel title="Segurança" icon={<ShieldCheck className="h-6 w-6" />} accent="purple" items={LEFT_LINKS} />
          </div>

          {/* Center column — backbone segmentado */}
          <div className="flex flex-col items-center">
            {flow.map((item, idx) => (
              <Fragment key={"type" in item && item.type === "module" ? item.slug : (item as any).id ?? idx}>
                {/* Segmento amarelo entre elementos */}
                {idx > 0 && <BackboneSegment height={24} />}

                {item.type === "module" ? (
                  <MainNodeCard item={item} status={moduleStatusBySlug[item.slug]} />
                ) : (
                  <SubmoduleNode item={item} />
                )}
              </Fragment>
            ))}
          </div>

          {/* Right column */}
          <div className="pt-2">
            <SupportPanel title="Ferramentas" icon={<BookOpen className="h-6 w-6" />} accent="blue" items={RIGHT_LINKS} />
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
