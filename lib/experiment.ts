export type ExperimentResult = "相互排斥" | "相互吸引" | null;

export type ExperimentRow = {
  group_no: number;
  charged_object: string;
  glass_result: ExperimentResult;
  rubber_result: ExperimentResult;
  updated_at: string | null;
};

export type StudentSubmissionPayload = {
  groupNo: number;
  glassResult: Exclude<ExperimentResult, null>;
  rubberResult: Exclude<ExperimentResult, null>;
};

export type ChargedObjectDefinition = {
  fullText: string;
  emphasis: string;
};

export const RESULT_REPEL: Exclude<ExperimentResult, null> = "相互排斥";
export const RESULT_ATTRACT: Exclude<ExperimentResult, null> = "相互吸引";

export const CHARGED_OBJECTS: ChargedObjectDefinition[] = [
  { fullText: "毛皮摩擦过的PVC管", emphasis: "PVC管" },
  { fullText: "头发摩擦过的气球", emphasis: "气球" },
  { fullText: "纸巾摩擦过的吸管", emphasis: "吸管" },
  { fullText: "丝绸摩擦过的塑料盒", emphasis: "塑料盒" },
  { fullText: "塑料袋摩擦过的桶", emphasis: "桶" },
  { fullText: "毛巾摩擦过的试管", emphasis: "试管" }
] as const;

export const TOTAL_GROUPS = CHARGED_OBJECTS.length;

export function isValidGroupNo(input: number) {
  return Number.isInteger(input) && input >= 1 && input <= TOTAL_GROUPS;
}

export function isExperimentResult(value: unknown): value is Exclude<ExperimentResult, null> {
  return value === RESULT_REPEL || value === RESULT_ATTRACT;
}

export function getResultTone(value: ExperimentResult) {
  if (value === RESULT_REPEL) {
    return "repel";
  }

  if (value === RESULT_ATTRACT) {
    return "attract";
  }

  return "pending";
}

export function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "尚未提交";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short",
    timeStyle: "medium"
  }).format(new Date(value));
}

export function countSubmittedRows(rows: ExperimentRow[]) {
  return rows.filter((row) => row.glass_result !== null && row.rubber_result !== null).length;
}

export function getLatestUpdatedAt(rows: ExperimentRow[]) {
  return (
    rows
      .map((row) => row.updated_at)
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null
  );
}

export function getChargedObjectDefinition(groupNo: number) {
  return CHARGED_OBJECTS[groupNo - 1] ?? null;
}

export function getDisplayChargedObject(groupNo: number, fallback?: string | null) {
  return getChargedObjectDefinition(groupNo)?.fullText ?? fallback ?? "";
}
