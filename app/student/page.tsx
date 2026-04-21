import { StudentIcon } from "@/components/icons";
import { StudentForm } from "@/components/student-form";

export default function StudentPage() {
  return (
    <main className="shell">
      <section className="panel hero compact-hero student-hero">
        <div className="section-kicker">
          <StudentIcon className="kicker-icon" />
          <p className="eyebrow">Student Input</p>
        </div>
        <h1>提交本组实验数据</h1>
        <p>
          输入小组号后，系统只显示本组对应的一行实验信息。当前实验共 11 组，
          重点带电体名称会用红色标出。
        </p>
      </section>
      <StudentForm />
    </main>
  );
}
