'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface EmojiGeneratorProps {
  onNewEmoji: (prompt: string) => Promise<void>
}

export default function EmojiGenerator({ onNewEmoji }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedEmoji, setGeneratedEmoji] = useState<{ image_url: string; prompt: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setGeneratedEmoji(null)
    setError(null)
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate emoji')
      }

      const data = await response.json()
      if (data.success && data.emoji) {
        setGeneratedEmoji({
          image_url: data.emoji.image_url,
          prompt: data.emoji.prompt,
        })
        await onNewEmoji(data.emoji.prompt) // Notify parent component
      } else {
        throw new Error(data.error || 'Failed to generate emoji')
      }
    } catch (error) {
      console.error('Error generating emoji:', error)
      setError('Failed to generate emoji. Please try again.')
    } finally {
      setIsLoading(false)
      setPrompt('') // Clear the input after generation
    }
  }

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your emoji prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Emoji'
          )}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {generatedEmoji && (
        <div className="mt-4">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={generatedEmoji.image_url}
              alt={generatedEmoji.prompt}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">{generatedEmoji.prompt}</p>
        </div>
      )}
    </Card>
  )
}