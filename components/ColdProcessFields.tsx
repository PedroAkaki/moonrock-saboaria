"use client";

import type { ColdProcessData } from "@/lib/batch/types";

interface ColdProcessFieldsProps {
  value: ColdProcessData;
  onChange: (next: ColdProcessData) => void;
}

function optionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

export default function ColdProcessFields({ value, onChange }: ColdProcessFieldsProps) {
  const update = <Key extends keyof ColdProcessData>(key: Key, nextValue: ColdProcessData[Key]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <details className="group" open>
      <summary className="text-sm font-semibold text-moon-300 cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2">
        <span className="transition-transform group-open:rotate-90">▶</span> Processo Cold Process
      </summary>
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NumberField label="Ambiente (°C)" value={value.ambientTempC} onChange={(next) => update("ambientTempC", next)} />
          <NumberField label="Óleos (°C)" value={value.oilTempC} onChange={(next) => update("oilTempC", next)} />
          <NumberField label="Lixívia (°C)" value={value.lyeTempC} onChange={(next) => update("lyeTempC", next)} />
          <NumberField label="Mistura (°C)" value={value.mixingTempC} onChange={(next) => update("mixingTempC", next)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NumberField label="Tempo até trace (min)" value={value.traceTimeMinutes} onChange={(next) => update("traceTimeMinutes", next)} />
          <SelectField
            label="Ponto de trace no despejo"
            value={value.tracePointAtPour ?? ""}
            onChange={(next) => update("tracePointAtPour", next === "" ? undefined : next as NonNullable<ColdProcessData["tracePointAtPour"]>)}
            options={[
              ["", "Não registrado"],
              ["emulsion", "Emulsão estável"],
              ["light", "Trace leve"],
              ["medium", "Trace médio"],
              ["heavy", "Trace pesado"],
            ]}
          />
          <SelectField
            label="Gel phase no corte"
            value={value.gelPhase ?? ""}
            onChange={(next) => update("gelPhase", next === "" ? undefined : next as NonNullable<ColdProcessData["gelPhase"]>)}
            options={[
              ["", "Não registrado"],
              ["full", "Gel completo"],
              ["partial", "Gel parcial"],
              ["none", "Sem gel"],
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField label="Técnica de design" value={value.designTechnique} placeholder="Ex.: drop swirl" onChange={(next) => update("designTechnique", next)} />
          <TextField label="Molde" value={value.moldName} placeholder="Ex.: loaf de silicone" onChange={(next) => update("moldName", next)} />
        </div>
        <div>
          <label className="block text-xs text-moon-400 mb-1">Notas do processo</label>
          <textarea
            value={value.notes ?? ""}
            onChange={(event) => update("notes", event.target.value || undefined)}
            placeholder="Comportamento da massa, fragrância, cor e decisão de gel..."
            rows={2}
            className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white placeholder-moon-400"
          />
        </div>
      </div>
    </details>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number | undefined; onChange: (value: number | undefined) => void }) {
  return (
    <div>
      <label className="block text-xs text-moon-400 mb-1">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(optionalNumber(event.target.value))}
        className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white"
      />
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string | undefined; placeholder: string; onChange: (value: string | undefined) => void }) {
  return (
    <div>
      <label className="block text-xs text-moon-400 mb-1">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        placeholder={placeholder}
        className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white placeholder-moon-400"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <div>
      <label className="block text-xs text-moon-400 mb-1">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </div>
  );
}
