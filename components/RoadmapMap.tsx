"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { Check, Lock, Play, ArrowRight, ShieldCheck, FlaskConical, BookOpen, Sparkles } from "lucide-react";
import { roadmapNodes, RoadmapNode, RoadmapTopic } from "@/data/roadmap-nodes";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";
import { getContinueNowAction, getClientProgress } from "@/lib/learning";

type RoadmapStatus = "completed" | "current" | "in-progress" | "not-started" | "locked";

function getSlugStatus(node: RoadmapNode, progress: ReturnType<typeof getProgress>, modules: { slug: string; status: string }[]): RoadmapStatus {
  switch (node.statusSource) {
    case "always-current":
      return "current";
    case "always-available":
      return "not-started";
    case "locked":
      return "locked";
    case "learning-module": {
      const mod = modules.find((m) => m.slug === node.slug);
      const saved = progress.modules[node.slug]?.status;
      if (!mod || mod.status !== "available") return "locked";
      if (saved === "completed") return "completed";
      if (saved === "in-progress") return "in-progress";
      const firstIncomplete = modules.find((m) => m.status === "available" && progress.modules[m.slug]?.status !== "completed");
      if (firstIncomplete?.slug === node.slug) return "current";
      return "not-started";
    }
    default:
      return "not-started";
  }
}

function typeIcon(type: string) {
  switch (type) {
    case "foundation": return <ShieldCheck className="h-4 w-4" />;
    case "tool": return <BookOpen className="h-4 w-4" />;
    case "milestone": return <Sparkles className="h-4 w-4" />;
    default: return <FlaskConical className="h-4 w-4" />;
  }
}

function typeBadge(type: string): { label: string; className: string } {
  switch (type) {
    case "foundation": return { label: "Fundação", className: "text-amber-300 border-amber-700 bg-amber-900/20" };
    case "tool": return { label: "Ferramenta", className: "text-blue-300 border-blue-700 bg-blue-900/20" };
    case "milestone": return { label: "Marco", className: "text-purple-300 border-purple-700 bg-purple-900/20" };
    default: return { label: "Módulo", className: "text-moon-400 border-moon-600 bg-moon-800" };
  }
}

function centerBorderByType(type: string, status: RoadmapStatus): string {
  const base = statusClasses(status);
  switch (type) {
    case "foundation": return `${base} ring-1 ring-amber-300/30`;
    case "tool": return `${base} ring-1 ring-blue-400/20`;
    case "milestone": return `${base} ring-1 ring-purple-400/20`;
    default: return base;
  }
}

function statusClasses(status: RoadmapStatus): string {
  switch (status) {
    case "completed": return "border-green-500/50 bg-green-900/10 text-green-200 ring-1 ring-green-500/30";
    case "current": return "border-amber-300 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(252,211,77,0.25)] ring-1 ring-amber-300/40";
    case "in-progress": return "border-purple-500/60 bg-purple-900/20 text-purple-100";
    case "locked": return "border-moon-700 bg-moon-900/50 text-moon-500";
    default: return "border-moon-600 bg-moon-800/70 text-moon-200";
  }
}

const TOPIC_TYPE_COLORS: Record<string, string> = {
  safety: "border-red-700/50 bg-red-900/15",
  tool: "border-blue-700/50 bg-blue-900/15",
  recipe: "border-green-700/50 bg-green-900/15",
  checklist: "border-purple-700/50 bg-purple-900/15",
};

