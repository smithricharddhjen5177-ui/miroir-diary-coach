import { getWeekString, getWeekRange, formatDateShort } from "@/lib/utils/date"
import { listJournals } from "@/lib/journal/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ week: string }>
}

export default async function WeeklyReviewPage({ params }: Props) {
  const { week: weekParam } = await params
  const weekStr = weekParam === "current" ? getWeekString() : weekParam

  // Validate week string format
  if (!/^\d{4}-W\d{2}$/.test(weekStr)) {
    notFound()
  }

  const { start, end } = getWeekRange(weekStr)
  const allEntries = await listJournals()
  const weekEntries = allEntries.filter(
    (e) => e.date >= start && e.date <= end
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">周记</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {weekStr} · {start} ~ {end}
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本周概览</CardTitle>
        </CardHeader>
        <CardContent>
          {weekEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              这周还没有日记。开始写第一篇吧。
            </p>
          ) : (
            <div className="space-y-3">
              {weekEntries.map((entry) => (
                <Link
                  key={entry.date}
                  href={`/journal/${entry.date}`}
                  className="block rounded-lg border p-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {formatDateShort(entry.date)}
                    </span>
                    <div className="flex items-center gap-2">
                      {entry.energy !== null && (
                        <Badge variant="secondary" className="text-xs">
                          ⚡ {entry.energy}
                        </Badge>
                      )}
                      {entry.eveningReview.facts && (
                        <Badge variant="outline" className="text-xs">
                          已复盘
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.state.occupyingThought ||
                      entry.eveningReview.discoveries ||
                      "（自由书写）"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly review template (interactive would be in a client component) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本周联结</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>回顾这一周的日记，观察：</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>这周反复出现的主题或模式是什么？</li>
            <li>哪两三件事其实互相有联结？</li>
            <li>哪个小动作其实是一个信号？</li>
            <li>这周和上周比，有哪里不一样？</li>
          </ul>
          <p className="text-xs mt-3">
            完整周记模板（含交互式复盘）将在后续版本支持。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
