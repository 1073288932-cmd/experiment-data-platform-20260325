"use client";

import { startTransition, useState } from "react";

import type { BinaryAnswer, ExperimentRow } from "@/lib/experiment";

type RequestState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const EMPTY_STATE: RequestState = { kind: "idle", message: "" };

type AnswerEditorProps = {
  id: string;
  title: string;
  value: BinaryAnswer;
  onChange: (value: Exclude<BinaryAnswer, null>) => void;
};

function AnswerEditor({ id, title, value, onChange }: AnswerEditorProps) {
  return (
    <div className="field">
      <label>{title}</label>
      <div className="choice-set">
        <div className="choice">
          <input
            checked={value === "1"}
            id={`${id}-1`}
            name={id}
            onChange={() => onChange("1")}
            type="radio"
            value="1"
          />
          <label htmlFor={`${id}-1`}>1 = 相互排斥</label>
        </div>
        <div className="choice">
          <input
            checked={value === "0"}
            id={`${id}-0`}
            name={id}
            onChange={() => onChange("0")}
            type="radio"
            value="0"
          />
          <label htmlFor={`${id}-0`}>0 = 相互吸引</label>
        </div>
      </div>
    </div>
  );
}

export function StudentForm() {
  const [groupInput, setGroupInput] = useState("");
  const [row, setRow] = useState<ExperimentRow | null>(null);
  const [glassResult, setGlassResult] = useState<BinaryAnswer>(null);
  const [rubberResult, setRubberResult] = useState<BinaryAnswer>(null);
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
          输入你的小组号，系统会只显示本组这一行。填写完成后点击提交，教师端会实时更新总表。
        </p>
        <div className="inline-form">
          <div className="field">
            <label htmlFor="group-input">小组号</label>
            <input
              id="group-input"
              inputMode="numeric"
              onChange={(event) => setGroupInput(event.target.value)}
              placeholder="例如：2"
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
                  <strong>{row.charged_object}</strong>
                </div>
              </div>

              <AnswerEditor
                id="glass-result"
                onChange={setGlassResult}
                title="与丝绸摩擦过的玻璃棒（填 1 或 0）"
                value={glassResult}
              />
              <AnswerEditor
                id="rubber-result"
                onChange={setRubberResult}
                title="与毛皮摩擦过的橡胶棒（填 1 或 0）"
                value={rubberResult}
              />

              <button className="button" disabled={isSubmitting} onClick={handleSubmit} type="button">
                {isSubmitting ? "提交中..." : "提交实验结果"}
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-note">
            先输入小组号并读取数据，然后系统才会展示你本组这一行的实验信息。
          </div>
        )}
      </div>

      <aside className="panel card">
        <h3>填写提示</h3>
        <p className="hint">
          第一版只支持固定实验模板。学生只需填写两项测量结果：
          <br />
          1 表示相互排斥。
          <br />
          0 表示相互吸引。
        </p>
        <p className="hint">
          同一小组可以再次提交，系统会保留最新值，并在教师端覆盖显示。
        </p>
      </aside>
    </section>
  );
}
