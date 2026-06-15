import fs from "fs/promises"
import path from "path"
import { JournalEntry } from "./types"
import { parseJournalMarkdown } from "./parser"
import { journalToMarkdown } from "./writer"

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
    return parseJournalMarkdown(raw, date)
  } catch {
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
    .filter((f) => f.endsWith(".md") && /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map((f) => f.replace(".md", ""))
    .sort()
    .reverse()
}

export async function searchJournals(query: string): Promise<JournalEntry[]> {
  const entries = await listJournals()
  const lowerQuery = query.toLowerCase()
  return entries.filter((entry) => {
    const searchText = [
      entry.freeWriting,
      entry.eveningReview.mood,
      entry.eveningReview.body,
      entry.eveningReview.occupyingThought,
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
