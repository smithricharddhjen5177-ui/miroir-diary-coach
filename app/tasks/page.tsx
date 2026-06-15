"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  status: "inbox" | "this_week" | "waiting" | "parking" | "done"
  energy?: "low" | "medium" | "high"
}

const STATUS_LABELS: Record<string, string> = {
  inbox: "收件箱",
  this_week: "本周",
  waiting: "等待中",
  parking: "停车场",
  done: "完成",
}

const ENERGY_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "开始下一次阅读材料：先读一个明确段落，标 3 个关键词", status: "this_week", energy: "medium" },
    { id: "2", title: "准备 IPE 阅读笔记第一版", status: "this_week", energy: "high" },
    { id: "3", title: "推进毕业论文阅读笔记一小段", status: "this_week", energy: "high" },
    { id: "4", title: "继续调整任务管理方式，但不要把它当成主要任务", status: "this_week", energy: "low" },
    { id: "5", title: "要不要接入 Trello", status: "waiting" },
    { id: "6", title: "怎么让读书笔记更像我自己的思考", status: "waiting" },
    { id: "7", title: "把周记、月记和任务系统再进一步打通", status: "parking" },
  ])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newTask.trim(),
        status: "inbox",
      },
    ])
    setNewTask("")
  }

  const moveTask = (id: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    )
  }

  const sections: Task["status"][] = ["this_week", "inbox", "waiting", "parking", "done"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">任务队列</h1>
        <p className="text-sm text-muted-foreground mt-1">
          每天从这里挑 1-3 件写进今天的日记。白天只看日记，晚上复盘时再回来。
        </p>
      </div>

      {/* Quick add */}
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="新任务...（一句话描述，不用太正式）"
        />
        <Button onClick={addTask} variant="outline">
          添加
        </Button>
      </div>

      {/* Task sections */}
      <div className="space-y-4">
        {sections.map((status) => {
          const sectionTasks = tasks.filter((t) => t.status === status)
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {STATUS_LABELS[status]}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {sectionTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {sectionTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">空</p>
                ) : (
                  <div className="space-y-1">
                    {sectionTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm group",
                          "hover:bg-muted transition-colors",
                          status === "done" && "line-through text-muted-foreground"
                        )}
                      >
                        <span className="flex-1">{task.title}</span>
                        {task.energy && (
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", ENERGY_COLORS[task.energy])}
                          >
                            {task.energy}
                          </Badge>
                        )}
                        <select
                          value={task.status}
                          onChange={(e) => moveTask(task.id, e.target.value as Task["status"])}
                          className="text-xs bg-transparent border rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {sections.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        提示：任务的 <code>energy</code> 标签（low / medium / high）帮你匹配精力和任务类型。
        低能量时做 low 标签的事，高能量时攻克 high 标签的事。
        如果一件事还不能直接开始，它通常不是任务，而是项目。
      </p>
    </div>
  )
}
