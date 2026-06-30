import { VisualRoadmap } from "@/components/VisualRoadmap";

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">🗺️ Trilha de Aprendizado</h1>
        <p className="text-moon-400 mt-2">
          8 níveis — do laboratório à bancada, com rigor técnico e passo a passo prático
        </p>
      </header>

      <VisualRoadmap />
    </div>
  );
}
