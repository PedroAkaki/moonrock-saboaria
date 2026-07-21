"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Plus, FlaskConical, Trash2, Copy, Download, Upload, Pencil } from "lucide-react";
import {
  BatchStatus,
  SoapMethod,
  BatchOil,
} from "@/lib/diario";
import {
  createDiaryBatch,
  deleteDiaryBatch,
  duplicateDiaryBatch,
  generateDiaryBatchCode,
  getDiaryBatches,
  isBatchV2,
  updateColdProcessCureReview,
  updateDiaryBatch,
  updateDiaryBatchStatus,
} from "@/lib/batch/repository";
import { normalizeStoredBatchV1 } from "@/lib/batch/decoder";
import type { ColdProcessData, StoredBatch } from "@/lib/batch/types";
import { exportBackup, importBackup, downloadJson, readJsonFile } from "@/lib/storage/backup";
import {
  clearCalculatorFormulaForDiary,
  readCalculatorFormulaForDiary,
} from "@/lib/storage/calculator-diary";
import {
  clearLearningDiaryPracticeFromDiaryUrl,
  readLearningDiaryPracticeForDiary,
  type LearningDiaryPractice,
} from "@/lib/learning/diary-practice";
import ColdProcessFields from "@/components/ColdProcessFields";
import { ColdProcessCureReview } from "@/components/ColdProcessCureReview";

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  made: "Produzido",
  curing: "Em cura",
  ready: "Pronto",
  failed: "Falhou",
  archived: "Arquivado",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-moon-700 text-moon-300 border-moon-600",
  made: "bg-amber-900/30 text-amber-300 border-amber-700",
  curing: "bg-purple-900/30 text-purple-300 border-purple-700",
  ready: "bg-green-900/30 text-green-300 border-green-700",
  failed: "bg-red-900/30 text-red-300 border-red-700",
  archived: "bg-moon-800 text-moon-500 border-moon-600",
};

const METHOD_LABELS: Record<SoapMethod, string> = {
  melt_and_pour: "Melt & Pour",
  used_oil: "Óleo Usado",
  cold_process: "Cold Process",
  hot_process: "Hot Process",
  other: "Outro",
};

const TRACE_LABELS = {
  emulsion: "Emulsão estável",
  light: "Trace leve",
  medium: "Trace médio",
  heavy: "Trace pesado",
} as const;

const GEL_PHASE_LABELS = {
  full: "Gel completo",
  partial: "Gel parcial",
  none: "Sem gel",
} as const;

const UNMOLD_SURFACE_LABELS = {
  firm: "Superfície firme",
  soft: "Superfície macia",
  sticky: "Superfície pegajosa",
  unknown: "Toque não avaliado",
} as const;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyColdProcessData(): ColdProcessData {
  return { method: "cold_process" };
}

function getColdProcessData(batch: StoredBatch): ColdProcessData {
  const normalized = isBatchV2(batch) ? batch : normalizeStoredBatchV1(batch);
  return normalized.processData?.method === "cold_process"
    ? { ...normalized.processData }
    : emptyColdProcessData();
}

function getCureData(batch: StoredBatch) {
  if (!isBatchV2(batch)) return batch.cure;
  return batch.readiness?.kind === "cure" ? batch.readiness : undefined;
}

function subscribeToHydration(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => undefined;
}