function TopicPill({ topic }: { topic: RoadmapTopic }) {
  const color = TOPIC_TYPE_COLORS[topic.type] ?? "border-moon-600 bg-moon-800/70";
  const content = (
    <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs leading-tight transition-colors ${color} ${topic.href ? "hover:brightness-125 cursor-pointer" : ""}`}>
      <span>{topic.title}</span>
      {topic.importance === "secondary" && <span className="text-[9px] text-moon-500">(extra)</span>}
    </div>
  );
  if (topic.href) return <Link href={topic.href}>{content}</Link>;
  return <div>{content}</div>;
}

function CenterNode({ node, status }: { node: RoadmapNode; status: RoadmapStatus }) {
  const badge = typeBadge(node.type);
  const content = (
    <div className={`rounded-2xl border px-5 py-3.5 text-center transition-all ${centerBorderByType(node.type, status)}`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        {status === "completed" ? <Check className="h-5 w-5 text-green-300" /> : status === "locked" ? <Lock className="h-5 w-5 text-moon-500" /> : typeIcon(node.type)}
        <span className="text-sm font-bold leading-tight text-white">{node.title}</span>
      </div>
      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
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

  const modules = learningModules as { id: number; slug: string; level: number; title: string; status: string }[];
  const modulesRaw = learningModules as { id: number; slug: string; level: number; title: string; status: string; summary?: string }[];
  const continueAction = useMemo(() => getContinueNowAction(modulesRaw, progress), [modulesRaw, progress]);

  let lastSection = "";
  const availableModules = modules.filter((m) => m.status === "available");
  const completedCount = availableModules.filter((m) => progress.modules[m.slug]?.status === "completed").length;
  const progressPercent = availableModules.length > 0 ? Math.round((completedCount / availableModules.length) * 100) : 0;

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="relative mx-auto min-w-[800px] max-w-[900px] px-6 py-4">
        {/* CTA */}
        {continueAction && continueAction.slug !== "aprendizado" && (
          <Link href={continueAction.href}
            className="group mb-5 flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 hover:bg-amber-300/20 transition-colors">
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

        {/* Mini header */}
        <div className="text-center mb-5">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300/70">Trilha Principal</span>
        </div>

        {/* Continuous backbone — behind everything */}
        <div className="absolute left-1/2 top-20 bottom-28 w-0.5 -translate-x-1/2 rounded-full bg-amber-300/40 shadow-[0_0_20px_rgba(252,211,77,0.15)]" />

        {roadmapNodes.map((node, idx) => {
          const status = getSlugStatus(node, progress, modules);
          const showSection = node.section && node.section !== lastSection;
          if (node.section) lastSection = node.section;

          return (
            <Fragment key={node.id}>
              {/* Section label */}
              {showSection && (
                <div className="relative z-10 flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-moon-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-moon-400 shrink-0">{node.section}</span>
                  <div className="flex-1 h-px bg-moon-600" />
                </div>
              )}

              {/* Row with dashed connectors */}
              <div className="relative grid grid-cols-[240px_1fr_240px] gap-6 items-center my-3">
                {/* Dashed horizontal connector behind everything */}
                <div className="absolute left-[250px] right-[250px] top-1/2 border-t border-dashed border-moon-500/25 -translate-y-1/2 z-0" />

                {/* Left topics */}
                <div className="relative z-10 flex flex-col items-end gap-2">
                  {node.leftTopics?.map((topic) => (
                    <TopicPill key={topic.id} topic={topic} />
                  ))}
                </div>

                {/* Center node — masked from backbone */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-moon-800 rounded-2xl px-1 py-0.5">
                    <CenterNode node={node} status={status} />
                  </div>
                </div>

                {/* Right topics */}
                <div className="relative z-10 flex flex-col items-start gap-2">
                  {node.rightTopics?.map((topic) => (
                    <TopicPill key={topic.id} topic={topic} />
                  ))}
                </div>
              </div>
            </Fragment>
          );
        })}

        {/* End cap */}
        <div className="relative z-10 text-center mt-4">
          <div className="inline-flex items-center gap-2 rounded-xl border border-moon-700 bg-moon-900/70 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-moon-500">
            <Lock className="h-3.5 w-3.5" /> Em breve
          </div>
        </div>

        {/* Progress */}
        <div className="relative z-10 mt-8 rounded-2xl border border-moon-700 bg-moon-900/80 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-moon-400">{completedCount} de {availableModules.length} módulos</p>
            </div>
            <div className="h-2.5 flex-1 rounded-full bg-moon-800">
              <div className="h-2.5 rounded-full bg-purple-400" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-5 text-xs text-moon-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-400" /> Concluído</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-amber-300" /> Atual</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-purple-400" /> Andamento</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-moon-500" /> Disponível</span>
        </div>
      </div>
    </div>
  );
}
