"use client";

import { useState, useEffect } from "react";
import MainLearningOrbit from "@/components/MainLearningOrbit";
import Link from "next/link";
import { ArrowRight, Check, Play, Award, Sparkles, ArrowLeft } from "lucide-react";
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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Voltar */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-moon-400 hover:text-white mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Início
      </Link>

      {/* Header compacto */}
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-bold text-white">🌙 MoonRock Estudo</h1>
        <p className="text-sm text-moon-400">
          Sua jornada de aprendizado em saboaria artesanal
        </p>
      </header>

      {/* Hero: Learning Orbit */}
      <section className="motion-enter-up">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-amber-400/70 text-center mb-3">Mapa da Jornada</h2>
        <MainLearningOrbit />
      </section>

      {/* Continue CTA */}
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

      {/* Stats compactas */}
      <div className="motion-enter-up delay-2">
        <div className="flex items-center justify-center gap-6 text-sm text-moon-400">
          <span><strong className="text-white">{stats.completed}</strong> concluídos</span>
          <span className="text-moon-600">·</span>
          <span><strong className="text-amber-300">{stats.inProgress}</strong> em andamento</span>
          <span className="text-moon-600">·</span>
          <span><strong className="text-moon-300">{stats.available + stats.locked}</strong> na trilha</span>
        </div>
      </div>

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="bg-moon-700/30 backdrop-blur rounded-xl border border-moon-600 p-4 motion-enter-up delay-3">
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

      {/* Bottom: conclusão completa */}
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
