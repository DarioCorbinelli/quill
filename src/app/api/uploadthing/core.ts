import { PLANS } from '@/config/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadedFile } from '@uploadthing/shared'
import { db } from '@/lib/db'

const f = createUploadthing()

const middleware = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) throw new Error('Unauthorized')

  return { userId: user.id }
}

const onUploadComplete = async ({metadata, file}:{metadata: Awaited<ReturnType<typeof middleware>>, file: UploadedFile}) => {
  const dbFile = await db.file.findFirst({
    where: {url: file.url}
  })

  if (dbFile) return

  await db.file.create({
    data: {
      name: file.name,
      url: file.url,
      key: file.key,
      userId: metadata.userId,
    }
  })

  console.log('file url', file.url)

  return { success: true }
}

export const ourFileRouter = {
  freeFileUploader: f({ pdf: {maxFileSize: PLANS[0].maxSize, maxFileCount: 1} })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proFileUploader: f({ pdf: { maxFileSize: PLANS[1].maxSize, maxFileCount: 1 } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
