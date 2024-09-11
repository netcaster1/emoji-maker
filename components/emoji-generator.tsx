'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Loader2 } from 'lucide-react'

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmoji, setGeneratedEmoji] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedEmoji(data.imageUrl)
      } else {
        setError(data.error || 'Failed to generate emoji')
      }
    } catch (error) {
      console.error('Error generating emoji:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsGenerating(false)
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
        <Button type="submit" disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Emoji'
          )}
        </Button>
      </form>
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
      {generatedEmoji && (
        <div className="mt-4 flex justify-center">
          <img src={generatedEmoji} alt="Generated Emoji" className="w-32 h-32" />
        </div>
      )}
    </Card>
  )
}