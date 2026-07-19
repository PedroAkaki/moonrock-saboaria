import {
  validateBatch,
  type BatchAdditive,
  type BatchOil,
  type BatchStatus,
  type SoapMethod,
} from "@/lib/diario";
import {
  validateProcessDataForMethod,
  validateReadinessForMethod,
} from "@/lib/batch/method-rules";
import type {
  BatchProcessData,
  BatchReadiness,
  BatchResult,
  BatchSource,
  BatchV2,
  BatchYield,
  ColdProcessData,
  LegacyBatchCure,
  LegacyBatchData,
  MeltAndPourData,
  OtherProcessData,
  StoredBatch,
  StoredBatchV1,
  StoredBatchV2,
  TransitionalBatchFormula,
  UsedOilProcessData,
  HotProcessData,
} from "@/lib/batch/types";

export type DecodeResult<T> =
  | { success: true; data: T }
  | { success: false; reason: string };

function ok<T>(data: T): DecodeResult<T> {
  return { success: true, data };
}

function fail<T = never>(reason: string): DecodeResult<T> {
  return { success: false, reason };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseOptionalString(record: Record<string, unknown>, key: string, path: string): DecodeResult<string | undefined> {
  const value = record[key];
  if (value === undefined) return ok(undefined);
  return typeof value === "string" ? ok(value) : fail(`${path} deve ser texto.`);
}

function parseOptionalNumber(record: Record<string, unknown>, key: string, path: string): DecodeResult<number | undefined> {
  const value = record[key];
  if (value === undefined) return ok(undefined);
  return isFiniteNumber(value) ? ok(value) : fail(`${path} deve ser um número.`);
}

function parseRequiredString(record: Record<string, unknown>, key: string, path: string): DecodeResult<string> {
  const value = record[key];
  return typeof value === "string" && value.length > 0
    ? ok(value)
    : fail(`${path} deve ser texto não vazio.`);
}

function parseMethod(value: unknown): DecodeResult<SoapMethod> {
  switch (value) {
    case "cold_process":
    case "hot_process":
    case "melt_and_pour":
    case "used_oil":
    case "other":
      return ok(value);
    default:
      return fail("method não é reconhecido.");
  }
}

function parseStatus(value: unknown): DecodeResult<BatchStatus> {
  switch (value) {
    case "draft":
    case "made":
    case "curing":
    case "ready":
    case "failed":
    case "archived":
      return ok(value);
    default:
      return fail("status não é reconhecido.");
  }
}

function parseStringArray(value: unknown, path: string): DecodeResult<string[]> {
  if (!Array.isArray(value)) return fail(`${path} deve ser uma lista.`);
  const items: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    if (typeof value[index] !== "string") return fail(`${path}[${index}] deve ser texto.`);
    items.push(value[index]);
  }
  return ok(items);
}

function parseSource(value: unknown): DecodeResult<BatchSource> {
  if (!isRecord(value)) return fail("source deve ser um objeto.");
  const type = value.type;
  if (type !== "recipe" && type !== "calculator" && type !== "free_formula" && type !== "duplicate_batch") {
    return fail("source.type não é reconhecido.");
  }
  if (value.recipeId !== undefined && value.recipeId !== null && typeof value.recipeId !== "string") {
    return fail("source.recipeId deve ser texto ou null.");
  }
  if (value.sourceBatchId !== undefined && value.sourceBatchId !== null && typeof value.sourceBatchId !== "string") {
    return fail("source.sourceBatchId deve ser texto ou null.");
  }
  return ok({
    type,
    ...(value.recipeId === undefined ? {} : { recipeId: value.recipeId }),
    ...(value.sourceBatchId === undefined ? {} : { sourceBatchId: value.sourceBatchId }),
  });
}

