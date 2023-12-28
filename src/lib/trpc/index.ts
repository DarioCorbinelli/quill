import { db } from '@/lib/db'
import { privateProcedure, router } from './init'
import { TRPCError } from '@trpc/server'
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/helpers/utils'
import { PLANS } from '@/config/stripe'
import z from 'zod'

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
    const file = await db.file.findUnique({ where: { key } })

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    return file
  }),
  getUserFiles: privateProcedure.query(async ({ ctx: { userId } }) => {
    const files = await db.file.findMany({ where: { userId } })

    return files
  }),
  deleteUserFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx: { userId }, input: { id } }) => {
    const file = await db.file.findUnique({where: { id, userId }})

    if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

    await db.file.delete({ where: { id } })

    return { success: true }
  })
})

export type AppRouter = typeof appRouter
