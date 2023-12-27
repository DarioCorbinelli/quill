'use client'

import { trpc } from '@/lib/trpc/trpc'
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

  return <div>setting up your account...</div>
}

export default page
