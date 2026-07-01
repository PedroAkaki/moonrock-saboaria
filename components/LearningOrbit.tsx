"use client";

import { Check, Circle } from "lucide-react";
import { ReactNode } from "react";

export type OrbitStatus = "completed" | "in-progress" | "not-started" | "locked";

export interface OrbitNodeDef {
  id: string;
  label: string;
  shortLabel?: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  status: OrbitStatus;
}

interface LearningOrbitProps {
  centerLabel: string;
  centerSubLabel?: string;
  centerIcon?: ReactNode;
  nodes: OrbitNodeDef[];
  onNodeClick?: (node: OrbitNodeDef) => void;
  activeNodeId?: string | null;
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  totalLabel?: string;
  embedded?: boolean;
}

const STATUS_CLASSES: Record<OrbitStatus, string> = {
  completed: "border-green-400/60 bg-green-500/30 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.25)]",
  "in-progress": "border-purple-400/70 bg-purple-500/30 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-purple-400/30",
  "not-started": "border-moon-400/50 bg-moon-900/70 text-moon-100",
  locked: "border-moon-700 bg-moon-900/50 text-moon-500 opacity-60",
};

const DOT_CLASSES: Record<OrbitStatus, string> = {
  completed: "bg-green-400 border-green-400",
  "in-progress": "bg-purple-400 border-purple-400",
  "not-started": "border-moon-400/50 bg-transparent",
  locked: "border-moon-700 bg-moon-800/60",
};

export default function LearningOrbit({
  centerLabel,
  centerSubLabel,
  centerIcon,
  nodes,
  onNodeClick,
  activeNodeId,
  progressPercent,
  completedCount,
  totalCount,
  totalLabel,
  embedded = false,
}: LearningOrbitProps) {
  const ringRadius = embedded ? 125 : 132;
  const COUNT = nodes.length;

  const orbitContent = (
    <>
      {/* Orbit area */}
      <div className={`relative mx-auto ${embedded ? "h-[300px] sm:h-[350px]" : "h-[320px] sm:h-[380px]"} max-w-[430px] overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,149,48,0.14),transparent_34%),radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

        {/* Rings */}
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-moon-500/30" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-moon-500/25" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-moon-500/20" />

        {/* Center planet */}
        <div className="absolute left-1/2 top-1/2 z-10 flex aspect-square w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-amber-300/60 bg-moon-800 text-center shadow-[0_0_44px_rgba(191,149,48,0.35)] motion-moon-pulse">
          {centerIcon ?? <Circle className="mb-1 h-5 w-5 text-amber-200" />}
          <span className="text-xs font-semibold text-white leading-tight px-1">{centerLabel}</span>
          {centerSubLabel && (
            <span className="text-[9px] text-moon-400 mt-0.5">{centerSubLabel}</span>
          )}
        </div>

        {/* Orbiting nodes */}
        {nodes.map((node, index) => {
          const angle = (index / COUNT) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * ringRadius;
          const y = Math.sin(angle) * ringRadius;
          const isLocked = node.status === "locked";
          const isActive = activeNodeId === node.id;

          const content = (
            <div
              className={`flex aspect-square w-16 flex-col items-center justify-center rounded-full border text-center transition-transform sm:w-20 ${STATUS_CLASSES[node.status]} ${isActive ? "scale-110 ring-2 ring-amber-300/50" : "hover:scale-105"}`}
            >
              <span className="mb-0.5">
                {node.status === "completed" ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : node.icon ?? <Circle className="h-4 w-4 sm:h-5 sm:w-5" />}
              </span>
              <span className="max-w-[4.5rem] text-[10px] font-semibold leading-tight">
                {node.shortLabel ?? node.label}
              </span>
            </div>
          );

          return (
            <div
              key={node.id}
              className="absolute left-1/2 top-1/2 z-20"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {node.href && !isLocked ? (
                <a
                  href={node.href}
                  onClick={(e) => {
                    if (onNodeClick) {
                      e.preventDefault();
                      onNodeClick(node);
                    }
                  }}
                  className="block -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 rounded-full active:scale-95 transition-transform"
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onNodeClick?.(node)}
                  className="-translate-x-1/2 -translate-y-1/2 cursor-pointer active:scale-95 transition-transform"
                  aria-label={node.label}
                >
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom panel */}
      <div className={`border-t border-moon-700 bg-moon-800/60 ${embedded ? "p-3" : "p-4"}`}>
        {/* Progress */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-moon-300">Progresso</p>
            <div className="mt-2 h-2 rounded-full bg-moon-700">
              <div className="h-2 rounded-full bg-amber-300 transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-moon-500">
              <span className="text-green-400">{completedCount}</span> de {totalCount} concluídos.
              {totalLabel && <span className="ml-1 text-moon-500">· {totalLabel}</span>}
            </p>
          </div>
          <div className={`font-bold text-white ${embedded ? "text-3xl" : "text-4xl"}`}>{progressPercent}%</div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-moon-400">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-500" /> Concluído</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-purple-500" /> Andamento</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-moon-300" /> Disponível</span>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return orbitContent;
  }

  return (
    <section className="mb-8 rounded-2xl border border-moon-600 bg-moon-900/70 overflow-hidden shadow-2xl shadow-black/20">
      {orbitContent}
    </section>
  );
}
