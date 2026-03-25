import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">Not Found</p>
        <h1>页面不存在或访问令牌无效</h1>
        <p>请检查教师端链接中的 token 是否与环境变量 `TEACHER_SHARE_TOKEN` 保持一致。</p>
        <div className="hero-actions">
          <Link className="button-link" href="/">
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}

