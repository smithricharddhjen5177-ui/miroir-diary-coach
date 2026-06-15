import matter from "gray-matter"
import { JournalEntry, emptyJournalEntry, JournalState, Priority, Task, EveningReview, TomorrowHandoff, Maintenance } from "./types"
import { getWeekString, getMonthString, getQuarterString } from "@/lib/utils/date"

export function parseJournalMarkdown(raw: string, fallbackDate: string): JournalEntry {
  const { data, content } = matter(raw)

  const date = data.date || fallbackDate
  const week = data.week || getWeekString(new Date(date))
  const month = data.month || getMonthString(new Date(date))
  const quarter = data.quarter || getQuarterString(new Date(date))

  const entry = emptyJournalEntry(date, week, month, quarter)

  // Parse state
  if (data.state) {
    entry.state = {
      mood: data.state.mood || "",
      body: data.state.body || "",
      occupyingThought: data.state.occupying_thought || "",
      worthToday: data.state.worth_today || "",
    }
  }

  // Parse priorities
  if (Array.isArray(data.priorities)) {
    entry.priorities = data.priorities.map((p: { text?: string; done?: boolean }) => ({
      text: p.text || "",
      done: p.done || false,
    }))
  }

  // Parse tasks
  if (Array.isArray(data.tasks)) {
    entry.tasks = data.tasks.map((t: { text?: string; done?: boolean }) => ({
      text: t.text || "",
      done: t.done || false,
    }))
  }

  // Parse quick capture
  if (Array.isArray(data.quick_capture)) {
    entry.quickCapture = data.quick_capture
  }

  // Parse free writing from content body
  entry.freeWriting = content.trim()

  // Parse maintenance
  if (data.maintenance) {
    entry.maintenance = {
      openPage: data.maintenance.open_page || false,
      focusTime: data.maintenance.focus_time || false,
      reviewLine: data.maintenance.review_line || false,
      outdoor: data.maintenance.outdoor || false,
      stretch: data.maintenance.stretch || false,
      treat: data.maintenance.treat || false,
      aiPlan: data.maintenance.ai_plan || false,
      aiReview: data.maintenance.ai_review || false,
    }
  }

  // Scalar fields
  entry.energy = data.energy ?? null
  entry.reading = data.reading || ""
  entry.meditation = data.meditation || false
  entry.workout = data.workout || false

  // Parse evening review from frontmatter
  if (data.review) {
    entry.eveningReview = {
      facts: data.review.facts || "",
      discoveries: data.review.discoveries || "",
      nextAction: data.review.next_action || "",
      didWell: data.review.did_well || "",
      thorn: data.review.thorn || "",
      pattern: data.review.pattern || "",
    }
  }

  // Parse tomorrow handoff from frontmatter
  if (data.handoff) {
    entry.tomorrowHandoff = {
      primary: data.handoff.primary || "",
      secondary: data.handoff.secondary || "",
      maintenance: data.handoff.maintenance || "",
    }
  }

  return entry
}

/**
 * Parse the free writing content to extract evening review sections.
 * This handles the case where the review is written inline in the markdown body
 * rather than in frontmatter.
 */
export function parseBodySections(body: string): {
  stateCheckin: string
  freeWriting: string
  eveningReview: { facts: string; discoveries: string; nextAction: string; didWell: string; thorn: string; pattern: string }
  tomorrowHandoff: { primary: string; secondary: string; maintenance: string }
} {
  const sections = {
    stateCheckin: "",
    freeWriting: body,
    eveningReview: { facts: "", discoveries: "", nextAction: "", didWell: "", thorn: "", pattern: "" },
    tomorrowHandoff: { primary: "", secondary: "", maintenance: "" },
  }

  // Extract 今日状态 section
  const stateMatch = body.match(/###\s*今日状态\n([\s\S]*?)(?=###|$)/)
  if (stateMatch) {
    sections.stateCheckin = stateMatch[1].trim()
  }

  // Extract 晚间复盘 section with subsections
  const reviewMatch = body.match(/###\s*晚间复盘\n([\s\S]*?)(?=###\s*明日交接|$)/)
  if (reviewMatch) {
    const reviewText = reviewMatch[1]

    const factsMatch = reviewText.match(/- 今天发生了什么[：:]\s*([^\n]*)/)
    if (factsMatch) sections.eveningReview.facts = factsMatch[1].trim()

    const discoMatch = reviewText.match(/- 我注意到什么[：:]\s*([^\n]*)/)
    if (discoMatch) sections.eveningReview.discoveries = discoMatch[1].trim()

    const actionMatch = reviewText.match(/- 明天我自己能做的一个小动作[：:]\s*([^\n]*)/)
    if (actionMatch) sections.eveningReview.nextAction = actionMatch[1].trim()

    const wellMatch = reviewText.match(/- 今天一个做得不错的地方[：:]\s*([^\n]*)/)
    if (wellMatch) sections.eveningReview.didWell = wellMatch[1].trim()

    const thornMatch = reviewText.match(/- 今天出现了什么[“"](.*?)[”"]或小提醒[：:]\s*([^\n]*)/)
    if (thornMatch) sections.eveningReview.thorn = thornMatch[2].trim()

    const patternMatch = reviewText.match(/- 这件事更深地指向了什么模式[：:]\s*([^\n]*)/)
    if (patternMatch) sections.eveningReview.pattern = patternMatch[1].trim()
  }

  // Extract 明日交接 section
  const handoffMatch = body.match(/###\s*明日交接\n([\s\S]*?)(?=---|$)/)
  if (handoffMatch) {
    const handoffText = handoffMatch[1]

    const primaryMatch = handoffText.match(/- 明天最重要的 1 件事[：:]\s*([^\n]*)/)
    if (primaryMatch) sections.tomorrowHandoff.primary = primaryMatch[1].trim()

    const secondaryMatch = handoffText.match(/- 明天第二重要的 1 件事[：:]\s*([^\n]*)/)
    if (secondaryMatch) sections.tomorrowHandoff.secondary = secondaryMatch[1].trim()

    const maintMatch = handoffText.match(/- 明天维护秩序的 1 件小事[：:]\s*([^\n]*)/)
    if (maintMatch) sections.tomorrowHandoff.maintenance = maintMatch[1].trim()
  }

  // Extract free writing (content before 晚间复盘)
  const freeWritingMatch = body.match(/###\s*📕自由书写\n([\s\S]*?)(?=###\s*晚间复盘|$)/)
  if (freeWritingMatch) {
    sections.freeWriting = freeWritingMatch[1].trim()
  }

  return sections
}
