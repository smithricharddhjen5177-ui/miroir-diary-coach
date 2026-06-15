import { JournalEntry } from "./types"

function escapeYamlValue(value: string): string {
  if (!value) return "''"
  if (/[:\n'"{}[\]&*#?|>%@`!,\-]/.test(value) || value.includes("\\")) {
    return `"${value.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
  }
  if (
    value === "true" ||
    value === "false" ||
    value === "null" ||
    !isNaN(Number(value))
  ) {
    return `"${value}"`
  }
  return value
}

export function journalToMarkdown(entry: JournalEntry): string {
  const frontmatter = buildFrontmatter(entry)
  const body = buildBody(entry)
  return `---\n${frontmatter}\n---\n\n${body}\n`
}

function buildFrontmatter(entry: JournalEntry): string {
  const lines: string[] = [
    `date: '${entry.date}'`,
    `week: '${entry.week}'`,
    `month: '${entry.month}'`,
    `quarter: '${entry.quarter}'`,
    "",
    "todos:",
  ]

  const activeTodos = entry.todos.filter((t) => t.text)
  if (activeTodos.length > 0) {
    for (const t of activeTodos) {
      lines.push(`  - text: ${escapeYamlValue(t.text)}`)
      lines.push(`    done: ${t.done}`)
    }
  } else {
    lines.push("  []")
  }

  lines.push("", "quick_capture:")
  if (entry.quickCapture.length > 0) {
    for (const item of entry.quickCapture) {
      lines.push(`  - ${escapeYamlValue(item)}`)
    }
  } else {
    lines.push("  []")
  }

  // Evening review (includes state + review)
  const review = entry.eveningReview
  const hasReview = Object.values(review).some((v) => v)
  if (hasReview) {
    lines.push("", "review:")
    if (review.mood) lines.push(`  mood: ${escapeYamlValue(review.mood)}`)
    if (review.body) lines.push(`  body: ${escapeYamlValue(review.body)}`)
    if (review.occupyingThought)
      lines.push(`  occupying_thought: ${escapeYamlValue(review.occupyingThought)}`)
    if (review.worthToday)
      lines.push(`  worth_today: ${escapeYamlValue(review.worthToday)}`)
    if (review.facts) lines.push(`  facts: ${escapeYamlValue(review.facts)}`)
    if (review.discoveries)
      lines.push(`  discoveries: ${escapeYamlValue(review.discoveries)}`)
    if (review.nextAction)
      lines.push(`  next_action: ${escapeYamlValue(review.nextAction)}`)
    if (review.didWell)
      lines.push(`  did_well: ${escapeYamlValue(review.didWell)}`)
    if (review.thorn) lines.push(`  thorn: ${escapeYamlValue(review.thorn)}`)
    if (review.pattern)
      lines.push(`  pattern: ${escapeYamlValue(review.pattern)}`)
  }

  // Tomorrow handoff
  const handoff = entry.tomorrowHandoff
  if (Object.values(handoff).some((v) => v)) {
    lines.push("", "handoff:")
    if (handoff.primary)
      lines.push(`  primary: ${escapeYamlValue(handoff.primary)}`)
    if (handoff.secondary)
      lines.push(`  secondary: ${escapeYamlValue(handoff.secondary)}`)
    if (handoff.maintenance)
      lines.push(`  maintenance: ${escapeYamlValue(handoff.maintenance)}`)
  }

  // Habits
  const doneHabits = entry.habits.filter((h) => h.done)
  if (doneHabits.length > 0) {
    lines.push("", "habits:")
    for (const h of entry.habits) {
      if (h.done) {
        lines.push(`  - key: ${h.key}`)
        lines.push(`    done: true`)
      }
    }
  }

  // Scalars
  if (entry.energy !== null) lines.push("", `energy: ${entry.energy}`)
  if (entry.reading) lines.push("", `reading: ${escapeYamlValue(entry.reading)}`)
  lines.push("", `meditation: ${entry.meditation}`, `workout: ${entry.workout}`)

  return lines.join("\n")
}

function buildBody(entry: JournalEntry): string {
  const d = entry.date
  const parts: string[] = []

  const year = d.split("-")[0]
  const month = d.substring(0, 7)
  const monthName = new Date(d).toLocaleString("en-US", { month: "long" })
  const quarter = year + "-Q" + (Math.floor((parseInt(d.split("-")[1]) - 1) / 3) + 1)
  const week = entry.week
  const weekNum = week.split("-W")[1]
  const prevDate = getAdjacentDate(d, -1)
  const nextDate = getAdjacentDate(d, 1)

  parts.push(
    `## [[${year}]] / [[${quarter}|${quarter.split("-")[1]}]] / [[${month}|${monthName}]] / [[${week}|Week ${weekNum}]]`
  )
  parts.push("# DAILY NOTE")
  parts.push(
    `##### ❮ [[${prevDate}]] | ${d} | [[${nextDate}]] ❯`
  )
  parts.push("---")
  parts.push("")

  // ── 今日任务 ──
  parts.push("### 今日任务")
  parts.push("> 只挑 1~3 件，不超过 3 件。完成任何一个就算赢。")
  if (entry.todos.some((t) => t.text)) {
    for (const t of entry.todos) {
      if (!t.text) continue
      const prefix = t.done ? "[x]" : "[ ]"
      parts.push(`- ${prefix} ${t.text}`)
    }
  } else {
    parts.push("- [ ] ")
    parts.push("- [ ] ")
    parts.push("- [ ] ")
  }
  parts.push("")

  // ── 快速收纳 ──
  parts.push("### 快速收纳")
  parts.push("> 突然冒出来、但现在不做的事先记这里。")
  if (entry.quickCapture.length > 0) {
    for (const item of entry.quickCapture) {
      parts.push(`- ${item}`)
    }
  } else {
    parts.push("- ")
    parts.push("- ")
  }
  parts.push("")

  // ── 自由书写 ──
  parts.push("### 📕自由书写")
  parts.push("")
  if (entry.freeWriting) {
    parts.push(entry.freeWriting)
  }
  parts.push("")

  // ── 晚间复盘 ──
  parts.push("### 晚间复盘")
  parts.push(
    "> 先写事实，再写发现，再写一个明天自己能做的小动作。只写 1~3 行也算完成。"
  )
  parts.push("")

  // 今日状态（复盘时填）
  parts.push("#### 今日状态")
  parts.push(`- 此刻状态：${entry.eveningReview.mood}`)
  parts.push(`- 身体感觉：${entry.eveningReview.body}`)
  parts.push(
    `- 最占据心里的事：${entry.eveningReview.occupyingThought}`
  )
  parts.push(
    `- 今天什么算值得：${entry.eveningReview.worthToday}`
  )
  parts.push("")

  parts.push("#### 事实与发现")
  parts.push(
    `- 今天发生了什么（客观事实）：${entry.eveningReview.facts}`
  )
  parts.push(
    `- 我注意到什么（发现 / 情绪 / 学习）：${entry.eveningReview.discoveries}`
  )
  parts.push(
    `- 明天我自己能做的一个小动作：${entry.eveningReview.nextAction}`
  )
  parts.push("")

  if (
    entry.eveningReview.didWell ||
    entry.eveningReview.thorn ||
    entry.eveningReview.pattern
  ) {
    parts.push("#### 如果还有余力")
    if (entry.eveningReview.didWell)
      parts.push(`- 做得不错的地方：${entry.eveningReview.didWell}`)
    if (entry.eveningReview.thorn)
      parts.push(
        `- "带刺的机会"或小提醒：${entry.eveningReview.thorn}`
      )
    if (entry.eveningReview.pattern)
      parts.push(
        `- 这件事更深地指向了什么模式：${entry.eveningReview.pattern}`
      )
    parts.push("")
  }

  // ── 明日交接 ──
  parts.push("### 明日交接")
  parts.push(`- 明天最重要的 1 件事：${entry.tomorrowHandoff.primary}`)
  parts.push(
    `- 第二重要（可留空）：${entry.tomorrowHandoff.secondary}`
  )
  parts.push(
    `- 维护秩序的小事（可留空）：${entry.tomorrowHandoff.maintenance}`
  )
  parts.push("")

  // ── 习惯养成 ──
  parts.push("---")
  parts.push("### ⚛️习惯养成")
  parts.push("> 每天完成「基础习惯」就算没有掉线。可选加分锦上添花。")
  parts.push("")

  const daily = entry.habits.filter((h) => h.category === "daily")
  const bonus = entry.habits.filter((h) => h.category === "bonus")
  const ai = entry.habits.filter((h) => h.category === "ai")

  parts.push("#### 基础习惯")
  for (const h of daily) {
    parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
  }
  parts.push("")

  parts.push("#### 可选加分")
  for (const h of bonus) {
    parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
  }
  parts.push("")

  parts.push("#### AI 协作")
  for (const h of ai) {
    parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
  }
  parts.push("")

  parts.push("#### 记录项")
  parts.push(`- ⚡[energy::${entry.energy ?? ""}]`)
  parts.push(`- 📖[reading::${entry.reading}]`)
  parts.push(`- 🧘🏻[meditation::${entry.meditation ? "✓" : ""}]`)
  parts.push(`- 🏋🏻‍♂️[workout::${entry.workout ? "✓" : ""}]`)
  parts.push("---")
  parts.push("")

  return parts.join("\n")
}

function getAdjacentDate(dateStr: string, offset: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}
