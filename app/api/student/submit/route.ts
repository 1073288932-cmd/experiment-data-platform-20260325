import { NextRequest, NextResponse } from "next/server";

import { updateExperimentRow } from "@/lib/data";
import { isExperimentResult, isValidGroupNo, type StudentSubmissionPayload } from "@/lib/experiment";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<StudentSubmissionPayload>;

  if (!isValidGroupNo(Number(body.groupNo))) {
    return NextResponse.json({ message: "组号无效，请输入 1 到 8 之间的整数。" }, { status: 400 });
  }

  if (!isExperimentResult(body.glassResult) || !isExperimentResult(body.rubberResult)) {
    return NextResponse.json(
      { message: "提交内容无效，结果只能填写“相互排斥”或“相互吸引”。" },
      { status: 400 }
    );
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
