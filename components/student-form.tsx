"use client";

import { startTransition, useState } from "react";

import {
  type ExperimentResult,
  type ExperimentRow,
  getChargedObjectDefinition,
  getDisplayChargedObject,
  RESULT_ATTRACT,
  RESULT_REPEL
} from "@/lib/experiment";

type RequestState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const EMPTY_STATE: RequestState = { kind: "idle", message: "" };

type AnswerEditorProps = {
  id: string;
  title: string;
  value: ExperimentResult;
  onChange: (value: Exclude<ExperimentResult, null>) => void;
};

function renderChargedObject(groupNo: number, fallback?: string | null) {
  const definition = getChargedObjectDefinition(groupNo);
  const text = getDisplayChargedObject(groupNo, fallback);

  if (!definition || !text.includes(definition.emphasis)) {
    return text;
  }

  const [prefix, suffix] = text.split(definition.emphasis);

  return (
    <>
      {prefix}
      <span className="charged-object-emphasis">{definition.emphasis}</span>
      {suffix}
    </>
  );
}

function AnswerEditor({ id, title, value, onChange }: AnswerEditorProps) {
  return (
    <div className="field">
      <label>{title}</label>
      <div className="choice-set">
        <div className="choice">
          <input
            checked={value === RESULT_REPEL}
            id={`${id}-repel`}
            name={id}
            onChange={() => onChange(RESULT_REPEL)}
            type="radio"
            value={RESULT_REPEL}
          />
          <label htmlFor={`${id}-repel`}>相互排斥</label>
        </div>
        <div className="choice">
          <input
            checked={value === RESULT_ATTRACT}
            id={`${id}-attract`}
            name={id}
            onChange={() => onChange(RESULT_ATTRACT)}
            type="radio"
            value={RESULT_ATTRACT}
          />
          <label htmlFor={`${id}-attract`}>相互吸引</label>
        </div>
      </div>
    </div>
  );
}

export function StudentForm() {
  const [groupInput, setGroupInput] = useState("");
  const [row, setRow] = useState<ExperimentRow | null>(null);
  const [glassResult, setGlassResult] = useState<ExperimentResult>(null);
  const [rubberResult, setRubberResult] = useState<ExperimentResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>(EMPTY_STATE);

  const handleLookup = async () => {
    const trimmed = groupInput.trim();
    if (!trimmed) {
      setRequestState({ kind: "error", message: "请先输入小组号。" });
      return;
    }

    setIsLoading(true);
    setRequestState(EMPTY_STATE);

    try {
      const response = await fetch(`/api/student?groupNo=${encodeURIComponent(trimmed)}`, {
        cache: "no-store"
      });
      const payload = (await response.json()) as { message?: string; row?: ExperimentRow };
      const rowData = payload.row;

      if (!response.ok || !rowData) {
        throw new Error(payload.message ?? "未找到该小组。");
      }

      startTransition(() => {
        setRow(rowData);
        setGlassResult(rowData.glass_result);
        setRubberResult(rowData.rubber_result);
      });
    } catch (error) {
      setRow(null);
      setGlassResult(null);
      setRubberResult(null);
      setRequestState({
        kind: "error",
        message: error instanceof Error ? error.message : "读取数据失败，请稍后重试。"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!row) {
      setRequestState({ kind: "error", message: "请先读取本组实验信息。" });
      return;
    }

    if (glassResult === null || rubberResult === null) {
      setRequestState({ kind: "error", message: "请先完成两项结果填写。" });
      return;
    }

    setIsSubmitting(true);
    setRequestState(EMPTY_STATE);

    try {
      const response = await fetch("/api/student/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupNo: row.group_no,
          glassResult,
          rubberResult
        })
      });

      const payload = (await response.json()) as { message?: string; row?: ExperimentRow };
      const rowData = payload.row;

      if (!response.ok || !rowData) {
        throw new Error(payload.message ?? "提交失败，请稍后重试。");
      }

      startTransition(() => {
        setRow(rowData);
        setRequestState({
          kind: "success",
          message: `第 ${rowData.group_no} 组数据已提交，老师端会自动看到最新结果。`
        });
      });
    } catch (error) {
      setRequestState({
        kind: "error",
        message: error instanceof Error ? error.message : "提交失败，请稍后重试。"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid student-layout">
      <div className="panel card">
        <h2>学生端填写</h2>
        <p className="hint">
          输入你的小组号，系统会只显示本组这一行。当前实验共 11 组，填写完成后点击提交，教师端会实时更新总表。
        </p>
        <div className="inline-form">
          <div className="field">
            <label htmlFor="group-input">小组号</label>
            <input
              id="group-input"
              inputMode="numeric"
              onChange={(event) => setGroupInput(event.target.value)}
              placeholder="请输入 1 到 11"
              value={groupInput}
            />
          </div>
          <div className="hero-actions">
            <button className="button" disabled={isLoading} onClick={handleLookup} type="button">
              {isLoading ? "读取中..." : "读取本组数据"}
            </button>
          </div>
        </div>

        {requestState.kind !== "idle" ? (
          <div className={`status ${requestState.kind === "success" ? "success" : "error"}`}>
            {requestState.message}
          </div>
        ) : null}

        {row ? (
          <div className="answer-grid">
            <div className="row-preview">
              <div className="meta-grid">
                <div className="meta-box">
                  <span>组别</span>
                  <strong>{row.group_no}</strong>
                </div>
                <div className="meta-box">
                  <span>带电体</span>
                  <strong>{renderChargedObject(row.group_no, row.charged_object)}</strong>
                </div>
              </div>

              <AnswerEditor
                id="glass-result"
                onChange={setGlassResult}
                title="与丝绸摩擦过的玻璃棒"
                value={glassResult}
              />
              <AnswerEditor
                id="rubber-result"
                onChange={setRubberResult}
                title="与毛皮摩擦过的橡胶棒"
                value={rubberResult}
              />

              <button className="button" disabled={isSubmitting} onClick={handleSubmit} type="button">
                {isSubmitting ? "提交中..." : "提交实验结果"}
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-note">先输入小组号并读取数据，然后系统会展示你本组这一行的实验信息。</div>
        )}
      </div>

      <aside className="panel card">
        <h3>填写提示</h3>
        <p className="hint">当前模板固定为 11 个小组。重点带电体名称会用红色标出，便于学生快速核对本组器材。</p>
        <p className="hint">同一小组可以再次提交，系统会保留最新值，并在教师端覆盖显示。</p>
      </aside>
    </section>
  );
}
