"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { JournalEntry } from "@/lib/journal/types"
import { formatDate } from "@/lib/utils/date"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { EnergyPicker } from "./EnergyPicker"
import { FreeWritingEditor } from "./FreeWritingEditor"
import Link from "next/link"

// ─── Writing prompts from video framework ───
const MOOD_PROMPTS = [
  "今天发生了什么让我情绪波动的事？",
  "今天哪个瞬间让我感觉最有活力？",
  "如果用三个词形容今天的心情，是什么？",
  "今天的身体有什么感觉？紧绷、放松、疲惫还是充沛？",
]

const STORY_PROMPTS = [
  "今天发生的最有故事价值的一件事是什么？",
  "如果能写成一篇五分钟的短故事，主角是谁？起承转合是什么？",
  "今天有哪个瞬间是我希望永远记住的？",
]

const DECISION_PROMPTS = [
  "如果我继续照这条路走下去，5年后我的生活会是什么样子？",
  "如果我走一条完全不同的路，同时不用担心钱和别人的眼光，5年后呢？",
  "今天做了什么决定？或者有什么决定正在犹豫？",
  "12个月后，我想和朋友一起庆祝什么？",
]

interface Props {
  entry: JournalEntry
  isNew: boolean
}

export function DailyJournal({ entry: initialEntry, isNew }: Props) {
  const router = useRouter()
  const [entry, setEntry] = useState<JournalEntry>(initialEntry)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const scheduleSave = useCallback((updated: JournalEntry) => {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveJournal(updated), 2000)
  }, [])

  const saveJournal = async (data: JournalEntry) => {
    setSaving(true)
    try {
      const res = await fetch("/api/journal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (res.ok) { setSaved(true); if (isNew) router.refresh() }
    } catch (err) { console.error("Save failed:", err) } finally { setSaving(false) }
  }

  const update = (patch: Partial<JournalEntry>) => {
    const updated = { ...entry, ...patch }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updateReview = (field: string, value: string) => {
    update({ eveningReview: { ...entry.eveningReview, [field]: value } })
  }

  const updateHandoff = (field: string, value: string) => {
    update({ tomorrowHandoff: { ...entry.tomorrowHandoff, [field]: value } })
  }

  const toggleHabit = (key: string) => {
    update({ habits: entry.habits.map((h) => (h.key === key ? { ...h, done: !h.done } : h)) })
  }

  const updateTodo = (i: number, text: string) => {
    const todos = [...entry.todos]
    todos[i] = { ...todos[i], text }
    update({ todos })
  }

  const toggleTodo = (i: number) => {
    const todos = [...entry.todos]
    todos[i] = { ...todos[i], done: !todos[i].done }
    update({ todos })
  }

  const updateGratitude = (i: number, field: string, value: string) => {
    const gratitude = [...entry.gratitude]
    gratitude[i] = { ...gratitude[i], [field]: value }
    update({ gratitude })
  }

  const handleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveJournal(entry)
  }

  const prevDate = adj(entry.date, -1)
  const nextDate = adj(entry.date, 1)
  const daily = entry.habits.filter((h) => h.category === "daily")
  const bonus = entry.habits.filter((h) => h.category === "bonus")
  const aiHabits = entry.habits.filter((h) => h.category === "ai")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href={`/journal/${prevDate}`} className="hover:text-foreground">←</Link>
            <span>{formatDate(entry.date)}</span>
            <Link href={`/journal/${nextDate}`} className="hover:text-foreground">→</Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Note</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-muted-foreground">已保存</span>}
          {saving && <span className="text-xs text-muted-foreground">保存中...</span>}
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>保存</Button>
        </div>
      </div>
      <Separator />

      {/* ☀️ 晨间意图 */}
      <Card className="journal-section border-amber-200/50 dark:border-amber-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">☀️ 晨间意图</CardTitle>
          <p className="text-xs text-muted-foreground">今天将是美好的一天。你想体验什么？</p>
        </CardHeader>
        <CardContent>
          <Input
            value={entry.morningIntention}
            onChange={(e) => update({ morningIntention: e.target.value })}
            placeholder="今天，我想体验的一件事是..."
          />
        </CardContent>
      </Card>

      {/* 今日任务 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">今日任务</CardTitle>
          <p className="text-xs text-muted-foreground">只写 1~3 件。完成任何一个就算赢。</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.todos.map((todo, i) => (
            <div key={i} className="flex items-center gap-3">
              <button onClick={() => toggleTodo(i)} className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors", todo.done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary/50")}>
                {todo.done && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </button>
              <Input value={todo.text} onChange={(e) => updateTodo(i, e.target.value)} placeholder={["最重要的 1 件事", "第二件事", "第三件事（可留空）"][i]} className={cn("flex-1", todo.done && "line-through text-muted-foreground")} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 快速收纳 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">快速收纳</CardTitle>
          <p className="text-xs text-muted-foreground">突然冒出来的念头先记这里，不用现在就处理。</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Input key={i} value={entry.quickCapture[i] || ""} onChange={(e) => { const qc = [...entry.quickCapture]; qc[i] = e.target.value; update({ quickCapture: qc.filter(Boolean) }) }} placeholder={`念头 ${i + 1}`} />
          ))}
        </CardContent>
      </Card>

      {/* 💭 心情日记 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">💭 心情日记</CardTitle>
          <p className="text-xs text-muted-foreground">表达性写作：记录今天的感受、情绪、想法。不用有条理，想到什么写什么。</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {MOOD_PROMPTS.map((p) => (
              <Badge key={p} variant="outline" className="cursor-pointer hover:bg-accent text-[11px] font-normal" onClick={() => update({ freeWriting: entry.freeWriting ? entry.freeWriting + "\n\n" + p : p })}>
                {p}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <FreeWritingEditor content={entry.freeWriting} onChange={(v) => update({ freeWriting: v })} />
        </CardContent>
      </Card>

      {/* 📖 生活故事 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📖 生活故事</CardTitle>
          <p className="text-xs text-muted-foreground">今天最有故事价值的一件事是什么？能以它为素材讲五分钟的故事吗？</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {STORY_PROMPTS.map((p) => (
              <Badge key={p} variant="outline" className="cursor-pointer hover:bg-accent text-[11px] font-normal" onClick={() => update({ lifeStory: entry.lifeStory ? entry.lifeStory + "\n" + p : p })}>
                + {p.slice(0, 20)}...
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea value={entry.lifeStory} onChange={(e) => update({ lifeStory: e.target.value })} placeholder="今天发生在我身上的最有故事价值的事情是..." className="min-h-[80px]" />
        </CardContent>
      </Card>

      {/* 🙏 感恩日记 */}
      <Card className="journal-section border-green-200/50 dark:border-green-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🙏 感恩日记</CardTitle>
          <p className="text-xs text-muted-foreground">关注生活中发生的美好的事情。你感激的三件事是什么？</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2 rounded-lg bg-muted/30 p-3">
              <Input value={entry.gratitude[i]?.content || ""} onChange={(e) => updateGratitude(i, "content", e.target.value)} placeholder={`${i + 1}. 我感激...`} />
              <div className="flex gap-2">
                <Input value={entry.gratitude[i]?.person || ""} onChange={(e) => updateGratitude(i, "person", e.target.value)} placeholder="感谢谁？" className="flex-1" />
                <Input value={entry.gratitude[i]?.qualities || ""} onChange={(e) => updateGratitude(i, "qualities", e.target.value)} placeholder="TA 的三个品质" className="flex-1" />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">💡 试着给你感激的人分享你写的内容——"我很感激我的生命中有你"。</p>
        </CardContent>
      </Card>

      {/* 🧭 决策反思 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">🧭 决策反思</CardTitle>
          <p className="text-xs text-muted-foreground">决策导向行动，行动导向结果。</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {DECISION_PROMPTS.map((p) => (
              <Badge key={p} variant="outline" className="cursor-pointer hover:bg-accent text-[11px] font-normal" onClick={() => update({ decisionReflection: entry.decisionReflection ? entry.decisionReflection + "\n\n" + p : p })}>
                {p.length > 35 ? p.slice(0, 35) + "..." : p}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Textarea value={entry.decisionReflection} onChange={(e) => update({ decisionReflection: e.target.value })} placeholder="如果我继续照这条路走下去，5年后我的生活会是什么样子？" className="min-h-[100px]" />
        </CardContent>
      </Card>

      {/* 晚间复盘 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">晚间复盘</CardTitle>
          <p className="text-xs text-muted-foreground">先写事实，再写发现，再写下一步。只写 1~3 行也算完成。</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">今日状态</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-muted-foreground">此刻状态</label><Input value={entry.eveningReview.mood} onChange={(e) => updateReview("mood", e.target.value)} placeholder="疲惫、兴奋、平静..." /></div>
              <div><label className="text-sm text-muted-foreground">身体感觉</label><Input value={entry.eveningReview.body} onChange={(e) => updateReview("body", e.target.value)} placeholder="胸闷、肩膀重、轻松..." /></div>
            </div>
            <div><label className="text-sm text-muted-foreground">今天最占据心里的事</label><Input value={entry.eveningReview.occupyingThought} onChange={(e) => updateReview("occupyingThought", e.target.value)} placeholder="哪件事一直在心里转？" /></div>
            <div><label className="text-sm text-muted-foreground">今天什么算值得？</label><Input value={entry.eveningReview.worthToday} onChange={(e) => updateReview("worthToday", e.target.value)} placeholder="完成一件什么事，今天就算没白过" /></div>
          </div>
          <Separator />
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">事实与发现</p>
            <div><label className="text-sm text-muted-foreground">今天发生了什么（客观事实）</label><Textarea value={entry.eveningReview.facts} onChange={(e) => updateReview("facts", e.target.value)} placeholder="只写观察，不加评价..." className="mt-1 h-20" /></div>
            <div><label className="text-sm text-muted-foreground">我注意到什么（发现 / 情绪 / 学习）</label><Textarea value={entry.eveningReview.discoveries} onChange={(e) => updateReview("discoveries", e.target.value)} placeholder="这个感觉熟悉吗？以前什么时候有过？" className="mt-1 h-20" /></div>
            <div><label className="text-sm text-muted-foreground">明天我自己能做的一个小动作</label><Input value={entry.eveningReview.nextAction} onChange={(e) => updateReview("nextAction", e.target.value)} placeholder="只需 15 分钟的那种" /></div>
          </div>
          <Separator />
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">如果还有余力</p>
            <div><label className="text-sm text-muted-foreground">今天做得不错的地方</label><Input value={entry.eveningReview.didWell} onChange={(e) => updateReview("didWell", e.target.value)} placeholder="哪怕很小的事" /></div>
            <div><label className="text-sm text-muted-foreground">"带刺的机会"或小提醒</label><Input value={entry.eveningReview.thorn} onChange={(e) => updateReview("thorn", e.target.value)} placeholder="让你不舒服的事，可能是一个信号" /></div>
            <div><label className="text-sm text-muted-foreground">更深地指向了什么模式</label><Textarea value={entry.eveningReview.pattern} onChange={(e) => updateReview("pattern", e.target.value)} placeholder="和之前的哪件事是同一个模式？" className="mt-1 h-16" /></div>
          </div>
        </CardContent>
      </Card>

      {/* 明日交接 */}
      <Card className="journal-section">
        <CardHeader className="pb-3"><CardTitle className="text-base">明日交接</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><label className="text-sm text-muted-foreground">明天最重要的 1 件事</label><Input value={entry.tomorrowHandoff.primary} onChange={(e) => updateHandoff("primary", e.target.value)} placeholder="只一件" /></div>
          <div><label className="text-sm text-muted-foreground">第二重要（可留空）</label><Input value={entry.tomorrowHandoff.secondary} onChange={(e) => updateHandoff("secondary", e.target.value)} placeholder="可留空" /></div>
          <div><label className="text-sm text-muted-foreground">维护秩序的小事（可留空）</label><Input value={entry.tomorrowHandoff.maintenance} onChange={(e) => updateHandoff("maintenance", e.target.value)} placeholder="喝水、散步、早睡" /></div>
        </CardContent>
      </Card>

      {/* 习惯养成 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚛️ 习惯养成</CardTitle>
          <p className="text-xs text-muted-foreground">每天完成「基础习惯」就算没有掉线。</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><p className="text-xs font-medium text-muted-foreground uppercase">基础习惯</p>{daily.map((h) => <HabitBtn key={h.key} habit={h} onToggle={toggleHabit} />)}</div>
          <div className="space-y-2"><p className="text-xs font-medium text-muted-foreground uppercase">可选加分</p>{bonus.map((h) => <HabitBtn key={h.key} habit={h} onToggle={toggleHabit} />)}</div>
          <div className="space-y-2"><p className="text-xs font-medium text-muted-foreground uppercase">AI 协作</p>{aiHabits.map((h) => <HabitBtn key={h.key} habit={h} onToggle={toggleHabit} />)}</div>
          <Separator />
          <EnergyPicker value={entry.energy} onChange={(v) => update({ energy: v })} />
          <div><label className="text-sm text-muted-foreground">📖 阅读/学习</label><Input value={entry.reading} onChange={(e) => update({ reading: e.target.value })} placeholder="今天读了什么？" className="mt-1" /></div>
          <div className="flex gap-6">
            <CheckBtn label="🧘🏻 冥想" checked={entry.meditation} onChange={() => update({ meditation: !entry.meditation })} />
            <CheckBtn label="🏋🏻‍♂️ 运动" checked={entry.workout} onChange={() => update({ workout: !entry.workout })} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HabitBtn({ habit, onToggle }: { habit: { key: string; label: string; done: boolean }; onToggle: (k: string) => void }) {
  return (
    <button onClick={() => onToggle(habit.key)} className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", habit.done ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted")}>
      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors", habit.done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30")}>
        {habit.done && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
      </span>
      {habit.label}
    </button>
  )
}

function CheckBtn({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 text-sm">
      <span className={cn("flex h-5 w-5 items-center justify-center rounded border transition-colors", checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30")}>
        {checked && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
      </span>
      {label}
    </button>
  )
}

function adj(dateStr: string, offset: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}
