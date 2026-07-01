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
} from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";

type RoadmapStatus = "completed" | "current" | "in-progress" | "not-started" | "locked";

type MainNode = {
  slug: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
};

type SupportItem = {
  label: string;
  status: RoadmapStatus;
};

const MAIN_NODES: MainNode[] = [
  { slug: "base-glicerinada", title: "Base Glicerinada", subtitle: "Entenda os fundamentos", icon: <Droplets className="h-5 w-5" />, href: "/aprendizado/base-glicerinada" },
  { slug: "sabao-de-oleo-usado", title: "Sabão de Óleo Usado", subtitle: "Sustentabilidade na prática", icon: <Droplets className="h-5 w-5" />, href: "/aprendizado/sabao-de-oleo-usado" },
  { slug: "cold-process-basico", title: "Cold Process Básico", subtitle: "Do básico ao avançado", icon: <FlaskConical className="h-5 w-5" />, href: "/aprendizado/cold-process-basico" },
  { slug: "controle-de-formulacao", title: "Controle de Formulação", subtitle: "Eleve o nível das fórmulas", icon: <FlaskConical className="h-5 w-5" /> },
  { slug: "syndet-avancado", title: "Syndet Avançado", subtitle: "Explore novas possibilidades", icon: <Sparkles className="h-5 w-5" /> },
];

const LEFT_SUPPORT: SupportItem[] = [
  { label: "EPI & Boas Práticas", status: "not-started" },
  { label: "Fichas de Segurança", status: "not-started" },
  { label: "Manipulação de Soda Cáustica", status: "not-started" },
  { label: "Ventilação & Ambiente", status: "not-started" },
  { label: "Armazenamento Seguro", status: "not-started" },
  { label: "Primeiros Socorros", status: "not-started" },
];

const RIGHT_SUPPORT: SupportItem[] = [
  { label: "Óleos & Manteigas", status: "not-started" },
  { label: "Aditivos & Corantes", status: "not-started" },
  { label: "Fragrâncias", status: "not-started" },
  { label: "Técnicas de Mistura", status: "not-started" },
  { label: "Traço & Consistência", status: "not-started" },
  { label: "Inspeção & Cura", status: "not-started" },
  { label: "Dicas & Troubleshooting", status: "not-started" },
];

