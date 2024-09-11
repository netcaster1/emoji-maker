'use client'

import { useState } from 'react'
import { Card } from './ui/card'
import { Download, Heart } from 'lucide-react'

type Emoji = {
  id: string
  url: string
  liked: boolean
}

export default function EmojiGrid() {
  const [emojis, setEmojis] = useState<Emoji[]>([
    { id: '1', url: 'https://placeholder.com/150x150', liked: false },
    { id: '2', url: 'https://placeholder.com/150x150', liked: true },
    // Add more placeholder emojis as needed
  ])

  const handleLike = (id: string) => {
    setEmojis(emojis.map(emoji => 
      emoji.id === id ? { ...emoji, liked: !emoji.liked } : emoji
    ))
  }

  const handleDownload = (url: string) => {
    // TODO: Implement download functionality
    console.log('Downloading:', url)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="relative group">
          <img src={emoji.url} alt="Emoji" className="w-full h-auto" />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button onClick={() => handleDownload(emoji.url)} className="p-2 bg-white rounded-full">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={() => handleLike(emoji.id)} className="p-2 bg-white rounded-full">
              <Heart className={`w-5 h-5 ${emoji.liked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}