import { RegisterLink, LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { FC } from 'react'

interface NavbarProps {
}

const Navbar: FC<NavbarProps> = async ({ }) => {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  return (
    <div className='flex justify-between'>
      {!user ? (
        <div>
          <LoginLink>Accedi</LoginLink>{' '}
          <RegisterLink>Registrati</RegisterLink>
        </div>
      ) : (
          <div>{user.email}{' '}<LogoutLink>Esci</LogoutLink></div>
      )}
    </div>
  )
}

export default Navbar
