import { getToday, getWeekString, getMonthString, getQuarterString, getDeathCountdown } from "@/lib/utils/date"
import { readJournal, journalExists } from "@/lib/journal/service"
import { JournalEntry, emptyJournalEntry } from "@/lib/journal/types"
import { DailyJournal } from "../_components/DailyJournal"
import { OnThisDay } from "../_components/OnThisDay"
import { Countdown } from "../_components/Countdown"

export default async function TodayPage() {
  const today = getToday()
  const existing = await readJournal(today)

  const entry: JournalEntry = existing || emptyJournalEntry(
    today,
    getWeekString(),
    getMonthString(),
    getQuarterString()
  )

  const daysLeft = getDeathCountdown()

  return (
    <div className="space-y-8">
      <DailyJournal entry={entry} isNew={!existing} />

      <Countdown daysLeft={daysLeft} />

      {existing && <OnThisDay today={today} />}
    </div>
  )
}
