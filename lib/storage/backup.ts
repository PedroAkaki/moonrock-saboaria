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
  const progress = loadRaw("moonrock:progress:v1");
  const batches = loadRaw("moonrock:diario:batches:v1");

  const data: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: "moonrock-saboaria",
    progress: parseOrEmpty(progress),
    batches: parseArrayOrEmpty(batches),
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

    if (!parsed || typeof parsed !== "object") {
      return { success: false, error: "JSON inválido: não é um objeto." };
    }

    const data = parsed as Record<string, unknown>;

    if (data.app !== "moonrock-saboaria") {
      return { success: false, error: `App inválido: esperado "moonrock-saboaria", recebido "${data.app}".` };
    }

    if (typeof data.version !== "number" || data.version < 1) {
      return { success: false, error: "Versão do backup inválida ou ausente." };
    }

    if (typeof data.progress !== "object" || data.progress === null || Array.isArray(data.progress)) {
      return { success: false, error: "Campo 'progress' inválido ou ausente." };
    }

    if (!Array.isArray(data.batches)) {
      return { success: false, error: "Campo 'batches' inválido ou ausente." };
    }

    // Validate progress has the expected shape
    const progress = data.progress as Record<string, unknown>;
    if (typeof progress.version !== "number") {
      return { success: false, error: "Progresso inválido: campo 'version' ausente." };
    }

    // Everything validated — write to localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("moonrock:progress:v1", JSON.stringify(data.progress));
      window.localStorage.setItem("moonrock:diario:batches:v1", JSON.stringify(data.batches));
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

function parseOrEmpty(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const p = JSON.parse(raw);
    return typeof p === "object" && p !== null && !Array.isArray(p) ? p : {};
  } catch {
    return {};
  }
}

function parseArrayOrEmpty(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}
