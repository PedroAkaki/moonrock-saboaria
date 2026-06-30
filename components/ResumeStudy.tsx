"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
}

export default function ResumeStudy() {
  const [nextSlug, setNextSlug] = useState<string | null>(null);
  const [nextTitle, setNextTitle] = useState<string | null>(null);

  useEffect(() => {
    const modules = learningModules as Module[];
    const p = getProgress();
    let found = false;

    // Try last visited module first
    if (p.lastModuleSlug) {
      const lastMod = modules.find((m) => m.slug === p.lastModuleSlug);
      if (lastMod && lastMod.status === "available") {
        const status = p.modules[p.lastModuleSlug]?.status;
        if (status !== "completed") {
          setNextSlug(p.lastModuleSlug);
          setNextTitle(lastMod.title);
          found = true;
        }
      }
    }

    // Fallback: find first incomplete
    if (!found) {
      for (const m of modules) {
        if (m.status !== "available") break;
        const status = p.modules[m.slug]?.status;
        if (status !== "completed") {
          setNextSlug(m.slug);
          setNextTitle(m.title);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      setNextSlug("aprendizado");
      setNextTitle("Revisar Estudo");
    }
  }, []);

  if (!nextSlug) return null;

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
