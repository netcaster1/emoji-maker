import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('emojis')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ emojis: data })
  } catch (error) {
    console.error('Error fetching emojis:', error)
    return NextResponse.json({ error: 'Failed to fetch emojis' }, { status: 500 })
  }
}