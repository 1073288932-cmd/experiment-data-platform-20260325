import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "实验数据收集平台",
  description: "学生端提交实验结果，教师端实时汇总展示。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

