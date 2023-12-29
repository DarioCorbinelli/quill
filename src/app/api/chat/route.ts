import { openai } from "@/lib/openai"
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages
  })

  const stream = OpenAIStream(res)

  return new StreamingTextResponse(stream)
}
