import { readJournal } from "@/lib/journal/service"
import { getWeekString, getMonthString, getQuarterString } from "@/lib/utils/date"
import { JournalEntry, emptyJournalEntry } from "@/lib/journal/types"
import { DailyJournal } from "../_components/DailyJournal"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ date: string }>
}

export default async function JournalEntryPage({ params }: Props) {
  const { date } = await params
  const entry = await readJournal(date)

  if (!entry) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <DailyJournal entry={entry} isNew={false} />
    </div>
  )
}
