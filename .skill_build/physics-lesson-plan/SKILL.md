---
name: "physics-lesson-plan"
description: "Generate and refine Chinese junior-high physics lesson plans from Word lesson drafts or classroom transcripts. Use a fixed Word template, bundled DOCX/PDF processing skills, the bundled Su Ke edition grade-8 physics textbook PDF, confirmed learning objectives, confirmed question chains, and formal teacher-student process writing."
---

# Physics Lesson Plan

Use this skill when the user wants to turn a Chinese junior-high physics Word lesson plan or classroom transcript into a completed lesson-design Word document.

This skill is self-contained for Codex and Claude Code. It bundles:

- DOCX handling skill: `bundled-skills/docx/SKILL.md`
- PDF handling skill: `bundled-skills/pdf/SKILL.md`
- Textbook PDF: `assets/textbooks/苏科版初中物理八年级下册_24年审定.pdf`

## CRITICAL Workflow

1. Read all required source files before writing.
   - Read the user lesson plan or transcript.
   - Read the Word template structure.
   - Read the relevant textbook section from the bundled textbook PDF unless the user provides a newer textbook.
   - Read image-based requirements or examples if the user provides them.
2. If DOCX processing is needed, read `bundled-skills/docx/SKILL.md` before editing or generating Word files.
3. If PDF processing is needed, read `bundled-skills/pdf/SKILL.md` before extracting textbook content.
4. Extract lesson facts: topic, grade, textbook version, lesson type,课时, content,学情,重难点, activities, experiments,评价,作业,板书.
5. Ask for missing administrative facts before final Word generation when they cannot be inferred safely.
6. Generate learning objectives first and stop for user confirmation.
7. Generate the question chain only after objectives are confirmed, then stop for user confirmation.
8. Generate the full Word lesson plan only after both objectives and question chain are confirmed.
9. Validate the output and report exactly what was checked.

## Non-Negotiable Rules

- NEVER edit a file before reading it. Reason: editing unread files risks destroying the template structure, user changes, or document-specific formatting.
- NEVER claim a DOCX/PDF was inspected unless it was actually opened, parsed, rendered, or structurally read. Reason: users rely on this claim to judge whether the output is trustworthy.
- NEVER invent missing course facts such as lesson date, class, grade, textbook version, or课时. Reason: these are administrative facts and a plausible guess can make the final document unusable.
- NEVER skip the objective-confirmation step. Reason: objectives control task design, evaluation, and question sequencing.
- NEVER skip the question-chain-confirmation step. Reason: the question chain is the classroom spine and must reflect the teacher’s preferred teaching logic.
- NEVER use unconfirmed draft objectives or questions after the user has revised them. Reason: the user’s revision is the source of truth.
- NEVER generate a question chain without checking the textbook section when a textbook is available. Reason: the lesson must reflect textbook-designed activities, not only the source lesson draft.
- NEVER say a long task succeeded until command output or file inspection proves it. Reason: task progress is unknowable while the operation is still running.
- DO NOT put “问题链”“问题1”“问题2” or similar planning labels in final `教学环节` or `设计意图` cells. Reason: the final lesson plan should read like polished teaching design, not a planning worksheet.
- DO NOT fill the `学习评价` cell with long explanatory text when the template provides options. Reason: in this template the cell should only mark options such as `√ A.即时练习　√ B.当堂检测　√ C.展示汇报`.
- DO NOT leave placeholder text such as “详见下方” in the template table. Reason: placeholders look unfinished and may appear as errors in narrow mobile previews.
- DO NOT make `教与学流程` superficial. Reason: this section is the main evidence that the lesson is teachable and meets “常态好课” expectations.
- DO NOT merely list questions separately and then ignore them. Reason: confirmed questions must drive teacher prompts, student responses, experiment choices, transitions, and summaries.
- DO NOT over-disclaim completed work. Reason: once a check is actually done, report it plainly; unnecessary hedging reduces trust.
- DO NOT predict progress or outcomes while a task is still running. Reason: after launching a long task, the agent may not know its true state until it reads output.
- DO NOT use emoji. Reason: lesson-plan communication should remain formal and compact.
- DO NOT use three sentences when one clear sentence is enough. Reason: concise communication makes confirmation steps easier for the teacher.

## Textbook PDF Procedure

CRITICAL: Always use the bundled textbook unless the user provides a different textbook file.

1. Locate the lesson in `assets/textbooks/苏科版初中物理八年级下册_24年审定.pdf`.
2. Prefer reliable extraction tools from the environment:
   - `pdftotext` if available.
   - Tools or scripts described in `bundled-skills/pdf/SKILL.md`.
   - Rendering or screenshot inspection if text extraction fails.
