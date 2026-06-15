// ─── Daily Journal Types ───

export interface TodoItem {
  text: string
  done: boolean
}

export interface GratitudeItem {
  content: string
  person: string
  qualities: string
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

// ─── Wheel of Life (from video framework) ───

export interface WheelOfLife {
  body: number       // 身体
  mental: number     // 心理
  health: number     // 健康
  career: number     // 职业
  income: number     // 收入
  growth: number     // 成长
  love: number       // 爱情
  family: number     // 家庭
  friendship: number // 友谊
  purpose: number    // 意义/使命
}

export const WHEEL_DIMENSIONS: { key: keyof WheelOfLife; label: string }[] = [
  { key: "body", label: "身体" },
  { key: "mental", label: "心理" },
  { key: "health", label: "健康" },
  { key: "career", label: "职业" },
  { key: "income", label: "收入" },
  { key: "growth", label: "成长" },
  { key: "love", label: "爱情" },
  { key: "family", label: "家庭" },
  { key: "friendship", label: "友谊" },
  { key: "purpose", label: "意义" },
]

export function emptyWheelOfLife(): WheelOfLife {
  return { body: 0, mental: 0, health: 0, career: 0, income: 0, growth: 0, love: 0, family: 0, friendship: 0, purpose: 0 }
}

// ─── Journal Entry ───

export interface JournalEntry {
  date: string
  week: string
  month: string
  quarter: string
  // 晨间意图
  morningIntention: string
  // 今日任务
  todos: TodoItem[]
  quickCapture: string[]
  // 生活故事
  lifeStory: string
  // 自由书写
  freeWriting: string
  // 感恩日记
  gratitude: GratitudeItem[]
  // 晚间复盘（含状态）
  eveningReview: EveningReview
  // 决策反思
  decisionReflection: string
  // 明日交接
  tomorrowHandoff: TomorrowHandoff
  habits: Habit[]
  // 能量 & 记录
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
    morningIntention: "",
    todos: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
    quickCapture: [],
    lifeStory: "",
    freeWriting: "",
    gratitude: [
      { content: "", person: "", qualities: "" },
      { content: "", person: "", qualities: "" },
      { content: "", person: "", qualities: "" },
    ],
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
    decisionReflection: "",
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

// ─── Weekly/Monthly Review Types ───

export interface WeeklyReview {
  week: string
  stateScore: number
  top3: string[]
  mostDraining: string
  recurringThemes: string[]
  connections: string
  discoveries: string
  experiment: { what: string; when: string; fallback: string }
  lifeReview: { bodySleep: string; emotionRelationships: string; attentionRhythm: string }
  selfMessage: string
}

export interface MonthlyReview {
  month: string
  keywords: string[]
  mostImportant: string
  accomplished: string[]
  deferred: string[]
  goodDecisions: string[]
  draggingPatterns: string[]
  selfObservation: { avoiding: string; energyScenes: string; lifeCloser: string }
  systemOptimization: { keep: string; drop: string; nextMonthChange: string }
  nextDirection: { theme: string; top3: string[]; reminder: string }
  wheelOfLife: WheelOfLife
}

// ─── Yearly Review Type ───

export interface YearlyReview {
  year: number
  // Wheel of Life
  wheelOfLife: WheelOfLife
  // Life story
  mostStoryWorthy: string
  // Decision reflection
  decisionReflection: string
  // Fear exercise
  fearExercise: {
    worstOutcome: string
    prevention: string
    recovery: string
    smallSuccessGain: string
    inactionCost: string
    adviceFrom85: string
  }
  // 12-month celebration
  celebrations: string[]
  // Gratitude
  yearGratitude: string
  // Next year
  nextYearTheme: string
  nextYearTop3: string[]
}
