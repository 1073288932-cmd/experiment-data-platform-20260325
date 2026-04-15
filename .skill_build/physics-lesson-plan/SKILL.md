---
name: "physics-lesson-plan"
description: "Generate and refine Chinese junior-high physics lesson plans from Word lesson drafts or classroom transcripts. Use the bundled fixed Word template, bundled DOCX/PDF processing skills, the bundled Su Ke edition grade-8 physics Markdown textbook with images, confirmed learning objectives, confirmed question chains, a scripted DOCX template filler, and formal but vivid teacher-student process writing."
---

# Physics Lesson Plan

Use this skill to turn a Chinese junior-high physics Word lesson plan or classroom transcript into a completed school-template Word lesson plan.

This skill is self-contained for Codex and Claude Code. It bundles:

- DOCX handling skill: `bundled-skills/docx/SKILL.md`
- PDF handling skill: `bundled-skills/pdf/SKILL.md`
- Textbook Markdown: `assets/textbooks/八下课本/MinerU_markdown_202604150001640_b3d8830b.md`
- Textbook index: `assets/textbooks/八下课本/INDEX.md`
- Textbook images: `assets/textbooks/八下课本/images/`
- Word template: `assets/templates/模板.docx` and ASCII alias `assets/templates/lesson-template.docx`
- Template filling script: `scripts/fill_lesson_template.ps1`

## CRITICAL Workflow

1. Read required source files before writing.
   - Read the user lesson plan or classroom transcript.
   - Read the bundled Word template structure.
   - Read the relevant textbook section from the bundled Markdown textbook unless the user supplies a newer textbook.
   - Read any image-based requirements or examples supplied by the user.
2. If DOCX processing is needed, read `bundled-skills/docx/SKILL.md`.
3. If PDF processing is needed for user-supplied PDFs, read `bundled-skills/pdf/SKILL.md`; DO NOT use PDF extraction for the bundled textbook by default.
4. Extract lesson facts: topic, grade, textbook version, lesson type,课时, content,学情,重难点, activities, experiments, evaluation, homework, board design.
5. Ask for missing administrative facts before final Word generation when they cannot be inferred safely.
6. Generate learning objectives first and stop for user confirmation.
7. Generate the question chain only after objectives are confirmed, then stop for user confirmation.
8. Generate the full Word lesson plan only after both objectives and question chain are confirmed.
9. Generate the final Word file by copying the bundled template and filling its existing tables. Prefer `scripts/fill_lesson_template.ps1`. DO NOT draw a replacement table.
10. Validate the output and report exactly what was checked.

## Non-Negotiable Rules

