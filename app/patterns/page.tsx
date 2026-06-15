import { listJournals } from "@/lib/journal/service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function PatternsPage() {
  const entries = await listJournals()

  // Extract potential patterns from evening reviews
  const patternsWithEvidence: {
    pattern: string
    dates: string[]
    category: string
  }[] = []

  for (const entry of entries) {
    if (entry.eveningReview.pattern) {
      const existing = patternsWithEvidence.find(
        (p) => p.pattern === entry.eveningReview.pattern
      )
      if (existing) {
        existing.dates.push(entry.date)
      } else {
        patternsWithEvidence.push({
          pattern: entry.eveningReview.pattern,
          dates: [entry.date],
          category: detectCategory(entry.eveningReview.pattern),
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">模式库</h1>
        <p className="text-sm text-muted-foreground mt-1">
          从你的日记中识别出的反复出现的主题与模式。AI 辅助识别功能即将推出。
        </p>
      </div>

      {patternsWithEvidence.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              还没有识别到模式。坚持写日记，尤其是在晚间复盘时追问"这件事更深地指向了什么模式"。
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              当 AI 模式提取功能上线后，Miroir 会自动扫描你的日记来发现模式。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {patternsWithEvidence.map((p, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {p.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {p.dates.length} 次出现
                  </Badge>
                </div>
                <CardTitle className="text-base mt-1">{p.pattern}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {p.dates.map((date) => (
                    <Link
                      key={date}
                      href={`/journal/${date}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {date}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function detectCategory(pattern: string): string {
  const lower = pattern.toLowerCase()
  if (lower.includes("逃避") || lower.includes("逃") || lower.includes("拖延") || lower.includes("avoid")) {
    return "逃避模式"
  }
  if (lower.includes("价值") || lower.includes("否定") || lower.includes("打压") || lower.includes("不够好")) {
    return "自我价值感"
  }
  if (lower.includes("关系") || lower.includes("脆弱") || lower.includes("敞开心扉")) {
    return "关系与脆弱"
  }
  if (lower.includes("恐惧") || lower.includes("害怕") || lower.includes("方向") || lower.includes("编制") || lower.includes("考编")) {
    return "方向与恐惧"
  }
  if (lower.includes("身体") || lower.includes("睡眠") || lower.includes("喝水") || lower.includes("运动")) {
    return "身体与生活"
  }
  return "其他"
}
