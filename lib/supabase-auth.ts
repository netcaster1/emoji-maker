import { createClient } from '@supabase/supabase-js'
import { useUser } from '@clerk/nextjs'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useSupabaseAuth() {
  const { user } = useUser()

  if (user) {
    supabase.auth.setSession({
      access_token: user.id,
      refresh_token: '',
    })
  }

  return supabase
}