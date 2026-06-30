interface QuickReviewBoxProps {
  points: string[];
}

export default function QuickReviewBox({ points }: QuickReviewBoxProps) {
  return (
    <div className="bg-moon-700/30 border border-moon-600 rounded-xl p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-moon-300 mb-4">
        ⚡ Revisão Rápida
      </h3>
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-moon-200">
            <span className="text-moon-500 mt-0.5 shrink-0">•</span>
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
