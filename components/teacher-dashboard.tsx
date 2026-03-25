"use client";

import { useEffect, useState } from "react";

import {
  countSubmittedRows,
  formatUpdatedAt,
  getLatestUpdatedAt,
  type ExperimentRow,
  TOTAL_GROUPS
} from "@/lib/experiment";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type TeacherDashboardProps = {
  initialRows: ExperimentRow[];
  token: string;
};

type ActionState = {
  kind: "idle" | "success" | "error";
  message: string;
};

const EMPTY_ACTION_STATE: ActionState = {
  kind: "idle",
  message: ""
};

export function TeacherDashboard({ initialRows, token }: TeacherDashboardProps) {
  const [rows, setRows] = useState(initialRows);
  const [syncMessage, setSyncMessage] = useState("已连接实时更新。");
  const [isResetting, setIsResetting] = useState(false);
  const [actionState, setActionState] = useState<ActionState>(EMPTY_ACTION_STATE);

  useEffect(() => {
    let isMounted = true;
    const supabase = createBrowserSupabaseClient();

    const refreshRows = async () => {
      try {
        const response = await fetch(`/api/teacher/rows?token=${encodeURIComponent(token)}`, {
          cache: "no-store"
        });
        const payload = (await response.json()) as { rows?: ExperimentRow[]; message?: string };

        if (!response.ok || !payload.rows) {
          throw new Error(payload.message ?? "刷新教师端数据失败。");
        }

        if (isMounted) {
          setRows(payload.rows);
          setSyncMessage(
            `最后同步：${new Intl.DateTimeFormat("zh-CN", { timeStyle: "medium" }).format(new Date())}`
          );
        }
      } catch (error) {
        if (isMounted) {
          setSyncMessage(error instanceof Error ? error.message : "实时同步失败。");
        }
      }
    };

    const channel = supabase
      .channel("experiment-rows-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "experiment_rows"
        },
        () => {
          void refreshRows();
        }
      )
      .subscribe((status) => {
        if (!isMounted) {
          return;
        }

        if (status === "SUBSCRIBED") {
          setSyncMessage("已连接实时更新。");
        } else if (status === "CHANNEL_ERROR") {
          setSyncMessage("实时连接失败，请检查 Supabase Realtime 与环境变量。");
        }
      });

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [token]);

  const handleReset = async () => {
    const confirmed = window.confirm("确认要清空本次实验数据吗？这会把 1 到 8 组的结果全部重置为空。");

    if (!confirmed) {
      return;
    }

    setIsResetting(true);
    setActionState(EMPTY_ACTION_STATE);

    try {
      const response = await fetch("/api/teacher/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      const payload = (await response.json()) as {
        rows?: ExperimentRow[];
        message?: string;
      };

      if (!response.ok || !payload.rows) {
        throw new Error(payload.message ?? "清空实验数据失败。");
      }

      setRows(payload.rows);
      setActionState({
        kind: "success",
        message: payload.message ?? "已清空本次实验数据。"
      });
      setSyncMessage(
        `最后同步：${new Intl.DateTimeFormat("zh-CN", { timeStyle: "medium" }).format(new Date())}`
      );
    } catch (error) {
      setActionState({
        kind: "error",
        message: error instanceof Error ? error.message : "清空实验数据失败。"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const submittedCount = countSubmittedRows(rows);
  const latestUpdatedAt = getLatestUpdatedAt(rows);

  return (
    <section className="teacher-top grid">
      <div className="stats-grid">
        <div className="stat-card">
          <p>已提交组数</p>
          <strong>{submittedCount}</strong>
        </div>
        <div className="stat-card">
          <p>未提交组数</p>
          <strong>{TOTAL_GROUPS - submittedCount}</strong>
        </div>
        <div className="stat-card">
          <p>最后提交时间</p>
          <strong style={{ fontSize: "1.1rem", lineHeight: 1.5 }}>{formatUpdatedAt(latestUpdatedAt)}</strong>
        </div>
      </div>

      <div className="panel card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap"
          }}
        >
          <div>
            <h2>全班实验总表</h2>
            <p className="hint">{syncMessage}</p>
          </div>
          <button className="button secondary" disabled={isResetting} onClick={handleReset} type="button">
            {isResetting ? "清空中..." : "一键清空本次实验数据"}
          </button>
        </div>

        {actionState.kind !== "idle" ? (
          <div className={`status ${actionState.kind === "success" ? "success" : "error"}`}>
            {actionState.message}
          </div>
        ) : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>组别</th>
                <th>带电体</th>
                <th>与丝绸摩擦过的玻璃棒</th>
                <th>与毛皮摩擦过的橡胶棒</th>
                <th>最后提交</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.group_no}>
                  <td>{row.group_no}</td>
                  <td>{row.charged_object}</td>
                  <td>
                    {row.glass_result === null ? <span className="muted">待填写</span> : <span className="pill">{row.glass_result}</span>}
                  </td>
                  <td>
                    {row.rubber_result === null ? <span className="muted">待填写</span> : <span className="pill">{row.rubber_result}</span>}
                  </td>
                  <td>{formatUpdatedAt(row.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