function StatusDot({ status }: { status: RoadmapStatus }) {
  if (status === "completed") {
    return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-green-400 bg-green-500/20 text-green-300"><Check className="h-3 w-3" /></span>;
  }
  if (status === "current") {
    return <span className="h-5 w-5 rounded-full border-2 border-amber-300 bg-amber-300/20 shadow-[0_0_18px_rgba(252,211,77,0.35)]" />;
  }
  if (status === "in-progress") {
    return <span className="h-5 w-5 rounded-full border-2 border-purple-400 bg-purple-500/20" />;
  }
  if (status === "locked") {
    return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-moon-500 text-moon-500"><Lock className="h-3 w-3" /></span>;
  }
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

function SupportPanel({ title, subtitle, icon, items, accent }: {
  title: string; subtitle: string; icon: React.ReactNode; items: SupportItem[]; accent: "purple" | "blue";
}) {
  const border = accent === "purple" ? "border-purple-500/60" : "border-blue-500/60";
  const text = accent === "purple" ? "text-purple-300" : "text-blue-300";

  return (
    <section className={`rounded-2xl border ${border} bg-moon-900/70 p-3 shadow-xl shadow-black/20`}>
      <div className="mb-3 flex items-start gap-2">
        <div className={text}>{icon}</div>
        <div>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${text}`}>{title}</h3>
          <p className="text-xs text-moon-400">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex min-h-10 items-center justify-between gap-2 rounded-xl border border-moon-700 bg-moon-800/70 px-3 py-2">
            <span className="text-xs leading-tight text-moon-200">{item.label}</span>
            <StatusDot status={item.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MainNodeCard({ node, status }: { node: MainNode; status: RoadmapStatus }) {
  const content = (
    <div className={`relative rounded-2xl border px-4 py-4 text-center transition-all ${statusClasses(status)}`}>
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className={status === "current" ? "text-amber-200" : "text-moon-300"}>{node.icon}</span>
        <StatusDot status={status} />
      </div>
      <h3 className="text-sm font-bold leading-tight text-white">{node.title}</h3>
      <p className="mt-1 text-xs leading-tight text-moon-400">{node.subtitle}</p>
    </div>
  );

  if (node.href && status !== "locked") {
    return <Link href={node.href} className="block hover:-translate-y-0.5 transition-transform">{content}</Link>;
  }
  return content;
}

export default function RoadmapMap() {
  const [progress, setProgress] = useState(() => getProgress());

  useEffect(() => {
    const update = () => setProgress(getProgress());
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const moduleStatusBySlug = useMemo(() => {
    const modules = learningModules as { slug: string; status: string }[];
    const firstIncomplete = modules.find((mod) => mod.status === "available" && progress.modules[mod.slug]?.status !== "completed");
    return MAIN_NODES.reduce<Record<string, RoadmapStatus>>((acc, node) => {
      const module = modules.find((m) => m.slug === node.slug);
      const saved = progress.modules[node.slug]?.status;
      if (!module || module.status !== "available") acc[node.slug] = "locked";
      else if (saved === "completed") acc[node.slug] = "completed";
      else if (saved === "in-progress") acc[node.slug] = "in-progress";
      else if (firstIncomplete?.slug === node.slug) acc[node.slug] = "current";
      else acc[node.slug] = "not-started";
      return acc;
    }, {});
  }, [progress]);

  const completedCount = Object.values(moduleStatusBySlug).filter((s) => s === "completed").length;
  const progressPercent = Math.round((completedCount / MAIN_NODES.length) * 100);

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="relative mx-auto min-w-[760px] max-w-[820px] px-4 py-6">
        {/* Top backbone label */}
        <div className="relative mx-auto mb-8 flex w-72 items-center justify-center gap-3 rounded-2xl border border-amber-300/40 bg-moon-900/80 px-5 py-3 shadow-[0_0_28px_rgba(252,211,77,0.18)]">
          <Moon className="h-7 w-7 text-amber-200" />
          <span className="text-xl font-bold tracking-[0.24em] text-amber-200">FUNDAÇÃO</span>
        </div>

        {/* Horizontal branch line */}
        <div className="absolute left-[120px] right-[120px] top-[86px] h-0.5 bg-amber-300/70 shadow-[0_0_18px_rgba(252,211,77,0.35)]" />

        {/* Side branch connectors */}
        <div className="absolute left-[150px] top-[86px] h-10 border-l border-dashed border-purple-400/80" />
        <div className="absolute right-[150px] top-[86px] h-10 border-l border-dashed border-blue-400/80" />

        {/* 3-column grid */}
        <div className="grid grid-cols-[220px_240px_220px] items-start gap-6">
          {/* Left column */}
          <div className="relative pt-12">
            <div className="absolute -right-6 top-28 w-6 border-t border-dashed border-purple-400/80" />
            <SupportPanel title="Suporte Técnico" subtitle="Segurança e base essencial" icon={<ShieldCheck className="h-6 w-6" />} accent="purple" items={LEFT_SUPPORT} />
            <div className="mt-8 rounded-2xl border border-purple-500/60 bg-purple-900/20 p-4">
              <p className="text-sm font-semibold text-purple-200">Dicas & Soluções</p>
              <p className="mt-1 text-xs leading-relaxed text-moon-400">Segurança vem sempre em primeiro lugar.</p>
            </div>
          </div>

          {/* Center column — backbone */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-amber-300/60 shadow-[0_0_20px_rgba(252,211,77,0.35)]" />
            <div className="relative z-10 space-y-5">
              {MAIN_NODES.map((node) => (
                <MainNodeCard key={node.slug} node={node} status={moduleStatusBySlug[node.slug]} />
              ))}
              <div className="rounded-xl border border-moon-700 bg-moon-900/70 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-moon-500">
                <Lock className="mr-2 inline h-3.5 w-3.5" /> Em breve
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="relative pt-12">
            <div className="absolute -left-6 top-56 w-6 border-t border-dashed border-blue-400/80" />
            <SupportPanel title="Suporte Criativo" subtitle="Técnicas, extras e acabamento" icon={<Sparkles className="h-6 w-6" />} accent="blue" items={RIGHT_SUPPORT} />
            <div className="mt-8 rounded-2xl border border-blue-500/60 bg-blue-900/20 p-4">
              <p className="text-sm font-semibold text-blue-200">Sabedoria Lunar</p>
              <p className="mt-1 text-xs leading-relaxed text-moon-400">Aprenda com a experiência de quem vive a saboaria.</p>
            </div>
          </div>
        </div>

        {/* Progress footer */}
        <div className="mt-8 rounded-2xl border border-moon-700 bg-moon-900/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-moon-400">do roadmap concluído</p>
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
