"use client";

import { startTransition, useState } from "react";

import { CheckIcon } from "@/components/icons";
import {
  type ExperimentResult,
  type ExperimentRow,
  getChargedObjectDefinition,
  getDisplayChargedObject,
  RESULT_ATTRACT,
  RESULT_REPEL,
  TOTAL_GROUPS
} from "@/lib/experiment";

type RequestState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const EMPTY_STATE: RequestState = { kind: "idle", message: "" };

const TEXT = {
  answerAttract: "\u76f8\u4e92\u5438\u5f15",
  answerRepel: "\u76f8\u4e92\u6392\u65a5",
  cardTitle: "\u5b66\u751f\u7aef\u586b\u5199",
  groupLabel: "\u5c0f\u7ec4\u53f7",
  readButton: "\u8bfb\u53d6\u672c\u7ec4\u6570\u636e",
  readingButton: "\u8bfb\u53d6\u4e2d...",
  groupMeta: "\u7ec4\u522b",
  objectMeta: "\u5e26\u7535\u4f53",
  submitButton: "\u63d0\u4ea4\u5b9e\u9a8c\u7ed3\u679c",
  submittingButton: "\u63d0\u4ea4\u4e2d...",
  glassTitle: "\u4e0e\u4e1d\u7ef8\u6469\u64e6\u8fc7\u7684\u73bb\u7483\u68d2",
  rubberTitle: "\u4e0e\u6bdb\u76ae\u6469\u64e6\u8fc7\u7684\u6a61\u80f6\u68d2",
  noteTitle: "\u586b\u5199\u63d0\u793a",
  invalidGroupEmpty: "\u8bf7\u5148\u8f93\u5165\u5c0f\u7ec4\u53f7\u3002",
  lookupFallback: "\u672a\u627e\u5230\u8be5\u5c0f\u7ec4\u3002",
  lookupFailed: "\u8bfb\u53d6\u6570\u636e\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002",
  readFirst: "\u8bf7\u5148\u8bfb\u53d6\u672c\u7ec4\u5b9e\u9a8c\u4fe1\u606f\u3002",
  completeAnswers: "\u8bf7\u5148\u5b8c\u6210\u4e24\u9879\u7ed3\u679c\u586b\u5199\u3002",
  submitFailed: "\u63d0\u4ea4\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002"
};

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
    <div className="field answer-field">
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
          <label htmlFor={`${id}-repel`}>
            <span>{TEXT.answerRepel}</span>
          </label>
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
          <label htmlFor={`${id}-attract`}>
            <span>{TEXT.answerAttract}</span>
          </label>
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
      setRequestState({ kind: "error", message: TEXT.invalidGroupEmpty });
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
        throw new Error(payload.message ?? TEXT.lookupFallback);
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
        message: error instanceof Error ? error.message : TEXT.lookupFailed
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!row) {
      setRequestState({ kind: "error", message: TEXT.readFirst });
      return;
    }

    if (glassResult === null || rubberResult === null) {
      setRequestState({ kind: "error", message: TEXT.completeAnswers });
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
        throw new Error(payload.message ?? TEXT.submitFailed);
      }

      startTransition(() => {
        setRow(rowData);
        setRequestState({
          kind: "success",
          message: `\u7b2c ${rowData.group_no} \u7ec4\u6570\u636e\u5df2\u63d0\u4ea4\uff0c\u6559\u5e08\u7aef\u4f1a\u81ea\u52a8\u770b\u5230\u6700\u65b0\u7ed3\u679c\u3002`
        });
      });
    } catch (error) {
      setRequestState({
        kind: "error",
        message: error instanceof Error ? error.message : TEXT.submitFailed
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid student-layout">
      <div className="panel card student-card">
        <div className="card-heading">
          <span className="mini-icon">
            <CheckIcon />
          </span>
          <div>
            <p className="eyebrow">Your Group</p>
            <h2>{TEXT.cardTitle}</h2>
          </div>
        </div>

        <p className="hint">
          {"\u8f93\u5165\u4f60\u7684\u5c0f\u7ec4\u53f7\uff0c\u7cfb\u7edf\u4f1a\u53ea\u663e\u793a\u672c\u7ec4\u8fd9\u4e00\u884c\u3002\u586b\u5199\u5b8c\u6210\u540e\u70b9\u51fb\u63d0\u4ea4\uff0c\u6559\u5e08\u7aef\u4f1a\u5b9e\u65f6\u66f4\u65b0\u603b\u8868\u3002"}
        </p>

        <div className="inline-form lookup-form">
          <div className="field">
            <label htmlFor="group-input">{TEXT.groupLabel}</label>
            <input
              id="group-input"
              inputMode="numeric"
              onChange={(event) => setGroupInput(event.target.value)}
              placeholder={`\u8bf7\u8f93\u5165 1 \u5230 ${TOTAL_GROUPS}`}
              value={groupInput}
            />
          </div>
          <button className="button" disabled={isLoading} onClick={handleLookup} type="button">
            {isLoading ? TEXT.readingButton : TEXT.readButton}
          </button>
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
                  <span>{TEXT.groupMeta}</span>
                  <strong>{row.group_no}</strong>
                </div>
                <div className="meta-box object-box">
                  <span>{TEXT.objectMeta}</span>
                  <strong>{renderChargedObject(row.group_no, row.charged_object)}</strong>
                </div>
              </div>

              <AnswerEditor
                id="glass-result"
                onChange={setGlassResult}
                title={TEXT.glassTitle}
                value={glassResult}
              />
              <AnswerEditor
                id="rubber-result"
                onChange={setRubberResult}
                title={TEXT.rubberTitle}
                value={rubberResult}
              />

              <button className="button submit-button" disabled={isSubmitting} onClick={handleSubmit} type="button">
                {isSubmitting ? TEXT.submittingButton : TEXT.submitButton}
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-note">
            {"\u5148\u8f93\u5165\u5c0f\u7ec4\u53f7\u5e76\u8bfb\u53d6\u6570\u636e\uff0c\u7136\u540e\u7cfb\u7edf\u4f1a\u5c55\u793a\u4f60\u672c\u7ec4\u8fd9\u4e00\u884c\u7684\u5b9e\u9a8c\u4fe1\u606f\u3002"}
          </div>
        )}
      </div>

      <aside className="panel card note-card">
        <p className="eyebrow">Notes</p>
        <h3>{TEXT.noteTitle}</h3>
        <p className="hint">
          {`\u5f53\u524d\u6a21\u677f\u56fa\u5b9a\u4e3a ${TOTAL_GROUPS} \u4e2a\u5c0f\u7ec4\u3002\u91cd\u70b9\u5e26\u7535\u4f53\u540d\u79f0\u4f1a\u7528\u7ea2\u8272\u6807\u51fa\uff0c\u65b9\u4fbf\u5feb\u901f\u6838\u5bf9\u672c\u7ec4\u5668\u6750\u3002`}
        </p>
        <p className="hint">
          {"\u540c\u4e00\u5c0f\u7ec4\u53ef\u4ee5\u518d\u6b21\u63d0\u4ea4\uff0c\u7cfb\u7edf\u4f1a\u4fdd\u7559\u6700\u65b0\u503c\uff0c\u5e76\u5728\u6559\u5e08\u7aef\u8986\u76d6\u663e\u793a\u3002"}
        </p>
      </aside>
    </section>
  );
}