3. Search for the lesson title and nearby headings.
4. Extract the textbook learning path:
   - 情境图 and opening prompts.
   - 活动, 体验与猜想, 实验与验证, 交流与讨论.
   - Apparatus lists.
   - Original textbook questions.
   - Example problems,反思,实践与练习 when relevant.
5. For 苏科版八年级下册《压强》, preserve the textbook emphasis:
   - 图9-1认识压力.
   - 图9-2压在钉板上的气球.
   - 活动9.1探究影响压力作用效果的因素.
   - 图9-4实验器材.
   - “你选用了哪些器材？请说出你的实验过程与结论。”
   - 压强定义、公式、单位、教材例题.
   - 活动9.2估测人站立时对地面的压强.
   - 图9-7增大和减小压强.
6. If extraction fails, say exactly what failed and ask for page images or permission to use another tool. DO NOT invent textbook content. Reason: invented textbook links break the lesson’s alignment with the actual book.

## DOCX/PDF Handling

- For Word generation or editing, read `bundled-skills/docx/SKILL.md` and use its scripts when useful.
- For PDF extraction, rendering, or validation, read `bundled-skills/pdf/SKILL.md` and use its scripts when useful.
- Use the minimum necessary bundled references; do not load all bundled skill files into context unless needed.
- Preserve the original Word template package whenever possible.
- CRITICAL: DOCX internal paths must use forward slashes such as `word/document.xml`, not backslashes. Reason: mobile Office/WPS may fail with import errors if the main document part is not discoverable.

## Learning Objective Requirements

Write objectives in formal Chinese lesson-plan language. Preserve strong wording from the source lesson plan when it already meets the standard.

Each objective must cover one physics core-literacy dimension:

- 物理观念
- 科学思维
- 科学探究
- 科学态度与责任

Each objective must include the four elements:

- 行为主体: normally “学生”
- 行为表现: observable actions such as 理解, 区分, 设计, 完成, 观察, 记录, 分析, 解释, 计算, 归纳
- 行为条件: experiment, data, textbook activity, life situation, material, or problem context
- 行为程度: 正确, 合理, 完整, 规范, 基于证据, 能迁移应用

After drafting objectives, send only the objective confirmation draft and ask the user to confirm or revise it.

## Question Chain Requirements

Generate the question chain only after objectives are confirmed.

The confirmation draft should include at least 10 questions and, for each question, briefly state:

- Question content.
- Function, such as 概念引入, 情境冲突, 体验观察, 猜想提出, 实验设计, 证据归纳, 概念建构, 易错辨析, 迁移应用.
- Related objective.
- Textbook basis when applicable.
- Teacher follow-up.

After the user confirms, embed the questions naturally into the teaching process. In the final Word table, use natural teacher prompts and student responses instead of numbered question-chain labels.

## Teaching Process Requirements

The `教与学活动` cell must be detailed and teachable, similar in density to a strong source lesson plan.

For each teaching stage:

- If the source lesson plan already contains a strong matching stage, preserve and polish it.
- If the source lesson plan lacks a stage that the confirmed question chain or textbook requires, generate the stage from the textbook content.
- Include teacher actions, student actions, teacher-student dialogue, experiment operations, expected student responses, teacher follow-up, and evaluation feedback.
- Present dialogue with `师：` and `生：`.
- Include enough detail for a teacher to teach from it directly.
- Keep `教学环节` concise, for example `情境导入，认识压力`.
- Keep `设计意图` concise and polished. Do not mention “问题链” in this cell.

For experiment-centered physics lessons, the process must explicitly cover:

- Which apparatus students choose.
- Why each apparatus is chosen.
- How variables are controlled.
- What students observe.
- What conclusion students draw.
- How the teacher evaluates whether the conclusion is evidence-based.

If the process becomes too long, split drafting into two confirmation batches, such as first five stages and remaining stages. DO NOT silently shorten the teaching process. Reason: shortening hides the most important classroom design work.

## Template Rules

- Preserve the provided Word template table structure.
- Output Word by default.
- Fill every required cell.
- In `学习评价`, mark only selected options unless the user explicitly asks for narrative evaluation.
- If using direct OOXML editing, preserve the original template package and replace only necessary parts when possible. Reason: rebuilding the whole archive can break Office compatibility.
- If rendering with WPS, Word, or LibreOffice is possible, open or render the final document before claiming visual verification.

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
- Confirmed questions are embedded in teacher-student activity, not merely listed.
- `学习评价` follows the template option format.
- `教学环节` and `设计意图` do not expose planning labels such as “问题链”.
- Apparatus-selection, experiment process, and conclusion stages are detailed.
- Teacher behavior, student behavior, teacher-student language, and feedback are present.
- DOCX package contains `word/document.xml` with forward slash path.
- Report whether visual rendering/opening was actually performed.