- NEVER edit a file before reading it. Reason: editing unread files risks destroying the template structure, user changes, or document-specific formatting.
- NEVER claim a DOCX/PDF was inspected unless it was actually opened, parsed, rendered, or structurally read. Reason: users rely on this claim to judge whether the output is trustworthy.
- NEVER invent missing course facts such as lesson date, class, grade, textbook version, or课时. Reason: administrative guesses can make the final document unusable.
- NEVER skip the objective-confirmation step. Reason: objectives control task design, evaluation, and question sequencing.
- NEVER skip the question-chain-confirmation step. Reason: the question chain is the classroom spine and must reflect the teacher's preferred teaching logic.
- NEVER use unconfirmed draft objectives or questions after the user revises them. Reason: the user's revision is the source of truth.
- NEVER generate a question chain without checking the Markdown textbook section when a textbook is available. Reason: the lesson must reflect textbook-designed activities, not only the source lesson draft.
- NEVER read the bundled textbook PDF for routine lesson planning if the Markdown textbook is present. Reason: PDF extraction is slow in Claude Code and was replaced by Markdown for fast lookup.
- NEVER create the final lesson plan in free-form prose only. Reason: the required output must preserve the bundled Word template's table structure.
- NEVER use a newly invented table layout when the bundled template is available. Reason: the user requires the exact template table format, not a visually similar replacement.
- NEVER rebuild the lesson-plan table from scratch. Reason: re-created tables usually differ from the school template in merged cells, row heights, widths, and WPS rendering.
- NEVER split the original template's first table into multiple smaller tables. Reason: the bundled template has a known structure, and splitting it proves the template was not preserved.
- NEVER say the template XML is too complex for completion before running or inspecting `scripts/fill_lesson_template.ps1`. Reason: the script exists specifically to copy the real template and fill its existing XML safely.
- NEVER leave `教学目标`, `板书设计`, `作业布置`, or `教后记` blank in the final Word. Reason: these are required template cells.
- NEVER put only `（课后填写）` in `教后记`. Reason: the user requires the table to be filled; write a usable reflective note unless explicitly told to leave it blank.
- NEVER say a long task succeeded until command output or file inspection proves it. Reason: task progress is unknowable while the operation is still running.
- DO NOT put `问题链` as a meta label in final `教学环节` or `设计意图` cells. Reason: those cells should stay concise and polished.
- DO put explicit check labels such as `问题1：...` and `活动一：...` inside the final `教与学活动` cell. Reason: the teacher and AI need to verify that every confirmed question and activity is used.
- DO NOT fill the `学习评价` cell with long explanatory text when the template provides options. Reason: in this template the cell should only mark options such as `√ A.即时练习　√ B.当堂检测　√ C.展示汇报`.
- DO NOT output rigid checklist headings such as `教师提出`, `学生预设`, `教师追问`, `活动承接`, `评价反馈`, `过渡提升` as repeated visible subheadings in the final teaching process. Reason: those headings make the lesson stiff and formulaic; they are an internal completeness checklist, not classroom language.
- DO NOT output experiment activities as bracketed fragments such as `【器材】`, `【操作】`, `【记录】`, `【交流】`, `【结论】` unless the user explicitly asks for that style. Reason: the user wants vivid teacher-student interaction and teachable classroom behavior, not a lab-report skeleton.
- DO NOT merely list questions separately and then ignore them. Reason: confirmed questions must drive teacher prompts, student responses, experiment choices, transitions, and summaries.
- DO NOT omit any confirmed question from the final teaching process. Reason: the second confirmation step becomes meaningless if the final classroom design does not use the confirmed questions.
- DO NOT compress an experiment or inquiry stage into one short paragraph. Reason: physics lessons must show apparatus use, operation sequence, evidence collection, analysis, conclusion, and teacher feedback.
- DO NOT use emoji. Reason: lesson-plan communication should remain formal and compact.
- DO NOT use three sentences when one clear sentence is enough. Reason: concise communication makes confirmation steps easier for the teacher.

## Textbook Markdown Procedure

CRITICAL: Always use the bundled Markdown textbook unless the user provides a different textbook file.

1. Open `assets/textbooks/八下课本/INDEX.md` first.
2. Locate the lesson title, chapter title, or activity line number in the index.
3. Read only the relevant slice of `assets/textbooks/八下课本/MinerU_markdown_202604150001640_b3d8830b.md`.
4. If the Markdown section references images, inspect referenced files under `assets/textbooks/八下课本/images/` only when image content matters for activity design.
5. Use text search before broad reading. Recommended searches: lesson title, activity title, and textbook prompts such as `你选用了哪些器材`.
6. DO NOT scan the whole Markdown file when title or index lookup can locate the lesson. Reason: full-file reading wastes context and slows Claude Code.
7. Extract the textbook learning path:情境图, opening prompts,活动,体验与猜想,实验与验证,交流与讨论, apparatus lists, original textbook questions, example problems,反思,实践与练习.
8. Preserve textbook-designed activities whenever relevant, especially prompts asking students to choose apparatus and explain experiment process and conclusion.
9. If Markdown lookup fails, say exactly what failed and ask for a page image or a lesson title. DO NOT invent textbook content. Reason: invented textbook links break alignment with the actual book.

## CRITICAL Word Template Filling Procedure

Use this exact procedure for the final Word deliverable.

1. Copy `assets/templates/lesson-template.docx` or `assets/templates/模板.docx` to the output path.
2. Read the copied DOCX structure before editing it.
3. Confirm the copied template has exactly 3 tables:
   - Table 0: 14 rows, course information, objectives, evaluation, methods, and a short flow placeholder.
   - Table 1: 2 rows before expansion, headers `教学环节 / 教与学活动 / 设计意图`.
   - Table 2: 4 rows, `板书设计 / 作业布置 / 教后记`.
4. Fill existing cells in Table 0 and Table 2.
5. For Table 1, clone the existing blank process row, append one cloned row per teaching stage, then delete or overwrite the original blank row.
6. Preserve merged cells, table widths, borders, and paragraph styles from the copied template.
7. If using OOXML, replace only necessary content in `word/document.xml`.
8. DO NOT create a new DOCX from Markdown. Reason: Markdown-to-DOCX conversion will draw a different table and lose the school template.
9. DO NOT create a new table that merely resembles the template. Reason: visual similarity is not enough; the file must be based on the actual template.
10. Final validation must fail if the output does not have exactly 3 tables with row counts matching the filled-template pattern.

