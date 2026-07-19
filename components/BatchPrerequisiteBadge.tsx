"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { BATCH_STORAGE_KEY, countBatchesByMethod, type SoapMethod } from "@/lib/diario";

interface BatchPrerequisiteBadgeProps {
  method: SoapMethod;
  minBatches: number;
  methodLabel: string;
}

function subscribeToBatchStorage(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === BATCH_STORAGE_KEY) onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

/**
 * Verifica no Diário (localStorage) quantos lotes do método o usuário já
 * registrou e mostra o progresso real do pré-requisito do módulo.
 */
export default function BatchPrerequisiteBadge({ method, minBatches, methodLabel }: BatchPrerequisiteBadgeProps) {
  const count = useSyncExternalStore(
    subscribeToBatchStorage,
    () => countBatchesByMethod(method),
    () => null,
  );

  if (count === null) return null;

  const fulfilled = count >= minBatches;

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border ${
        fulfilled
          ? "bg-green-900/30 text-green-300 border-green-700"
          : "bg-amber-900/20 text-amber-300 border-amber-700"
      }`}
    >
      {fulfilled
        ? `✓ Você tem ${count} lotes ${methodLabel} no Diário`
        : (
          <>
            {count} de {minBatches} lotes {methodLabel} no{" "}
            <Link href="/diario" className="underline">Diário</Link>
          </>
        )}
    </span>
  );
}
