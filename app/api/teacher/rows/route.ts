import { NextRequest, NextResponse } from "next/server";

import { listExperimentRows } from "@/lib/data";
import { getTeacherShareToken } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || token !== getTeacherShareToken()) {
    return NextResponse.json({ message: "教师端访问令牌无效。" }, { status: 403 });
  }

  try {
    const rows = await listExperimentRows();
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "读取教师端总表失败。" },
      { status: 500 }
    );
  }
}

