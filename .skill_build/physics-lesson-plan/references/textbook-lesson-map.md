# Textbook Lesson Map

Use this map before reading the bundled grade-8 lower-volume textbook Markdown. It prevents slow full-file scanning.

## CRITICAL

DO NOT search the whole textbook Markdown when a lesson key below matches the input lesson.

Use `scripts/extract_textbook_section.ps1` with a lesson key:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill-root>\scripts\extract_textbook_section.ps1" -LessonKey "gravity-force-diagram" -OutputText ".\textbook_extract\gravity-force-diagram.txt"
```

Then read the extracted text file.

## Lesson Keys

| Lesson key | Lesson | Markdown lines | Notes |
|---|---|---:|---|
| force-elastic-force | 第七章 一、力 弹力 | 1039-1248 | force concept, deformation, spring force, spring dynamometer |
| gravity-force-diagram | 第七章 二、重力 力的示意图 | 1249-1444 | gravity size/direction, 活动7.1, 活动7.2, force diagram, practice |
| friction | 第七章 三、摩擦力 | 1490-1671 | sliding friction, influencing factors, reducing/increasing friction |
| interaction-of-forces | 第七章 四、力的作用是相互的 | 1672-1745 | interaction of forces |
| pressure | 第九章 一、压强 | 2472-2670 | pressure, 活动9.1, 活动9.2, increasing/decreasing pressure |
| liquid-pressure | 第九章 二、液体的压强 | 2671-2800 | liquid pressure, student experiment |

## Fast Matching Rules

- If the source lesson title contains `重力` or `力的示意图`, use `gravity-force-diagram`.
- If the source lesson title contains `压强` but not `液体`, use `pressure`.
- If the source lesson title contains `液体` and `压强`, use `liquid-pressure`.
- If the source lesson title contains `摩擦`, use `friction`.
- If the source lesson title contains `弹力` or `弹簧测力计`, use `force-elastic-force`.
- If the source lesson title contains `相互`, use `interaction-of-forces`.

If no rule matches, open `assets/textbooks/八下课本/INDEX.md` and choose the nearest lesson line. DO NOT scan the full Markdown first.
