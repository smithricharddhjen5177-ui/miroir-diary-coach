import { NextRequest, NextResponse } from "next/server"
import { searchJournals, getJournalDates } from "@/lib/journal/service"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    const dates = await getJournalDates()
    return NextResponse.json({ dates })
  }

  const entries = await searchJournals(query)
  return NextResponse.json(entries)
}
