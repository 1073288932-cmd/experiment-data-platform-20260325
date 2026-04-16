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
- Deep question-chain reference: `references/deep-question-chain.md`
- Activity design reference: `references/activity-design.md`
- Teaching-process style reference: `references/teaching-process-style.md`

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
- NEVER pass a full lesson-plan JSON object directly inside a PowerShell command line. Reason: Chinese quotation marks, newlines, backslashes, and nested quotes are often parsed by PowerShell before the script receives them, causing false JSON failures or forcing an incomplete simplified JSON.
- NEVER replace the complete JSON with a simplified JSON just to make PowerShell parsing succeed. Reason: the simplified JSON usually drops teaching objectives, question labels, board design, reflection, or detailed process content, which makes the Word output incomplete.
- DO NOT use Chinese smart quotes `“ ” ‘ ’` as JSON syntax. Reason: valid JSON requires ASCII double quotes `"` for keys and string boundaries; Chinese punctuation may appear only inside already quoted string values.
- DO NOT put `问题链` as a meta label in final `教学环节` or `设计意图` cells. Reason: those cells should stay concise and polished.
- DO put explicit check labels such as `核心问题1：...`, `递进型问题1-1-1：...`, `探究型问题2-2-1：...`, `过渡型问题2-3-1：...`, `迁移型问题3-3-1：...`, and `活动一：...` inside the final `教与学活动` cell. Reason: the teacher and AI need to verify that every confirmed question and activity is used with its depth-learning function.
- DO NOT fill the `学习评价` cell with long explanatory text when the template provides options. Reason: in this template the cell should only mark options such as `√ A.即时练习　√ B.当堂检测　√ C.展示汇报`.
- DO NOT output rigid checklist headings such as `教师提出`, `学生预设`, `教师追问`, `活动承接`, `评价反馈`, `过渡提升` as repeated visible subheadings in the final teaching process. Reason: those headings make the lesson stiff and formulaic; they are an internal completeness checklist, not classroom language.
- DO NOT output experiment activities as bracketed fragments such as `【器材】`, `【操作】`, `【记录】`, `【交流】`, `【结论】` unless the user explicitly asks for that style. Reason: the user wants vivid teacher-student interaction and teachable classroom behavior, not a lab-report skeleton.
- DO NOT merely list questions separately and then ignore them. Reason: confirmed questions must drive teacher prompts, student responses, experiment choices, transitions, and summaries.
- DO NOT write the final teaching process as repeated one-question-one-answer pairs such as `师：... 生：... 师：... 生：...` with no classroom action between them. Reason: the user requires natural, concrete classroom implementation language, not a scripted Q&A outline.
- NEVER let question labels replace classroom writing. Reason: anchors such as `问题1：...`, `核心问题1：...`, and `活动一：...` are only coverage checkpoints; the body must still describe teacher setup, student operation,教师巡视,追问,反馈, and transition.
- DO NOT generate a shallow question chain made of isolated recall questions. Reason: the user requires deep-learning question chains that create concept construction, inquiry, transition, and transfer.
- DO NOT generate the question-chain confirmation draft without core questions and sub-question chains. Reason: a deep question chain must have an overall structure, not only ten parallel questions.
- DO NOT omit question-chain type labels in the confirmation draft. Reason: the user needs to verify core, progressive, transitional, inquiry, and transfer functions before Word generation.
- DO NOT omit any confirmed question from the final teaching process. Reason: the second confirmation step becomes meaningless if the final classroom design does not use the confirmed questions.
- NEVER create more than 5 major `活动N` labels in one lesson. Reason: an activity is a core student learning task, not every small teaching step; too many activities fragment the lesson and hide the main learning path.
- DO NOT label knowledge review, emotional elevation, routine practice, teacher explanation, formula calculation, homework assignment, or classroom summary as `活动N`. Reason: these segments may be necessary teaching links, but they are not core student-centered inquiry or thinking activities.
- DO NOT split one experiment into separate activities such as `设计实验方案`, `动手实验收集数据`, `数据汇总初步分析`, and `得出结论`. Reason: these are internal steps of the same inquiry activity, not independent activities.
- DO NOT create decorative or nominal activities where students only listen, copy, or answer recall questions. Reason: an activity must help students construct knowledge through purposeful thinking, doing, comparing, discussing, or transferring.
- NEVER copy the `一米长度认识` example from `references/activity-design.md` into a physics lesson plan unless the lesson itself is about length measurement. Reason: that example is a method source only; unrelated lesson plans must use the method, not the case content.
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

