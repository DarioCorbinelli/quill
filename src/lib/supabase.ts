import { createClient } from '@supabase/supabase-js'

const privateKey = process.env.SUPABASE_API_KEY
const url = process.env.SUPABASE_URL

if (!privateKey) throw new Error('SUPABASE_PRIVATE_KEY not set')
if (!url) throw new Error('SUPABASE_URL not set')

export const supabase = createClient(url, privateKey)