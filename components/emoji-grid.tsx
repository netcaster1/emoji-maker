'use client'

import { Card } from './ui/card'
import { Download, Heart } from 'lucide-react'
import { useEmoji } from '../contexts/emoji-context'

// Add this type declaration at the top of the file
declare global {
    interface Window {
      showSaveFilePicker: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
    }
  }

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

export default function EmojiGrid() {
  const { emojis, toggleLike } = useEmoji()

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(`/api/download-emoji?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()

      // Check if the browser supports the showSaveFilePicker API
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'emoji.png',
          types: [{
            description: 'PNG Files',
            accept: { 'image/png': ['.png'] },
          }],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
      } else {
        // Fallback for browsers that don't support showSaveFilePicker
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = 'emoji.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error('Error downloading emoji:', error)
    }
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
            <button onClick={() => toggleLike(emoji.id)} className="p-2 bg-white rounded-full">
              <Heart className={`w-5 h-5 ${emoji.liked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}