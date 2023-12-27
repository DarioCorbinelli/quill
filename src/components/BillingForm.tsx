'use client'

import { getUserSubscriptionPlan } from '@/lib/stripe'
import { trpc } from '@/lib/trpc/trpc'
import { FC } from 'react'
import { format } from 'date-fns'

interface BillingFormProps {
  plan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const BillingForm: FC<BillingFormProps> = ({ plan: { isSubscribed, isCanceled, stripeCurrentPeriodEnd } }) => {
  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess({ url }) {
      if (url) window.location.href = url

      alert('something went wrong')
    },
  })

  return (
    <div>
      <button onClick={() => createStripeSession()}>{isLoading ? 'loading' : isSubscribed ? 'Manage subscription' : 'get pro'}</button>
      {isSubscribed ? (
        <p className='rounded-full text-xs font-medium'>
          {isCanceled ? 'Your plan will be canceled on ' : 'Your plan renews on'}
          {format(stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}.
        </p>
      ) : null}
    </div>
  )
}

export default BillingForm
