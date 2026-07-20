import type { SoapMethod } from "@/lib/diario";

export interface LearningDiaryPractice {
  slug: string;
  method: SoapMethod;
  suggestedName: string;
  observations: string;
}

const PRACTICES: Record<string, Omit<LearningDiaryPractice, "slug">> = {
  "cold-process-praticas-progressivas": {
    method: "cold_process",
    suggestedName: "Prática CP — controle",
    observations: "Prática progressiva de Cold Process\n\nIntenção: \nO que ficará igual: \nÚnica variável em estudo: \nO que vou observar na bancada: \nO que vou conferir em 24–48 h: ",
  },
};

export function getLearningDiaryPractice(slug: string): LearningDiaryPractice | null {
  const practice = PRACTICES[slug];
  return practice ? { slug, ...practice } : null;
}

export function getLearningDiaryPracticeHref(slug: string): string | null {
  return getLearningDiaryPractice(slug)
    ? `/diario?practice=${encodeURIComponent(slug)}`
    : null;
}

export function getLearningDiaryPracticeFromSearch(search: string): LearningDiaryPractice | null {
  const slug = new URLSearchParams(search).get("practice");
  return slug === null ? null : getLearningDiaryPractice(slug);
}

export function readLearningDiaryPracticeForDiary(): LearningDiaryPractice | null {
  if (typeof window === "undefined") return null;
  return getLearningDiaryPracticeFromSearch(window.location.search);
}

export function clearLearningDiaryPracticeFromDiaryUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("practice")) return;
  url.searchParams.delete("practice");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}
