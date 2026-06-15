"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { JournalEntry } from "@/lib/journal/types"
import { formatDate, getToday } from "@/lib/utils/date"
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

  // Auto-save after 2 seconds of inactivity
  const scheduleSave = useCallback((updated: JournalEntry) => {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveJournal(updated)
    }, 2000)
  }, [])

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
        if (isNew) {
          router.refresh()
        }
      }
    } catch (err) {
      console.error("Failed to save:", err)
    } finally {
      setSaving(false)
    }
  }

  const update = (patch: Partial<JournalEntry>) => {
    const updated = { ...entry, ...patch }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updateState = (field: string, value: string) => {
    const updated = { ...entry, state: { ...entry.state, [field]: value } }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updatePriority = (index: number, text: string) => {
    const priorities = [...entry.priorities]
    priorities[index] = { ...priorities[index], text }
    const updated = { ...entry, priorities }
    setEntry(updated)
    scheduleSave(updated)
  }

  const togglePriority = (index: number) => {
    const priorities = [...entry.priorities]
    priorities[index] = { ...priorities[index], done: !priorities[index].done }
    const updated = { ...entry, priorities }
    setEntry(updated)
    scheduleSave(updated)
  }

  const updateTask = (index: number, text: string) => {
    const tasks = [...entry.tasks]
    tasks[index] = { ...tasks[index], text }
    const updated = { ...entry, tasks }
    setEntry(updated)
    scheduleSave(updated)
  }

  const toggleTask = (index: number) => {
    const tasks = [...entry.tasks]
    tasks[index] = { ...tasks[index], done: !tasks[index].done }
    const updated = { ...entry, tasks }
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

  const toggleMaintenance = (field: string) => {
    const updated = {
      ...entry,
      maintenance: {
        ...entry.maintenance,
        [field]: !entry.maintenance[field as keyof typeof entry.maintenance],
      },
    }
    setEntry(updated)
    scheduleSave(updated)
  }

  const setFreeWriting = (content: string) => {
    const updated = { ...entry, freeWriting: content }
    setEntry(updated)
    scheduleSave(updated)
  }

  // Manual save
  const handleManualSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveJournal(entry)
  }

  const prevDate = getPrevDate(entry.date)
  const nextDate = getNextDate(entry.date)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href={`/journal/${prevDate}`} className="hover:text-foreground transition-colors">
              ←
            </Link>
            <span>{formatDate(entry.date)}</span>
            <Link href={`/journal/${nextDate}`} className="hover:text-foreground transition-colors">
              →
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Note</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-muted-foreground animate-in fade-in">
              已保存
            </span>
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

      {/* 今日状态 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            今日状态
            <Badge variant="secondary" className="text-[10px] font-normal">
              必填
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              此刻状态
            </label>
            <Input
              value={entry.state.mood}
              onChange={(e) => updateState("mood", e.target.value)}
              placeholder="疲惫、兴奋、平静、焦虑..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              身体感觉
            </label>
            <Input
              value={entry.state.body}
              onChange={(e) => updateState("body", e.target.value)}
              placeholder="胸闷、肩膀重、脸发烫、想跑..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              现在最占据我心里的事
            </label>
            <Input
              value={entry.state.occupyingThought}
              onChange={(e) => updateState("occupyingThought", e.target.value)}
              placeholder="哪件事一直在心里转？"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              如果今天只认真过好一天，什么算值得？
            </label>
            <Input
              value={entry.state.worthToday}
              onChange={(e) => updateState("worthToday", e.target.value)}
              placeholder="写下一件让今天值得的事"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* 今日重点 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">今日重点</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            "最重要的 1 件事",
            "第二重要的 1 件事",
            "维护生活秩序的 1 件小事",
          ].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => togglePriority(i)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  entry.priorities[i]?.done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary/50"
                )}
              >
                {entry.priorities[i]?.done && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
              <Input
                value={entry.priorities[i]?.text || ""}
                onChange={(e) => updatePriority(i, e.target.value)}
                placeholder={label}
                className={cn(
                  "flex-1",
                  entry.priorities[i]?.done && "line-through text-muted-foreground"
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 今日任务 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">今日任务</CardTitle>
          <p className="text-xs text-muted-foreground">
            从 Task Queue 挑 1-3 件，不要超过 3 件
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => toggleTask(i)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                  task.done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 hover:border-primary/50"
                )}
              >
                {task.done && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
              <Input
                value={task.text}
                onChange={(e) => updateTask(i, e.target.value)}
                placeholder={`任务 ${i + 1}`}
                className={cn(
                  "flex-1",
                  task.done && "line-through text-muted-foreground"
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 能量 & 记录项 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">能量 & 记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnergyPicker
            value={entry.energy}
            onChange={(v) => update({ energy: v })}
          />
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              📖 阅读/学习
            </label>
            <Input
              value={entry.reading}
              onChange={(e) => update({ reading: e.target.value })}
              placeholder="今天读了什么？学了什么？"
              className="mt-1"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <button
                onClick={() => update({ meditation: !entry.meditation })}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                  entry.meditation
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {entry.meditation && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
              🧘🏻 冥想
            </label>
            <label className="flex items-center gap-2 text-sm">
              <button
                onClick={() => update({ workout: !entry.workout })}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                  entry.workout
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {entry.workout && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
              🏋🏻‍♂️ 运动
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 自由书写 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">📕 自由书写</CardTitle>
          <p className="text-xs text-muted-foreground">
            不限格式，写任何想写的东西。哪怕只写 3 行也算完成。
          </p>
        </CardHeader>
        <CardContent>
          <FreeWritingEditor
            content={entry.freeWriting}
            onChange={setFreeWriting}
          />
        </CardContent>
      </Card>

      {/* 晚间复盘 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">晚间复盘</CardTitle>
          <p className="text-xs text-muted-foreground">
            先写事实，再写发现，再写一个明天自己能做的小动作。只写 1-3 行也算完成。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              最低复盘
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
                placeholder="一个15分钟就能完成的动作"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              如果还有余力
            </p>
            <div>
              <label className="text-sm text-muted-foreground">
                今天一个做得不错的地方
              </label>
              <Input
                value={entry.eveningReview.didWell}
                onChange={(e) => updateReview("didWell", e.target.value)}
                placeholder="哪怕很小的事也值得记"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                带刺的机会或小提醒
              </label>
              <Input
                value={entry.eveningReview.thorn}
                onChange={(e) => updateReview("thorn", e.target.value)}
                placeholder="什么让你不舒服？那可能是一个信号"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">
                这件事更深地指向了什么模式
              </label>
              <Textarea
                value={entry.eveningReview.pattern}
                onChange={(e) => updateReview("pattern", e.target.value)}
                placeholder="这个模式和之前的哪件事是同一个？"
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
              placeholder="只一件，多了就不叫重要了"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              明天第二重要的 1 件事（可留空）
            </label>
            <Input
              value={entry.tomorrowHandoff.secondary}
              onChange={(e) => updateHandoff("secondary", e.target.value)}
              placeholder="可留空"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              明天维护秩序的 1 件小事（可留空）
            </label>
            <Input
              value={entry.tomorrowHandoff.maintenance}
              onChange={(e) => updateHandoff("maintenance", e.target.value)}
              placeholder="喝水、散步、早睡——任何让你不滑坡的小事"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* 今日维护 */}
      <Card className="journal-section">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">⚛️ 今日维护</CardTitle>
          <p className="text-xs text-muted-foreground">
            今天能完成「最低版本」就算没有掉线
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">最低版本</p>
            {[
              { key: "openPage", label: "打开今天这页并写 3 行" },
              { key: "focusTime", label: "完成 1 段不聊天的专注时间" },
              { key: "reviewLine", label: "留下 1 句晚间复盘" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <button
                  onClick={() => toggleMaintenance(key)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    entry.maintenance[key as keyof typeof entry.maintenance]
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {entry.maintenance[key as keyof typeof entry.maintenance] && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                {label}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">可选加分</p>
            {[
              { key: "outdoor", label: "出门 / 走一走 / 晒太阳" },
              { key: "stretch", label: "拉伸或活动一下身体" },
              { key: "treat", label: "吃一点让自己开心的东西" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <button
                  onClick={() => toggleMaintenance(key)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    entry.maintenance[key as keyof typeof entry.maintenance]
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {entry.maintenance[key as keyof typeof entry.maintenance] && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                {label}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">AI 协作</p>
            {[
              { key: "aiPlan", label: "今天主动用一次 Miroir 拆计划" },
              { key: "aiReview", label: "今天主动用一次 Miroir 做复盘或整理" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <button
                  onClick={() => toggleMaintenance(key)}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                    entry.maintenance[key as keyof typeof entry.maintenance]
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {entry.maintenance[key as keyof typeof entry.maintenance] && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                {label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getPrevDate(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split("T")[0]
}

function getNextDate(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}
