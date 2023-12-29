import { authProtectPage } from '@/helpers/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: {
    fileId: string
  }
}

const page: FC<pageProps> = async ({ params: { fileId } }) => {
  const { user } = await authProtectPage({
    redirect: `/dashboard/${fileId}`,
  })

  const file = await db.file.findUnique({
    where: {
      id: fileId,
      userId: user.id
    }
  })
  if (!file) notFound()

  return (
    <div className='flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between'>
      <div className='max-w-8xl mx-auto w-full grow lg:flex xl:px-2'>
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* Main area */}
            {/* <PdfRenderer url={file.url} /> */}
            pdf renderer
          </div>
        </div>

        <div className='flex-[0.75] shrink-0 border-t border-border-200 lg:w-96 lg:border-l lg:border-t-0'>
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
        </div>
      </div>
    </div>
  )
}

export default page
