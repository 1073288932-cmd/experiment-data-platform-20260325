import { StudentForm } from "@/components/student-form";

export default function StudentPage() {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">Student Input</p>
        <h1>提交本组实验数据</h1>
        <p>输入小组号后，系统只展示本组的带电体和需要填写的两项结果。提交成功后，教师端会自动刷新总表。</p>
      </section>
      <StudentForm />
    </main>
  );
}
