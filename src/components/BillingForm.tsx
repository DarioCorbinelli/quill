'use client'

import { getUserSubscriptionPlan } from '@/lib/stripe'
import { trpc } from '@/lib/trpc/trpc'
import { FC, HTMLAttributes } from 'react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BillingFormProps extends HTMLAttributes<HTMLDivElement> {
  plan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const BillingForm: FC<BillingFormProps> = ({ plan, className, ...rest }) => {
  const { toast } = useToast()

  const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
    onSuccess({ url }) {
      if (url) window.location.href = url
      else
        toast({
          title: "C'è stato un problema...",
          description: 'Per piacere riprova tra qualche istante.',
          variant: 'destructive',
        })
    },
  })

  return (
    <div className={cn('container max-w-5xl', className)} {...rest}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createStripeSession()
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Piano:</CardTitle>
            <CardDescription>
              Attualmente il tuo piano è il piano <strong>{plan.name}</strong>.
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
            <Button type='submit'>
              {isLoading ? <Loader2 className='mr-4 h-4 w-4 animate-spin' /> : null}
              {plan.isSubscribed ? 'Gestisci abbonamento' : 'Accedi a Pro'}
            </Button>

            {plan.isSubscribed ? (
              <p className='rounded-full text-xs font-medium'>
                {plan.isCanceled ? 'Il tuo piano sarà cancellato il ' : 'Il tuo piano si rinnoverà il '}
                {format(plan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy', { locale: it })}.
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default BillingForm
