import { authProtectPage } from '@/helpers/auth'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const { user } = await authProtectPage()

  return <div>this is {user.given_name}'s dashboard</div>
}

export default page
