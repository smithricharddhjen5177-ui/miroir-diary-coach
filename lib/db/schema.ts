import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const journalIndex = sqliteTable("journal_index", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").unique().notNull(),
  week: text("week"),
  month: text("month"),
  quarter: text("quarter"),
  energy: integer("energy"),
  wordCount: integer("word_count").default(0),
  hasReview: integer("has_review", { mode: "boolean" }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
})

export const patterns = sqliteTable("patterns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category"), // self-worth | avoidance | vulnerability | fear | body
  description: text("description"),
  firstObservedDate: text("first_observed_date"),
  lastObservedDate: text("last_observed_date"),
  evidenceDates: text("evidence_dates"), // JSON array
  status: text("status").default("active"), // active | resolved | archived
  createdAt: text("created_at"),
})

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  status: text("status").default("inbox"), // inbox | this_week | waiting | parking | done
  energyRequired: text("energy_required"), // low | medium | high
  sourceDate: text("source_date"),
  createdAt: text("created_at"),
  completedAt: text("completed_at"),
})
