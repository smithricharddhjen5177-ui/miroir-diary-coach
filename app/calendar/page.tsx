import { getJournalDates } from "@/lib/journal/service"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"

export default async function CalendarPage() {
  const dates = await getJournalDates()
  const dateSet = new Set(dates)

  // Generate calendar for current and past 3 months
  const today = new Date()
  const months: Date[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push(d)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">日历</h1>
        <p className="text-sm text-muted-foreground mt-1">
          共 {dates.length} 篇日记
        </p>
      </div>

      {months.map((monthStart) => {
        const monthEnd = endOfMonth(monthStart)
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
        const monthLabel = format(monthStart, "yyyy 年 M 月")

        return (
          <Card key={monthLabel}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{monthLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
                  <div key={d} className="py-1 font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}
                {/* Pad start of month */}
                {Array.from({ length: (getDay(monthStart) + 6) % 7 }).map(
                  (_, i) => (
                    <div key={`pad-${i}`} />
                  )
                )}
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd")
                  const hasEntry = dateSet.has(dateStr)
                  const isToday = isSameDay(day, today)

                  return (
                    <Link
                      key={dateStr}
                      href={hasEntry ? `/journal/${dateStr}` : `/journal/${dateStr}`}
                      className={`py-2 rounded-md text-sm transition-colors ${
                        isToday
                          ? "bg-primary text-primary-foreground font-semibold"
                          : hasEntry
                          ? "bg-primary/10 hover:bg-primary/20 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {format(day, "d")}
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