function parseOil(value: unknown, path: string): DecodeResult<BatchOil> {
  if (!isRecord(value)) return fail(`${path} deve ser um objeto.`);
  if (value.oilId !== null && typeof value.oilId !== "string") return fail(`${path}.oilId deve ser texto ou null.`);
  if (typeof value.name !== "string") return fail(`${path}.name deve ser texto.`);
  if (!isFiniteNumber(value.grams)) return fail(`${path}.grams deve ser um número.`);
  if (!isFiniteNumber(value.percentage)) return fail(`${path}.percentage deve ser um número.`);
  if (value.sapNaoh !== undefined && !isFiniteNumber(value.sapNaoh)) return fail(`${path}.sapNaoh deve ser um número.`);
  if (value.sapKoh !== undefined && !isFiniteNumber(value.sapKoh)) return fail(`${path}.sapKoh deve ser um número.`);
  return ok({
    oilId: value.oilId,
    name: value.name,
    grams: value.grams,
    percentage: value.percentage,
    ...(value.sapNaoh === undefined ? {} : { sapNaoh: value.sapNaoh }),
    ...(value.sapKoh === undefined ? {} : { sapKoh: value.sapKoh }),
  });
}

function parseAdditive(value: unknown, path: string): DecodeResult<BatchAdditive> {
  if (!isRecord(value)) return fail(`${path} deve ser um objeto.`);
  if (typeof value.name !== "string") return fail(`${path}.name deve ser texto.`);
  if (value.grams !== undefined && !isFiniteNumber(value.grams)) return fail(`${path}.grams deve ser um número.`);
  const type = value.type;
  if (type !== undefined && type !== "fragrance" && type !== "colorant" && type !== "clay" && type !== "botanical" && type !== "other") {
    return fail(`${path}.type não é reconhecido.`);
  }
  if (value.notes !== undefined && typeof value.notes !== "string") return fail(`${path}.notes deve ser texto.`);
  return ok({
    name: value.name,
    ...(value.grams === undefined ? {} : { grams: value.grams }),
    ...(type === undefined ? {} : { type }),
    ...(value.notes === undefined ? {} : { notes: value.notes }),
  });
}

function parseTransitionalFormula(value: unknown): DecodeResult<TransitionalBatchFormula> {
  if (!isRecord(value)) return fail("formula deve ser um objeto.");
  if (!isFiniteNumber(value.totalOilWeight)) return fail("formula.totalOilWeight deve ser um número.");
  if (value.alkaliType !== "naoh" && value.alkaliType !== "koh" && value.alkaliType !== "mixed") {
    return fail("formula.alkaliType não é reconhecido.");
  }
  if (value.naohGrams !== undefined && !isFiniteNumber(value.naohGrams)) return fail("formula.naohGrams deve ser um número.");
  if (value.kohGrams !== undefined && !isFiniteNumber(value.kohGrams)) return fail("formula.kohGrams deve ser um número.");
  if (!isFiniteNumber(value.waterGrams)) return fail("formula.waterGrams deve ser um número.");
  if (!isFiniteNumber(value.superfatPercent)) return fail("formula.superfatPercent deve ser um número.");
  if (value.waterLyeRatio !== undefined && !isFiniteNumber(value.waterLyeRatio)) return fail("formula.waterLyeRatio deve ser um número.");
  if (value.lyeConcentrationPercent !== undefined && !isFiniteNumber(value.lyeConcentrationPercent)) {
    return fail("formula.lyeConcentrationPercent deve ser um número.");
  }
  if (value.expectedBatchWeight !== undefined && !isFiniteNumber(value.expectedBatchWeight)) {
    return fail("formula.expectedBatchWeight deve ser um número.");
  }
  if (!Array.isArray(value.oils)) return fail("formula.oils deve ser uma lista.");

  const oils: BatchOil[] = [];
  for (let index = 0; index < value.oils.length; index += 1) {
    const oil = parseOil(value.oils[index], `formula.oils[${index}]`);
    if (!oil.success) return oil;
    oils.push(oil.data);
  }

  let additives: BatchAdditive[] | undefined;
  if (value.additives !== undefined) {
    if (!Array.isArray(value.additives)) return fail("formula.additives deve ser uma lista.");
    additives = [];
    for (let index = 0; index < value.additives.length; index += 1) {
      const additive = parseAdditive(value.additives[index], `formula.additives[${index}]`);
      if (!additive.success) return additive;
      additives.push(additive.data);
    }
  }

  return ok({
    totalOilWeight: value.totalOilWeight,
    alkaliType: value.alkaliType,
    waterGrams: value.waterGrams,
    superfatPercent: value.superfatPercent,
    oils,
    ...(value.naohGrams === undefined ? {} : { naohGrams: value.naohGrams }),
    ...(value.kohGrams === undefined ? {} : { kohGrams: value.kohGrams }),
    ...(value.waterLyeRatio === undefined ? {} : { waterLyeRatio: value.waterLyeRatio }),
    ...(value.lyeConcentrationPercent === undefined ? {} : { lyeConcentrationPercent: value.lyeConcentrationPercent }),
    ...(value.expectedBatchWeight === undefined ? {} : { expectedBatchWeight: value.expectedBatchWeight }),
    ...(additives === undefined ? {} : { additives }),
  });
}

