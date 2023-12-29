import UpgradeBtn from '@/components/UpgradeBtn'
import { buttonVariants } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { PLANS } from '@/config/stripe'
import { cn } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  
  const pricingItems = [
    {
      plan: 'Free',
      tagline: 'Per piccoli progetti.',
      quota: PLANS.find((p) => p.slug === 'free')!.quota,
      features: [
        {
          text: '5 pagine per PDF',
          footnote: 'Il numero massimo di pagine per file PDF.',
        },
        {
          text: 'Dimensione max file: 4MB',
          footnote: 'Le dimensioni massime dei file PDF.',
        },
        {
          text: 'Interfaccia mobile inclusa',
        },
        {
          text: 'Qualità risposte incrementata',
          footnote: "Risposte di qualità superiore da parte dell'algoritmo per una esperienza d'uso migliore.",
          negative: true,
        },
        {
          text: 'Supporto prioritario',
          negative: true,
        },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'Per progetti con esigenze superiori.',
      quota: PLANS.find((p) => p.slug === 'pro')!.quota,
      features: [
        {
          text: '25 pagine per PDF',
          footnote: 'Il numero massimo di pagine per file PDF.',
        },
        {
          text: 'Dimensione max file: 16MB',
          footnote: 'Le dimensioni massime dei file PDF.',
        },
        {
          text: 'Interfaccia mobile inclusa',
        },
        {
          text: 'Qualità risposte incrementata',
          footnote: "Risposte di qualità superiore da parte dell'algoritmo per una esperienza d'uso migliore.",
        },
        {
          text: 'Supporto prioritario',
        },
      ],
    },
  ]

  return (
    <>
      <main className='container mb-8 mt-24 max-w-5xl text-center'>
        <div className='mx-auto mb-10 sm:max-w-xl'>
          <h1 className='text-6xl font-bold sm:text-7xl'>Prezzi</h1>
          <p className='mt-5 text-typography-600 sm:text-lg'>Che tu stia soltanto provando il nostro servizio o che tu abbia esegenze maggiori, abbiamo il piano che fa per te.</p>
        </div>

        <div className='grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2'>
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, features }) => {
              const price = PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0

              return (
                <div
                  key={plan}
                  className={cn('relative rounded-2xl bg-background shadow-lg', {
                    'border-2 border-primary shadow-primary-200': plan === 'Pro',
                    'border border-border-200': plan !== 'Pro',
                  })}
                >
                  {plan === 'Pro' && (
                    <div className='absolute -top-5 left-0 right-0 mx-auto w-40 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground'>
                      Fai l'upgrade ora
                    </div>
                  )}

                  <div className='p-5'>
                    <h3 className='font-display my-3 text-center text-3xl font-bold'>{plan}</h3>
                    <p className='text-typography-500'>{tagline}</p>
                    <p className='font-display my-5 text-6xl font-semibold'>${price}</p>
                    <p className='text-typography-500'>al mese</p>
                  </div>

                  <div className='flex h-20 items-center justify-center border-b border-t border-border-200 bg-separation-50'>
                    <div className='flex items-center space-x-1'>
                      <p>{quota.toLocaleString()} PDF/mese inclusi</p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className='ml-1.5 cursor-default'>
                          <HelpCircle className='h-4 w-4 text-typography-500' />
                        </TooltipTrigger>
                        <TooltipContent className='w-80 p-2'>Quanti PDF puoi caricare ogni mese.</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className='my-10 space-y-5 px-8'>
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className='flex space-x-5'>
                        <div className='flex-shrink-0'>
                          {negative ? <Minus className='h-6 w-6 text-typography-300' /> : <Check className='h-6 w-6 text-primary-500' />}
                        </div>
                        {footnote ? (
                          <div className='flex items-center space-x-1'>
                            <p
                              className={cn('text-typography-600', {
                                'text-typography-400': negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className='ml-1.5 cursor-default'>
                                <HelpCircle className='h-4 w-4 text-typography-500' />
                              </TooltipTrigger>
                              <TooltipContent className='w-80 p-2'>{footnote}</TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn('text-typography-600', {
                              'text-typography-400': negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className='border-t border-border-200' />
                  <div className='p-5'>
                    {plan === 'Free' ? (
                      <Link
                        href={user ? '/dashboard' : '/sign-in?post_login_redirect_url=/pricing'}
                        className={buttonVariants({
                          className: 'w-full',
                          variant: 'secondary',
                        })}
                      >
                        {user ? "Fai l'upgrade ora" : 'Registrati'}
                        <ArrowRight className='ml-1.5 h-5 w-5' />
                      </Link>
                    ) : user ? (
                      <UpgradeBtn />
                    ) : (
                      <Link
                        href='/sign-in?post_login_redirect_url=/pricing'
                        className={buttonVariants({
                          className: 'w-full',
                        })}
                      >
                        {user ? "Fai l'upgrade ora" : 'Registrati'}
                        <ArrowRight className='ml-1.5 h-5 w-5' />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </TooltipProvider>
        </div>
      </main>
    </>
  )
}

export default page
