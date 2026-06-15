"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { WHEEL_DIMENSIONS, WheelOfLife, emptyWheelOfLife } from "@/lib/journal/types"
import { cn } from "@/lib/utils"

export default function YearlyReviewPage() {
  const params = useParams()
  const year = parseInt((params?.year as string) || String(new Date().getFullYear()))

  const [wheel, setWheel] = useState<WheelOfLife>(emptyWheelOfLife())
  const [mostStoryWorthy, setMostStoryWorthy] = useState("")
  const [decisionReflection, setDecisionReflection] = useState("")
  const [fearExercise, setFearExercise] = useState({
    worstOutcome: "", prevention: "", recovery: "", smallSuccessGain: "", inactionCost: "", adviceFrom85: "",
  })
  const [celebrations, setCelebrations] = useState<string[]>(["", "", ""])
  const [yearGratitude, setYearGratitude] = useState("")
  const [nextYearTheme, setNextYearTheme] = useState("")
  const [nextYearTop3, setNextYearTop3] = useState(["", "", ""])

  const avgWheel = Object.values(wheel).filter((v) => v > 0).length > 0
    ? Math.round((Object.values(wheel).reduce((a, b) => a + b, 0) / Object.values(wheel).filter((v) => v > 0).length) * 10) / 10
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{year} 年度回顾</h1>
        <p className="text-sm text-muted-foreground mt-1">回顾这一年的成长，为下一年设定方向。</p>
      </div>

      {/* 🎡 生命之轮 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">🎡 生命之轮</CardTitle>
          <CardDescription>十项打分，满分十分。不必苛责自己——低于3分的，想想怎么提升到5分。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {WHEEL_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="text-center space-y-1.5">
                <p className="text-sm text-muted-foreground">{dim.label}</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setWheel({ ...wheel, [dim.key]: score })}
                      className={cn(
                        "w-6 h-6 rounded text-[10px] font-medium transition-colors",
                        wheel[dim.key] >= score
                          ? score <= 3 ? "bg-red-500/70 text-white"
                          : score <= 5 ? "bg-amber-500/70 text-white"
                          : score <= 7 ? "bg-green-500/60 text-white"
                          : "bg-emerald-500 text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                      )}
                      title={`${score}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-foreground">{wheel[dim.key] || "—"}</p>
              </div>
            ))}
          </div>
          {avgWheel !== null && (
            <div className="text-center">
              <Badge variant="secondary" className="text-sm px-4 py-1">
                平均分：{avgWheel} / 10
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📖 年度故事 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📖 今年的故事</CardTitle>
          <CardDescription>今年发生在我身上的最有故事价值的事情是什么？</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={mostStoryWorthy} onChange={(e) => setMostStoryWorthy(e.target.value)} placeholder="如果要把今年写成五分钟的故事..." className="min-h-[100px]" />
        </CardContent>
      </Card>

      {/* 🧭 决策反思 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧭 决策反思</CardTitle>
          <CardDescription>如果我继续照这条路走下去，5年后我的生活会是什么样子？如果我走一条完全不同的路呢？</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={decisionReflection} onChange={(e) => setDecisionReflection(e.target.value)} placeholder="写下你的思考..." className="min-h-[120px]" />
        </CardContent>
      </Card>

      {/* 😨 恐惧练习 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">😨 恐惧练习</CardTitle>
          <CardDescription>面对那些让你不敢行动的事情。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><label className="text-sm text-muted-foreground">如果做了最害怕的事情，最坏的结果是什么？</label><Textarea value={fearExercise.worstOutcome} onChange={(e) => setFearExercise({ ...fearExercise, worstOutcome: e.target.value })} placeholder="最坏会怎样？" className="mt-1 h-20" /></div>
          <div><label className="text-sm text-muted-foreground">我能做些什么来防止最坏的事情发生？</label><Input value={fearExercise.prevention} onChange={(e) => setFearExercise({ ...fearExercise, prevention: e.target.value })} placeholder="预防措施" /></div>
          <div><label className="text-sm text-muted-foreground">如果最坏的事情发生了，我能用什么来弥补？</label><Input value={fearExercise.recovery} onChange={(e) => setFearExercise({ ...fearExercise, recovery: e.target.value })} placeholder="补救方案" /></div>
          <div><label className="text-sm text-muted-foreground">如果我取得了一点点成功，能获得什么？</label><Input value={fearExercise.smallSuccessGain} onChange={(e) => setFearExercise({ ...fearExercise, smallSuccessGain: e.target.value })} placeholder="小成功也值得庆祝" /></div>
          <div><label className="text-sm text-muted-foreground">如果我害怕的事情一件不做，半年、一年、三年后我的生活会怎样？</label><Textarea value={fearExercise.inactionCost} onChange={(e) => setFearExercise({ ...fearExercise, inactionCost: e.target.value })} placeholder="什么都不做的代价" className="mt-1 h-20" /></div>
          <div><label className="text-sm text-muted-foreground">向 85 岁的自己寻求建议：现在我应该怎么做？</label><Textarea value={fearExercise.adviceFrom85} onChange={(e) => setFearExercise({ ...fearExercise, adviceFrom85: e.target.value })} placeholder="老年的自己会给现在的你什么建议？" className="mt-1 h-20" /></div>
        </CardContent>
      </Card>

      {/* 🎉 12个月庆祝清单 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎉 12个月后想庆祝的事</CardTitle>
          <CardDescription>在生活的不同方面，一年后你想和朋友一起庆祝什么？比如每周健身三次、第一次创业、要求加薪……</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {celebrations.map((c, i) => (
            <Input key={i} value={c} onChange={(e) => { const arr = [...celebrations]; arr[i] = e.target.value; setCelebrations(arr) }} placeholder={`${i + 1}. 我想庆祝...`} />
          ))}
        </CardContent>
      </Card>

      {/* 🙏 年度感恩 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🙏 年度感恩</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={yearGratitude} onChange={(e) => setYearGratitude(e.target.value)} placeholder="这一年，你最感激的人或事是什么？" className="min-h-[80px]" />
        </CardContent>
      </Card>

      {/* 🎯 下一年方向 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎯 {year + 1} 年方向</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><label className="text-sm text-muted-foreground">年度主题</label><Input value={nextYearTheme} onChange={(e) => setNextYearTheme(e.target.value)} placeholder="一个词或一句话概括明年的主题" /></div>
          <div><label className="text-sm text-muted-foreground">最重要的 3 件事</label>
            {nextYearTop3.map((t, i) => (
              <Input key={i} value={t} onChange={(e) => { const arr = [...nextYearTop3]; arr[i] = e.target.value; setNextYearTop3(arr) }} placeholder={`${i + 1}. `} className="mt-1" />
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center pb-8">
        💡 记住在 12 月庆祝之前提醒自己，同时享受过程中的每一步。
      </p>
    </div>
  )
}
