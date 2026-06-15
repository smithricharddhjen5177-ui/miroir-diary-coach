"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { isAIEnabled } from "@/lib/ai/client"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [testingAI, setTestingAI] = useState(false)
  const [aiStatus, setAiStatus] = useState<"unknown" | "ok" | "error">("unknown")

  const testAI = async () => {
    setTestingAI(true)
    setAiStatus("unknown")
    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "你好" }),
      })
      if (res.ok) {
        setAiStatus("ok")
      } else {
        setAiStatus("error")
      }
    } catch {
      setAiStatus("error")
    } finally {
      setTestingAI(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">设置</h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理 Miroir 的配置
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI 配置</CardTitle>
          <CardDescription>
            Miroir 使用 DeepSeek API 提供 AI 教练功能。
            在{" "}
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              platform.deepseek.com
            </a>{" "}
            获取 API Key。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">DeepSeek API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="mt-1 font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              API Key 存储在环境变量 <code>DEEPSEEK_API_KEY</code> 中。此页面仅用于测试连接。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={testAI} disabled={testingAI} variant="outline" size="sm">
              {testingAI ? "测试中..." : "测试连接"}
            </Button>
            {aiStatus === "ok" && (
              <Badge variant="default" className="bg-green-500">
                连接成功
              </Badge>
            )}
            {aiStatus === "error" && (
              <Badge variant="destructive">连接失败</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">数据</CardTitle>
          <CardDescription>
            所有日记以 Markdown 文件存储在 <code>content/journal/</code> 目录中。
            可用 Obsidian、VS Code 或任何文本编辑器打开。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Markdown</Badge>
            <Badge variant="outline">本地存储</Badge>
            <Badge variant="outline">Git 友好</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">关于 Miroir</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Miroir（法语"镜子"）是一个反思优先的日记应用。</p>
          <p>
            不是一个更好的笔记工具，而是一个内置了心理咨询师级别反思框架的日记教练。
          </p>
          <Separator className="my-2" />
          <p className="text-xs">
            核心原则：感受先于事实 · 完成胜于完美 · 下一个十五分钟 · 两件事可以同时成立
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