### PowerShell JSON Safety

CRITICAL: Always write the complete lesson data to a UTF-8 `.json` file first, then pass only the JSON file path to PowerShell. DO NOT pass the JSON object itself in `-Command`, `-InputJson`, or any inline argument.

Correct sequence:

1. Create or edit `lesson-data.json` as a normal file.
2. Validate the file:

```powershell
powershell -ExecutionPolicy Bypass -File "<skill-root>\scripts\validate_lesson_json.ps1" -InputJson "<lesson-data.json>"
```

3. Fill the Word template:

```powershell
powershell -ExecutionPolicy Bypass -File "<skill-root>\scripts\fill_lesson_template.ps1" -InputJson "<lesson-data.json>" -OutputDocx "<output.docx>"
```

If JSON validation fails, fix `lesson-data.json`; DO NOT simplify the schema and DO NOT remove required fields to bypass the error.

When a shell command must create the JSON file, use a single-quoted PowerShell here-string so the JSON is written as literal text. The opening `@'` and closing `'@` must each be alone on their own line:

```powershell
$json = @'
{
  "course": {
    "theme": "课题",
    "objectives": "学生能够……"
  },
  "processRows": []
}
'@
Set-Content -LiteralPath "<lesson-data.json>" -Value $json -Encoding UTF8
```

Prefer direct file editing over shell-created JSON when available. The final JSON must still use the complete schema below.

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
      "activity": "活动一：...\n**核心问题1：...**\n递进型问题1-1-1：...\n师：...\n生：...",
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

Before drafting the question chain, read `references/deep-question-chain.md`. Use the uploaded lesson plan and the relevant textbook section as the two main sources. Preserve strong existing activities from the uploaded lesson, and use the textbook to supply missing situations, experiments, apparatus choices, prompts, and transfer contexts.

The confirmation draft must use this table shape:

| 教学情境组织流程 | 问题链设计（如果有预设回答可以注明） | 问题链类型 |
|---|---|---|
| 核心问题1：... || 核心问题链 |
| 情境1：... | 1-1-1 ... | 递进型问题链 |
| 探究1：... | 1-2-1 ... | 探究型问题链 |
| 过渡：... | 1-3-1 ... | 过渡型问题链 |
| 核心问题2：... || 核心问题链 |
| 迁移情境：... | 2-1-1 ... | 迁移型问题链 |

CRITICAL requirements for the confirmation draft:

- Include 2 to 4 core questions. Core questions must come from the lesson key points and difficult points.
- Include at least 10 sub-questions across the whole chain.
- Cover all five types when the lesson content permits: 核心问题链, 递进型问题链, 过渡型问题链, 探究型问题链, 迁移型问题链.
- If the lesson has experiments, include inquiry questions for apparatus choice, experimental process, evidence collection, conclusion, and anomaly/error analysis.
- The later question must grow from the earlier question or answer. DO NOT write ten unrelated questions.
- Each sub-question must show its source or basis in concise wording, such as `教材活动`, `教材插图`, `上传教案原环节`, `生活情境`, or `实验数据`.
- At least three questions must require evidence, comparison, explanation, design, evaluation, or transfer, not simple recall.
- Include expected student thinking only when it helps the teacher judge depth; keep it concise.

Question-chain type standards:

- 核心问题链: organize the whole lesson around key/difficult points; students answer them after completing the sub-question chains.
- 递进型问题链: follow `情境呈现 -> 观察现象 -> 发现原因/共同特征 -> 归纳概念或规律`.
- 探究型问题链: follow `提出问题 -> 作出假设 -> 制定计划 -> 选择器材 -> 收集证据 -> 解释问题 -> 表达交流`.
- 过渡型问题链: connect knowledge points, activities, or core questions; make the need for the next learning stage visible.
- 迁移型问题链: apply the concept or law to a new real situation; prefer design, decision-making, explanation, or evaluation tasks.

After the user confirms, embed the questions naturally into the teaching process. Keep typed hierarchical labels such as `递进型问题1-1-1：...` as check anchors, not as a separate question-chain list.

CRITICAL: The final `教与学活动` cell must include every confirmed question with its confirmed type and hierarchical number, such as `核心问题1：...`, `递进型问题1-1-1：...`, `探究型问题2-2-1：...`, `过渡型问题2-3-1：...`, `迁移型问题3-3-1：...`. These labels belong inside `教与学活动`, not in `教学环节` or `设计意图`.

