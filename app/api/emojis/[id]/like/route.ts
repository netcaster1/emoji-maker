import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emojiId = parseInt(params.id)

  try {
    // Check if the user has already liked this emoji
    const { data: existingLike } = await supabase
      .from('emoji_likes')
      .select()
      .eq('user_id', userId)
      .eq('emoji_id', emojiId)
      .single()

    if (existingLike) {
      // User has already liked this emoji, so we'll unlike it
      await supabase
        .from('emoji_likes')
        .delete()
        .eq('user_id', userId)
        .eq('emoji_id', emojiId)

      // Decrement the likes_count
      await supabase.rpc('decrement_emoji_likes', { emoji_id: emojiId })
    } else {
      // User hasn't liked this emoji yet, so we'll add a like
      await supabase
        .from('emoji_likes')
        .insert({ user_id: userId, emoji_id: emojiId })

      // Increment the likes_count
      await supabase.rpc('increment_emoji_likes', { emoji_id: emojiId })
    }

    // Fetch the updated emoji
    const { data: updatedEmoji, error } = await supabase
      .from('emojis')
      .select('likes_count')
      .eq('id', emojiId)
      .single()

    if (error) throw error

    return NextResponse.json({ likes_count: updatedEmoji.likes_count })
  } catch (error) {
    console.error('Error liking/unliking emoji:', error)
    return NextResponse.json({ error: 'Failed to like/unlike emoji' }, { status: 500 })
  }
}