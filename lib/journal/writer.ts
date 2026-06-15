import { JournalEntry, JournalState, Priority, Task, EveningReview, TomorrowHandoff, Maintenance } from "./types"
import { formatDate, getDayName } from "@/lib/utils/date"

function stateToYaml(state: JournalState): string {
  return [
    `  mood: ${escapeYamlValue(state.mood)}`,
    `  body: ${escapeYamlValue(state.body)}`,
    `  occupying_thought: ${escapeYamlValue(state.occupyingThought)}`,
    `  worth_today: ${escapeYamlValue(state.worthToday)}`,
  ].join("\n")
}

function prioritiesToYaml(priorities: Priority[]): string {
  if (!priorities.some(p => p.text)) return "  []"
  const items = priorities
    .filter(p => p.text)
    .map(p => `  - text: ${escapeYamlValue(p.text)}\n    done: ${p.done}`)
  return items.join("\n")
}

function tasksToYaml(tasks: Task[]): string {
  if (!tasks.some(t => t.text)) return "  []"
  const items = tasks
    .filter(t => t.text)
    .map(t => `  - text: ${escapeYamlValue(t.text)}\n    done: ${t.done}`)
  return items.join("\n")
}

function quickCaptureToYaml(items: string[]): string {
  if (!items.length) return "  []"
  return items.map(i => `  - ${escapeYamlValue(i)}`).join("\n")
}

function reviewToYaml(review: EveningReview): string {
  const lines: string[] = []
  if (review.facts) lines.push(`  facts: ${escapeYamlValue(review.facts)}`)
  if (review.discoveries) lines.push(`  discoveries: ${escapeYamlValue(review.discoveries)}`)
  if (review.nextAction) lines.push(`  next_action: ${escapeYamlValue(review.nextAction)}`)
  if (review.didWell) lines.push(`  did_well: ${escapeYamlValue(review.didWell)}`)
  if (review.thorn) lines.push(`  thorn: ${escapeYamlValue(review.thorn)}`)
  if (review.pattern) lines.push(`  pattern: ${escapeYamlValue(review.pattern)}`)
  return lines.join("\n")
}

function handoffToYaml(handoff: TomorrowHandoff): string {
  const lines: string[] = []
  if (handoff.primary) lines.push(`  primary: ${escapeYamlValue(handoff.primary)}`)
  if (handoff.secondary) lines.push(`  secondary: ${escapeYamlValue(handoff.secondary)}`)
  if (handoff.maintenance) lines.push(`  maintenance: ${escapeYamlValue(handoff.maintenance)}`)
  return lines.join("\n")
}