function parseYield(value: unknown): DecodeResult<BatchYield | undefined> {
  if (value === undefined) return ok(undefined);
  if (!isRecord(value)) return fail("yield deve ser um objeto.");
  if (value.barsCount !== undefined && !isFiniteNumber(value.barsCount)) return fail("yield.barsCount deve ser um número.");
  if (value.cutDate !== undefined && typeof value.cutDate !== "string") return fail("yield.cutDate deve ser texto.");
  if (value.unmoldDate !== undefined && typeof value.unmoldDate !== "string") return fail("yield.unmoldDate deve ser texto.");
  if (value.finalWeightGrams !== undefined && !isFiniteNumber(value.finalWeightGrams)) {
    return fail("yield.finalWeightGrams deve ser um número.");
  }
  return ok({
    ...(value.barsCount === undefined ? {} : { barsCount: value.barsCount }),
    ...(value.cutDate === undefined ? {} : { cutDate: value.cutDate }),
    ...(value.unmoldDate === undefined ? {} : { unmoldDate: value.unmoldDate }),
    ...(value.finalWeightGrams === undefined ? {} : { finalWeightGrams: value.finalWeightGrams }),
  });
}

function parseResult(value: unknown): DecodeResult<BatchResult | undefined> {
  if (value === undefined) return ok(undefined);
  if (!isRecord(value)) return fail("result deve ser um objeto.");
  if (value.ph !== undefined && !isFiniteNumber(value.ph)) return fail("result.ph deve ser um número.");
  if (value.observations !== undefined && typeof value.observations !== "string") return fail("result.observations deve ser texto.");
  if (value.rating !== undefined && value.rating !== 1 && value.rating !== 2 && value.rating !== 3 && value.rating !== 4 && value.rating !== 5) {
    return fail("result.rating deve estar entre 1 e 5.");
  }
  if (value.wouldRepeat !== undefined && typeof value.wouldRepeat !== "boolean") return fail("result.wouldRepeat deve ser booleano.");
  if (value.failureReason !== undefined && typeof value.failureReason !== "string") return fail("result.failureReason deve ser texto.");
  return ok({
    ...(value.ph === undefined ? {} : { ph: value.ph }),
    ...(value.observations === undefined ? {} : { observations: value.observations }),
    ...(value.rating === undefined ? {} : { rating: value.rating }),
    ...(value.wouldRepeat === undefined ? {} : { wouldRepeat: value.wouldRepeat }),
    ...(value.failureReason === undefined ? {} : { failureReason: value.failureReason }),
  });
}

