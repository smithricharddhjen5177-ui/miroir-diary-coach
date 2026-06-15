import OpenAI from "openai"

let client: OpenAI | null = null

export function getAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not set")
    }
    client = new OpenAI({
      apiKey,
      baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
    })
  }
  return client
}

export function getAIModel(): string {
  return process.env.DEEPSEEK_MODEL || "deepseek-chat"
}

/**
 * Check if AI features are available (API key is configured)
 */
export function isAIEnabled(): boolean {
  return !!process.env.DEEPSEEK_API_KEY
}
