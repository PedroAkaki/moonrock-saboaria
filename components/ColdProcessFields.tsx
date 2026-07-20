"use client";

import type { ColdProcessData } from "@/lib/batch/types";

interface ColdProcessFieldsProps {
  value: ColdProcessData;
  onChange: (next: ColdProcessData) => void;
}

function optionalNumber(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ColdProcessFields({ value, onChange }: ColdProcessFieldsProps) {
  const update = <Key extends keyof ColdProcessData>(key: Key, nextValue: ColdProcessData[Key]) => {
    onChange({ ...value, [key]: nextValue });
  };
  const updateUnmoldCheck = (next: NonNullable<ColdProcessData["unmoldCheck"]>) => {
    update("unmoldCheck", next);
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
        <details className="rounded-lg border border-moon-600 bg-moon-800/40 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold text-moon-300">
            Conferência em 24–48 h
          </summary>
          <p className="mt-1 text-xs text-moon-400">
            Registre o desmolde e sinais visuais iniciais. Esta conferência é opcional e não substitui a avaliação ao fim da cura.
          </p>
          {value.unmoldCheck === undefined ? (
            <button
              type="button"
              onClick={() => updateUnmoldCheck({ checkedAt: today(), unmolded: false })}
              className="mt-3 rounded-lg border border-moon-500 px-3 py-1.5 text-xs text-moon-200 hover:border-moon-300"
            >
              Registrar conferência
            </button>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-moon-400 mb-1">Data da conferência</label>
                  <input
                    type="date"
                    required
                    value={value.unmoldCheck.checkedAt}
                    onChange={(event) => updateUnmoldCheck({ ...value.unmoldCheck!, checkedAt: event.target.value })}
                    className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <SelectField
                  label="Desmolde"
                  value={value.unmoldCheck.unmolded ? "unmolded" : "not_unmolded"}
                  onChange={(next) => updateUnmoldCheck({ ...value.unmoldCheck!, unmolded: next === "unmolded" })}
                  options={[
                    ["not_unmolded", "Ainda não desenformou"],
                    ["unmolded", "Desenformado"],
                  ]}
                />
                <SelectField
                  label="Toque da superfície"
                  value={value.unmoldCheck.surfaceCondition ?? ""}
                  onChange={(next) => updateUnmoldCheck({
                    ...value.unmoldCheck!,
                    surfaceCondition: next === "" ? undefined : next as NonNullable<ColdProcessData["unmoldCheck"]>["surfaceCondition"],
                  })}
                  options={[
                    ["", "Não registrado"],
                    ["firm", "Firme"],
                    ["soft", "Macio"],
                    ["sticky", "Pegajoso"],
                    ["unknown", "Não sei avaliar"],
                  ]}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-moon-300">
                <CheckField label="Cinza de soda" checked={value.unmoldCheck.sodaAsh ?? false} onChange={(checked) => updateUnmoldCheck({ ...value.unmoldCheck!, sodaAsh: checked })} />
                <CheckField label="Rachaduras" checked={value.unmoldCheck.cracking ?? false} onChange={(checked) => updateUnmoldCheck({ ...value.unmoldCheck!, cracking: checked })} />
                <CheckField label="Separação visível" checked={value.unmoldCheck.separation ?? false} onChange={(checked) => updateUnmoldCheck({ ...value.unmoldCheck!, separation: checked })} />
              </div>
              <div>
                <label className="block text-xs text-moon-400 mb-1">Notas da conferência</label>
                <textarea
                  value={value.unmoldCheck.notes ?? ""}
                  onChange={(event) => updateUnmoldCheck({ ...value.unmoldCheck!, notes: event.target.value || undefined })}
                  placeholder="Ex.: corte limpo, cantos ainda macios..."
                  rows={2}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white placeholder-moon-400"
                />
              </div>
              <button
                type="button"
                onClick={() => update("unmoldCheck", undefined)}
                className="text-xs text-moon-400 underline hover:text-white"
              >
                Remover conferência
              </button>
            </div>
          )}
        </details>
      </div>
    </details>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
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
