# EdgeOne Pages 部署说明

这个项目可以直接部署到腾讯 EdgeOne Pages，无需改动为 Cloudflare 专用运行时。

官方依据：

- EdgeOne Pages 支持 Next.js 13.5+、14、15、16
- 支持 App Router
- 支持 SSR
- 支持 Route Handlers

参考文档：

- https://pages.edgeone.ai/zh/document/framework-nextjs
- https://cloud.tencent.com/document/product/1552/127454

## 一、推荐部署方式

使用 GitHub 仓库导入到 EdgeOne Pages。

## 二、部署前准备

把当前项目上传到 GitHub。

需要在 EdgeOne Pages 配置以下环境变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TEACHER_SHARE_TOKEN`

建议值：

- `NEXT_PUBLIC_SUPABASE_URL=https://ogcfrpncykgyoyrwpvat.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：填你当前 Supabase 的 publishable/anon key
- `SUPABASE_SERVICE_ROLE_KEY`：填你已轮换后的新 key
- `TEACHER_SHARE_TOKEN=physics-class-2026`

## 三、在 EdgeOne Pages 中创建项目

1. 登录 EdgeOne Pages 控制台
2. 创建项目
3. 选择 GitHub 仓库导入
4. 选择本项目仓库
5. 框架选择 `Next.js`

根据官方文档，这个项目可使用以下默认构建设置：

- Build Command: `npm run build`
- Output Directory: `.next`

## 四、部署后访问

部署成功后，EdgeOne 会给你一个公网域名。

实际访问地址：

- 学生端：`https://你的域名/student`
- 教师端：`https://你的域名/teacher/physics-class-2026`

## 五、为什么推荐 EdgeOne

- 更适合中国大陆访问场景
- 官方明确支持 Next.js 16 与 App Router
- 比 `workers.dev` 更适合作为正式课堂入口

## 六、当前代码状态

当前项目本身已经是标准 Next.js 应用：

- 本地开发：`npm run dev`
- 标准构建：`npm run build`

这意味着迁移到 EdgeOne Pages 不需要改业务代码，重点只在“代码托管 + 控制台导入 + 环境变量配置”。
