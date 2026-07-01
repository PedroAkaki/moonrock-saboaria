"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import oilsData from "@/data/oils.json";
import GlossaryTerm from "@/components/GlossaryTerm";

const TYPE_NAMES: Record<string, string> = {
  "oleo-liquido": "Óleo Líquido",
  "gordura-solida": "Gordura Sólida",
  "manteiga": "Manteiga",
  "cera-liquida": "Cera Líquida",
  "gordura-animal": "Gordura Animal",
};

const STABILITY_NAMES: Record<string, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
  "muito-baixa": "Muito Baixa",
};

const AVAIL_NAMES: Record<string, string> = {
  alta: "Fácil",
  media: "Média",
  dificil: "Difícil",
  "muito-baixa": "Importação",
};

const DOS_LABELS: Record<string, { label: string; color: string }> = {
  baixo: { label: "Baixo", color: "text-green-300 bg-green-900/30 border-green-700" },
  medio: { label: "Médio", color: "text-amber-300 bg-amber-900/30 border-amber-700" },
  alto: { label: "Alto", color: "text-red-300 bg-red-900/30 border-red-700" },
};

type FilterKey = "type" | "stability" | "availability" | "dosRisk";

export default function OleosPage() {
  const oils = oilsData.oils as (typeof oilsData.oils[0] & {
    dosRisk?: string; formulaRole?: string; substitutionNotes?: string;
    beginnerNote?: string; recommendedUse?: string;
  })[];
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    type: "", stability: "", availability: "", dosRisk: "",
  });

  const unique = <T,>(arr: T[]): T[] => [...new Set(arr)];

  const typeOptions = unique(oils.map((o) => o.type)).sort();
  const stabilityOptions = unique(oils.map((o) => o.stability)).sort(
    (a, b) => ["alta", "media", "baixa", "muito-baixa"].indexOf(a) - ["alta", "media", "baixa", "muito-baixa"].indexOf(b)
  );
  const availOptions = unique(oils.map((o) => o.availability)).sort(
    (a, b) => ["alta", "media", "dificil", "muito-baixa"].indexOf(a) - ["alta", "media", "dificil", "muito-baixa"].indexOf(b)
  );
  const dosOptions = unique(oils.map((o) => o.dosRisk ?? "")).filter(Boolean).sort();

  const filtered = useMemo(() => {
    return oils.filter((o) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const match =
          o.name.toLowerCase().includes(q) ||
          o.inci.toLowerCase().includes(q) ||
          o.notes.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Filters
      if (filters.type && o.type !== filters.type) return false;
      if (filters.stability && o.stability !== filters.stability) return false;
      if (filters.availability && o.availability !== filters.availability) return false;
      if (filters.dosRisk && (o.dosRisk ?? "") !== filters.dosRisk) return false;
      return true;
    });
  }, [search, filters, oils]);

  const setFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAll = () => {
    setSearch("");
    setFilters({ type: "", stability: "", availability: "", dosRisk: "" });
  };

  const activeFilters = Object.values(filters).filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">🫒 Biblioteca de Óleos</h1>
          <p className="text-moon-400 mt-1">
            {oils.length} óleos com valores de <GlossaryTerm term="saponificação">saponificação</GlossaryTerm>, função prática e risco de DOS
          </p>
        </div>
        <Link href="/calculadora" className="bg-white hover:bg-moon-200 text-moon-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 text-center">
          → Calculadora
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 p-4 space-y-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, INCI ou descrição..."
          className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2.5 text-sm text-white placeholder-moon-400"
        />

        {/* Filter chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Tipo */}
          <select value={filters.type} onChange={(e) => setFilter("type", e.target.value)}
            className="bg-moon-800 border border-moon-500 rounded-lg px-2 py-2 text-xs text-white appearance-none">
            <option value="">Tipo: todos</option>
            {typeOptions.map((t) => (<option key={t} value={t}>{TYPE_NAMES[t] ?? t}</option>))}
          </select>

          {/* Estabilidade */}
          <select value={filters.stability} onChange={(e) => setFilter("stability", e.target.value)}
            className="bg-moon-800 border border-moon-500 rounded-lg px-2 py-2 text-xs text-white appearance-none">
            <option value="">Estabilidade: todas</option>
            {stabilityOptions.map((s) => (<option key={s} value={s}>{STABILITY_NAMES[s] ?? s}</option>))}
          </select>

          {/* Disponibilidade */}
          <select value={filters.availability} onChange={(e) => setFilter("availability", e.target.value)}
            className="bg-moon-800 border border-moon-500 rounded-lg px-2 py-2 text-xs text-white appearance-none">
            <option value="">Disponibilidade: todas</option>
            {availOptions.map((a) => (<option key={a} value={a}>{AVAIL_NAMES[a] ?? a}</option>))}
          </select>

          {/* Risco DOS */}
          <select value={filters.dosRisk} onChange={(e) => setFilter("dosRisk", e.target.value)}
            className="bg-moon-800 border border-moon-500 rounded-lg px-2 py-2 text-xs text-white appearance-none">
            <option value="">Risco DOS: todos</option>
            {dosOptions.map((d) => (<option key={d} value={d}>{DOS_LABELS[d]?.label ?? d}</option>))}
          </select>
        </div>

        {/* Clear + count */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-moon-400">{filtered.length} de {oils.length} óleos</span>
          {activeFilters > 0 && (
            <button onClick={clearAll} className="text-moon-300 underline hover:text-white transition-colors">
              Limpar filtros ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Oil cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((oil) => {
          const dos = DOS_LABELS[oil.dosRisk ?? ""] ?? { label: "—", color: "text-moon-400 bg-moon-800 border-moon-600" };
          const stabilityColor = oil.stability === "alta" ? "text-green-400" :
            oil.stability === "media" ? "text-yellow-400" : "text-red-400";
          const availColor = oil.availability === "alta" ? "text-green-400" :
            oil.availability === "media" ? "text-yellow-400" : "text-red-400";

          return (
            <div key={oil.id} className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-white truncate">{oil.name}</h2>
                  <p className="text-xs text-moon-500 italic truncate">{oil.inci}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stabilityColor} bg-moon-800`}>
                    {STABILITY_NAMES[oil.stability] ?? oil.stability}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dos.color}`}>
                    DOS: {dos.label}
                  </span>
                </div>
              </div>

              {/* Function + Beginner note */}
              {oil.formulaRole && (
                <p className="text-xs text-moon-200 leading-relaxed">🧪 <span className="text-moon-300">{oil.formulaRole}</span></p>
              )}
              {oil.beginnerNote && (
                <p className="text-xs text-purple-300/80 leading-relaxed">💡 {oil.beginnerNote}</p>
              )}

              {/* Substitutions */}
              {oil.substitutionNotes && (
                <p className="text-xs text-moon-400 italic leading-relaxed">↔ {oil.substitutionNotes}</p>
              )}

              {/* SAP grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-moon-800 rounded p-2 text-center border border-moon-600">
                  <div className="font-bold text-moon-100">{oil.sapNaOH}</div>
                  <div className="text-xs text-moon-400"><GlossaryTerm term="saponificação">SAP NaOH</GlossaryTerm></div>
                </div>
                <div className="bg-moon-800 rounded p-2 text-center border border-moon-600">
                  <div className="font-bold text-moon-100">{oil.sapKOH}</div>
                  <div className="text-xs text-moon-400">SAP KOH</div>
                </div>
              </div>

              {/* Property bars */}
              <div className="space-y-1">
                {[
                  { label: "Dureza", value: oil.hardness, color: "bg-blue-500" },
                  { label: "Limpeza", value: oil.cleansing, color: "bg-green-500" },
                  { label: "Condicionamento", value: oil.conditioning, color: "bg-purple-500" },
                  { label: "Espuma", value: oil.bubbly, color: "bg-amber-500" },
                  { label: "Cremosidade", value: oil.creamy, color: "bg-pink-500" },
                ].map((prop) => (
                  <div key={prop.label} className="flex items-center gap-2">
                    <span className="text-xs text-moon-400 w-28">{prop.label}</span>
                    <div className="flex-1 h-2 bg-moon-800 rounded-full overflow-hidden">
                      <div className={`h-full ${prop.color} rounded-full transition-all`}
                        style={{ width: `${((prop.value ?? 0) / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs text-moon-500 w-4 text-right">{prop.value ?? 0}</span>
                  </div>
                ))}
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-moon-800 rounded-full px-2 py-1 text-moon-400">INS: {oil.ins}</span>
                <span className={`${availColor} bg-moon-800 rounded-full px-2 py-1`}>
                  {AVAIL_NAMES[oil.availability] ?? oil.availability}
                </span>
                <span className="bg-moon-800 rounded-full px-2 py-1 text-moon-400">Máx: {oil.maxPercent}%</span>
                <span className="bg-moon-800 rounded-full px-2 py-1 text-moon-400">
                  {TYPE_NAMES[oil.type] ?? oil.type}
                </span>
              </div>

              {/* Notes */}
              <p className="text-sm text-moon-400 italic leading-relaxed">{oil.notes}</p>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-moon-400">
          <p className="text-lg">Nenhum óleo encontrado</p>
          <button onClick={clearAll} className="mt-2 text-sm text-moon-300 underline hover:text-white transition-colors">
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
