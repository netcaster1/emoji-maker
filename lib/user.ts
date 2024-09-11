import { supabase } from './supabase'

export async function checkUserExists(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error checking user:', error)
    return false
  }

  return !!data
}

export async function createUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { user_id: userId }
    ])
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data
}