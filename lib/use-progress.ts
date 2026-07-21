"use client";

import { useSyncExternalStore } from "react";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeToProgress,
  type AppProgress,
} from "@/lib/progress";

const EMPTY_PROGRESS_SNAPSHOT: AppProgress = {
  version: 1,
  updatedAt: "",
  lastModuleSlug: null,
  modules: {},
};

/**
 * Lê o progresso do localStorage como fonte externa de verdade.
 * Retorna null no servidor e durante a hidratação; depois disso, acompanha
 * qualquer gravação feita por `saveProgress`, inclusive em outra aba.
 */
export function useProgress(): AppProgress | null {
  return useSyncExternalStore(subscribeToProgress, getProgressSnapshot, getServerProgressSnapshot);
}

/**
 * Para telas que precisam renderizar sua estrutura já no servidor. O mesmo
 * snapshot vazio é usado no SSR e na hidratação; o storage entra depois.
 */
export function useProgressOrEmpty(): AppProgress {
  return useProgress() ?? EMPTY_PROGRESS_SNAPSHOT;
}