## Teaching Process Requirements

CRITICAL STYLE: Before writing final `教与学活动`, read `references/teaching-process-style.md`. Follow its natural classroom implementation style. The output must be closer to a polished teaching record than to a question-answer script.

The `教与学活动` cell must be detailed and teachable, similar in density to a strong source lesson plan.

CRITICAL: `教与学流程` is the core of the lesson plan. It must be complete enough that another teacher could teach from it directly.

Before drafting the teaching process, read `references/activity-design.md`. Use it to decide what counts as a major `活动N`, how to merge small links inside one activity, and how to make activities promote student thinking and core literacy. Extract methods only from the `一米长度认识` example; DO NOT output that example's content in unrelated physics lessons.

For each teaching stage:

- Preserve and polish strong matching stages from the source lesson plan.
- Generate missing stages from textbook content when the confirmed question chain or textbook requires them.
- Include teacher actions, student actions, teacher-student dialogue, experiment operations, expected student responses, teacher follow-up, and evaluation feedback.
- Use `师：` and `生：` as part of a broader classroom narrative. Between dialogue turns, write what the teacher displays, demonstrates, organizes, writes on the board, or asks students to do, and what students observe, operate, discuss, record, report, draw, calculate, or revise.
- For each major activity, include at least one concrete student action and one concrete teacher guidance action. Examples: `学生分组讨论`, `学生操作并记录`, `学生汇报数据`, `教师巡视`, `教师追问`, `教师反馈`, `教师板书归纳`, `自然过渡到...`.
- Every experiment, drawing, group discussion, or inquiry activity must include `教师巡视` or equivalent classroom monitoring language. Reason: the user wants visible teacher behavior and real-time feedback, not only final answers.
- Every major activity should contain a transition sentence showing how the preceding question or evidence leads to the next learning link. Reason: the problem chain should串起 classroom flow, not sit beside it.
- Present dialogue with `师：` and `生：`.
- Keep `教学环节` concise, for example `情境导入，认识重力`.
- Keep `设计意图` concise and polished. Do not mention `问题链` in this cell.
- In `教与学活动`, list major activities as `活动一：...`, `活动二：...`.
- Define `活动` strictly: an activity is a student-centered learning task that lets students think, observe, operate, explore, discuss, compare, construct concepts, or transfer knowledge, and that directly promotes core literacy. It must have a clear task situation, student action, learning evidence, and teacher feedback.
- A good activity must answer four questions: What do students think about? What do students do? What evidence helps them form a new understanding? How does the teacher guide construction through questioning, comparison, feedback, or lift?
- Activity design must value precision, targeting, and effectiveness. Do not design an activity only because it looks lively; design it because it helps students experience, compare, discover, and construct a physics idea.
- Activities should move students from experience to comparison, from comparison to standard or evidence, from evidence to concept, and from concept to transfer.
- Use 3 to 5 major activities for a normal 40-45 minute lesson. The maximum is 5.
- After every confirmed question label, write an implementation paragraph, not just a short answer. The paragraph should include at least two of these: teacher setup, student action, likely student answer, teacher追问,教师巡视/指导, evidence feedback, transition.
- Treat `提出问题`, `设计方案`, `选择器材`, `动手实验`, `记录数据`, `数据汇总`, `分析图像`, `交流评价`, and `归纳结论` as internal links of one inquiry activity when they serve the same experimental task.
- Treat `知识回顾`, `情感升华`, `练习巩固`, `课堂小结`, and `作业布置` as teaching links or summary/evaluation links, not as `活动N`.
- Example for `重力 力的示意图`: `活动一：观察生活现象，认识重力`; `活动二：探究重力与质量的关系`; `活动三：判断重力方向`; `活动四：绘制力的示意图`; `活动五：迁移应用，解释生活与航天情境`. Do not create 16 activities from the steps inside these activities.
- Every confirmed question must appear exactly once in final `教与学活动`, unless the user revised or deleted it.
- Preserve confirmed hierarchical numbers in final check labels. For example, `1-2-1` in the confirmation table must appear as `过渡型问题1-2-1：...` or `探究型问题1-2-1：...` according to its confirmed type. DO NOT convert it to a flat label such as `问题4：...`. Reason: flat numbering hides the depth-learning structure.
- Bold every `核心问题N：...` label in the final Word when the output format supports bold text. If the writing stage is plain JSON for the template script, write the label as `**核心问题N：...**` so the generator can preserve or later convert the emphasis. Reason: core questions are the lesson spine and must be visually identifiable.
- Each core question must become a visible stage-level teaching thread. Do not hide core questions in a separate unused list.
- Each transition question must appear at the boundary between activities, not at the end as an afterthought.
- Each transfer question must appear in application, summary, homework, or extension, and must require students to use the learned concept in a new context.

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
**核心问题2：重力的大小与质量有什么关系？怎样用实验数据证明？**
递进型问题2-1-1：提起质量不同的物体，手臂感觉有什么不同？这种感觉能否直接作为科学结论？
探究型问题2-2-1：本实验要探究的是哪两个物理量之间的关系？哪个量需要改变，哪个量需要测量？
探究型问题2-2-2：为了探究重力与质量的关系，你选择哪些器材？每种器材分别解决什么问题？
师：（举起一个钩码和三个相同钩码）“大家先不要急着计算，先判断：质量增加到3倍，重力会怎样变化？你的依据是什么？”
生：“可能也是3倍，因为钩码个数变多了。”
师：“这只是猜想。要把猜想变成证据，我们需要哪些器材？怎样测量才公平？”
学生小组讨论后选择弹簧测力计、钩码和铁架台，说明用同一只弹簧测力计依次测量1个、2个、3个钩码的重力，并记录质量与重力。
教师巡视时提醒学生读数视线要与刻度线相平，发现数据差异较大的小组，追问是否完成调零、是否让钩码静止后再读数。
汇报时，教师引导学生比较数据，概括“质量增大几倍，重力也近似增大几倍”，并自然过渡到“重力与质量是否成正比”的进一步判断。
过渡型问题2-3-1：我们已经知道重力大小可以测量和计算，那么重力的方向是否也能仅凭直觉判断？
```

For source lesson plans that already have detailed teacher/student activities:

- Preserve strong existing descriptions from the source.
- Insert confirmed typed hierarchical labels into matching places, for example `递进型问题1-1-1：...` or `迁移型问题3-3-1：...`.
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
- Final `教与学活动` follows `references/teaching-process-style.md`: it uses activity/question anchors for checking, while the body is natural classroom implementation language.
- Final `教与学活动` is not a repeated `师：... 生：...` Q&A script; it contains student operations, teacher巡视,追问,反馈, and transition language.
- Question-chain confirmation draft used the table shape `教学情境组织流程 / 问题链设计 / 问题链类型`.
- Question-chain confirmation draft included 2 to 4 core questions and at least 10 sub-questions.
- Question-chain confirmation draft included core, progressive, transitional, inquiry, and transfer types when the lesson content permits.
- Question-chain questions came from the uploaded lesson plan and the relevant textbook section.
- Question-chain questions were not isolated recall questions; they required observation, comparison, explanation, design, evidence, evaluation, or transfer.
- Every confirmed question appears in `教与学活动` with its type and hierarchical number, such as `递进型问题1-1-1：...`, not as a flat `问题N：...`.
- Final `教与学活动` contains no more than 5 major `活动N` labels.
- Experiment steps such as designing a plan, operating, recording, analyzing, and concluding are written as internal links of one activity, not independent `活动N` labels.
- Knowledge review, emotional elevation, practice consolidation, classroom summary, and homework assignment are not labeled as `活动N`.
- Each major activity has a student-centered task, visible student action, learning evidence, and teacher feedback.
- Each major activity helps students think, do, compare, discuss, construct, or transfer; none are decorative labels for teacher explanation.
- Activity sequence supports cognitive progression, such as experience -> comparison -> evidence -> concept -> transfer.
- No unrelated activity-design example content, such as `一米长度认识`, appears in the final lesson plan unless the lesson is about length measurement.
- `学习评价` follows the template option format.
- `教学环节` and `设计意图` do not expose planning labels such as `问题链`.
- `教学目标`, `板书设计`, `作业布置`, and `教后记` are nonblank and complete.
- Apparatus-selection, experiment process, and conclusion stages are detailed.
- Teacher behavior, student behavior, teacher-student language, and feedback are present.
- Final DOCX has exactly 3 tables and is based on the copied bundled template.
- DOCX package contains `word/document.xml` with forward slash path.
- Report whether visual rendering/opening was actually performed.
