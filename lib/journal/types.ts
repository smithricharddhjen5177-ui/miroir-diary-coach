export interface JournalState {
  mood: string
  body: string
  occupyingThought: string
  worthToday: string
}

export interface TodoItem {
  text: string
  done: boolean
}

export interface EveningReview {
  // 今日状态（复盘时填写）
  mood: string
  body: string
  occupyingThought: string
  worthToday: string
  // 最低复盘
  facts: string
  discoveries: string
  nextAction: string
  // 有余力
  didWell: string
  thorn: string
  pattern: string
}

export interface TomorrowHandoff {
  primary: string
  secondary: string
  maintenance: string
}

export interface Habit {
  key: string
  label: string
  done: boolean
  category: "daily" | "bonus" | "ai"
}

export interface JournalEntry {
  date: string
  week: string
  month: string
  quarter: string
  todos: TodoItem[]
  quickCapture: string[]
  freeWriting: string
  eveningReview: EveningReview
  tomorrowHandoff: TomorrowHandoff
  habits: Habit[]
  energy: number | null
  reading: string
  meditation: boolean
  workout: boolean
  createdAt?: string
  updatedAt?: string
}

export function emptyJournalEntry(
  date: string,
  week: string,
  month: string,
  quarter: string
): JournalEntry {
  return {
    date,
    week,
    month,
    quarter,
    todos: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
    quickCapture: [],
    freeWriting: "",
    eveningReview: {
      mood: "",
      body: "",
      occupyingThought: "",
      worthToday: "",
      facts: "",
      discoveries: "",
      nextAction: "",
      didWell: "",
      thorn: "",
      pattern: "",
    },
    tomorrowHandoff: {
      primary: "",
      secondary: "",
      maintenance: "",
    },
    habits: [
      { key: "open_page", label: "打开日记写 3 行", done: false, category: "daily" },
      { key: "focus_time", label: "一段不聊天的专注时间", done: false, category: "daily" },
      { key: "review_line", label: "留下一句晚间复盘", done: false, category: "daily" },
      { key: "outdoor", label: "出门 / 散步 / 晒太阳", done: false, category: "bonus" },
      { key: "stretch", label: "拉伸或活动身体", done: false, category: "bonus" },
      { key: "treat", label: "吃一点让自己开心的东西", done: false, category: "bonus" },
      { key: "ai_plan", label: "用 Miroir 拆计划", done: false, category: "ai" },
      { key: "ai_review", label: "用 Miroir 做复盘", done: false, category: "ai" },
    ],
    energy: null,
    reading: "",
    meditation: false,
    workout: false,
  }
}