function parseColdProcessData(record: Record<string, unknown>): DecodeResult<ColdProcessData> {
  const ambientTempC = parseOptionalNumber(record, "ambientTempC", "processData.ambientTempC");
  const oilTempC = parseOptionalNumber(record, "oilTempC", "processData.oilTempC");
  const lyeTempC = parseOptionalNumber(record, "lyeTempC", "processData.lyeTempC");
  const mixingTempC = parseOptionalNumber(record, "mixingTempC", "processData.mixingTempC");
  const traceTimeMinutes = parseOptionalNumber(record, "traceTimeMinutes", "processData.traceTimeMinutes");
  const designTechnique = parseOptionalString(record, "designTechnique", "processData.designTechnique");
  const moldName = parseOptionalString(record, "moldName", "processData.moldName");
  const notes = parseOptionalString(record, "notes", "processData.notes");
  const tracePointAtPour = record.tracePointAtPour;
  if (tracePointAtPour !== undefined && tracePointAtPour !== "emulsion" && tracePointAtPour !== "light" && tracePointAtPour !== "medium" && tracePointAtPour !== "heavy") {
    return fail("processData.tracePointAtPour não é reconhecido.");
  }
  const gelPhase = record.gelPhase;
  if (gelPhase !== undefined && gelPhase !== "full" && gelPhase !== "partial" && gelPhase !== "none") {
    return fail("processData.gelPhase não é reconhecido.");
  }
  if (!ambientTempC.success) return ambientTempC;
  if (!oilTempC.success) return oilTempC;
  if (!lyeTempC.success) return lyeTempC;
  if (!mixingTempC.success) return mixingTempC;
  if (!traceTimeMinutes.success) return traceTimeMinutes;
  if (!designTechnique.success) return designTechnique;
  if (!moldName.success) return moldName;
  if (!notes.success) return notes;
  return ok({
    method: "cold_process",
    ...(ambientTempC.data === undefined ? {} : { ambientTempC: ambientTempC.data }),
    ...(oilTempC.data === undefined ? {} : { oilTempC: oilTempC.data }),
    ...(lyeTempC.data === undefined ? {} : { lyeTempC: lyeTempC.data }),
    ...(mixingTempC.data === undefined ? {} : { mixingTempC: mixingTempC.data }),
    ...(traceTimeMinutes.data === undefined ? {} : { traceTimeMinutes: traceTimeMinutes.data }),
    ...(tracePointAtPour === undefined ? {} : { tracePointAtPour }),
    ...(gelPhase === undefined ? {} : { gelPhase }),
    ...(designTechnique.data === undefined ? {} : { designTechnique: designTechnique.data }),
    ...(moldName.data === undefined ? {} : { moldName: moldName.data }),
    ...(notes.data === undefined ? {} : { notes: notes.data }),
  });
}

function parseHotProcessData(record: Record<string, unknown>): DecodeResult<HotProcessData> {
  const heatingMethod = record.heatingMethod;
  if (heatingMethod !== undefined && heatingMethod !== "slow_cooker" && heatingMethod !== "stove" && heatingMethod !== "water_bath" && heatingMethod !== "other") {
    return fail("processData.heatingMethod não é reconhecido.");
  }
  const cookTimeMinutes = parseOptionalNumber(record, "cookTimeMinutes", "processData.cookTimeMinutes");
  const moldName = parseOptionalString(record, "moldName", "processData.moldName");
  const notes = parseOptionalString(record, "notes", "processData.notes");
  if (!cookTimeMinutes.success) return cookTimeMinutes;
  if (!moldName.success) return moldName;
  if (!notes.success) return notes;
  return ok({
    method: "hot_process",
    ...(heatingMethod === undefined ? {} : { heatingMethod }),
    ...(cookTimeMinutes.data === undefined ? {} : { cookTimeMinutes: cookTimeMinutes.data }),
    ...(moldName.data === undefined ? {} : { moldName: moldName.data }),
    ...(notes.data === undefined ? {} : { notes: notes.data }),
  });
}

function parseMeltAndPourData(record: Record<string, unknown>): DecodeResult<MeltAndPourData> {
  const meltingMethod = record.meltingMethod;
  if (meltingMethod !== undefined && meltingMethod !== "microwave" && meltingMethod !== "water_bath" && meltingMethod !== "other") {
    return fail("processData.meltingMethod não é reconhecido.");
  }
  const pouringTemperatureC = parseOptionalNumber(record, "pouringTemperatureC", "processData.pouringTemperatureC");
  const unmoldTimeHours = parseOptionalNumber(record, "unmoldTimeHours", "processData.unmoldTimeHours");
  const notes = parseOptionalString(record, "notes", "processData.notes");
  if (record.bubblesObserved !== undefined && typeof record.bubblesObserved !== "boolean") {
    return fail("processData.bubblesObserved deve ser booleano.");
  }
  if (!pouringTemperatureC.success) return pouringTemperatureC;
  if (!unmoldTimeHours.success) return unmoldTimeHours;
  if (!notes.success) return notes;
  return ok({
    method: "melt_and_pour",
    ...(meltingMethod === undefined ? {} : { meltingMethod }),
    ...(pouringTemperatureC.data === undefined ? {} : { pouringTemperatureC: pouringTemperatureC.data }),
    ...(unmoldTimeHours.data === undefined ? {} : { unmoldTimeHours: unmoldTimeHours.data }),
    ...(record.bubblesObserved === undefined ? {} : { bubblesObserved: record.bubblesObserved }),
    ...(notes.data === undefined ? {} : { notes: notes.data }),
  });
}

