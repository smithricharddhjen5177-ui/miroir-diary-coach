import { NextRequest, NextResponse } from "next/server"
import { getAIClient, getAIModel, isAIEnabled } from "@/lib/ai/client"
import { buildCoachMessages } from "@/lib/ai/prompts"

export async function POST(request: NextRequest) {
  if (!isAIEnabled()) {
    return NextResponse.json(
      { error: "AI is not configured. Set DEEPSEEK_API_KEY in .env.local" },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const client = getAIClient()
    const model = getAIModel()
    const messages = buildCoachMessages(message, history)

    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.8,
      max_tokens: 1000,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("AI coach error:", error)
    return NextResponse.json(
      { error: "AI coaching failed" },
      { status: 500 }
    )
  }
}
