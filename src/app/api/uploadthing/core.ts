import { PLANS } from '@/config/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadedFile } from '@uploadthing/shared'
import { db } from '@/lib/db'
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { supabase } from '@/lib/supabase'
import { getUserSubscriptionPlan } from '@/lib/stripe'

const f = createUploadthing()

const middleware = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) throw new Error('Unauthorized')

  const subscriptionPlan = await getUserSubscriptionPlan()

  return { userId: user.id, subscriptionPlan }
}

const onUploadComplete = async ({ metadata, file }: { metadata: Awaited<ReturnType<typeof middleware>>; file: UploadedFile }) => {
  const dbFile = await db.file.findFirst({
    where: { url: file.url },
  })

  if (dbFile) return

  const fileCreated = await db.file.create({
    data: {
      name: file.name,
      url: file.url,
      key: file.key,
      userId: metadata.userId,
      uploadStatus: 'processing',
    },
  })

  try {
    const res = await fetch(fileCreated.url)
    const blob = await res.blob()
    const loader = new WebPDFLoader(blob)
    const docs = await loader.load()
    const pagesAmt = docs.length

    const withFileReferenceDocs = docs.map(d => ({...d, metadata: {...d.metadata, fileKey: fileCreated.key}}))

    const { isSubscribed } = metadata.subscriptionPlan

    const isProExceeded = pagesAmt > PLANS.find((p) => p.name === 'Pro')!.pagesPerPDF
    const isFreeExceeded = pagesAmt > PLANS.find((p) => p.name === 'Free')!.pagesPerPDF

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        where: { id: fileCreated.id, userId: metadata.userId },
        data: { uploadStatus: 'failed' },
      })
    }

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })

    await SupabaseVectorStore.fromDocuments(withFileReferenceDocs, embeddings, {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents',
    })

    await db.file.update({
      where: { id: fileCreated.id, userId: metadata.userId },
      data: { uploadStatus: 'success' },
    })
  } catch (err) {
    await db.file.update({
      where: { id: fileCreated.id, userId: metadata.userId },
      data: { uploadStatus: 'failed' },
    })
  }

  return { success: true }
}

export const ourFileRouter = {
  freeFileUploader: f({ pdf: { maxFileSize: PLANS[0].maxSize, maxFileCount: 1 } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proFileUploader: f({ pdf: { maxFileSize: PLANS[1].maxSize, maxFileCount: 1 } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
