import FilesView from '@/components/FilesView'
import UploadBtn from '@/components/UploadBtn'
import { authProtectPage } from '@/helpers/auth'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  await authProtectPage()
  const plan = await getUserSubscriptionPlan()

    return (
      <main className='container'>
        <div className='mt-8 flex items-end justify-between gap-4 border-b border-border-200 pb-5'>
          <h1 className='text-5xl font-bold text-typography-900'>I Miei File</h1>
          <UploadBtn isSubscribed={plan.isSubscribed} className='mb-1' />
        </div>
        <FilesView className='mt-8' />
      </main>
    )
}

export default page
