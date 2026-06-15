import { getOnThisDay } from "@/lib/journal/service"
import { formatDateShort } from "@/lib/utils/date"
import Link from "next/link"

export async function OnThisDay({ today }: { today: string }) {
  const entries = await getOnThisDay(today)

  if (entries.length === 0) return null

  return (
    <div className="rounded-xl border bg-card px-6 py-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        📅 往年今日
      </h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <Link
            key={entry.date}
            href={`/journal/${entry.date}`}
            className="block rounded-lg border bg-background p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDateShort(entry.date)}
              </span>
              {entry.energy !== null && (
                <span className="text-xs text-muted-foreground">
                  ⚡ {entry.energy}/10
                </span>
              )}
            </div>
            <p className="text-sm line-clamp-2 text-foreground/80">
              {entry.eveningReview.occupyingThought ||
                entry.eveningReview.facts ||
                entry.freeWriting?.slice(0, 100) ||
                "（无内容）"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
