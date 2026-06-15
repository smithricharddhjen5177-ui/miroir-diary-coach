import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"

const tursoClient = createClient({
  url: process.env.DATABASE_URL || "file:./data/miroir.db",
})

export const db = drizzle(tursoClient, { schema })

export function getDb() {
  return db
}
