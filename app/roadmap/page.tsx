import type { Metadata } from "next";
import RoadmapMap from "@/components/RoadmapMap";

export const metadata: Metadata = {
  title: "Mapa Completo — MoonRock Saboaria",
  description:
    "Visão global da sua jornada em saboaria artesanal: 8 níveis, conexões entre conceitos, receitas e ferramentas.",
};

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">🗺️ Mapa Completo da Jornada</h1>
        <p className="text-moon-400 mt-2 max-w-xl mx-auto">
          Visão panorâmica de tudo que você vai aprender — como os conceitos,
          receitas e ferramentas se conectam
        </p>
      </header>
      <RoadmapMap />
    </div>
  );
}
