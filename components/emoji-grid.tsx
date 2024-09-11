'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, Dispatch, SetStateAction, useCallback } from 'react'
import { likeEmoji } from '@/lib/api'
import Image from 'next/image'
import { Heart, Download  } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast' // Make sure to install and set up react-hot-toast
import * as Tooltip from '@radix-ui/react-tooltip';

export interface Emoji {
  id: number
  image_url: string
  prompt: string
  likes_count: number
  isLoading?: boolean
  hasError?: boolean
}

interface EmojiGridProps {
  emojis: Emoji[];
  setEmojis: Dispatch<SetStateAction<Emoji[]>>;
}

export function EmojiGrid({ emojis, setEmojis }: EmojiGridProps) {
  const [error, setError] = useState<string | null>(null)
  const [localEmojis, setLocalEmojis] = useState<Emoji[]>(emojis)

  useEffect(() => {
    setLocalEmojis(emojis)
  }, [emojis])

  const handleLike = async (emojiId: number) => {
    try {
      const response = await likeEmoji(emojiId)
      setLocalEmojis(prevEmojis => prevEmojis.map(emoji => 
        emoji.id === emojiId 
          ? { ...emoji, likes_count: response.likes_count } 
          : emoji
      ))
      setEmojis(prevEmojis => prevEmojis.map(emoji => 
        emoji.id === emojiId 
          ? { ...emoji, likes_count: response.likes_count } 
          : emoji
      ))
      toast.success(response.likes_count > 0 ? 'Emoji liked!' : 'Emoji unliked!')
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

  const retryLoadImage = useCallback((emoji: Emoji) => {
    setEmojis(prevEmojis => prevEmojis.map(e => 
      e.id === emoji.id ? { ...e, isLoading: true, hasError: false } : e
    ));
    
    const checkImage = async (retries = 5) => {
      if (retries === 0) {
        throw new Error('Image not available after multiple attempts');
      }

      try {
        const response = await fetch(emoji.image_url);
        if (response.ok) {
          const blob = await response.blob();
          if (blob.type.startsWith('image/')) {
            setEmojis(prevEmojis => prevEmojis.map(e => 
              e.id === emoji.id ? { ...e, isLoading: false, hasError: false } : e
            ));
            return;
          }
        }
        throw new Error('Image not ready yet');
      } catch (error) {
        console.error(`Attempt ${6 - retries} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await checkImage(retries - 1);
      }
    };

    checkImage().catch(() => {
      setEmojis(prevEmojis => prevEmojis.map(e => 
        e.id === emoji.id ? { ...e, isLoading: false, hasError: true } : e
      ));
      toast.error('Failed to load image after multiple attempts');
    });
  }, [setEmojis]);

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>
  }

  return (
    <Tooltip.Provider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {localEmojis.map((emoji) => (
          <div key={emoji.id} className="flex flex-col">
            <div className="relative aspect-square group">
              {emoji.isLoading ? (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Loading image...</span>
                </div>
              ) : (
                <Image
                  src={emoji.image_url}
                  alt={emoji.prompt || 'Emoji'}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="rounded-lg"
                  onError={() => {
                    console.error(`Failed to load image: ${emoji.image_url}`);
                    setEmojis(prevEmojis => prevEmojis.map(e => 
                      e.id === emoji.id ? { ...e, isLoading: false, hasError: true } : e
                    ));
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => emoji.image_url && handleDownload(emoji.image_url, emoji.prompt)}
                  className="text-white hover:text-blue-500"
                  disabled={!emoji.image_url}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center px-1">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <p className="text-sm font-medium text-gray-700 truncate flex-grow cursor-help">
                    {emoji.prompt || 'No prompt'}
                  </p>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-white p-2 rounded shadow-lg z-50 max-w-xs text-sm text-gray-800"
                    sideOffset={5}
                  >
                    {emoji.prompt || 'No prompt'}
                    <Tooltip.Arrow className="fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleLike(emoji.id)}
                className="text-gray-500 hover:text-red-500 p-0"
              >
                <Heart className={`h-4 w-4 ${emoji.likes_count > 0 ? 'fill-current text-red-500' : ''}`} />
                <span className="ml-1 text-xs">{emoji.likes_count}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Tooltip.Provider>
  )
}