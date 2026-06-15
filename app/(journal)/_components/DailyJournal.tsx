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
import { cn } from "@/lib/utils"
import { EnergyPicker } from "./EnergyPicker"
import { FreeWritingEditor } from "./FreeWritingEditor"
import Link from "next/link"

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

  const scheduleSave = useCallback(
    (updated: JournalEntry) => {
      setSaved(false)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveJournal(updated)
      }, 2000)
    },
    []
  )

  const saveJournal = async (data: JournalEntry) => {
    setSaving(true)
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaved(true)
        if (isNew) router.refresh()
      }
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }

  const update = (patch: Partial<JournalEntry>) => {
    const updated = { ...entry, ...patch }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updateReview = (field: string, value: string) => {
    const updated = {
      ...entry,
      eveningReview: { ...entry.eveningReview, [field]: value },
    }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updateHandoff = (field: string, value: string) => {
    const updated = {
      ...entry,
      tomorrowHandoff: { ...entry.tomorrowHandoff, [field]: value },
    }
    setEntry(updated)
    scheduleSave(updated)
  }

  const toggleHabit = (key: string) => {
    const habits = entry.habits.map((h) =>
      h.key === key ? { ...h, done: !h.done } : h
    )
    update({ habits })
  }

  const updateTodo = (index: number, text: string) => {
    const todos = [...entry.todos]
    todos[index] = { ...todos[index], text }
    update({ todos })
  }

  const toggleTodo = (index: number) => {
    const todos = [...entry.todos]
    todos[index] = { ...todos[index], done: !todos[index].done }
    update({ todos })
  }

  const setFreeWriting = (content: string) => {
    update({ freeWriting: content })
  }

  const handleManualSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveJournal(entry)
  }

  const prevDate = getAdjacentDate(entry.date, -1)
  const nextDate = getAdjacentDate(entry.date, 1)
  const daily = entry.habits.filter((h) => h.category === "daily")
  const bonus = entry.habits.filter((h) => h.category === "bonus")
  const aiHabits = entry.habits.filter((h) => h.category === "ai")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              href={`/journal/${prevDate}`}
              className="hover:text-foreground transition-colors"
            >
              ←
            </Link>
            <span>{formatDate(entry.date)}</span>
            <Link
              href={`/journal/${nextDate}`}
              className="hover:text-foreground transition-colors"
            >
              →
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Note</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-muted-foreground">已保存</span>
          )}
          {saving && (
            <span className="text-xs text-muted-foreground">保存中...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={saving}
          >
            保存
          </Button>
        </div>
      </div>

      <Separator />

      {/* 今日任务（合并原来的重点+任务） */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">今日任务</CardTitle>
          <p className="text-xs text-muted-foreground">
            只写 1~3 件。完成任何一个就算赢。不用写满，只写真正重要的。
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.todos.map((todo, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => toggleTodo(i)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  todo.done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary/50"
                )}
              >
                {todo.done && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
              <Input
                value={todo.text}
                onChange={(e) => updateTodo(i, e.target.value)}
                placeholder={
                  ["最重要的 1 件事", "第二件事", "第三件事（可留空）"][i]
                }
                className={cn(
                  "flex-1",
                  todo.done && "line-through text-muted-foreground"
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 快速收纳 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">快速收纳</CardTitle>
          <p className="text-xs text-muted-foreground">
            突然冒出来的念头先记这里，不用现在就处理。
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={entry.quickCapture[i] || ""}
              onChange={(e) => {
                const qc = [...entry.quickCapture]
                qc[i] = e.target.value
                update({ quickCapture: qc.filter(Boolean) })
              }}
              placeholder={`念头 ${i + 1}`}
            />
          ))}
        </CardContent>
      </Card>

      {/* 自由书写 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📕 自由书写</CardTitle>
          <p className="text-xs text-muted-foreground">
            不限格式，不限字数。哪怕只写 3 行也算完成。
          </p>
        </CardHeader>
        <CardContent>
          <FreeWritingEditor
            content={entry.freeWriting}
            onChange={setFreeWriting}
          />
        </CardContent>
      </Card>

      {/* 晚间复盘（含今日状态） */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">晚间复盘</CardTitle>
          <p className="text-xs text-muted-foreground">
            写事实、写发现、写下一步。只写 1~3 行也算完成。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 今日状态（复盘时填） */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              今日状态
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  此刻状态
                </label>
                <Input
                  value={entry.eveningReview.mood}
                  onChange={(e) => updateReview("mood", e.target.value)}
                  placeholder="疲惫、兴奋、平静..."
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  身体感觉
                </label>
                <Input
                  value={entry.eveningReview.body}
                  onChange={(e) => updateReview("body", e.target.value)}
                  placeholder="胸闷、肩膀重、轻松..."
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                今天最占据心里的事
              </label>
              <Input
                value={entry.eveningReview.occupyingThought}
                onChange={(e) => updateReview("occupyingThought", e.target.value)}
                placeholder="哪件事一直在心里转？"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                今天什么算值得？
              </label>
              <Input
                value={entry.eveningReview.worthToday}
                onChange={(e) => updateReview("worthToday", e.target.value)}
                placeholder="完成一件什么事，今天就算没白过"
              />
            </div>
          </div>

          <Separator />

          {/* 最低复盘 */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              事实与发现
            </p>
            <div>
              <label className="text-sm text-muted-foreground">
                今天发生了什么（客观事实）
              </label>
              <Textarea
                value={entry.eveningReview.facts}
                onChange={(e) => updateReview("facts", e.target.value)}
                placeholder="只写观察，不加评价..."
                className="mt-1 h-20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                我注意到什么（发现 / 情绪 / 学习）
              </label>
              <Textarea
                value={entry.eveningReview.discoveries}
                onChange={(e) => updateReview("discoveries", e.target.value)}
                placeholder="这个感觉熟悉吗？以前什么时候有过？"
                className="mt-1 h-20"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                明天我自己能做的一个小动作
              </label>
              <Input
                value={entry.eveningReview.nextAction}
                onChange={(e) => updateReview("nextAction", e.target.value)}
                placeholder="只需 15 分钟的那种"
              />
            </div>
          </div>

          <Separator />

          {/* 有余力 */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              如果还有余力
            </p>
            <div>
              <label className="text-sm text-muted-foreground">
                今天做得不错的地方
              </label>
              <Input
                value={entry.eveningReview.didWell}
                onChange={(e) => updateReview("didWell", e.target.value)}
                placeholder="哪怕很小的事"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                "带刺的机会"或小提醒
              </label>
              <Input
                value={entry.eveningReview.thorn}
                onChange={(e) => updateReview("thorn", e.target.value)}
                placeholder="让你不舒服的事，可能是一个信号"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                这件事更深地指向了什么模式
              </label>
              <Textarea
                value={entry.eveningReview.pattern}
                onChange={(e) => updateReview("pattern", e.target.value)}
                placeholder="和之前的哪件事是同一个模式？"
                className="mt-1 h-16"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 明日交接 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">明日交接</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">
              明天最重要的 1 件事
            </label>
            <Input
              value={entry.tomorrowHandoff.primary}
              onChange={(e) => updateHandoff("primary", e.target.value)}
              placeholder="只一件"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              第二重要的事（可留空）
            </label>
            <Input
              value={entry.tomorrowHandoff.secondary}
              onChange={(e) => updateHandoff("secondary", e.target.value)}
              placeholder="可留空"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              维护生活秩序的小事（可留空）
            </label>
            <Input
              value={entry.tomorrowHandoff.maintenance}
              onChange={(e) => updateHandoff("maintenance", e.target.value)}
              placeholder="喝水、散步、早睡"
            />
          </div>
        </CardContent>
      </Card>

      {/* 习惯养成 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚛️ 习惯养成</CardTitle>
          <p className="text-xs text-muted-foreground">
            每天完成「基础习惯」就算没有掉线。加分项锦上添花。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              基础习惯
            </p>
            {daily.map((h) => (
              <HabitToggle key={h.key} habit={h} onToggle={toggleHabit} />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              可选加分
            </p>
            {bonus.map((h) => (
              <HabitToggle key={h.key} habit={h} onToggle={toggleHabit} />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              AI 协作
            </p>
            {aiHabits.map((h) => (
              <HabitToggle key={h.key} habit={h} onToggle={toggleHabit} />
            ))}
          </div>

          {/* 能量 & 记录项 */}
          <Separator />
          <div className="space-y-3">
            <EnergyPicker
              value={entry.energy}
              onChange={(v) => update({ energy: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  📖 阅读/学习
                </label>
                <Input
                  value={entry.reading}
                  onChange={(e) => update({ reading: e.target.value })}
                  placeholder="今天读了什么？"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <CheckToggle
                label="🧘🏻 冥想"
                checked={entry.meditation}
                onChange={() => update({ meditation: !entry.meditation })}
              />
              <CheckToggle
                label="🏋🏻‍♂️ 运动"
                checked={entry.workout}
                onChange={() => update({ workout: !entry.workout })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HabitToggle({
  habit,
  onToggle,
}: {
  habit: { key: string; label: string; done: boolean }
  onToggle: (key: string) => void
}) {
  return (
    <button
      onClick={() => onToggle(habit.key)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        habit.done
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          habit.done
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}
      >
        {habit.done && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </span>
      {habit.label}
    </button>
  )
}

function CheckToggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30"
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}

function getAdjacentDate(dateStr: string, offset: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split("T")[0]
}