function escapeYamlValue(value: string): string {
  if (!value) return "''"
  // If value contains special characters, wrap in quotes
  if (/[:\n'"{}[\]&*#?|>%@`!,\-]/.test(value) || value.includes("\\")) {
    return `"${value.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
  }
  if (value === "true" || value === "false" || value === "null" || !isNaN(Number(value))) {
    return `"${value}"`
  }
  return value
}

export function journalToMarkdown(entry: JournalEntry): string {
  const frontmatter = buildFrontmatter(entry)
  const body = buildBody(entry)
  return `---\n${frontmatter}\n---\n\n${body}`
}

function buildFrontmatter(entry: JournalEntry): string {
  const lines: string[] = [
    `date: '${entry.date}'`,
    `week: '${entry.week}'`,
    `month: '${entry.month}'`,
    `quarter: '${entry.quarter}'`,
    "",
    "state:",
    stateToYaml(entry.state),
    "",
    "priorities:",
    prioritiesToYaml(entry.priorities),
    "",
    "tasks:",
    tasksToYaml(entry.tasks),
    "",
    "quick_capture:",
    quickCaptureToYaml(entry.quickCapture),
  ]

  // Only add review if there's content
  if (Object.values(entry.eveningReview).some(v => v)) {
    lines.push("", "review:", reviewToYaml(entry.eveningReview))
  }

  // Only add handoff if there's content
  if (Object.values(entry.tomorrowHandoff).some(v => v)) {
    lines.push("", "handoff:", handoffToYaml(entry.tomorrowHandoff))
  }

  lines.push("", "maintenance:", `  open_page: ${entry.maintenance.openPage}`, `  focus_time: ${entry.maintenance.focusTime}`, `  review_line: ${entry.maintenance.reviewLine}`, `  outdoor: ${entry.maintenance.outdoor}`, `  stretch: ${entry.maintenance.stretch}`, `  treat: ${entry.maintenance.treat}`, `  ai_plan: ${entry.maintenance.aiPlan}`, `  ai_review: ${entry.maintenance.aiReview}`)

  if (entry.energy !== null) lines.push("", `energy: ${entry.energy}`)
  if (entry.reading) lines.push("", `reading: ${escapeYamlValue(entry.reading)}`)
  lines.push("", `meditation: ${entry.meditation}`, `workout: ${entry.workout}`)

  return lines.join("\n")
}

function buildBody(entry: JournalEntry): string {
  const d = entry.date
  const parts: string[] = []

  // Breadcrumb header
  const quarter = d.split("-")[0] + "-Q" + (Math.floor((parseInt(d.split("-")[1]) - 1) / 3) + 1)
  const year = d.split("-")[0]
  const month = d.substring(0, 7)
  const monthName = new Date(d).toLocaleString("en-US", { month: "long" })
  const week = entry.week
  const weekNum = week.split("-W")[1]
  const prevDate = getPrevDate(d)
  const nextDate = getNextDate(d)
  const dayName = getDayName(d)

  parts.push(`## [[${year}]] / [[${quarter}|${quarter.split("-")[1]}]] / [[${month}|${monthName}]] / [[${week}|Week ${weekNum}]]`)
  parts.push(`# DAILY NOTE`)
  parts.push(`##### ❮ [[${prevDate}]] | ${d} | [[${nextDate}]] ❯`)
  parts.push("---")

  // 今日状态
  parts.push("### 今日状态")
  if (entry.state.mood) parts.push(`- 此刻状态：${entry.state.mood}`)
  else parts.push("- 此刻状态：")
  if (entry.state.occupyingThought) parts.push(`- 现在最占据我心里的事：${entry.state.occupyingThought}`)
  else parts.push("- 现在最占据我心里的事：")
  if (entry.state.worthToday) parts.push(`- 如果今天只认真过好一天，什么算值得？${entry.state.worthToday}`)
  else parts.push("- 如果今天只认真过好一天，什么算值得？")
  parts.push("")

  // 今日重点
  parts.push("### 今日重点")
  entry.priorities.forEach((p, i) => {
    const prefix = p.done ? "[x]" : "[ ]"
    const label = ["最重要的 1 件事", "第二重要的 1 件事", "维护生活秩序的 1 件小事"][i]
    parts.push(`- ${prefix} ${label}：${p.text}`)
  })
  parts.push("")

  // 今日任务
  parts.push("### 今日任务")
  parts.push("- 先去 [[System/Task Queue|Task Queue]] 挑 1 到 3 件，不要超过 3 件。")
  entry.tasks.forEach((t, i) => {
    const prefix = t.done ? "[x]" : "[ ]"
    parts.push(`- ${prefix} 任务 ${i + 1}：${t.text}`)
  })
  parts.push("")

  // 快速收纳
  parts.push("### 快速收纳")
  parts.push("- 今天突然冒出来、但现在不做的事先记这里，晚一点再决定要不要变成任务：")
  if (entry.quickCapture.length > 0) {
    entry.quickCapture.forEach(item => parts.push(`- ${item}`))
  } else {
    parts.push("- ")
    parts.push("- ")
    parts.push("- ")
  }
  parts.push("")

  // 自由书写
  parts.push("### 📕自由书写")
  parts.push("")
  if (entry.freeWriting) {
    parts.push(entry.freeWriting)
  }
  parts.push("")

  // 晚间复盘
  parts.push("### 晚间复盘")
  parts.push("> 先写事实，再写发现，再写一个你明天自己能做的小动作。只写 1 到 3 行也算完成。")
  parts.push("")
  parts.push("#### 最低复盘")
  parts.push(`- 今天发生了什么（客观事实）：${entry.eveningReview.facts}`)
  parts.push(`- 我注意到什么（发现 / 情绪 / 学习）：${entry.eveningReview.discoveries}`)
  parts.push(`- 明天我自己能做的一个小动作：${entry.eveningReview.nextAction}`)
  parts.push("")

  if (entry.eveningReview.didWell || entry.eveningReview.thorn || entry.eveningReview.pattern) {
    parts.push("#### 如果还有余力")
    if (entry.eveningReview.didWell) parts.push(`- 今天一个做得不错的地方：${entry.eveningReview.didWell}`)
    if (entry.eveningReview.thorn) parts.push(`- 今天出现了什么"带刺的机会"或小提醒：${entry.eveningReview.thorn}`)
    if (entry.eveningReview.pattern) parts.push(`- 这件事更深地指向了什么模式：${entry.eveningReview.pattern}`)
    parts.push("")
  }

  // 明日交接
  parts.push("### 明日交接")
  parts.push(`- 明天最重要的 1 件事：${entry.tomorrowHandoff.primary}`)
  parts.push(`- 明天第二重要的 1 件事（可留空）：${entry.tomorrowHandoff.secondary}`)
  parts.push(`- 明天维护秩序的 1 件小事（可留空）：${entry.tomorrowHandoff.maintenance}`)
  parts.push("")
  parts.push("")
  parts.push("")

  // 今日维护
  parts.push("---")
  parts.push("### ⚛️今日维护")
  parts.push("#### 最低版本")
  parts.push(`- [${entry.maintenance.openPage ? "x" : " "}] 打开今天这页并写 3 行`)
  parts.push(`- [${entry.maintenance.focusTime ? "x" : " "}] 完成 1 段不聊天的专注时间`)
  parts.push(`- [${entry.maintenance.reviewLine ? "x" : " "}] 留下 1 句晚间复盘（事实 / 发现 / 下一步三选一也算）`)
  parts.push("")
  parts.push("#### 可选加分")
  parts.push(`- [${entry.maintenance.outdoor ? "x" : " "}] 出门 / 走一走 / 晒太阳`)
  parts.push(`- [${entry.maintenance.stretch ? "x" : " "}] 拉伸或活动一下身体`)
  parts.push(`- [${entry.maintenance.treat ? "x" : " "}] 吃一点让自己开心的东西`)
  parts.push("")
  parts.push("#### AI 协作")
  parts.push(`- [${entry.maintenance.aiPlan ? "x" : " "}] 今天主动用一次 Miroir 拆计划`)
  parts.push(`- [${entry.maintenance.aiReview ? "x" : " "}] 今天主动用一次 Miroir 做复盘或整理`)
  parts.push("")
  parts.push("#### 记录项")
  parts.push(`- ⚡[energy::${entry.energy ?? ""}]`)
  parts.push(`- 📖[reading::${entry.reading}]`)
  parts.push(`- 🧘🏻[meditation::${entry.meditation ? "yes" : ""}]`)
  parts.push(`- 🏋🏻‍♂️[workout::${entry.workout ? "yes" : ""}]`)
  parts.push("")
  parts.push("#### 不求全做")
  parts.push("- 今天能完成 `最低版本` 就算没有掉线")
  parts.push("---")
  parts.push("")

  return parts.join("\n")
}

function getPrevDate(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split("T")[0]
}

function getNextDate(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}
