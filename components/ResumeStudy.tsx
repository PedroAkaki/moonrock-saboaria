"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import type { AppProgress } from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
}

/** Módulo disponível mais adiantado que ainda não foi concluído. */
function pickNextModule(p: AppProgress): { slug: string; title: string } {
  const modules = learningModules as Module[];

  // O último módulo visitado tem prioridade, se ainda estiver em aberto.
  if (p.lastModuleSlug) {
    const lastMod = modules.find((m) => m.slug === p.lastModuleSlug);
    if (lastMod && lastMod.status === "available" && p.modules[p.lastModuleSlug]?.status !== "completed") {
      return { slug: p.lastModuleSlug, title: lastMod.title };
    }
  }

  for (const m of modules) {
    if (m.status !== "available") break;
    if (p.modules[m.slug]?.status !== "completed") {
      return { slug: m.slug, title: m.title };
    }
  }

  return { slug: "aprendizado", title: "Revisar Estudo" };
}

export default function ResumeStudy() {
  const progress = useProgress();
  if (!progress) return null;

  const { slug: nextSlug, title: nextTitle } = pickNextModule(progress);

  return (
    <Link
      href={`/aprendizado${nextSlug === "aprendizado" ? "" : `/${nextSlug}`}`}
      className="group block bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-moon-300 uppercase tracking-wider">
            {nextSlug === "aprendizado" ? "Revisar" : "Continuar Estudo"}
          </p>
          <p className="text-white font-semibold text-sm">
            {nextSlug === "aprendizado" ? "Revisar Estudo" : nextTitle}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-moon-300 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
