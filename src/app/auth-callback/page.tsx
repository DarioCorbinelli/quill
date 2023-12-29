'use client'

import { trpc } from '@/lib/trpc/trpc'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  const { status, error } = trpc.initUserAccount.useQuery(undefined, {
    onError(err) {
      if (err.data?.code === 'UNAUTHORIZED') return router.push(origin ? `/sign-in?post_login_redirect_url=${origin}` : '/sign-in')
      if (status === 'error' && error.data?.code === 'CONFLICT') return router.push(origin || '/dashboard')
    },
    onSuccess() {
      return router.push(origin || '/dashboard')
    },
  })

  return (
    <div className='mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-typography-800' />
        <h3 className='text-xl font-semibold'>Stiamo preparando il tuo account...</h3>
        <p>Sarai reindirizzato utomaticamente.</p>
      </div>
    </div>
  )
}

export default page
