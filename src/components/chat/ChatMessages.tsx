'use client'

import { useChat } from '@/context/ChatProvider'
import { FC } from 'react'

interface ChatMessagesProps {
  fileId: string
}

const ChatMessages: FC<ChatMessagesProps> = ({ fileId }) => {
  const {messages, error, isLoading} = useChat()
  return <ul>{messages.map(m => <li key={m.id}>{m.content}</li>)}{error && <li>error</li>}{isLoading && <li>loading</li> }</ul>
}

export default ChatMessages