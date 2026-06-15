import fs from "fs/promises"
import path from "path"
import { JournalEntry } from "./types"
import { parseJournalMarkdown, parseBodySections } from "./parser"
import { journalToMarkdown } from "./writer"
import { getWeekString, getMonthString, getQuarterString } from "@/lib/utils/date"

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal")

export async function ensureJournalDir(): Promise<void> {
  await fs.mkdir(JOURNAL_DIR, { recursive: true })
}

export function getJournalFilePath(date: string): string {
  return path.join(JOURNAL_DIR, `${date}.md`)
}

export async function journalExists(date: string): Promise<boolean> {
  try {
    await fs.access(getJournalFilePath(date))
    return true
  } catch {
    return false
  }
}

export async function readJournal(date: string): Promise<JournalEntry | null> {
  try {
    const filePath = getJournalFilePath(date)
    const raw = await fs.readFile(filePath, "utf-8")
    // Also parse inline body sections
    const bodySections = parseBodySections(raw)
    const entry = parseJournalMarkdown(raw, date)

    // Merge body sections into entry
    if (bodySections.stateCheckin && !entry.state.mood) {
      // Extract state from body if frontmatter is sparse
      const lines = bodySections.stateCheckin.split("\n")
      for (const line of lines) {
        const moodMatch = line.match(/此刻状态[：:]\s*(.+)/)
        if (moodMatch && !entry.state.mood) entry.state.mood = moodMatch[1].trim()
        const bodyMatch = line.match(/身体.*?[：:]\s*(.+)/)
        if (bodyMatch && !entry.state.body) entry.state.body = bodyMatch[1].trim()
        const thoughtMatch = line.match(/占据.*?[：:]\s*(.+)/)
        if (thoughtMatch && !entry.state.occupyingThought) entry.state.occupyingThought = thoughtMatch[1].trim()
        const worthMatch = line.match(/值得.*?[：:]\s*(.+)/)
        if (worthMatch && !entry.state.worthToday) entry.state.worthToday = worthMatch[1].trim()
      }
    }
    if (bodySections.eveningReview.facts && !entry.eveningReview.facts) {
      entry.eveningReview = { ...entry.eveningReview, ...bodySections.eveningReview }
    }
    if (bodySections.tomorrowHandoff.primary && !entry.tomorrowHandoff.primary) {
      entry.tomorrowHandoff = { ...entry.tomorrowHandoff, ...bodySections.tomorrowHandoff }
    }

    return entry
  } catch (error) {
    return null
  }
}

export async function writeJournal(entry: JournalEntry): Promise<void> {
  await ensureJournalDir()
  const filePath = getJournalFilePath(entry.date)
  const markdown = journalToMarkdown(entry)
  await fs.writeFile(filePath, markdown, "utf-8")
}

export async function listJournals(): Promise<JournalEntry[]> {
  await ensureJournalDir()
  const files = await fs.readdir(JOURNAL_DIR)
  const entries: JournalEntry[] = []

  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const date = file.replace(".md", "")
    // Skip non-date files
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue

    try {
      const raw = await fs.readFile(path.join(JOURNAL_DIR, file), "utf-8")
      const entry = parseJournalMarkdown(raw, date)
      entries.push(entry)
    } catch {
      // Skip corrupted files
    }
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getJournalDates(): Promise<string[]> {
  await ensureJournalDir()
  const files = await fs.readdir(JOURNAL_DIR)
  return files
    .filter(f => f.endsWith(".md") && /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map(f => f.replace(".md", ""))
    .sort()
    .reverse()
}

export async function searchJournals(query: string): Promise<JournalEntry[]> {
  const entries = await listJournals()
  const lowerQuery = query.toLowerCase()
  return entries.filter(entry => {
    const searchText = [
      entry.state.mood,
      entry.state.body,
      entry.state.occupyingThought,
      entry.freeWriting,
      entry.eveningReview.facts,
      entry.eveningReview.discoveries,
      entry.eveningReview.pattern,
      entry.reading,
    ].join(" ")
    return searchText.toLowerCase().includes(lowerQuery)
  })
}

export async function getOnThisDay(today: string): Promise<JournalEntry[]> {
  const todayDate = new Date(today)
  const month = todayDate.getMonth() + 1
  const day = todayDate.getDate()
  const year = todayDate.getFullYear()

  const entries: JournalEntry[] = []
  for (let y = year - 1; y >= year - 5; y--) {
    const pastDate = `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const entry = await readJournal(pastDate)
    if (entry) {
      entries.push(entry)
    }
  }

  return entries
}