## Template Filling Script

Use `scripts/fill_lesson_template.ps1` for the final Word file unless the user explicitly asks for another method.

```powershell
powershell -ExecutionPolicy Bypass -File "<skill-root>\scripts\fill_lesson_template.ps1" -InputJson "<lesson-data.json>" -OutputDocx "<output.docx>"
```

The script copies `assets/templates/lesson-template.docx`, clears the copied file's read-only flag, fills the existing template tables, expands the teaching-process table, writes `word/document.xml` with forward slash ZIP paths, and validates table count.

For script stability in Windows PowerShell 5.1, use ASCII option keys in JSON:

- `meansChecks`: `ppt`, `worksheet`, `micro-video`, `image`, `model`, `object`, `experiment`, `it`
- `methodChecks`: `lecture`, `dialogue`, `cooperation`, `practice`, `experiment`, `modeling`, `project`

Minimum JSON shape:

```json
{
  "course": {
    "theme": "课题",
    "date": "上课日期",
    "lessonType": "A1. 新授课",
    "description": "B1. 常态课",
    "contentAnalysis": "教学内容及学情简析",
    "objectives": "确认后的教学目标",
    "evaluation": "√ A.即时练习　√ B.当堂检测　√ C.展示汇报",
    "keyDifficult": "教学重点与难点",
    "breakthrough": "重难点突破策略",
    "seatForm": "B. 小组合作式",
    "meansChecks": ["ppt", "worksheet", "experiment"],
    "methodChecks": ["lecture", "dialogue", "cooperation", "experiment"],
    "flowSummary": "教学流程简要概括"
  },
  "processRows": [
    {
      "stage": "简洁教学环节",
      "activity": "活动一：...\n问题1：...\n师：...\n生：...",
      "intention": "简洁设计意图"
    }
  ],
  "board": "板书设计",
  "homework": "作业布置",
  "reflection": "教后记"
}
```

If the script fails, report the exact error and fix the input JSON or script. DO NOT tell the user that manual XML editing is required before attempting this script.

## Learning Objective Requirements

Write objectives in formal Chinese lesson-plan language. Preserve strong wording from the source lesson plan when it already meets the standard.

Each objective must cover one physics core-literacy dimension:

- 物理观念
- 科学思维
- 科学探究
- 科学态度与责任

Each objective must include the four elements:

- 行为主体: normally `学生`
- 行为表现: observable actions such as理解,区分,设计,完成,观察,记录,分析,解释,计算,归纳
- 行为条件: experiment, data, textbook activity, life situation, material, or problem context
- 行为程度:正确,合理,完整,规范,基于证据,能迁移应用

After drafting objectives, send only the objective confirmation draft and ask the user to confirm or revise it.

## Question Chain Requirements

Generate the question chain only after objectives are confirmed.

The confirmation draft should include at least 10 questions and, for each question, briefly state:

- Question content.
- Function, such as概念引入,情境冲突,体验观察,猜想提出,实验设计,证据归纳,概念建构,易错辨析,迁移应用.
- Related objective.
- Textbook basis when applicable.
- Teacher follow-up.

After the user confirms, embed the questions naturally into the teaching process. Keep `问题N：...` labels only as check anchors, not as a separate question-chain list.

CRITICAL: The final `教与学活动` cell must include every confirmed question as `问题1：...`, `问题2：...`, etc. These labels belong inside `教与学活动`, not in `教学环节` or `设计意图`.

## Teaching Process Requirements

The `教与学活动` cell must be detailed and teachable, similar in density to a strong source lesson plan.

CRITICAL: `教与学流程` is the core of the lesson plan. It must be complete enough that another teacher could teach from it directly.

For each teaching stage:

- Preserve and polish strong matching stages from the source lesson plan.
- Generate missing stages from textbook content when the confirmed question chain or textbook requires them.
- Include teacher actions, student actions, teacher-student dialogue, experiment operations, expected student responses, teacher follow-up, and evaluation feedback.
- Present dialogue with `师：` and `生：`.
- Keep `教学环节` concise, for example `情境导入，认识重力`.
- Keep `设计意图` concise and polished. Do not mention `问题链` in this cell.
- In `教与学活动`, list major activities as `活动一：...`, `活动二：...`.
- Every confirmed `问题N` must appear exactly once in final `教与学活动`, unless the user revised or deleted it.

