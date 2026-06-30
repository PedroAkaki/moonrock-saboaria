interface StudyCardProps {
  title: string;
  definition: string;
  whyItMatters: string;
  commonMistake: string;
  practicalSignal: string;
}

export default function StudyCard({
  title,
  definition,
  whyItMatters,
  commonMistake,
  practicalSignal,
}: StudyCardProps) {
  return (
    <div className="bg-moon-700/30 border border-moon-600 rounded-xl p-5">
      <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-white rounded-full" />
        {title}
      </h4>

      <div className="space-y-3 text-sm">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-moon-500 mb-0.5">
            Definição
          </span>
          <p className="text-moon-200 leading-relaxed">{definition}</p>
        </div>

        <div>
          <span className="block text-[11px] uppercase tracking-wider text-moon-500 mb-0.5">
            Por que importa
          </span>
          <p className="text-moon-200 leading-relaxed">{whyItMatters}</p>
        </div>

        <div className="bg-red-900/20 border-l-2 border-red-500/50 pl-3 py-2 rounded-r">
          <span className="block text-[11px] uppercase tracking-wider text-red-400 mb-0.5">
            Erro Comum
          </span>
          <p className="text-red-200/80 text-sm">{commonMistake}</p>
        </div>

        <div>
          <span className="block text-[11px] uppercase tracking-wider text-moon-500 mb-0.5">
            Na Prática
          </span>
          <p className="text-moon-400 italic text-sm leading-relaxed">{practicalSignal}</p>
        </div>
      </div>
    </div>
  );
}
