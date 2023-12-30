import { db } from '@/lib/db'
import { openai } from '@/lib/openai'
import { sendMessagesValidator } from '@/lib/validations/chat-messages'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export async function POST(req: Request) {
  const body = await req.json()
  const {messages, fileId} = sendMessagesValidator.parse(body)

  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  })
  if (!dbUser) return new Response('Unauthorized', { status: 401 })

  const dbFile = await db.file.findUnique({where: {id: fileId, userId: user.id}})
  if (!dbFile) return new Response('Not found', { status: 404 })


  const lastMessage = messages[messages.length - 1]
  await db.message.create({
    data: {
      fileId,
      userId: user.id,
      text: lastMessage.content!,
      isUserMessage: lastMessage.role === 'user' ? true : false,
    }
  })
  
  const typedMessages = messages as ChatCompletionMessageParam[]

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: typedMessages,
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          fileId,
          userId: user.id,
          text: completion,
          isUserMessage: false,
        }
      })
    },
  })

  return new StreamingTextResponse(stream)
}
