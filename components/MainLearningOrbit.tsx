"use client";

import { useMemo } from "react";
import { FlaskConical, ShieldCheck, Beaker, Thermometer, Sparkles, Droplets } from "lucide-react";
import LearningOrbit, { OrbitNodeDef } from "./LearningOrbit";
import learningModules from "@/data/learning-modules.json";
import { useProgressOrEmpty } from "@/lib/use-progress";

const MODULE_ICONS: Record<number, React.ReactNode> = {
  1: <Droplets className="h-4 w-4" />,
  2: <Beaker className="h-4 w-4" />,
  3: <Thermometer className="h-4 w-4" />,
  4: <ShieldCheck className="h-4 w-4" />,
  5: <FlaskConical className="h-4 w-4" />,
  6: <FlaskConical className="h-4 w-4" />,
  7: <Droplets className="h-4 w-4" />,
  8: <Sparkles className="h-4 w-4" />,
};

const MODULE_LABELS: Record<number, { label: string; short: string }> = {
  1: { label: "Base Glicerinada", short: "Base" },
  2: { label: "Sabão de Óleo Usado", short: "Óleo usado" },
  3: { label: "Cold Process Básico", short: "CP básico" },
  4: { label: "Controle de Formulação", short: "Formulação" },
  5: { label: "Hot Process", short: "Hot Process" },
  6: { label: "Cold Process Avançado", short: "CP avançado" },
  7: { label: "Sabão Líquido KOH", short: "KOH" },
  8: { label: "Syndet / Autoral", short: "Autoral" },
};

export default function MainLearningOrbit() {
  const progress = useProgressOrEmpty();

  const modules = learningModules as { id: number; slug: string; level: number; title: string; status: string }[];
  const available = modules.filter((m) => m.status === "available");
  const completedCount = available.filter((m) => progress.modules[m.slug]?.status === "completed").length;
  const progressPercent = available.length > 0 ? Math.round((completedCount / available.length) * 100) : 0;

  const nodes: OrbitNodeDef[] = useMemo(() => {
    return modules.map((mod) => {
      const modProg = progress.modules[mod.slug];
      const isAvail = mod.status === "available";

      let status: OrbitNodeDef["status"];
      if (!isAvail) {
        status = "locked";
      } else if (modProg?.status === "completed") {
        status = "completed";
      } else if (modProg?.status === "in-progress" || modProg?.status === "not-started") {
        status = modProg?.status === "in-progress" ? "in-progress" : "not-started";
      } else {
        status = "not-started";
      }

      const labels = MODULE_LABELS[mod.id] ?? { label: mod.title, short: mod.title.slice(0, 12) };

      return {
        id: mod.slug,
        label: labels.label,
        shortLabel: labels.short,
        icon: MODULE_ICONS[mod.id] ?? <FlaskConical className="h-4 w-4" />,
        href: isAvail ? `/aprendizado/${mod.slug}` : undefined,
        status,
      };
    });
  }, [modules, progress]);

  return (
    <LearningOrbit
      centerLabel="Jornada MoonRock"
      centerSubLabel={`${modules.length} módulos`}
      centerIcon={<FlaskConical className="mb-1 h-5 w-5 text-amber-200" />}
      nodes={nodes}
      progressPercent={progressPercent}
      completedCount={completedCount}
      totalCount={available.length}
      totalLabel={`${modules.length} no total`}
    />
  );
}
