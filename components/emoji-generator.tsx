'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Loader2 } from 'lucide-react'
// import { generateEmoji } from '@/lib/api'

interface EmojiGeneratorProps {
  onNewEmoji: (prompt: string) => Promise<void>
}

export default function EmojiGenerator({ onNewEmoji }: EmojiGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onNewEmoji(prompt)
    } catch (error) {
      console.error('Error generating emoji:', error)
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
    </Card>
  )
}