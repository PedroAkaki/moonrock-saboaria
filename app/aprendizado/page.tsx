"use client";

import { useState, useEffect } from "react";
import MainLearningOrbit from "@/components/MainLearningOrbit";
import Link from "next/link";
import { ArrowRight, Check, Play, Award, Sparkles, BarChart3 } from "lucide-react";
import learningModules from "@/data/learning-modules.json";
import { getProgress } from "@/lib/progress";
import {
  getLearningStats,
  getContinueNowAction,
  getAchievements,
  getClientProgress,
} from "@/lib/learning";

interface Module {
  id: number;
  slug: string;
  level: number;
  title: string;
  status: string;
}

export default function AprendizadoPage() {
  const modules = learningModules as Module[];
  const [progress, setProgress] = useState(getClientProgress());

  useEffect(() => {
    const update = () => {
      setProgress(getProgress());
    };
    update();
    window.addEventListener("moonrock-progress-updated", update);
    return () => window.removeEventListener("moonrock-progress-updated", update);
  }, []);

  const stats = getLearningStats(modules, progress);
  const continueAction = getContinueNowAction(modules, progress);
  const achievements = getAchievements(modules, progress);
  const earnedAchievements = achievements.filter((a) => a.earned);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white">🌙 MoonRock Estudo</h1>
        <p className="text-moon-400 mt-2">
          Sua trilha de aprendizado em saboaria artesanal
        </p>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 motion-enter-up">
        <div className="bg-moon-700/40 backdrop-blur rounded-xl p-3 text-center border border-moon-600">
          <div className="text-xl font-bold text-white">{stats.completed}</div>
          <div className="text-xs text-moon-400">Concluídos</div>
        </div>
        <div className="bg-moon-700/40 backdrop-blur rounded-xl p-3 text-center border border-moon-600">
          <div className="text-xl font-bold text-amber-300">{stats.inProgress}</div>
          <div className="text-xs text-moon-400">Em andamento</div>
        </div>
        <div className="bg-moon-700/40 backdrop-blur rounded-xl p-3 text-center border border-moon-600">
          <div className="text-xl font-bold text-moon-300">
            {stats.available + stats.locked}
          </div>
          <div className="text-xs text-moon-400">Na trilha</div>
        </div>
      </div>

      {/* Continue now card */}
      {continueAction && (
        <Link
          href={continueAction.href}
          className="group block bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all hover:-translate-y-0.5 motion-shimmer-border motion-enter-up delay-1"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Play className="w-6 h-6 text-white ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-moon-300 uppercase tracking-wider font-medium">
                Continuar agora
              </p>
              <p className="text-white font-semibold text-base mt-0.5">
                {continueAction.label}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-moon-300 shrink-0 mt-2 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      )}

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="bg-moon-700/30 backdrop-blur rounded-xl border border-moon-600 p-4 motion-enter-up delay-2">
          <h2 className="text-sm font-semibold text-moon-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" /> Conquistas
          </h2>
          <div className="flex flex-wrap gap-2">
            {earnedAchievements.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/10 text-white rounded-full border border-white/20"
              >
                <Sparkles className="w-3 h-3" /> {a.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning Orbit */}
      <section className="motion-enter-up delay-3">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-moon-300" /> Mapa da Jornada
        </h2>
        <MainLearningOrbit />
      </section>

      {/* Bottom: revisão completa */}
      {stats.completed > 0 && stats.inProgress === 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-700/30 rounded-xl px-5 py-3">
            <Check className="w-5 h-5" />
            Todos os módulos disponíveis foram concluídos!
          </div>
        </div>
      )}
    </div>
  );
}
