import { BATCH_STORAGE_KEY } from "@/lib/diario";
import { validateStoredBatchArray } from "@/lib/batch/repository";

const BACKUP_VERSION = 1;

export interface BackupData {
  version: number;
  exportedAt: string;
  app: "moonrock-saboaria";
  progress: Record<string, unknown>;
  batches: unknown[];
}

/**
 * Export all user data to a structured JSON string.
 */
export function exportBackup(): string {
  const progress = parseProgressForExport(loadRaw("moonrock:progress:v1"));
  const storedBatches = parseJsonForExport(loadRaw(BATCH_STORAGE_KEY), []);
  const validation = validateStoredBatchArray(storedBatches);

  if (!validation.success) {
    const record = validation.index === null ? "coleção" : `registro ${validation.index + 1}`;
    throw new Error(`Não foi possível exportar: ${record} de lotes inválido (${validation.reason})`);
  }

  const data: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: "moonrock-saboaria",
    progress,
    batches: validation.data,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import user data from a validated BackupData JSON string.
 * Returns { success: true } on success, or { success: false, error: string } on failure.
 * Never overwrites existing data if validation fails.
 */
export function importBackup(
  jsonString: string
): { success: true } | { success: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(jsonString);

    if (!isRecord(parsed)) {
      return { success: false, error: "JSON inválido: não é um objeto." };
    }

    const data = parsed as Record<string, unknown>;

    if (data.app !== "moonrock-saboaria") {
      return { success: false, error: `App inválido: esperado "moonrock-saboaria", recebido "${data.app}".` };
    }

    if (typeof data.version !== "number" || data.version < 1) {
      return { success: false, error: "Versão do backup inválida ou ausente." };
    }

    if (typeof data.exportedAt !== "string") {
      return { success: false, error: "Data de exportação inválida ou ausente." };
    }

    const batchesValidation = validateStoredBatchArray(data.batches);
    if (!batchesValidation.success) {
      const record = batchesValidation.index === null
        ? "coleção de lotes"
        : `lote ${batchesValidation.index + 1}`;
      return {
        success: false,
        error: `Backup inválido no ${record}: ${batchesValidation.reason}`,
      };
    }

    // Legacy support: backup with only batches (no progress). An empty progress
    // object is also treated as absent because exportBackup uses it when there
    // is no saved learning progress.
    const hasProgress = isNonEmptyRecord(data.progress);

    if (data.progress !== undefined && data.progress !== null && !isRecord(data.progress)) {
      return { success: false, error: "Campo 'progress' inválido." };
    }

    if (hasProgress) {
      const progress = data.progress as Record<string, unknown>;
      if (typeof progress.version !== "number") {
        return { success: false, error: "Progresso inválido: campo 'version' ausente." };
      }
    }

    // Confirm before overwriting
    if (typeof window !== "undefined" && typeof window.confirm === "function") {
      const msg = hasProgress
        ? "Importar este backup substituirá os lotes e o progresso salvos neste navegador. Deseja continuar?"
        : "Importar este backup substituirá os lotes salvos neste navegador. Deseja continuar?";
      if (!window.confirm(msg)) {
        return { success: false, error: "Importação cancelada pelo usuário." };
      }
    }

    // Write to localStorage
    if (typeof window !== "undefined") {
      if (hasProgress) {
        window.localStorage.setItem("moonrock:progress:v1", JSON.stringify(data.progress));
      }
      window.localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batchesValidation.data));
      window.dispatchEvent(new Event("moonrock-progress-updated"));
    }

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: `Erro ao processar backup: ${e instanceof Error ? e.message : "formato inválido"}.`,
    };
  }
}

/**
 * Download a string as a .json file in the browser.
 */
export function downloadJson(filename: string, content: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger a file picker and read the selected file as text.
 * Returns a promise that resolves with the file contents, or rejects if canceled.
 */
export function readJsonFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("Nenhum arquivo selecionado."));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erro ao ler arquivo."));
      reader.readAsText(file);
    };
    input.click();
  });
}

// ─── helpers ────────────────────────────────────────────────

function loadRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseJsonForExport(raw: string | null, fallback: unknown): unknown {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Não foi possível exportar: dados locais contêm JSON inválido.");
  }
}

function parseProgressForExport(raw: string | null): Record<string, unknown> {
  const parsed = parseJsonForExport(raw, {});
  if (!isRecord(parsed)) {
    throw new Error("Não foi possível exportar: progresso local inválido.");
  }
  if (Object.keys(parsed).length > 0 && typeof parsed.version !== "number") {
    throw new Error("Não foi possível exportar: progresso local sem versão.");
  }
  return parsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && Object.keys(value).length > 0;
}
