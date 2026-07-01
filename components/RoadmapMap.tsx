"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { Check, Lock, Play, ArrowRight, Moon, AlertTriangle } from "lucide-react";
import { roadmapNodes, RoadmapNode, RoadmapTopic } from "@/data/roadmap-nodes";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";
import { getContinueNowAction, getClientProgress } from "@/lib/learning";

type RoadmapStatus = "completed" | "current" | "in-progress" | "not-started" | "locked";

function getSlugStatus(slug: string, progress: ReturnType<typeof getProgress>, modules: { slug: string; status: string }[]): RoadmapStatus {
  const mod = modules.find((m) => m.slug === slug);
  const saved = progress.modules[slug]?.status;
  if (!mod || mod.status !== "available") return "locked";
  if (saved === "completed") return "completed";
  if (saved === "in-progress") return "in-progress";
  const firstIncomplete = modules.find((m) => m.status === "available" && progress.modules[m.slug]?.status !== "completed");
  if (firstIncomplete?.slug === slug) return "current";
  return "not-started";
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

function TopicPill({ topic, status }: { topic: RoadmapTopic; status: RoadmapStatus }) {
  const content = (
    <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] leading-tight transition-colors ${statusClasses(status)} ${topic.href ? "hover:brightness-125" : ""}`}>
      {status === "locked" && <Lock className="h-3 w-3 shrink-0" />}
      {topic.title}
    </div>
  );
  if (topic.href) return <Link href={topic.href}>{content}</Link>;
  return <div>{content}</div>;
}

function CenterNode({ node, status }: { node: RoadmapNode; status: RoadmapStatus }) {
  const content = (
    <div className={`rounded-xl border px-4 py-3 text-center transition-all ${statusClasses(status)}`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        {status === "completed" ? <Check className="h-4 w-4 text-green-300" /> : status === "locked" ? <Lock className="h-4 w-4 text-moon-500" /> : <span className="h-4 w-4 rounded-full border-2 border-current" />}
        <span className="text-xs font-bold leading-tight text-white">{node.title}</span>
      </div>
    </div>
  );
  if (node.href && status !== "locked") return <Link href={node.href} className="block hover:-translate-y-0.5 transition-transform">{content}</Link>;
  return content;
}

function BackboneLine() {
  return <div className="mx-auto w-0.5 h-6 rounded-full bg-amber-300/60 shadow-[0_0_12px_rgba(252,211,77,0.3)]" />;
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

  // Group nodes by section for section labels
  let lastSection = "";

  // Stats
  const availableModules = modules.filter((m) => m.status === "available");
  const completedCount = availableModules.filter((m) => progress.modules[m.slug]?.status === "completed").length;
  const progressPercent = availableModules.length > 0 ? Math.round((completedCount / availableModules.length) * 100) : 0;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="relative mx-auto min-w-[780px] max-w-[860px] px-4 py-6">
        {/* CTA */}
        {continueAction && continueAction.slug !== "aprendizado" && (
          <Link href={continueAction.href}
            className="group mb-6 flex items-center gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 hover:bg-amber-300/20 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300/20">
              <Play className="h-4 w-4 text-amber-200 ml-0.5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-amber-200/80 uppercase tracking-wider font-medium">Continuar agora</p>
              <p className="text-sm font-semibold text-white">{continueAction.label}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-moon-900/80 px-5 py-2.5 shadow-[0_0_24px_rgba(252,211,77,0.15)]">
            <Moon className="h-5 w-5 text-amber-200" />
            <span className="text-base font-bold tracking-wider text-amber-200">SABOARIA ARTESANAL</span>
          </div>
        </div>

        <BackboneLine />

        {/* Nodes */}
        {roadmapNodes.map((node, idx) => {
          const status = getSlugStatus(node.slug, progress, modules);
          const showSection = node.section && node.section !== lastSection;
          if (node.section) lastSection = node.section;

          return (
            <Fragment key={node.slug}>
              {/* Section label */}
              {showSection && (
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-moon-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-400 shrink-0">{node.section}</span>
                  <div className="flex-1 h-px bg-moon-600" />
                </div>
              )}

              {/* Row: left topics | center node | right topics */}
              <div className="grid grid-cols-[240px_1fr_240px] gap-4 items-center my-2">
                {/* Left topics */}
                <div className="flex flex-col items-end gap-1.5">
                  {node.leftTopics?.map((topic) => (
                    <TopicPill key={topic.id} topic={topic} status={status} />
                  ))}
                </div>

                {/* Center node */}
                <div className="flex flex-col items-center">
                  <CenterNode node={node} status={status} />
                </div>

                {/* Right topics */}
                <div className="flex flex-col items-start gap-1.5">
                  {node.rightTopics?.map((topic) => (
                    <TopicPill key={topic.id} topic={topic} status={status} />
                  ))}
                </div>
              </div>

              {/* Backbone segment */}
              {idx < roadmapNodes.length - 1 && <BackboneLine />}
            </Fragment>
          );
        })}

        <BackboneLine />
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-moon-700 bg-moon-900/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-moon-500">
            <Lock className="h-3 w-3" /> Em breve
          </div>
        </div>

        {/* Progress */}
        <div className="mt-8 rounded-2xl border border-moon-700 bg-moon-900/80 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-white">{progressPercent}%</p>
              <p className="text-[10px] text-moon-400">{completedCount} de {availableModules.length} módulos</p>
            </div>
            <div className="h-2 flex-1 rounded-full bg-moon-800">
              <div className="h-2 rounded-full bg-purple-400" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] text-moon-500">
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-green-400" /> Concluído</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border-2 border-amber-300" /> Atual</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Andamento</span>
          <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-moon-500" /> Disponível</span>
        </div>
      </div>
    </div>
  );
}