export default function DiarioPage() {
  const [calculatorFormula] = useState(() => readCalculatorFormulaForDiary());
  const [learningPractice, setLearningPractice] = useState<LearningDiaryPractice | null>(() => readLearningDiaryPracticeForDiary());
  const [batches, setBatches] = useState<StoredBatch[]>(() => getDiaryBatches());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(() => calculatorFormula !== null || learningPractice !== null);
  const mounted = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  // Form state
  const [formName, setFormName] = useState(() => learningPractice?.suggestedName ?? "");
  const [formMethod, setFormMethod] = useState<SoapMethod>(() => learningPractice?.method ?? "cold_process");
  const [formDate, setFormDate] = useState(todayStr());
  const [formOilWeight, setFormOilWeight] = useState(() => calculatorFormula?.totalOilWeight ?? 500);
  const [formNaoh, setFormNaoh] = useState(() => calculatorFormula?.naohGrams ?? 0);
  const [formWater, setFormWater] = useState(() => calculatorFormula?.waterGrams ?? 0);
  const [formSuperfat, setFormSuperfat] = useState(() => calculatorFormula?.superfatPercent ?? 5);
  const [formOilList, setFormOilList] = useState<BatchOil[]>(() => calculatorFormula?.oils ?? []);
  const [formSourceType, setFormSourceType] = useState<"free_formula" | "calculator">(() => calculatorFormula ? "calculator" : "free_formula");
  const [formFormulaOpen, setFormFormulaOpen] = useState(() => calculatorFormula !== null);
  const [formObs, setFormObs] = useState(() => learningPractice?.observations ?? "");
  const [formColdProcess, setFormColdProcess] = useState<ColdProcessData>(emptyColdProcessData());
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editBatchId, setEditBatchId] = useState<string | null>(null);
  const [editBatchCode, setEditBatchCode] = useState<string | null>(null);
  const [editOriginal, setEditOriginal] = useState<StoredBatch | null>(null);

  // A fórmula da Calculadora só é consumida depois de createDiaryBatch().
  const load = useCallback(() => setBatches(getDiaryBatches()), []);

  const handleCreate = () => {
    if (!formName.trim()) return;

    if (editBatchId) {
      // Edit mode — update existing batch with safe merge
      updateDiaryBatch(editBatchId, {
        name: formName.trim(),
        batchDate: formDate,
        formula: {
          totalOilWeight: formOilWeight,
          alkaliType: editOriginal?.formula.alkaliType ?? "naoh",
          naohGrams: formNaoh || undefined,
          waterGrams: formWater,
          superfatPercent: formSuperfat,
          oils: formOilList,
        },
        observations: formObs,
        ...(formMethod === "cold_process" ? { processData: formColdProcess } : {}),
      });
      resetForm();
      load();
      return;
    }

    createDiaryBatch({
      name: formName.trim(),
      method: formMethod,
      batchDate: formDate,
      source: { type: formSourceType },
      formula: {
        totalOilWeight: formOilWeight,
        alkaliType: "naoh" as const,
        naohGrams: formNaoh || undefined,
        waterGrams: formWater,
        superfatPercent: formSuperfat,
        oils: formOilList,
      },
      observations: formObs.trim() || undefined,
      ...(formMethod === "cold_process" ? { processData: formColdProcess } : {}),
      status: formMethod === "cold_process" ? undefined : "curing",
    });

    // Só remove a chave da calculadora DEPOIS de criar o lote
    if (formSourceType === "calculator") {
      clearCalculatorFormulaForDiary();
    }

    resetForm();
    load();
  };

  const handleDuplicate = (id: string) => {
    duplicateDiaryBatch(id);
    load();
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este lote?")) {
      deleteDiaryBatch(id);
      load();
    }
  };

  const handleStatusChange = (id: string, status: BatchStatus) => {
    updateDiaryBatchStatus(id, status);
    load();
  };

  const handleEdit = (batch: StoredBatch) => {
    setLearningPractice(null);
    setEditBatchId(batch.id);
    setEditBatchCode(batch.batchCode);
    setEditOriginal(batch);
    setFormName(batch.name);
    setFormMethod(batch.method);
    setFormDate(batch.batchDate);
    setFormOilWeight(batch.formula.totalOilWeight);
    setFormNaoh(batch.formula.naohGrams ?? 0);
    setFormWater(batch.formula.waterGrams);
    setFormSuperfat(batch.formula.superfatPercent);
    setFormOilList(batch.formula.oils ?? []);
    setFormSourceType(batch.source.type === "calculator" ? "calculator" : "free_formula");
    setFormObs(batch.result?.observations ?? "");
    setFormColdProcess(batch.method === "cold_process" ? getColdProcessData(batch) : emptyColdProcessData());
    setFormFormulaOpen(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    clearLearningDiaryPracticeFromDiaryUrl();
    setLearningPractice(null);
    setEditBatchId(null);
    setEditBatchCode(null);
    setEditOriginal(null);
    setShowForm(false);
    setFormName("");
    setFormMethod("cold_process");
    setFormDate(todayStr());
    setFormOilWeight(500);
    setFormNaoh(0);
    setFormWater(0);
    setFormSuperfat(5);
    setFormOilList([]);
    setFormSourceType("free_formula");
    setFormFormulaOpen(false);
    setFormObs("");
    setFormColdProcess(emptyColdProcessData());
  };

  const handleExport = () => {
    try {
      const filename = `moonrock-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const data = exportBackup();
      downloadJson(filename, data);
    } catch (error) {
      setImportMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Não foi possível exportar o backup.",
      });
    }
  };

  const handleImport = async () => {
    try {
      const content = await readJsonFile();
      const result = importBackup(content);
      if (result.success) {
        setImportMessage({ type: "success", text: "Backup importado com sucesso! Dados restaurados." });
        load();
      } else {
        setImportMessage({ type: "error", text: result.error });
      }
    } catch (e) {
      setImportMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Erro ao selecionar arquivo.",
      });
    }
  };

  const filtered = statusFilter === "all" ? batches : batches.filter((b) => b.status === statusFilter);

  // Status counts
  const counts = {
    all: batches.length,
    curing: batches.filter((b) => b.status === "curing").length,
    ready: batches.filter((b) => b.status === "ready").length,
    draft: batches.filter((b) => b.status === "draft").length,
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📓 Diário de Lote</h1>
          <p className="text-moon-400 mt-1">Registre e acompanhe seus lotes de sabão</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 bg-moon-700 hover:bg-moon-600 text-moon-200 px-3 py-2 rounded-xl text-xs font-medium transition-colors border border-moon-600"
            title="Exportar dados"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button
            onClick={handleImport}
            className="inline-flex items-center gap-1.5 bg-moon-700 hover:bg-moon-600 text-moon-200 px-3 py-2 rounded-xl text-xs font-medium transition-colors border border-moon-600"
            title="Importar dados"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar
          </button>
          <button
            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
            className="inline-flex items-center gap-2 bg-white hover:bg-moon-200 text-moon-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancelar" : "Novo Lote"}
          </button>
        </div>
      </div>

      {/* Import feedback */}
      {importMessage && (
        <div className={`rounded-lg p-3 text-sm ${
          importMessage.type === "success"
            ? "bg-green-900/30 border border-green-700 text-green-300"
            : "bg-red-900/30 border border-red-700 text-red-300"
        }`}>
          {importMessage.text}
          <button onClick={() => setImportMessage(null)} className="ml-2 underline text-xs">Fechar</button>
        </div>
      )}

      {/* New batch form */}
      {showForm && (
        <div className="bg-moon-700/50 backdrop-blur rounded-xl border border-moon-600 p-5 space-y-4">
          <h2 className="font-semibold text-white">{editBatchId ? "Editar Lote" : "Novo Lote"}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-moon-300 mb-1">Nome do lote *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Lavanda teste 01"
                className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white placeholder-moon-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-moon-300 mb-1">Método</label>
              <select value={formMethod} onChange={(e) => setFormMethod(e.target.value as SoapMethod)} disabled={editBatchId !== null}
                className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white appearance-none">
                {Object.entries(METHOD_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-moon-300 mb-1">Data</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-moon-300 mb-1">Código</label>
              <input type="text" value={editBatchCode ?? generateDiaryBatchCode(formMethod)} readOnly
                className="w-full bg-moon-900 border border-moon-600 rounded-lg px-3 py-2 text-sm text-moon-400" />
            </div>
          </div>

          <details className="group" open={formFormulaOpen}>
            <summary className="text-sm font-semibold text-moon-300 cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2"
              onClick={(e) => { e.preventDefault(); setFormFormulaOpen(!formFormulaOpen); }}>
              <span className={`transition-transform ${formFormulaOpen ? "rotate-90" : ""}`}>▶</span> Fórmula
              {formSourceType === "calculator" && formOilList.length > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-300 border border-amber-700">Calculadora</span>
              )}
            </summary>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-moon-400 mb-1">Óleos (g)</label>
                <input type="number" value={formOilWeight} onChange={(e) => setFormOilWeight(Number(e.target.value))}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-moon-400 mb-1">NaOH (g)</label>
                <input type="number" value={formNaoh} onChange={(e) => setFormNaoh(Number(e.target.value))}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-moon-400 mb-1">Água (g)</label>
                <input type="number" value={formWater} onChange={(e) => setFormWater(Number(e.target.value))}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs text-moon-400 mb-1">Superfat (%)</label>
                <input type="number" value={formSuperfat} onChange={(e) => setFormSuperfat(Number(e.target.value))}
                  className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>

                    {/* Imported oils list */}
                    {formOilList.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-moon-500 uppercase tracking-wider">Óleos importados</p>
                        {formOilList.map((oil, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-moon-300 bg-moon-800 rounded-lg px-3 py-1.5">
                            <span>{oil.name}</span>
                            <span className="font-mono text-moon-400">{oil.grams}g ({oil.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    )}
          </details>

          {formMethod === "cold_process" && (
            <>
              {learningPractice && !editBatchId && (
                <p className="rounded-lg border border-sky-700 bg-sky-900/20 px-3 py-2 text-xs text-sky-100">
                  Contexto da prática preenchido a partir do Aprendizado. Revise e ajuste antes de salvar; este lote ainda não existe.
                </p>
              )}
              {editOriginal?.method === "cold_process" && !isBatchV2(editOriginal) && (
                <p className="rounded-lg border border-amber-700 bg-amber-900/20 px-3 py-2 text-xs text-amber-200">
                  Ao salvar, este lote legado será promovido para Batch v2. Os dados não exibidos serão preservados como legado.
                </p>
              )}
              <ColdProcessFields value={formColdProcess} onChange={setFormColdProcess} />
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-moon-300 mb-1">Observações</label>
            <textarea value={formObs} onChange={(e) => setFormObs(e.target.value)}
              placeholder="Temperatura, tempo de traço, aditivos..."
              rows={2}
              className="w-full bg-moon-800 border border-moon-500 rounded-lg px-3 py-2 text-sm text-white placeholder-moon-400" />
          </div>

          <button onClick={handleCreate} disabled={!formName.trim()}
            className="w-full bg-white hover:bg-moon-200 text-moon-900 font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            {editBatchId ? "Salvar Alterações" : "Salvar Lote"}
          </button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: `Todos (${counts.all})` },
          { key: "curing", label: `Em cura (${counts.curing})` },
          { key: "ready", label: `Pronto (${counts.ready})` },
          { key: "draft", label: `Rascunho (${counts.draft})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === tab.key
                ? "bg-white text-moon-900 border-white"
                : "bg-moon-800 text-moon-400 border-moon-600 hover:border-moon-400"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Batch list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-moon-400">
          <FlaskConical className="w-10 h-10 mx-auto mb-3 text-moon-500" />
          <p className="text-lg">Nenhum lote encontrado</p>
          <p className="text-sm mt-1">Clique em &quot;Novo Lote&quot; para registrar sua produção</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((batch) => {
            const cure = getCureData(batch);
            const daysInCure = cure?.startDate
              ? Math.floor(
                  (new Date().getTime() - new Date(cure.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;

            return (
              <div key={batch.id} className="bg-moon-700/40 backdrop-blur rounded-xl border border-moon-600 p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-moon-500">{batch.batchCode}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[batch.status]}`}>
                        {STATUS_LABELS[batch.status]}
                      </span>
                      {batch.source.type === "calculator" && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-300 border border-amber-700">Calculadora</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white truncate">{batch.name}</h3>
                    <p className="text-xs text-moon-400">{METHOD_LABELS[batch.method]} · {batch.batchDate}</p>
                  </div>
                </div>

                {/* Formula summary */}
                <div className="flex flex-wrap gap-3 text-xs text-moon-400">
                  <span>{batch.formula.totalOilWeight}g óleos</span>
                  {batch.formula.naohGrams && <span>{batch.formula.naohGrams}g NaOH</span>}
                  <span>{batch.formula.waterGrams}g água</span>
                  <span>{batch.formula.superfatPercent}% superfat</span>
                  {batch.formula.oils.length > 0 && <span>{batch.formula.oils.length} óleo(s)</span>}
                </div>

                {isBatchV2(batch) && batch.processData?.method === "cold_process" && (
                  <div className="flex flex-wrap gap-3 text-xs text-moon-400">
                    {batch.processData.mixingTempC !== undefined && <span>{batch.processData.mixingTempC}°C na mistura</span>}
                    {batch.processData.tracePointAtPour && <span>Trace: {TRACE_LABELS[batch.processData.tracePointAtPour]}</span>}
                    {batch.processData.gelPhase && <span>Gel: {GEL_PHASE_LABELS[batch.processData.gelPhase]}</span>}
                    {batch.processData.designTechnique && <span>Técnica: {batch.processData.designTechnique}</span>}
                  </div>
                )}

                {isBatchV2(batch) && batch.processData?.method === "cold_process" && batch.processData.unmoldCheck && (
                  <div className="rounded-lg border border-moon-600 bg-moon-800/40 px-3 py-2 text-xs text-moon-300">
                    <span className="font-semibold">Conferência 24–48 h · {batch.processData.unmoldCheck.checkedAt}</span>
                    <span className="ml-2">{batch.processData.unmoldCheck.unmolded ? "Desenformado" : "Ainda no molde"}</span>
                    {batch.processData.unmoldCheck.surfaceCondition && <span className="ml-2">· {UNMOLD_SURFACE_LABELS[batch.processData.unmoldCheck.surfaceCondition]}</span>}
                    {batch.processData.unmoldCheck.sodaAsh && <span className="ml-2">· cinza de soda</span>}
                    {batch.processData.unmoldCheck.cracking && <span className="ml-2">· rachaduras</span>}
                    {batch.processData.unmoldCheck.separation && <span className="ml-2">· separação</span>}
                  </div>
                )}

                {/* Cure info */}
                {batch.status === "curing" && (
                  <div className="text-xs text-moon-400">
                    <span className="text-purple-300">{daysInCure}</span> dias em cura
                    {cure?.targetEndDate && (
                      <> · Previsão: {cure.targetEndDate}</>
                    )}
                  </div>
                )}

                {/* Observations */}
                {batch.result?.observations && (
                  <p className="text-xs text-moon-500 italic leading-relaxed">{batch.result.observations}</p>
                )}

                {batch.method === "cold_process" && batch.status === "ready" && (
                  <ColdProcessCureReview
                    result={batch.result}
                    onSave={(review) => {
                      updateColdProcessCureReview(batch.id, review);
                      load();
                    }}
                  />
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Quick status buttons */}
                  {batch.status === "curing" && (
                    <button onClick={() => handleStatusChange(batch.id, "ready")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-900/30 text-green-300 border border-green-700 hover:bg-green-900/50 transition-colors">
                      Marcar Pronto
                    </button>
                  )}
                  {batch.status === "made" && (
                    <button onClick={() => handleStatusChange(batch.id, "curing")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/30 text-purple-300 border border-purple-700 hover:bg-purple-900/50 transition-colors">
                      Iniciar Cura
                    </button>
                  )}
                  {batch.status === "ready" && (
                    <button onClick={() => handleStatusChange(batch.id, "archived")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-moon-800 text-moon-400 border border-moon-600 hover:bg-moon-700 transition-colors">
                      Arquivar
                    </button>
                  )}

                  <button onClick={() => handleDuplicate(batch.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-moon-800 text-moon-400 border border-moon-600 hover:bg-moon-700 transition-colors inline-flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Duplicar
                  </button>
                  <button onClick={() => handleEdit(batch)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-moon-800 text-moon-400 border border-moon-600 hover:bg-moon-700 transition-colors inline-flex items-center gap-1">
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => handleDelete(batch.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 border border-red-800/50 hover:bg-red-900/40 transition-colors inline-flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
