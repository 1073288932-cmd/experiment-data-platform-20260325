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

export const RESULT_REPEL: Exclude<ExperimentResult, null> = "相互排斥";
export const RESULT_ATTRACT: Exclude<ExperimentResult, null> = "相互吸引";

export const CHARGED_OBJECTS = [
  "毛皮摩擦过的梳子",
  "梳子摩擦过的毛皮",
  "干毛巾摩擦过的吸管",
  "塑料袋摩擦过的气球",
  "头皮摩擦过的塑料尺",
  "绒布摩擦过的塑料衣架",
  "毛衣摩擦过的泡沫塑料",
  "毛巾摩擦过的塑料餐盒"
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
  return rows
    .map((row) => row.updated_at)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;
}
