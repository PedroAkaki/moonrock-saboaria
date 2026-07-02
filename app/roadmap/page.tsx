import RoadmapMap from "@/components/RoadmapMap";
import Link from "next/link";
import { ArrowLeft, Check, Circle } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <header className="mx-auto mb-4 max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-moon-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Início
        </Link>

        <h1 className="text-3xl font-bold text-white">Roadmap de Aprendizado</h1>
        <p className="mt-2 text-sm leading-relaxed text-moon-400">
          Seu caminho completo para dominar a arte da saboaria artesanal.
        </p>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-3 rounded-2xl border border-moon-700 bg-moon-900/70 p-3 text-xs text-moon-300">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 rounded-full border border-green-400 text-green-300" /> Concluído
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full border-2 border-amber-300" /> Atual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full border-2 border-purple-400" /> Em andamento
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Circle className="h-4 w-4 text-moon-500" /> Não iniciado
          </span>
        </div>

        <p className="mt-3 text-xs text-moon-500 md:hidden">
          Role para explorar a trilha completa.
        </p>
        <p className="mt-3 text-xs text-moon-500 hidden md:block">
          Arraste horizontalmente para explorar o mapa completo.
        </p>
      </header>

      <RoadmapMap />
    </div>
  );
}
