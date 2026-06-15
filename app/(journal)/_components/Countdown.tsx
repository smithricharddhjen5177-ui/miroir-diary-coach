export function Countdown({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-medium text-destructive/70 uppercase tracking-wider">
          死亡倒计时
        </span>
        <span className="countdown-number text-2xl font-bold text-destructive/80 tabular-nums">
          {daysLeft.toLocaleString()}
        </span>
        <span className="text-sm text-destructive/60">天</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        假设寿命80岁。这不是制造焦虑，而是提醒：每一天都值得认真过。
      </p>
    </div>
  )
}
