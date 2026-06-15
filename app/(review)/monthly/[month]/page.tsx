import { getMonthString, formatDateShort } from "@/lib/utils/date"
import { listJournals } from "@/lib/journal/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ month: string }>
}

export default async function MonthlyReviewPage({ params }: Props) {
  const { month: monthParam } = await params
  const monthStr = monthParam === "current" ? getMonthString() : monthParam

  // Validate month string format
  if (!/^\d{4}-\d{2}$/.test(monthStr)) {
    notFound()
  }

  const allEntries = await listJournals()
  const monthEntries = allEntries.filter((e) => e.date.startsWith(monthStr))

  const avgEnergy =
    monthEntries.length > 0
      ? Math.round(
          monthEntries.reduce((sum, e) => sum + (e.energy || 0), 0) /
            monthEntries.filter((e) => e.energy !== null).length || 0
        )
      : null

  const reviewCount = monthEntries.filter(
    (e) => e.eveningReview.facts
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">月记</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {monthStr} · {monthEntries.length} 篇日记
          {avgEnergy !== null && ` · 平均能量 ${avgEnergy}/10`}
          {` · ${reviewCount} 天复盘`}
        </p>
      </div>

      {/* Month stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase">
              日记天数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {monthEntries.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase">
              平均能量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {avgEnergy !== null ? avgEnergy : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase">
              复盘率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {monthEntries.length > 0
                ? Math.round((reviewCount / monthEntries.length) * 100)
                : 0}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Entry list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本月日记</CardTitle>
        </CardHeader>
        <CardContent>
          {monthEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              这个月还没有日记。
            </p>
          ) : (
            <div className="space-y-2">
              {monthEntries.map((entry) => (
                <Link
                  key={entry.date}
                  href={`/journal/${entry.date}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {formatDateShort(entry.date)}
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {entry.eveningReview.occupyingThought ||
                        entry.freeWriting?.slice(0, 60) ||
                        "（空）"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.energy !== null && (
                      <Badge variant="secondary" className="text-xs">
                        ⚡{entry.energy}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
