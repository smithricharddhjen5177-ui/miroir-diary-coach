import { JournalEntry } from "./types"

function esc(v: string): string {
  if (!v) return "''"
  if (/[:\n'"{}[\]&*#?|>%@`!,\-]/.test(v) || v.includes("\\")) {
    return `"${v.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
  }
  if (v === "true" || v === "false" || v === "null" || !isNaN(Number(v))) return `"${v}"`
  return v
}

export function journalToMarkdown(entry: JournalEntry): string {
  return `---\n${buildFrontmatter(entry)}\n---\n\n${buildBody(entry)}\n`
}

function buildFrontmatter(entry: JournalEntry): string {
  const lines: string[] = [
    `date: '${entry.date}'`,
    `week: '${entry.week}'`,
    `month: '${entry.month}'`,
    `quarter: '${entry.quarter}'`,
  ]

  // Morning intention
  if (entry.morningIntention) {
    lines.push("", `morning_intention: ${esc(entry.morningIntention)}`)
  }

  // Todos
  lines.push("", "todos:")
  const active = entry.todos.filter((t) => t.text)
  if (active.length > 0) {
    for (const t of active) {
      lines.push(`  - text: ${esc(t.text)}`, `    done: ${t.done}`)
    }
  } else {
    lines.push("  []")
  }

  // Quick capture
  lines.push("", "quick_capture:")
  if (entry.quickCapture.length > 0) {
    for (const item of entry.quickCapture) lines.push(`  - ${esc(item)}`)
  } else {
    lines.push("  []")
  }

  // Life story
  if (entry.lifeStory) {
    lines.push("", `life_story: ${esc(entry.lifeStory)}`)
  }

  // Gratitude
  const gratitude = entry.gratitude.filter((g) => g.content)
  if (gratitude.length > 0) {
    lines.push("", "gratitude:")
    for (const g of gratitude) {
      lines.push(`  - content: ${esc(g.content)}`)
      if (g.person) lines.push(`    person: ${esc(g.person)}`)
      if (g.qualities) lines.push(`    qualities: ${esc(g.qualities)}`)
    }
  }

  // Decision reflection
  if (entry.decisionReflection) {
    lines.push("", `decision_reflection: ${esc(entry.decisionReflection)}`)
  }

  // Evening review
  const r = entry.eveningReview
  const hasReview = Object.values(r).some((v) => v)
  if (hasReview) {
    lines.push("", "review:")
    if (r.mood) lines.push(`  mood: ${esc(r.mood)}`)
    if (r.body) lines.push(`  body: ${esc(r.body)}`)
    if (r.occupyingThought) lines.push(`  occupying_thought: ${esc(r.occupyingThought)}`)
    if (r.worthToday) lines.push(`  worth_today: ${esc(r.worthToday)}`)
    if (r.facts) lines.push(`  facts: ${esc(r.facts)}`)
    if (r.discoveries) lines.push(`  discoveries: ${esc(r.discoveries)}`)
    if (r.nextAction) lines.push(`  next_action: ${esc(r.nextAction)}`)
    if (r.didWell) lines.push(`  did_well: ${esc(r.didWell)}`)
    if (r.thorn) lines.push(`  thorn: ${esc(r.thorn)}`)
    if (r.pattern) lines.push(`  pattern: ${esc(r.pattern)}`)
  }

  // Handoff
  const h = entry.tomorrowHandoff
  if (Object.values(h).some((v) => v)) {
    lines.push("", "handoff:")
    if (h.primary) lines.push(`  primary: ${esc(h.primary)}`)
    if (h.secondary) lines.push(`  secondary: ${esc(h.secondary)}`)
    if (h.maintenance) lines.push(`  maintenance: ${esc(h.maintenance)}`)
  }

  // Habits
  const doneHabits = entry.habits.filter((x) => x.done)
  if (doneHabits.length > 0) {
    lines.push("", "habits:")
    for (const hh of doneHabits) {
      lines.push(`  - key: ${hh.key}`, `    done: true`)
    }
  }

  // Scalars
  if (entry.energy !== null) lines.push("", `energy: ${entry.energy}`)
  if (entry.reading) lines.push("", `reading: ${esc(entry.reading)}`)
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
  const prev = adj(d, -1)
  const next = adj(d, 1)

  parts.push(`## [[${year}]] / [[${quarter}|${quarter.split("-")[1]}]] / [[${month}|${monthName}]] / [[${week}|Week ${weekNum}]]`)
  parts.push("# DAILY NOTE")
  parts.push(`##### ❮ [[${prev}]] | ${d} | [[${next}]] ❯`)
  parts.push("---")
  parts.push("")

  // ── 晨间日记 ──
  parts.push("### ☀️ 晨间意图")
  parts.push("> 今天将是美好的一天。")
  parts.push("")
  if (entry.morningIntention) {
    parts.push(entry.morningIntention)
  } else {
    parts.push("今天，我想体验的一件事是：")
  }
  parts.push("")

  // ── 今日任务 ──
  parts.push("### 今日任务")
  parts.push("> 只挑 1~3 件。完成任何一个就算赢。")
  if (entry.todos.some((t) => t.text)) {
    for (const t of entry.todos) {
      if (!t.text) continue
      parts.push(`- [${t.done ? "x" : " "}] ${t.text}`)
    }
  } else {
    parts.push("- [ ] ", "- [ ] ", "- [ ] ")
  }
  parts.push("")

  // ── 快速收纳 ──
  parts.push("### 快速收纳")
  parts.push("> 突然冒出来、但现在不做的事先记这里。")
  if (entry.quickCapture.length > 0) {
    for (const item of entry.quickCapture) parts.push(`- ${item}`)
  } else {
    parts.push("- ", "- ")
  }
  parts.push("")

  // ── 心情日记（自由书写） ──
  parts.push("### 💭 心情日记")
  parts.push("> 表达性写作：记录今天发生的事情、感受、情绪。不用有条理，想到什么写什么。")
  parts.push("")
  if (entry.freeWriting) {
    parts.push(entry.freeWriting)
  }
  parts.push("")

  // ── 生活故事 ──
  parts.push("### 📖 生活故事")
  parts.push("> 今天发生在我身上的最有故事价值的事情是什么？能以此为素材讲五分钟的故事。")
  parts.push("")
  if (entry.lifeStory) {
    parts.push(entry.lifeStory)
  }
  parts.push("")

  // ── 感恩日记 ──
  parts.push("### 🙏 感恩日记")
  parts.push("> 关注生活中发生的美好的事情。")
  parts.push("")
  const gratitude = entry.gratitude.filter((g) => g.content)
  if (gratitude.length > 0) {
    for (let i = 0; i < 3; i++) {
      const g = entry.gratitude[i]
      if (g?.content) {
        parts.push(`${i + 1}. ${g.content}`)
        if (g.person) parts.push(`   - 感谢：${g.person}`)
        if (g.qualities) parts.push(`   - TA 的品质：${g.qualities}`)
      } else {
        parts.push(`${i + 1}. `)
      }
    }
  } else {
    parts.push("1. ", "2. ", "3. ")
  }
  parts.push("")

  // ── 决策日记 ──
  parts.push("### 🧭 决策反思")
  parts.push("> 如果我继续照这条路走下去，5年后我的生活会是什么样子？")
  parts.push("")
  if (entry.decisionReflection) {
    parts.push(entry.decisionReflection)
  } else {
    parts.push("今天做了一个什么决定？或者有什么决定正在犹豫？")
  }
  parts.push("")

  // ── 晚间复盘 ──
  parts.push("### 晚间复盘")
  parts.push("> 先写事实，再写发现，再写一个明天自己能做的小动作。")
  parts.push("")
  parts.push("#### 今日状态")
  parts.push(`- 此刻状态：${entry.eveningReview.mood}`)
  parts.push(`- 身体感觉：${entry.eveningReview.body}`)
  parts.push(`- 最占据心里的事：${entry.eveningReview.occupyingThought}`)
  parts.push(`- 今天什么算值得：${entry.eveningReview.worthToday}`)
  parts.push("")
  parts.push("#### 事实与发现")
  parts.push(`- 今天发生了什么（客观事实）：${entry.eveningReview.facts}`)
  parts.push(`- 我注意到什么（发现 / 情绪 / 学习）：${entry.eveningReview.discoveries}`)
  parts.push(`- 明天我自己能做的一个小动作：${entry.eveningReview.nextAction}`)
  parts.push("")
  if (entry.eveningReview.didWell || entry.eveningReview.thorn || entry.eveningReview.pattern) {
    parts.push("#### 如果还有余力")
    if (entry.eveningReview.didWell) parts.push(`- 做得不错的地方：${entry.eveningReview.didWell}`)
    if (entry.eveningReview.thorn) parts.push(`- "带刺的机会"或小提醒：${entry.eveningReview.thorn}`)
    if (entry.eveningReview.pattern) parts.push(`- 更深地指向了什么模式：${entry.eveningReview.pattern}`)
    parts.push("")
  }

  // ── 明日交接 ──
  parts.push("### 明日交接")
  parts.push(`- 明天最重要的 1 件事：${entry.tomorrowHandoff.primary}`)
  parts.push(`- 第二重要（可留空）：${entry.tomorrowHandoff.secondary}`)
  parts.push(`- 维护秩序的小事（可留空）：${entry.tomorrowHandoff.maintenance}`)
  parts.push("")

  // ── 习惯养成 ──
  parts.push("---")
  parts.push("### ⚛️习惯养成")
  parts.push("> 每天完成「基础习惯」就算没有掉线。")
  parts.push("")
  const daily = entry.habits.filter((x) => x.category === "daily")
  const bonus = entry.habits.filter((x) => x.category === "bonus")
  const ai = entry.habits.filter((x) => x.category === "ai")
  parts.push("#### 基础习惯")
  for (const h of daily) parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
  parts.push("")
  parts.push("#### 可选加分")
  for (const h of bonus) parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
  parts.push("")
  parts.push("#### AI 协作")
  for (const h of ai) parts.push(`- [${h.done ? "x" : " "}] ${h.label}`)
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

function adj(dateStr: string, offset: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}
