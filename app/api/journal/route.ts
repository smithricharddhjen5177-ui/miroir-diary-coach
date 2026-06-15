import { NextRequest, NextResponse } from "next/server"
import { readJournal, writeJournal, listJournals } from "@/lib/journal/service"
import { JournalEntry } from "@/lib/journal/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (date) {
    const entry = await readJournal(date)
    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(entry)
  }

  const entries = await listJournals()
  return NextResponse.json(entries)
}

export async function POST(request: NextRequest) {
  try {
    const body: JournalEntry = await request.json()

    if (!body.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    await writeJournal(body)
    return NextResponse.json({ success: true, date: body.date })
  } catch (error) {
    console.error("Failed to save journal:", error)
    return NextResponse.json(
      { error: "Failed to save journal" },
      { status: 500 }
    )
  }
}
