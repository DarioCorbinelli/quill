import { INFINITE_QUERY_LIMIT } from '@/config/inifinite-query'
import { PLANS } from '@/config/stripe'
import { absoluteUrl } from '@/helpers/utils'
import { db } from '@/lib/db'
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { utapi } from '@/lib/uploadthing/uploadthing-server'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { privateProcedure, router } from './init'

export const appRouter = router({
  initUserAccount: privateProcedure.query(
    async ({
      ctx: {
        user: { id, email },
      },
    }) => {
      const dbUser = await db.user.findUnique({ where: { id } })

      if (dbUser) throw new TRPCError({ code: 'CONFLICT' })

      await db.user.create({ data: { id, email } })

      return { success: true }
    }
  ),
  createStripeSession: privateProcedure.mutation(async ({ ctx: { userId } }) => {
    const dbUser = await db.user.findUnique({ where: { id: userId } })

    if (!dbUser) throw new TRPCError({ code: 'FORBIDDEN' })

    const billingUrl = absoluteUrl('/dashboard/billing')

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (subscriptionPlan.isSubscribed) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId!,
        return_url: billingUrl,
      })

      return { url: stripeSession.url }
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card', 'paypal'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price: PLANS.find((p) => p.name === 'Pro')?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: { userId },
    })

    return { url: stripeSession.url }
  }),
  getUserFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({ ctx: { userId }, input: { key } }) => {
    const file = await db.file.findUnique({ where: { key, userId } })

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    return file
  }),
  getUserFiles: privateProcedure.query(async ({ ctx: { userId } }) => {
    const files = await db.file.findMany({ where: { userId } })

    return files
  }),
  deleteUserFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx: { userId }, input: { id } }) => {
    const file = await db.file.findUnique({ where: { id, userId } })

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    await db.file.delete({ where: { id } })
    await utapi.deleteFiles(file.key)
    await supabase.from('documents').delete().eq('metadata->>fileKey', file.key)

    return { success: true }
  }),
  getFileUploadStatus: privateProcedure.input(z.object({ id: z.string() })).query(async ({ ctx: { userId }, input: { id } }) => {
    const file = await db.file.findUnique({ where: { id, userId }, include: {messages: {take: 5, orderBy: {createdAt: 'desc'}}} })

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    return { status: file.uploadStatus, initialMessages: file.messages }
  }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { userId }, input: { fileId, limit: passedLimit, cursor } }) => {
      const limit = passedLimit ?? INFINITE_QUERY_LIMIT

      const file = await db.file.findUnique({ where: { id: fileId, userId } })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      const messages = await db.message.findMany({
        where: { fileId, userId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        }
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (messages.length > limit) {
        const nextItem = messages.pop()
        nextCursor = nextItem?.id
      }

      return { messages, nextCursor }
    }),
})

export type AppRouter = typeof appRouter
