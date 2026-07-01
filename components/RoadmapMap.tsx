"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { Check, Lock, Play, ArrowRight, ShieldCheck, FlaskConical, BookOpen, Sparkles, ChefHat, AlertTriangle, Lightbulb, Gavel } from "lucide-react";
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

function statusClasses(status: RoadmapStatus): string {
  switch (status) {
    case "completed": return "border-green-500/50 bg-green-900/10 text-green-200 ring-1 ring-green-500/30";
    case "current": return "border-amber-300 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(252,211,77,0.25)] ring-1 ring-amber-300/40";
    case "in-progress": return "border-purple-500/60 bg-purple-900/20 text-purple-100 ring-1 ring-purple-500/20";
    case "locked": return "border-moon-700 bg-moon-900/50 text-moon-500 ring-0";
    default: return "border-moon-600 bg-moon-800/70 text-moon-200 ring-1 ring-moon-500/10";
  }
}

const TOPIC_CLUSTER: Record<string, { icon: React.ReactNode; label: string; wrapper: string }> = {
  concept: { icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Conceito", wrapper: "border-moon-600 bg-moon-800/60" },
  safety: { icon: <AlertTriangle className="h-3.5 w-3.5" />, label: "Segurança", wrapper: "border-red-700/50 bg-red-900/15" },
  tool: { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Ferramenta", wrapper: "border-blue-700/50 bg-blue-900/15" },
  recipe: { icon: <ChefHat className="h-3.5 w-3.5" />, label: "Receita", wrapper: "border-green-700/50 bg-green-900/15" },
  checklist: { icon: <Gavel className="h-3.5 w-3.5" />, label: "Checklist", wrapper: "border-purple-700/50 bg-purple-900/15" },
};

function TopicPill({ topic }: { topic: RoadmapTopic }) {
  const cluster = TOPIC_CLUSTER[topic.type] ?? TOPIC_CLUSTER.concept;
  const content = (
    <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs leading-tight transition-colors ${cluster.wrapper} ${topic.href ? "hover:brightness-125 cursor-pointer" : ""}`}>
      {cluster.icon}
      <span>{topic.title}</span>
      {topic.importance === "secondary" && <span className="text-[9px] text-moon-500">(extra)</span>}
    </div>
  );
  if (topic.href) return <Link href={topic.href}>{content}</Link>;
  return <div>{content}</div>;
}

function TopicGroup({ topics, position }: { topics: RoadmapTopic[]; position: "left" | "right" }) {
  const groups: Record<string, RoadmapTopic[]> = {};
  for (const t of topics) {
    if (!groups[t.type]) groups[t.type] = [];
    groups[t.type].push(t);
  }
  const order = ["concept", "safety", "tool", "recipe", "checklist"];
  return (
    <div className={`flex flex-col gap-3 ${position === "left" ? "items-end" : "items-start"}`}>
      {order.map((type) => {
        const items = groups[type];
        if (!items?.length) return null;
        const cluster = TOPIC_CLUSTER[type] ?? TOPIC_CLUSTER.concept;
        return (
          <div key={type} className={`flex flex-col gap-1.5 ${position === "left" ? "items-end" : "items-start"}`}>
            <span className={`text-[9px] font-medium uppercase tracking-wider text-moon-500 ${position === "left" ? "text-right" : "text-left"}`}>
              {cluster.icon} {cluster.label}
            </span>
            {items.map((topic) => (
              <TopicPill key={topic.id} topic={topic} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function CenterNode({ node, status }: { node: RoadmapNode; status: RoadmapStatus }) {
  const badge = typeBadge(node.type);
  const isLocked = status === "locked";
  const content = (
    <div className={`rounded-2xl border px-5 py-3.5 text-center transition-all relative ${statusClasses(status)} ${isLocked ? "opacity-70" : ""}`}>
      {isLocked && (
        <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1 rounded-full bg-moon-700 border border-moon-600 px-2 py-0.5 text-[9px] font-medium text-moon-400 shadow-sm">
          <Lock className="h-3 w-3" /> Em breve
        </div>
      )}
      <div className="flex items-center justify-center gap-2 mb-1">
        {status === "completed" ? <Check className="h-5 w-5 text-green-300" /> : isLocked ? <Lock className="h-5 w-5 text-moon-600" /> : typeIcon(node.type)}
        <span className={`text-sm font-bold leading-tight ${isLocked ? "text-moon-500" : "text-white"}`}>{node.title}</span>
      </div>
      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
    </div>
  );
  if (node.href && !isLocked) return <Link href={node.href} className="block hover:-translate-y-0.5 transition-transform">{content}</Link>;
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
      <div className="relative mx-auto min-w-[880px] max-w-[1024px] px-8 py-4">
        {/* Continue CTA */}
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

        {/* Section header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300/70">Trilha Principal</span>
        </div>

        {/* Vertical backbone with gradient fade */}
        <div className="absolute left-1/2 top-24 bottom-32 w-0.5 -translate-x-1/2 rounded-full"
          style={{
            background: "linear-gradient(to bottom, rgba(252,211,77,0.6), rgba(252,211,77,0.3), rgba(252,211,77,0.1))",
            boxShadow: "0 0 20px rgba(252,211,77,0.15)",
          }}
        />

        {roadmapNodes.map((node, idx) => {
          const status = getSlugStatus(node, progress, modules);
          const showSection = node.section && node.section !== lastSection;
          if (node.section) lastSection = node.section;
          const isLocked = status === "locked";

          return (
            <Fragment key={node.id}>
              {/* Section divider */}
              {showSection && (
                <div className="relative z-10 flex items-center gap-4 my-6">
                  <div className="flex-1 h-px" style={{
                    background: "linear-gradient(to right, transparent, rgba(120,113,98,0.5), transparent)",
                  }} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-moon-400 shrink-0 px-2">{node.section}</span>
                  <div className="flex-1 h-px" style={{
                    background: "linear-gradient(to right, transparent, rgba(120,113,98,0.5), transparent)",
                  }} />
                </div>
              )}

              {/* Row */}
              <div className={`relative grid grid-cols-[260px_1fr_260px] gap-6 items-center my-3 ${isLocked ? "opacity-60" : ""}`}>
                {/* Horizontal dashed connector */}
                <div className="absolute left-[270px] right-[270px] top-1/2 border-t border-dashed border-moon-500/30 -translate-y-1/2 z-0" />

                {/* Left side topics */}
                <div className="relative z-10">
                  {node.leftTopics && node.leftTopics.length > 0 && (
                    <TopicGroup topics={node.leftTopics} position="left" />
                  )}
                </div>

                {/* Center node */}
                <div className="relative z-10 flex flex-col items-center">
                  {isLocked ? (
                    <CenterNode node={node} status={status} />
                  ) : (
                    <div className="bg-moon-800 rounded-2xl px-1 py-0.5">
                      <CenterNode node={node} status={status} />
                    </div>
                  )}
                </div>

                {/* Right side topics */}
                <div className="relative z-10">
                  {node.rightTopics && node.rightTopics.length > 0 && (
                    <TopicGroup topics={node.rightTopics} position="right" />
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}

        {/* End cap */}
        <div className="relative z-10 text-center mt-6">
          <div className="inline-flex items-center gap-2 rounded-xl border border-moon-700 bg-moon-900/70 px-5 py-3 text-xs font-bold uppercase tracking-wider text-moon-500">
            <Lock className="h-3.5 w-3.5" /> Mais módulos em breve
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-8 rounded-2xl border border-moon-700 bg-moon-900/80 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
              <p className="text-3xl font-bold text-white">{progressPercent}%</p>
              <p className="text-xs text-moon-400">{completedCount} de {availableModules.length} módulos</p>
            </div>
            <div className="h-2.5 flex-1 rounded-full bg-moon-800 overflow-hidden">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-5 text-xs text-moon-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-400" /> Concluído</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border-2 border-amber-300" /> Atual</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-purple-400" /> Andamento</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-moon-500" /> Disponível</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3 text-moon-600" /> Em breve</span>
        </div>
      </div>
    </div>
  );
}
