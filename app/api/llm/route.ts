import { NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

// Configure FAL client
fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: Request) {
  try {
    const { model, prompt } = await request.json()

    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model,
        prompt,
      },
      logs: true,
    })

    return NextResponse.json({ output: result.data.output })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    )
  }
} 