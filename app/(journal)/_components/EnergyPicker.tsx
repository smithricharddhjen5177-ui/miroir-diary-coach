"use client"

import { cn } from "@/lib/utils"

const ENERGY_LEVELS = [
  { value: 1, label: "耗尽", emoji: "🪫" },
  { value: 2, label: "很低", emoji: "😮‍💨" },
  { value: 3, label: "偏低", emoji: "😐" },
  { value: 4, label: "一般", emoji: "🙂" },
  { value: 5, label: "不错", emoji: "😊" },
  { value: 6, label: "充沛", emoji: "⚡" },
  { value: 7, label: "很足", emoji: "🔥" },
]

interface Props {
  value: number | null
  onChange: (value: number) => void
}

export function EnergyPicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">
        ⚡ 能量等级
      </label>
      <div className="mt-2 flex gap-1">
        {ENERGY_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            title={`${level.value} - ${level.label}`}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs transition-all",
              "hover:border-primary/50 hover:bg-accent",
              value === level.value
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground"
            )}
          >
            <span className="text-lg">{level.emoji}</span>
            <span className="tabular-nums">{level.value}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
