import { NextRequest, NextResponse } from "next/server";

import { updateExperimentRow } from "@/lib/data";
import type { BinaryAnswer, StudentSubmissionPayload } from "@/lib/experiment";
import { isValidGroupNo } from "@/lib/experiment";

export const dynamic = "force-dynamic";

function isBinaryAnswer(value: unknown): value is Exclude<BinaryAnswer, null> {
  return value === "0" || value === "1";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<StudentSubmissionPayload>;

  if (!isValidGroupNo(Number(body.groupNo))) {
    return NextResponse.json({ message: "组号无效，请输入 1 到 8 之间的整数。" }, { status: 400 });
  }

  if (!isBinaryAnswer(body.glassResult) || !isBinaryAnswer(body.rubberResult)) {
    return NextResponse.json({ message: "提交内容无效，结果只能填写 1 或 0。" }, { status: 400 });
  }

  try {
    const row = await updateExperimentRow({
      groupNo: Number(body.groupNo),
      glassResult: body.glassResult,
      rubberResult: body.rubberResult
    });

    if (!row) {
      return NextResponse.json({ message: "提交失败，未找到对应小组。" }, { status: 404 });
    }

    return NextResponse.json({ row });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "提交实验数据失败。" },
      { status: 500 }
    );
  }
}

