import Link from "next/link";

import { getTeacherShareToken } from "@/lib/env";

export default function HomePage() {
  const teacherShareToken = getTeacherShareToken();

  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">Classroom Data Flow</p>
        <h1>实验数据收集平台</h1>
        <p>学生端按小组填写实验结果，教师端实时汇总全班数据。当前实验模板共 6 组，重点带电体名称会在页面中标红显示。</p>
        <div className="hero-actions">
          <Link className="button-link" href="/student">
            进入学生端
          </Link>
          <Link className="button-link secondary" href={`/teacher/${teacherShareToken}`}>
            教师端入口
          </Link>
        </div>
      </section>
    </main>
  );
}
