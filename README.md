# Miroir — 日记教练

> 不是一个更好的笔记工具，而是一个内置了心理咨询师级别反思框架的日记教练。

Miroir（法语"镜子"）是一个反思优先、AI 教练驱动的日记应用。它将深度反思框架（CBT、躯体觉察、模式识别）内建到日记写作流程中，让每一次写日记都像一次有教练引导的自我对话。

## 核心原则

- **感受先于事实** — 日记不只是记录"发生了什么"，更重要的是"我感受到什么"
- **完成胜于完美** — 只写 3 行也算完成
- **下一个十五分钟** — 面对巨大恐惧时，不问"这辈子怎么办"，只问"下一个 15 分钟做什么"
- **两件事可以同时成立** — 诚实和温柔不矛盾

## 功能

### 已实现
- ✅ 完整的每日日记模板（今日状态、重点、任务、自由书写、晚间复盘、明日交接、维护）
- ✅ AI 晚间复盘助手（DeepSeek API 驱动，流式输出）
- ✅ AI 教练对话（引导式日记写作，一次只问一个问题）
- ✅ 本地 Markdown 文件存储（数据主权，可被 Obsidian/VSCode 直接打开）
- ✅ 死亡倒计时（Memento Mori）
- ✅ 往年今日（On This Day）
- ✅ 周记 / 月记概览
- ✅ 模式库（自动从复盘中提取反复出现的模式）
- ✅ 任务队列（GTD 风格，与日记桥接）
- ✅ 日历视图
- ✅ 全文搜索
- ✅ 深色/浅色模式
- ✅ 移动端响应式

### 规划中
- ⏳ AI 模式自动识别（跨日记的模式提取）
- ⏳ 数据导出（Markdown zip）
- ⏳ 日记连续天数（streak）
- ⏳ 语音输入

## 技术栈

| 层 | 选择 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 编辑器 | TipTap (ProseMirror) |
| 存储 | 本地 Markdown 文件 + SQLite 索引 |
| AI | DeepSeek API (OpenAI 兼容) |
| 部署 | Vercel |

## 快速开始

```bash
# 安装依赖
npm install

# 配置 API Key
cp .env.example .env.local
# 编辑 .env.local，填入 DeepSeek API Key

# 填充演示数据（可选）
npx tsx scripts/seed.ts

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看。

## 项目结构

```
miroir/
├── app/                    # Next.js App Router
│   ├── (journal)/          # 日记页面（today, [date]）
│   ├── (coach)/            # AI 教练页面
│   ├── (review)/           # 周记/月记页面
│   ├── api/                # API 路由
│   ├── calendar/           # 日历视图
│   ├── patterns/           # 模式库
│   ├── tasks/              # 任务队列
│   └── settings/           # 设置页面
├── components/
│   ├── layout/             # 布局组件（侧边栏、主题）
│   └── ui/                 # shadcn/ui 组件
├── lib/
│   ├── ai/                 # AI 客户端与提示词
│   ├── journal/            # Markdown 解析/写入/类型
│   ├── db/                 # 数据库 schema
│   └── utils/              # 工具函数
├── content/journal/        # 日记 Markdown 文件
└── scripts/                # 工具脚本
```

## 对比市场产品

### vs 浮墨笔记（Flomo）
| 维度 | Flomo | Miroir |
|---|---|---|
| 核心理念 | 快速捕获一切想法 | 深度处理重要想法 |
| 组织方式 | 标签 + 搜索 | 时间线 + 模式库 + AI 联结 |
| AI 角色 | 无（或基础摘要） | 教练式追问 + 模式识别 |
| 反思框架 | 无（用户自建） | 内置四层追问 + 周/月复盘 |
| 数据格式 | 专有 | 开放 Markdown |

### vs 印象笔记（Evernote）
| 维度 | Evernote | Miroir |
|---|---|---|
| 定位 | 通用笔记库 | 专注日记与反思 |
| 复杂度 | 功能臃肿 | 极简，只做一件事 |
| AI | 通用搜索/摘要 | 深度个性化教练 |
| 数据格式 | 专有 | 开放 Markdown |

## License

MIT
