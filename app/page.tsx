import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">Classroom Data Flow</p>
        <h1>实验数据收集平台</h1>
        <p>
          学生端只填写自己小组的一行实验结果，教师端自动汇总全班数据，并通过 Supabase
          Realtime 订阅实现近实时刷新。
        </p>
        <div className="hero-actions">
          <Link className="button-link" href="/student">
            进入学生端
          </Link>
          <Link className="button-link secondary" href="/teacher/demo-token">
            教师端示例入口
          </Link>
        </div>
      </section>
    </main>
  );
}