function parseUsedOilProcessData(record: Record<string, unknown>): DecodeResult<UsedOilProcessData> {
  const oilSource = parseOptionalString(record, "oilSource", "processData.oilSource");
  const filtrationMethod = parseOptionalString(record, "filtrationMethod", "processData.filtrationMethod");
  const notes = parseOptionalString(record, "notes", "processData.notes");
  const intendedUse = record.intendedUse;
  if (intendedUse !== undefined && intendedUse !== "household_cleaning" && intendedUse !== "laundry" && intendedUse !== "other") {
    return fail("processData.intendedUse não é reconhecido.");
  }
  if (!oilSource.success) return oilSource;
  if (!filtrationMethod.success) return filtrationMethod;
  if (!notes.success) return notes;
  return ok({
    method: "used_oil",
    ...(oilSource.data === undefined ? {} : { oilSource: oilSource.data }),
    ...(filtrationMethod.data === undefined ? {} : { filtrationMethod: filtrationMethod.data }),
    ...(intendedUse === undefined ? {} : { intendedUse }),
    ...(notes.data === undefined ? {} : { notes: notes.data }),
  });
}

function parseOtherProcessData(record: Record<string, unknown>): DecodeResult<OtherProcessData> {
  const notes = parseOptionalString(record, "notes", "processData.notes");
  if (!notes.success) return notes;
  return ok({ method: "other", ...(notes.data === undefined ? {} : { notes: notes.data }) });
}

function parseProcessData(value: unknown): DecodeResult<BatchProcessData | undefined> {
  if (value === undefined) return ok(undefined);
  if (!isRecord(value)) return fail("processData deve ser um objeto.");
  switch (value.method) {
    case "cold_process": return parseColdProcessData(value);
    case "hot_process": return parseHotProcessData(value);
    case "melt_and_pour": return parseMeltAndPourData(value);
    case "used_oil": return parseUsedOilProcessData(value);
    case "other": return parseOtherProcessData(value);
    default: return fail("processData.method não é reconhecido.");
  }
}

function parseReadiness(value: unknown): DecodeResult<BatchReadiness | undefined> {
  if (value === undefined) return ok(undefined);
  if (!isRecord(value)) return fail("readiness deve ser um objeto.");

  if (value.kind === "cure" || value.kind === "stabilization") {
    const startDate = parseRequiredString(value, "startDate", "readiness.startDate");
    const targetEndDate = parseOptionalString(value, "targetEndDate", "readiness.targetEndDate");
    const actualEndDate = parseOptionalString(value, "actualEndDate", "readiness.actualEndDate");
    const daysPlanned = parseOptionalNumber(value, "daysPlanned", "readiness.daysPlanned");
    if (!startDate.success) return startDate;
    if (!targetEndDate.success) return targetEndDate;
    if (!actualEndDate.success) return actualEndDate;
    if (!daysPlanned.success) return daysPlanned;
    return ok({
      kind: value.kind,
      startDate: startDate.data,
      ...(targetEndDate.data === undefined ? {} : { targetEndDate: targetEndDate.data }),
      ...(actualEndDate.data === undefined ? {} : { actualEndDate: actualEndDate.data }),
      ...(daysPlanned.data === undefined ? {} : { daysPlanned: daysPlanned.data }),
    });
  }

  if (value.kind === "unmold") {
    const expectedAt = parseRequiredString(value, "expectedAt", "readiness.expectedAt");
    const completedAt = parseOptionalString(value, "completedAt", "readiness.completedAt");
    if (!expectedAt.success) return expectedAt;
    if (!completedAt.success) return completedAt;
    return ok({
      kind: "unmold",
      expectedAt: expectedAt.data,
      ...(completedAt.data === undefined ? {} : { completedAt: completedAt.data }),
    });
  }

  if (value.kind === "custom") {
    const label = parseRequiredString(value, "label", "readiness.label");
    const targetDate = parseOptionalString(value, "targetDate", "readiness.targetDate");
    const completedDate = parseOptionalString(value, "completedDate", "readiness.completedDate");
    const notes = parseOptionalString(value, "notes", "readiness.notes");
    if (!label.success) return label;
    if (!targetDate.success) return targetDate;
    if (!completedDate.success) return completedDate;
    if (!notes.success) return notes;
    return ok({
      kind: "custom",
      label: label.data,
      ...(targetDate.data === undefined ? {} : { targetDate: targetDate.data }),
      ...(completedDate.data === undefined ? {} : { completedDate: completedDate.data }),
      ...(notes.data === undefined ? {} : { notes: notes.data }),
    });
  }

  return fail("readiness.kind não é reconhecido.");
}

