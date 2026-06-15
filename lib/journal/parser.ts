import matter from "gray-matter"
import { JournalEntry, emptyJournalEntry, Habit } from "./types"
import { getWeekString, getMonthString, getQuarterString } from "@/lib/utils/date"

export function parseJournalMarkdown(
  raw: string,
  fallbackDate: string
): JournalEntry {
  const { data, content } = matter(raw)

  const date = data.date || fallbackDate
  const week = data.week || getWeekString(new Date(date))
  const month = data.month || getMonthString(new Date(date))
  const quarter = data.quarter || getQuarterString(new Date(date))

  const entry = emptyJournalEntry(date, week, month, quarter)

  // Parse todos (merged priorities + tasks)
  if (Array.isArray(data.todos)) {
    entry.todos = data.todos.map(
      (t: { text?: string; done?: boolean }) => ({
        text: t.text || "",
        done: t.done || false,
      })
    )
  } else {
    // Backward compat: merge old priorities and tasks
    const oldPriorities = Array.isArray(data.priorities)
      ? data.priorities.map((p: { text?: string; done?: boolean }) => ({
          text: p.text || "",
          done: p.done || false,
        }))
      : []
    const oldTasks = Array.isArray(data.tasks)
      ? data.tasks.map((t: { text?: string; done?: boolean }) => ({
          text: t.text || "",
          done: t.done || false,
        }))
      : []
    entry.todos = [...oldPriorities, ...oldTasks].filter((t) => t.text)
    // Pad to 3 items
    while (entry.todos.length < 3) {
      entry.todos.push({ text: "", done: false })
    }
  }

  // Parse quick capture
  if (Array.isArray(data.quick_capture)) {
    entry.quickCapture = data.quick_capture
  }

  // Extract only the 自由书写 section from body (fix garbled text)
  entry.freeWriting = extractFreeWriting(content)

  // Parse evening review from frontmatter
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

  // Parse tomorrow handoff
  if (data.handoff) {
    entry.tomorrowHandoff = {
      primary: data.handoff.primary || "",
      secondary: data.handoff.secondary || "",
      maintenance: data.handoff.maintenance || "",
    }
  }

  // Parse habits (new format) or fall back to old maintenance
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
    // Backward compat
    const defaultHabits = emptyJournalEntry(date, week, month, quarter).habits
    for (const habit of entry.habits) {
      const oldKey = habit.key
      if (oldKey in data.maintenance) {
        habit.done = !!data.maintenance[oldKey]
      }
    }
  }

  // Scalar fields
  entry.energy = data.energy ?? null
  entry.reading = data.reading || ""
  entry.meditation = data.meditation || false
  entry.workout = data.workout || false

  return entry
}

/**
 * Extract only the 自由书写 section from the markdown body.
 * Before: entire body was used as freeWriting (causing duplicates and garbled HTML)
 * Now: only content between "### 📕自由书写" and the next "###" heading.
 */
function extractFreeWriting(body: string): string {
  if (!body) return ""

  // Find the free writing section
  const startMarker = "### 📕自由书写"
  const startIndex = body.indexOf(startMarker)
  if (startIndex === -1) return body.trim() // fallback: whole body is free writing

  const afterStart = body.substring(startIndex + startMarker.length)

  // Find the next ### heading
  const nextHeading = afterStart.search(/\n###\s/)
  if (nextHeading === -1) {
    // No next heading - rest is free writing
    return afterStart.trim()
  }

  const section = afterStart.substring(0, nextHeading).trim()
  // Strip HTML tags to get plain text
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
