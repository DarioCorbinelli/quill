'use client'

import { Button } from '@/components/ui/Button'
import { trpc } from '@/lib/trpc/trpc'
import { ArrowRight } from 'lucide-react'
import { FC } from 'react'

interface UpgradeBtnProps {}

const UpgradeBtn: FC<UpgradeBtnProps> = ({}) => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess({ url }) {
      window.location.href = url ?? '/dashboard/billing'
    },
  })

  return (
    <Button onClick={() => createStripeSession()} className='w-full'>
      Fai l'upgrade ora <ArrowRight className='ml-1.5 h-5 w-5' />
    </Button>
  )
}

export default UpgradeBtn
