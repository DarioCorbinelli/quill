'use client'

import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import { buttonVariants } from '@/components/ui/Button'
import { PLANS } from '@/config/stripe'
import { ChatProvider } from '@/context/ChatProvider'
import { trpc } from '@/lib/trpc/trpc'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface ChatWrapperProps {
  isSubscribed: boolean
  fileId: string
}

const ChatWrapper: FC<ChatWrapperProps> = ({ isSubscribed, fileId }) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { id: fileId },
    {
      refetchInterval(data) {
        if (data?.status === 'success' || data?.status === 'failed') return false
        return 500
      },
    }
  )

  if (isLoading || !data)
    return (
      <div className='relative flex min-h-full flex-col justify-between gap-2 divide-y divide-border-200 bg-separation-50'>
        <div className='mb-28 flex flex-1 flex-col items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
            <h3 className='text-xl font-semibold'>Caricamento...</h3>
            <p className='text-sm text-typography-500'>Stiamo recuperando i tuoi messaggi.</p>
          </div>
        </div>
        {/* <ChatInput isDisabled /> */}
      </div>
    )

  if (data.status === 'processing')
    return (
      <div className='relative flex min-h-full flex-col justify-between gap-2 divide-y divide-border-200 bg-separation-50'>
        <div className='mb-28 flex flex-1 flex-col items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
            <h3 className='text-xl font-semibold'>Lavorazione PDF...</h3>
            <p className='text-sm text-typography-500'>Non ci vorrà molto.</p>
          </div>
        </div>
        {/* <ChatInput isDisabled /> */}
      </div>
    )

  if (data.status === 'failed')
    return (
      <div className='relative flex min-h-full flex-col justify-between gap-2 divide-y divide-border-200 bg-separation-50'>
        <div className='mb-28 flex flex-1 flex-col items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-destructive-500' />
            <h3 className='text-xl font-semibold'>Troppe pagine in questo PDF</h3>
            <p className='text-sm text-typography-500'>
              Il tuo piano <span className='font-medium'>{isSubscribed ? 'Pro' : 'Free'}</span> supporta al massimo{' '}
              {isSubscribed ? PLANS.find((p) => p.name === 'Pro')?.pagesPerPDF : PLANS.find((p) => p.name === 'Free')?.pagesPerPDF} pagine per PDF.
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}
            >
              <ChevronLeft className='mr-1.5 h-3 w-3' />
              Indietro
            </Link>
          </div>
        </div>
        {/* <ChatInput isDisabled /> */}
      </div>
    )

  return (
    <ChatProvider fileId={fileId} initialMessages={data.initialMessages}>
      <div className='relative flex min-h-full flex-col justify-between gap-2 divide-y divide-border-200 bg-background'>
        <div className='mb-28 flex flex-1 flex-col justify-between'>
          <ChatMessages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatProvider>
  )
}

export default ChatWrapper
