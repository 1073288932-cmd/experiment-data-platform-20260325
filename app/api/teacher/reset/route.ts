import { NextRequest, NextResponse } from "next/server";

import { resetExperimentRows } from "@/lib/data";
import { TOTAL_GROUPS } from "@/lib/experiment";
import { getTeacherShareToken } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string };
  const token = body.token;

  if (!token || token !== getTeacherShareToken()) {
    return NextResponse.json({ message: "教师端访问令牌无效。" }, { status: 403 });
  }

  try {
    const rows = await resetExperimentRows();
    return NextResponse.json({ rows, message: `已清空 1 到 ${TOTAL_GROUPS} 组的实验数据。` });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "清空实验数据失败。" },
      { status: 500 }
    );
  }
}
