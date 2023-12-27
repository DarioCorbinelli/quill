'use server'

import { db } from "@/lib/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

type Options = {
  redirect?: string
}

export async function authProtectPage(opt?: Options) {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  if (!user) redirect(opt?.redirect ? `/sign-in?post_login_redirect_url=${opt?.redirect}` : `/sign-in`)

  const dbUser = await db.user.findUnique({ where: { id: user.id } })
  
  if (!dbUser) redirect(opt?.redirect ? `/auth-callback?origin=${opt?.redirect}` : `/auth-callback`)

  return { user, dbUser }
}