function parseLegacyCure(value: unknown): DecodeResult<LegacyBatchCure> {
  if (!isRecord(value)) return fail("legacyData.unmappedCure deve ser um objeto.");
  const startDate = parseRequiredString(value, "startDate", "legacyData.unmappedCure.startDate");
  const targetEndDate = parseOptionalString(value, "targetEndDate", "legacyData.unmappedCure.targetEndDate");
  const actualEndDate = parseOptionalString(value, "actualEndDate", "legacyData.unmappedCure.actualEndDate");
  const daysPlanned = parseOptionalNumber(value, "daysPlanned", "legacyData.unmappedCure.daysPlanned");
  if (!startDate.success) return startDate;
  if (!targetEndDate.success) return targetEndDate;
  if (!actualEndDate.success) return actualEndDate;
  if (!daysPlanned.success) return daysPlanned;
  return ok({
    startDate: startDate.data,
    ...(targetEndDate.data === undefined ? {} : { targetEndDate: targetEndDate.data }),
    ...(actualEndDate.data === undefined ? {} : { actualEndDate: actualEndDate.data }),
    ...(daysPlanned.data === undefined ? {} : { daysPlanned: daysPlanned.data }),
  });
}

function parseLegacyData(value: unknown): DecodeResult<LegacyBatchData | undefined> {
  if (value === undefined) return ok(undefined);
  if (!isRecord(value)) return fail("legacyData deve ser um objeto.");
  if (value.sourceSchemaVersion !== 1) return fail("legacyData.sourceSchemaVersion deve ser 1.");
  if (value.unmappedProcess !== undefined && !isRecord(value.unmappedProcess)) {
    return fail("legacyData.unmappedProcess deve ser um objeto.");
  }
  if (value.unmappedFields !== undefined && !isRecord(value.unmappedFields)) {
    return fail("legacyData.unmappedFields deve ser um objeto.");
  }
  const unmappedCure = value.unmappedCure === undefined ? ok(undefined) : parseLegacyCure(value.unmappedCure);
  if (!unmappedCure.success) return unmappedCure;
  return ok({
    sourceSchemaVersion: 1,
    ...(value.unmappedProcess === undefined ? {} : { unmappedProcess: { ...value.unmappedProcess } }),
    ...(unmappedCure.data === undefined ? {} : { unmappedCure: unmappedCure.data }),
    ...(value.unmappedFields === undefined ? {} : { unmappedFields: { ...value.unmappedFields } }),
  });
}

export function decodeStoredBatchV1(raw: unknown): DecodeResult<StoredBatchV1> {
  const result = validateBatch(raw);
  return result.success ? ok(result.data) : fail(result.reason);
}

