export type ExperimentResult = "\u76f8\u4e92\u6392\u65a5" | "\u76f8\u4e92\u5438\u5f15" | null;

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

export const RESULT_REPEL: Exclude<ExperimentResult, null> = "\u76f8\u4e92\u6392\u65a5";
export const RESULT_ATTRACT: Exclude<ExperimentResult, null> = "\u76f8\u4e92\u5438\u5f15";

export const CHARGED_OBJECTS: ChargedObjectDefinition[] = [
  { fullText: "\u6bdb\u76ae\u6469\u64e6\u8fc7\u7684PVC\u7ba1", emphasis: "PVC\u7ba1" },
  { fullText: "\u5934\u53d1\u6469\u64e6\u8fc7\u7684\u6c14\u7403", emphasis: "\u6c14\u7403" },
  { fullText: "\u7eb8\u5dfe\u6469\u64e6\u8fc7\u7684\u5438\u7ba1", emphasis: "\u5438\u7ba1" },
  { fullText: "\u5934\u53d1\u6469\u64e6\u8fc7\u7684\u5851\u6599\u7ba1", emphasis: "\u5851\u6599\u7ba1" },
  { fullText: "\u6bdb\u8863\u6469\u64e6\u8fc7\u7684\u523b\u5ea6\u5c3a", emphasis: "\u523b\u5ea6\u5c3a" },
  { fullText: "\u5934\u53d1\u6469\u64e6\u8fc7\u7684\u6c14\u7403", emphasis: "\u6c14\u7403" },
  { fullText: "\u4e1d\u7ef8\u6469\u64e6\u8fc7\u7684\u76d2\u5b50", emphasis: "\u76d2\u5b50" },
  { fullText: "\u7edd\u7f18\u624b\u5957\u6469\u64e6\u8fc7\u7684\u523b\u5ea6\u5c3a", emphasis: "\u523b\u5ea6\u5c3a" },
  { fullText: "\u767d\u5e03\u6469\u64e6\u8fc7\u7684\u4e9a\u514b\u529b\u677f", emphasis: "\u4e9a\u514b\u529b\u677f" },
  { fullText: "\u7edd\u7f18\u624b\u5957\u6469\u64e6\u8fc7\u7684\u523b\u5ea6\u5c3a", emphasis: "\u523b\u5ea6\u5c3a" },
  { fullText: "\u767d\u5e03\u6469\u64e6\u8fc7\u7684\u8bd5\u7ba1", emphasis: "\u8bd5\u7ba1" }
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
    return "\u5c1a\u672a\u63d0\u4ea4";
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
