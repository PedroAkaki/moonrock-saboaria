"use client";

import { useSyncExternalStore } from "react";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeToProgress,
  type AppProgress,
} from "@/lib/progress";

/**
 * Lê o progresso do localStorage como fonte externa de verdade.
 * Retorna null no servidor e durante a hidratação; depois disso, acompanha
 * qualquer gravação feita por `saveProgress`, inclusive em outra aba.
 */
export function useProgress(): AppProgress | null {
  return useSyncExternalStore(subscribeToProgress, getProgressSnapshot, getServerProgressSnapshot);
}