For every confirmed question, internally check all six teaching functions below, but DO NOT print these six labels as repeated headings:

- Teacher prompt: the exact classroom question.
- Student response: at least one likely answer or misconception.
- Teacher follow-up: at least one follow-up question or clarification.
- Activity connection: what students do next, such as observe, discuss, measure, calculate, draw, explain, or report.
- Evaluation feedback: what evidence the teacher checks and how the teacher responds.
- Transition and lift: how this question leads to the next concept, activity, or question.

Better visible `教与学活动` style:

```text
活动二：探究重力与质量的关系
问题4：三个钩码总质量是单个钩码的3倍，总重是否也是3倍？
师：（举起一个钩码和三个相同钩码）“大家先不要急着计算，先判断：质量增加到3倍，重力会怎样变化？你的依据是什么？”
生：“可能也是3倍，因为钩码个数变多了。”
师：“这只是猜想。要把猜想变成证据，我们需要哪些器材？怎样测量才公平？”
学生小组讨论后选择弹簧测力计、钩码和铁架台，说明用同一只弹簧测力计依次测量1个、2个、3个钩码的重力，并记录质量与重力。
教师巡视时提醒学生读数视线要与刻度线相平，发现数据差异较大的小组，追问是否完成调零、是否让钩码静止后再读数。
汇报时，教师引导学生比较数据，概括“质量增大几倍，重力也近似增大几倍”，并自然过渡到“重力与质量是否成正比”的进一步判断。
```

For source lesson plans that already have detailed teacher/student activities:

- Preserve strong existing descriptions from the source.
- Insert confirmed `问题N` labels into matching places.
- Expand missing student responses, follow-up questions, feedback, and transitions.
- DO NOT discard detailed source material and replace it with a shorter generic summary. Reason: the user wants strong existing material retained and improved, not flattened.

For experiment-centered physics lessons, the process must explicitly cover:

- Which apparatus students choose.
- Why each apparatus is chosen.
- How variables are controlled.
- What students observe.
- What conclusion students draw.
- How the teacher evaluates whether the conclusion is evidence-based.

Final experiment writing must sound like classroom implementation: the teacher asks students to choose apparatus, students explain choices, groups operate and record, the teacher observes and prompts, students report evidence, and the teacher guides conclusion and correction. DO NOT output only `【器材】...【操作】...【记录】...【结论】...`.

If the process becomes too long, split drafting into two confirmation batches, such as first five stages and remaining stages. DO NOT silently shorten the teaching process.

## Final Document Requirements

The final document must include:

- `教学目标`: the confirmed objective text, not a newly generated substitute and not blank.
- `学习评价`: selected options only, unless the user requests narrative text.
- `教与学流程`: detailed stages with explicit question/activity labels in `教与学活动`.
- `板书设计`: a complete board plan.
- `作业布置`: complete homework.
- `教后记`: a concrete reflective note, not only `（课后填写）`.

## Communication Rules

- Be concise.
- Use formal Chinese for lesson-plan content.
- Use plain Chinese for process updates.
- Do not use emoji.
- Do not say a step succeeded until output proves it.
- If asked for progress while a command or document operation is still running, say it is still processing and do not guess the result.
- If a step was not done, say so directly and explain why.
- If a step was done, state the concrete check, for example: `已检查：3个表格存在，学习评价只保留勾选，正文未出现“问题链”字样。`

## Completion Checklist

Before final delivery, check:

- Objectives were confirmed or revised by the user.
- Question chain was confirmed or revised by the user.
- The relevant textbook section was read or extraction failure was reported.
- The bundled template file was used or the reason for not using it was reported.
- The scripted template filler was run, or the reason for not running it was reported.
- Confirmed questions are embedded in teacher-student activity, not merely listed.
- Every confirmed question appears in `教与学活动` as `问题N：...`.
- `学习评价` follows the template option format.
- `教学环节` and `设计意图` do not expose planning labels such as `问题链`.
- `教学目标`, `板书设计`, `作业布置`, and `教后记` are nonblank and complete.
- Apparatus-selection, experiment process, and conclusion stages are detailed.
- Teacher behavior, student behavior, teacher-student language, and feedback are present.
- Final DOCX has exactly 3 tables and is based on the copied bundled template.
- DOCX package contains `word/document.xml` with forward slash path.
- Report whether visual rendering/opening was actually performed.
