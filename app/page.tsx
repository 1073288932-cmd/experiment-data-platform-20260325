import Link from "next/link";

import { ArrowIcon, StudentIcon, TeacherIcon } from "@/components/icons";
import { getTeacherShareToken } from "@/lib/env";

export default function HomePage() {
  const teacherShareToken = getTeacherShareToken();

  return (
    <main className="shell home-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Classroom Data Flow</p>
          <h1>实验数据收集平台</h1>
          <p>
            为课堂实验设计的双端数据平台。学生只填写本组数据，教师端实时汇总全班 11 组结果，
            重点带电体名称会以红字标出，方便大屏讲评。
          </p>
        </div>

        <div className="hero-actions">
          <Link className="button-link" href="/student">
            <StudentIcon className="button-icon" />
            进入学生端
            <ArrowIcon className="button-arrow" />
          </Link>
          <Link className="button-link secondary" href={`/teacher/${teacherShareToken}`}>
            <TeacherIcon className="button-icon" />
            教师端入口
          </Link>
        </div>
      </section>
    </main>
  );
}