export function decodeStoredBatchV2(raw: unknown): DecodeResult<StoredBatchV2> {
  if (!isRecord(raw)) return fail("o lote deve ser um objeto.");
  if (raw.schemaVersion !== 2) return fail("schemaVersion deve ser 2.");

  const id = parseRequiredString(raw, "id", "id");
  const batchCode = parseRequiredString(raw, "batchCode", "batchCode");
  const name = parseRequiredString(raw, "name", "name");
  const method = parseMethod(raw.method);
  const createdAt = parseRequiredString(raw, "createdAt", "createdAt");
  const updatedAt = parseRequiredString(raw, "updatedAt", "updatedAt");
  const batchDate = parseRequiredString(raw, "batchDate", "batchDate");
  const source = parseSource(raw.source);
  const formula = parseTransitionalFormula(raw.formula);
  const processData = parseProcessData(raw.processData);
  const readiness = parseReadiness(raw.readiness);
  const yieldData = parseYield(raw.yield);
  const result = parseResult(raw.result);
  const status = parseStatus(raw.status);
  const legacyData = parseLegacyData(raw.legacyData);

  if (!id.success) return id;
  if (!batchCode.success) return batchCode;
  if (!name.success) return name;
  if (!method.success) return method;
  if (!createdAt.success) return createdAt;
  if (!updatedAt.success) return updatedAt;
  if (!batchDate.success) return batchDate;
  if (!source.success) return source;
  if (!formula.success) return formula;
  if (!processData.success) return processData;
  if (!readiness.success) return readiness;
  if (!yieldData.success) return yieldData;
  if (!result.success) return result;
  if (!status.success) return status;
  if (!legacyData.success) return legacyData;

  const tags = raw.tags === undefined ? ok(undefined) : parseStringArray(raw.tags, "tags");
  const photoIds = raw.photoIds === undefined ? ok(undefined) : parseStringArray(raw.photoIds, "photoIds");
  if (!tags.success) return tags;
  if (!photoIds.success) return photoIds;

  const processError = validateProcessDataForMethod(method.data, processData.data);
  if (processError) return fail(processError);
  const readinessError = validateReadinessForMethod(method.data, readiness.data);
  if (readinessError) return fail(readinessError);

  return ok({
    schemaVersion: 2,
    id: id.data,
    batchCode: batchCode.data,
    name: name.data,
    method: method.data,
    createdAt: createdAt.data,
    updatedAt: updatedAt.data,
    batchDate: batchDate.data,
    source: source.data,
    formula: formula.data,
    ...(processData.data === undefined ? {} : { processData: processData.data }),
    ...(readiness.data === undefined ? {} : { readiness: readiness.data }),
    ...(yieldData.data === undefined ? {} : { yield: yieldData.data }),
    ...(result.data === undefined ? {} : { result: result.data }),
    status: status.data,
    ...(tags.data === undefined ? {} : { tags: tags.data }),
    ...(photoIds.data === undefined ? {} : { photoIds: photoIds.data }),
    ...(legacyData.data === undefined ? {} : { legacyData: legacyData.data }),
  });
}

export function decodeStoredBatch(raw: unknown): DecodeResult<StoredBatch> {
  if (!isRecord(raw)) return fail("o lote deve ser um objeto.");
  if (raw.schemaVersion === 2) return decodeStoredBatchV2(raw);
  if (raw.version === 1) return decodeStoredBatchV1(raw);
  return fail("versão de schema do lote não é reconhecida.");
}

function cloneFormula(formula: TransitionalBatchFormula): TransitionalBatchFormula {
  return {
    ...formula,
    oils: formula.oils.map((oil) => ({ ...oil })),
    ...(formula.additives === undefined ? {} : { additives: formula.additives.map((additive) => ({ ...additive })) }),
  };
}

function cloneCure(cure: LegacyBatchCure): LegacyBatchCure {
  return { ...cure };
}

const V1_TOP_LEVEL_KEYS = new Set([
  "id", "batchCode", "name", "method", "createdAt", "updatedAt", "batchDate",
  "source", "formula", "process", "yield", "cure", "result", "status", "tags", "photoIds", "version",
]);

