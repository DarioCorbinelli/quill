'use client'

import { useChat } from '@/context/ChatProvider'
import { FC } from 'react'

interface ChatInputProps {
  isDisabled?: boolean
}

const ChatInput: FC<ChatInputProps> = ({ isDisabled }) => {
  const { handleSubmit, handleInputChange, input, isLoading } = useChat()
  return (
    <form onSubmit={handleSubmit}>
      <input type='text' value={input} onChange={handleInputChange} placeholder='Message here...'/>
      <button type="submit">{isLoading ? 'loading' : 'invia'}</button>
    </form>
  )
}

export default ChatInput
