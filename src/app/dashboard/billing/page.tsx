import BillingForm from '@/components/BillingForm'
import { authProtectPage } from '@/helpers/auth'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const {} = await authProtectPage({
    redirect: '/dashboard/billing',
  })

  const plan = await getUserSubscriptionPlan()

  return <BillingForm plan={plan} className='mt-12'/>
}

export default page
