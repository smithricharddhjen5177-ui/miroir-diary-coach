import matter from "gray-matter"
import { JournalEntry, emptyJournalEntry } from "./types"
import { getWeekString, getMonthString, getQuarterString } from "@/lib/utils/date"

export function parseJournalMarkdown(raw: string, fallbackDate: string): JournalEntry {
  const { data, content } = matter(raw)
  const date = data.date || fallbackDate
  const week = data.week || getWeekString(new Date(date))
  const month = data.month || getMonthString(new Date(date))
  const quarter = data.quarter || getQuarterString(new Date(date))

  const entry = emptyJournalEntry(date, week, month, quarter)

  // Morning intention
  if (data.morning_intention) {
    entry.morningIntention = data.morning_intention
  }

  // Todos
  if (Array.isArray(data.todos)) {
    entry.todos = data.todos.map((t: { text?: string; done?: boolean }) => ({
      text: t.text || "",
      done: t.done || false,
    }))
  } else {
    // Backward compat
    const oldP = Array.isArray(data.priorities)
      ? data.priorities.map((p: { text?: string; done?: boolean }) => ({ text: p.text || "", done: p.done || false }))
      : []
    const oldT = Array.isArray(data.tasks)
      ? data.tasks.map((t: { text?: string; done?: boolean }) => ({ text: t.text || "", done: t.done || false }))
      : []
    entry.todos = [...oldP, ...oldT].filter((x) => x.text)
    while (entry.todos.length < 3) entry.todos.push({ text: "", done: false })
  }

  // Quick capture
  if (Array.isArray(data.quick_capture)) entry.quickCapture = data.quick_capture

  // Life story
  if (data.life_story) entry.lifeStory = data.life_story

  // Free writing — extract from body (only the 心情日记 section)
  entry.freeWriting = extractSection(content, "💭 心情日记")

  // Gratitude
  if (Array.isArray(data.gratitude)) {
    entry.gratitude = data.gratitude.map(
      (g: { content?: string; person?: string; qualities?: string }) => ({
        content: g.content || "",
        person: g.person || "",
        qualities: g.qualities || "",
      })
    )
  }

  // Decision reflection
  if (data.decision_reflection) entry.decisionReflection = data.decision_reflection

  // Evening review
  if (data.review) {
    entry.eveningReview = {
      mood: data.review.mood || "",
      body: data.review.body || "",
      occupyingThought: data.review.occupying_thought || "",
      worthToday: data.review.worth_today || "",
      facts: data.review.facts || "",
      discoveries: data.review.discoveries || "",
      nextAction: data.review.next_action || "",
      didWell: data.review.did_well || "",
      thorn: data.review.thorn || "",
      pattern: data.review.pattern || "",
    }
  }

  // Handoff
  if (data.handoff) {
    entry.tomorrowHandoff = {
      primary: data.handoff.primary || "",
      secondary: data.handoff.secondary || "",
      maintenance: data.handoff.maintenance || "",
    }
  }

  // Habits
  if (Array.isArray(data.habits)) {
    entry.habits = data.habits.map(
      (h: { key?: string; label?: string; done?: boolean; category?: string }) => ({
        key: h.key || "",
        label: h.label || "",
        done: h.done || false,
        category: (h.category === "bonus" || h.category === "ai" ? h.category : "daily") as "daily" | "bonus" | "ai",
      })
    )
  } else if (data.maintenance) {
    for (const habit of entry.habits) {
      if (habit.key in data.maintenance) habit.done = !!data.maintenance[habit.key]
    }
  }

  entry.energy = data.energy ?? null
  entry.reading = data.reading || ""
  entry.meditation = data.meditation || false
  entry.workout = data.workout || false

  return entry
}

function extractSection(body: string, sectionName: string): string {
  if (!body) return ""
  const startMarker = `### ${sectionName}`
  const startIndex = body.indexOf(startMarker)
  if (startIndex === -1) {
    // fallback: look for old "📕自由书写" marker
    const oldMarker = "### 📕自由书写"
    const oldIdx = body.indexOf(oldMarker)
    if (oldIdx === -1) return body.trim()
    const after = body.substring(oldIdx + oldMarker.length)
    const nextHeading = after.search(/\n###\s/)
    return nextHeading === -1 ? after.trim() : after.substring(0, nextHeading).trim()
  }
  const after = body.substring(startIndex + startMarker.length)
  const nextHeading = after.search(/\n###\s/)
  const section = nextHeading === -1 ? after.trim() : after.substring(0, nextHeading).trim()
  return stripHtml(section)
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}
