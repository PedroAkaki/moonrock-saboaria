"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import learningModules from "@/data/learning-modules.json";

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
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const modules = learningModules as Module[];
    let found = false;

    for (const m of modules) {
      if (m.status !== "available") break;
      const saved = localStorage.getItem(`moonrock-progress-${m.slug}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          const vals = Object.values(data).filter(Boolean).length;
          if (vals > 0) {
            setHasProgress(true);
          }
        } catch {}
      }
      const key = `moonrock-progress-${m.slug}`;
      const stored = localStorage.getItem(key);
      const checked = stored ? Object.values(JSON.parse(stored)).filter(Boolean).length : 0;

      // Get conclusion criteria length from the module
      const mod = modules.find((x) => x.slug === m.slug) as any;
      const total = mod?.conclusion_criteria?.length ?? 0;
      const isComplete = total > 0 && checked >= total;

      if (!isComplete) {
        setNextSlug(m.slug);
        setNextTitle(m.title);
        found = true;
        break;
      }
    }

    if (!found) {
      // All done - suggest review
      setNextSlug("roadmap");
      setNextTitle("revisar roadmap");
    }
  }, []);

  if (!nextSlug) return null;

  return (
    <Link
      href={`/roadmap${nextSlug === "roadmap" ? "" : `/${nextSlug}`}`}
      className="group block bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-moon-300 uppercase tracking-wider">
            {hasProgress ? "Continuar Estudo" : "Começar"}
          </p>
          <p className="text-white font-semibold text-sm">
            {nextSlug === "roadmap" ? "Revisar Roadmap" : nextTitle}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-moon-300 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
