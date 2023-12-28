import UserAccountNav from '@/components/UserAccountNav'
import { buttonVariants } from '@/components/ui/Button'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { cn } from '@/lib/utils'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface NavbarProps {
}

const Navbar: FC<NavbarProps> = async ({ }) => {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  const plan = await getUserSubscriptionPlan()

  return (
    <div className='sticky inset-x-0 top-0 z-30 h-14 border-b border-border-200 bg-navigation/75 backdrop-blur-lg transition-all'>
      <div className='container flex h-full items-center justify-between gap-8'>
        <Link className='font-semibold outline-offset-2' href='/'>
          Quill.
        </Link>
        <div className={cn('flex items-center justify-center gap-0.5', { 'gap-1': !user })}>
          {!!user ? (
            <>
              <Link href='/dashboard' className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                Dashboard
              </Link>
              <UserAccountNav {...user} isSubscribed={plan.isSubscribed} className='ml-2.5' />
            </>
          ) : (
            <>
              <LoginLink className={buttonVariants({ size: 'sm', variant: 'ghost' })}>Accedi</LoginLink>
              <RegisterLink className={buttonVariants({ size: 'sm' })}>
                Registrati <ArrowRight className='ml-1.5 h-4 w-4' />
              </RegisterLink>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
