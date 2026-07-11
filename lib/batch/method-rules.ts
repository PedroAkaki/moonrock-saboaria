import type { BatchStatus, SoapMethod } from "@/lib/diario";
import type { BatchProcessData, BatchReadiness } from "@/lib/batch/types";

const DEFAULT_READINESS_DAYS: Partial<Record<SoapMethod, number>> = {
  cold_process: 42,
  hot_process: 14,
  melt_and_pour: 1,
  used_oil: 28,
};

function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getInitialBatchStatus(method: SoapMethod): BatchStatus {
  switch (method) {
    case "cold_process":
      return "curing";
    case "hot_process":
    case "melt_and_pour":
    case "used_oil":
      return "made";
    case "other":
      return "draft";
  }
}

export function getInitialReadiness(method: SoapMethod, batchDate: string): BatchReadiness | undefined {
  const days = DEFAULT_READINESS_DAYS[method];
  switch (method) {
    case "cold_process":
    case "used_oil":
      return {
        kind: "cure",
        startDate: batchDate,
        targetEndDate: addDays(batchDate, days ?? 0),
        daysPlanned: days,
      };
    case "hot_process":
      return {
        kind: "stabilization",
        startDate: batchDate,
        targetEndDate: addDays(batchDate, days ?? 0),
        daysPlanned: days,
      };
    case "melt_and_pour":
      return {
        kind: "unmold",
        expectedAt: addDays(batchDate, days ?? 0),
      };
    case "other":
      return undefined;
  }
}

export function validateProcessDataForMethod(
  method: SoapMethod,
  processData: BatchProcessData | undefined,
): string | null {
  if (!processData) return null;
  return processData.method === method
    ? null
    : `processData.method (${processData.method}) não corresponde ao método do lote (${method}).`;
}

export function isReadinessCompatible(method: SoapMethod, readiness: BatchReadiness): boolean {
  switch (method) {
    case "cold_process":
      return readiness.kind === "cure";
    case "hot_process":
      return readiness.kind === "cure" || readiness.kind === "stabilization";
    case "melt_and_pour":
      return readiness.kind === "unmold" || readiness.kind === "stabilization";
    case "used_oil":
      return readiness.kind === "cure";
    case "other":
      return readiness.kind === "custom";
  }
}

export function validateReadinessForMethod(
  method: SoapMethod,
  readiness: BatchReadiness | undefined,
): string | null {
  if (!readiness) return null;
  return isReadinessCompatible(method, readiness)
    ? null
    : `readiness.kind (${readiness.kind}) não é compatível com o método do lote (${method}).`;
}

