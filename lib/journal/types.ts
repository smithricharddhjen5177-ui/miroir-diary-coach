export interface JournalState {
  mood: string
  body: string
  occupyingThought: string
  worthToday: string
}

export interface Priority {
  text: string
  done: boolean
}

export interface Task {
  text: string
  done: boolean
}

export interface EveningReview {
  facts: string
  discoveries: string
  nextAction: string
  didWell: string
  thorn: string
  pattern: string
}

export interface TomorrowHandoff {
  primary: string
  secondary: string
  maintenance: string
}

export interface Maintenance {
  openPage: boolean
  focusTime: boolean
  reviewLine: boolean
  outdoor: boolean
  stretch: boolean
  treat: boolean
  aiPlan: boolean
  aiReview: boolean
}

export interface JournalEntry {
  date: string
  week: string
  month: string
  quarter: string
  state: JournalState
  priorities: Priority[]
  tasks: Task[]
  quickCapture: string[]
  freeWriting: string
  eveningReview: EveningReview
  tomorrowHandoff: TomorrowHandoff
  maintenance: Maintenance
  energy: number | null
  reading: string
  meditation: boolean
  workout: boolean
  createdAt?: string
  updatedAt?: string
}

export function emptyJournalEntry(date: string, week: string, month: string, quarter: string): JournalEntry {
  return {
    date,
    week,
    month,
    quarter,
    state: {
      mood: "",
      body: "",
      occupyingThought: "",
      worthToday: "",
    },
    priorities: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
    tasks: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
    quickCapture: [],
    freeWriting: "",
    eveningReview: {
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
    maintenance: {
      openPage: false,
      focusTime: false,
      reviewLine: false,
      outdoor: false,
      stretch: false,
      treat: false,
      aiPlan: false,
      aiReview: false,
    },
    energy: null,
    reading: "",
    meditation: false,
    workout: false,
  }
}
