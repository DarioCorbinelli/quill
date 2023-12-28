import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { cn } from '@/lib/utils'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'
import { Gem, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { FC, HTMLAttributes } from 'react'

interface UserAccountNavProps
  extends Pick<KindeUser, 'picture' | 'given_name' | 'email'>,
    HTMLAttributes<HTMLButtonElement>,
    Pick<Awaited<ReturnType<typeof getUserSubscriptionPlan>>, 'isSubscribed'> {}

const UserAccountNav: FC<UserAccountNavProps> = ({ picture, given_name: name, email, className, isSubscribed, ...rest }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('rounded-full outline-offset-4', className)} {...rest}>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={picture ?? undefined} />
          <AvatarFallback>
            <span className='sr-only'>{name}</span>
            <User className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {(name || email) && (
          <>
            <div className='w-[200px] p-2 leading-none'>
              {name && <p className='font-medium'>{name}</p>}
              {email && <p className='w-full truncate text-sm text-muted-foreground'>{email}</p>}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {isSubscribed ? (
            <Link href='/dashboard/billing'>Gestisci abbonamento</Link>
          ) : (
            <Link href='/pricing' className='justify-between gap-1.5'>
              Passa a Pro <Gem className='h-4 w-4 text-primary' />
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='cursor-pointer'>
          <LogoutLink>
            Esci <LogOut className='ml-auto h-4 w-4' />
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