function pickUnmappedV1Fields(batch: StoredBatchV1): Record<string, unknown> | undefined {
  const raw = batch as unknown;
  if (!isRecord(raw)) return undefined;
  const fields = Object.fromEntries(Object.entries(raw).filter(([key]) => !V1_TOP_LEVEL_KEYS.has(key)));
  return Object.keys(fields).length > 0 ? fields : undefined;
}

function normalizeColdProcess(legacyProcess: Record<string, unknown> | undefined): {
  processData?: ColdProcessData;
  unmappedProcess?: Record<string, unknown>;
} {
  if (!legacyProcess) return {};
  const mappedKeys = new Set([
    "ambientTemp", "oilTemp", "lyeTemp", "mixingTemp", "traceTimeMinutes", "moldName", "notes",
  ]);
  const unmappedProcess = Object.fromEntries(
    Object.entries(legacyProcess).filter(([key]) => !mappedKeys.has(key)),
  );
  return {
    processData: {
      method: "cold_process",
      ...(legacyProcess.ambientTemp === undefined ? {} : { ambientTempC: legacyProcess.ambientTemp as number }),
      ...(legacyProcess.oilTemp === undefined ? {} : { oilTempC: legacyProcess.oilTemp as number }),
      ...(legacyProcess.lyeTemp === undefined ? {} : { lyeTempC: legacyProcess.lyeTemp as number }),
      ...(legacyProcess.mixingTemp === undefined ? {} : { mixingTempC: legacyProcess.mixingTemp as number }),
      ...(legacyProcess.traceTimeMinutes === undefined ? {} : { traceTimeMinutes: legacyProcess.traceTimeMinutes as number }),
      ...(legacyProcess.moldName === undefined ? {} : { moldName: legacyProcess.moldName as string }),
      ...(legacyProcess.notes === undefined ? {} : { notes: legacyProcess.notes as string }),
    },
    ...(Object.keys(unmappedProcess).length === 0 ? {} : { unmappedProcess }),
  };
}

export function normalizeStoredBatchV1(batch: StoredBatchV1): BatchV2 {
  const rawProcess = batch.process as unknown;
  const legacyProcess = isRecord(rawProcess) ? { ...rawProcess } : undefined;
  const coldProcess = batch.method === "cold_process" ? normalizeColdProcess(legacyProcess) : {};
  const unmappedProcess = batch.method === "cold_process" ? coldProcess.unmappedProcess : legacyProcess;
  const unmappedFields = pickUnmappedV1Fields(batch);

  const legacyData: LegacyBatchData = {
    sourceSchemaVersion: 1,
    ...(unmappedProcess === undefined ? {} : { unmappedProcess }),
    ...(batch.method === "cold_process" ? {} : { unmappedCure: cloneCure(batch.cure) }),
    ...(unmappedFields === undefined ? {} : { unmappedFields }),
  };

  return {
    schemaVersion: 2,
    id: batch.id,
    batchCode: batch.batchCode,
    name: batch.name,
    method: batch.method,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
    batchDate: batch.batchDate,
    source: { ...batch.source },
    formula: cloneFormula(batch.formula),
    ...(coldProcess.processData === undefined ? {} : { processData: coldProcess.processData }),
    ...(batch.method === "cold_process"
      ? {
          readiness: {
            kind: "cure" as const,
            ...cloneCure(batch.cure),
          },
        }
      : {}),
    ...(batch.yield === undefined ? {} : { yield: { ...batch.yield } }),
    ...(batch.result === undefined ? {} : { result: { ...batch.result } }),
    status: batch.status,
    ...(batch.tags === undefined ? {} : { tags: [...batch.tags] }),
    ...(batch.photoIds === undefined ? {} : { photoIds: [...batch.photoIds] }),
    legacyData,
  };
}

export function normalizeStoredBatchV2(batch: StoredBatchV2): BatchV2 {
  return batch;
}

export function normalizeBatch(raw: unknown): DecodeResult<BatchV2> {
  const decoded = decodeStoredBatch(raw);
  if (!decoded.success) return decoded;
  return "schemaVersion" in decoded.data
    ? ok(normalizeStoredBatchV2(decoded.data))
    : ok(normalizeStoredBatchV1(decoded.data));
}
