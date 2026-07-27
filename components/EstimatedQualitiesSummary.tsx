import type { EstimatedQualities } from "@/lib/diario";

interface EstimatedQualitiesSummaryProps {
  qualities: EstimatedQualities;
  /** Nota registrada após a cura, quando já existir. */
  rating?: number;
}

const QUALITY_LABELS: { key: keyof EstimatedQualities; label: string; color: string }[] = [
  { key: "hardness", label: "Dureza", color: "bg-blue-500" },
  { key: "cleansing", label: "Limpeza", color: "bg-green-500" },
  { key: "conditioning", label: "Condicionamento", color: "bg-purple-500" },
  { key: "bubbly", label: "Espuma", color: "bg-amber-500" },
  { key: "creamy", label: "Cremosidade", color: "bg-pink-500" },
];

/**
 * Mostra o que a Calculadora estimava quando o lote foi criado. Depois da
 * avaliação pós-cura, vira base de comparação entre expectativa e resultado.
 */
export default function EstimatedQualitiesSummary({ qualities, rating }: EstimatedQualitiesSummaryProps) {
  return (
    <div className="rounded-lg border border-moon-600 bg-moon-800/40 px-3 py-2">
      <p className="text-xs font-semibold text-moon-300">
        Estimativa da calculadora <span className="font-normal text-moon-500">· escala 0–5 no momento do cálculo</span>
      </p>
      <div className="mt-2 space-y-1">
        {QUALITY_LABELS.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-28 text-[11px] text-moon-400">{label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-moon-900">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${(qualities[key] / 5) * 100}%` }} />
            </div>
            <span className="w-7 text-right font-mono text-[11px] text-moon-300">{qualities[key].toFixed(1)}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-moon-500">
        {rating === undefined
          ? "Depois da cura, compare estas expectativas com o que a barra realmente entregou."
          : "Compare com a avaliação registrada: onde a barra correspondeu à estimativa e onde não."}
      </p>
    </div>
  );
}
