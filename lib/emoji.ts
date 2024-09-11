/* eslint-disable @typescript-eslint/no-unused-vars */

import { supabase } from './supabase'

export async function uploadEmojiImage(buffer: Buffer, fileName: string) {
  const { data, error } = await supabase.storage
    .from('emojis')
    .upload(fileName, buffer, {
      contentType: 'image/png',
      upsert: true
    })

  if (error) {
    console.error('Error uploading emoji:', error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('emojis')
    .getPublicUrl(fileName)

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to get public URL for uploaded image')
  }

  console.log('Public URL:', publicUrlData.publicUrl) // Add this line

  return publicUrlData.publicUrl
}

export async function addEmojiToDatabase(imageUrl: string, prompt: string, userId: string) {
  const { data, error } = await supabase
    .from('emojis')
    .insert([
      { image_url: imageUrl, prompt, creator_user_id: userId }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding emoji to database:', error)
    throw error
  }

  return data
}

export async function getEmojis() {
  const response = await fetch('https://api.example.com/emojis');
  const data = await response.json();
  // Use 'data' here or return it
  return data;
}