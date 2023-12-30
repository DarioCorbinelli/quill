import { Message as DBMessage } from '@prisma/client'
import { useChat as useChatLib, type Message } from 'ai/react'
import { createContext, FC, PropsWithChildren, useContext } from 'react'

type ChatContext = {} & ReturnType<typeof useChatLib>
const ChatContext = createContext<ChatContext | null>(null)

interface ChatProviderProps extends PropsWithChildren {
  fileId: string
  initialMessages?: DBMessage[]
}
export const ChatProvider: FC<ChatProviderProps> = ({ children, fileId, initialMessages }) => {
  const sanitizedInitialMessages: Message[] = initialMessages
    ? initialMessages.map((m) => ({
        id: m.id,
        content: m.text,
        role: m.isUserMessage ? 'user' : 'assistant',
      }))
    : []

  const chat = useChatLib({
    body: { fileId },
    initialMessages: sanitizedInitialMessages,
  })
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === null) throw new Error('useChat must be used within a ChatProvider')
  return context
}
