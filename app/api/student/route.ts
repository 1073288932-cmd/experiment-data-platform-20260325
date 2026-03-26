import { NextRequest, NextResponse } from "next/server";

import { getExperimentRow } from "@/lib/data";
import { isValidGroupNo } from "@/lib/experiment";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const groupNo = Number(request.nextUrl.searchParams.get("groupNo"));

  if (!isValidGroupNo(groupNo)) {
    return NextResponse.json({ message: "组号无效，请输入 1 到 8 之间的整数。" }, { status: 400 });
  }

  try {
    const row = await getExperimentRow(groupNo);

    if (!row) {
      return NextResponse.json({ message: "未找到该组的预设实验行。" }, { status: 404 });
    }

    return NextResponse.json({ row });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "读取实验数据失败。" },
      { status: 500 }
    );
  }
}
