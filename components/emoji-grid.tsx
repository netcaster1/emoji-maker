'use client'

import { useEffect, useState } from 'react'
import { fetchEmojis, likeEmoji } from '@/lib/api'
import Image from 'next/image'
import { Heart, Download } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast' // Make sure to install and set up react-hot-toast

interface Emoji {
  id: number
  image_url: string
  prompt: string
  likes_count: number
}

export default function EmojiGrid() {
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEmojis = async () => {
      try {
        const { emojis } = await fetchEmojis()
        setEmojis(emojis)
      } catch (error) {
        console.error('Error loading emojis:', error)
        setError('Failed to load emojis')
      }
    }

    loadEmojis()
  }, [])

  const handleLike = async (emojiId: number) => {
    try {
      const response = await likeEmoji(emojiId)
      setEmojis(emojis.map(emoji => 
        emoji.id === emojiId 
          ? { ...emoji, likes_count: response.likes_count } 
          : emoji
      ))
    } catch (error) {
      console.error('Error liking/unliking emoji:', error)
      toast.error('Failed to update like status')
    }
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const fileName = `emoji-${prompt.replace(/\s+/g, '-').toLowerCase()}.png`

      if ('showSaveFilePicker' in window && typeof window.showSaveFilePicker === 'function') {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'PNG Image',
              accept: { 'image/png': ['.png'] },
            }],
          })
          const writable = await handle.createWritable()
          await writable.write(blob)
          await writable.close()
          toast.success('Emoji saved successfully!')
        } catch (err) {
          console.error('Error saving file:', err)
          fallbackDownload(blob, fileName)
        }
      } else {
        fallbackDownload(blob, fileName)
      }
    } catch (error) {
      console.error('Error downloading emoji:', error)
      toast.error('Failed to download emoji')
    }
  }

  const fallbackDownload = (blob: Blob, fileName: string) => {
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = blobUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(blobUrl)
    document.body.removeChild(a)
    toast.success('Emoji download started!')
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="relative aspect-square group">
          <Image
            src={emoji.image_url}
            alt={emoji.prompt}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            onError={() => console.error(`Failed to load image: ${emoji.image_url}`)}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="text-white text-sm mb-2">{emoji.prompt}</p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleLike(emoji.id)}
                className="text-white hover:text-red-500"
              >
                <Heart className="h-4 w-4 mr-1" />
                {emoji.likes_count}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDownload(emoji.image_url, emoji.prompt)}
                className="text-white hover:text-blue-500"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}