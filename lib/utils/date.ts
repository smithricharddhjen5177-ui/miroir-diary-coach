import { format, startOfWeek, endOfWeek, getISOWeek, getQuarter, parseISO } from "date-fns"

export function getToday(): string {
  return format(new Date(), "yyyy-MM-dd")
}

export function getWeekString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const week = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, "0")}`
}

export function getMonthString(date: Date = new Date()): string {
  return format(date, "yyyy-MM")
}

export function getQuarterString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const q = getQuarter(date)
  return `${year}-Q${q}`
}

export function getWeekRange(weekStr: string): { start: string; end: string } {
  // weekStr format: "2026-W25"
  const [year, week] = weekStr.split("-W")
  // Create a date for Jan 1 of that year and compute the week
  const jan1 = new Date(parseInt(year), 0, 1)
  const daysOffset = (parseInt(week) - 1) * 7
  const approximateStart = new Date(jan1.getTime() + daysOffset * 24 * 60 * 60 * 1000)
  const start = startOfWeek(approximateStart, { weekStartsOn: 1 })
  const end = endOfWeek(approximateStart, { weekStartsOn: 1 })
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  }
}

export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr)
  return format(d, "yyyy-MM-dd EEEE")
}

export function formatDateShort(dateStr: string): string {
  const d = parseISO(dateStr)
  return format(d, "MM-dd EEE")
}

export function getDayName(dateStr: string): string {
  const d = parseISO(dateStr)
  return format(d, "EEEE").toLowerCase()
}

export function getDaysBetween(start: string, end: string): number {
  const s = parseISO(start)
  const e = parseISO(end)
  return Math.floor((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000))
}

export function getDeathCountdown(birthDate: string = "2003-06-25"): number {
  const birth = parseISO(birthDate)
  const death = new Date(birth.getTime() + 80 * 365.25 * 24 * 60 * 60 * 1000)
  const now = new Date()
  return Math.max(0, Math.floor((death.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
}
