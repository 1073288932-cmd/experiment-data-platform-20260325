import { notFound } from "next/navigation";

import { TeacherDashboard } from "@/components/teacher-dashboard";
import { listExperimentRows } from "@/lib/data";
import { getTeacherShareToken } from "@/lib/env";

export const dynamic = "force-dynamic";

type TeacherPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function TeacherPage({ params }: TeacherPageProps) {
  const { token } = await params;
  const shareToken = getTeacherShareToken();

  if (token !== shareToken) {
    notFound();
  }

  const rows = await listExperimentRows();

  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">Teacher Dashboard</p>
        <h1>课堂实验实时汇总</h1>
        <p>老师端会自动读取全班最新实验数据，并通过 Supabase Realtime 订阅在学生提交后即时刷新对应行。</p>
      </section>
      <TeacherDashboard initialRows={rows} token={token} />
    </main>
  );
}

