import { createContext, FC, PropsWithChildren, useContext } from 'react'
import { useChat as useChatLib } from 'ai/react'

type ChatContext = {} & ReturnType<typeof useChatLib>
const ChatContext = createContext<ChatContext | null>(null)

interface ChatProviderProps extends PropsWithChildren {}
export const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const chat = useChatLib()
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) throw new Error('useChat must be used within a ChatProvider')
  return context
}
