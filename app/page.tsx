'use client'

import { useState } from 'react'
import EmojiGenerator from '../components/emoji-generator'
import EmojiGrid from '../components/emoji-grid'

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNewEmoji = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Emoji Maker</h1>
      <EmojiGenerator onNewEmoji={handleNewEmoji} />
      <EmojiGrid emojis={emojis} setEmojis={setEmojis} />
    </main>
  )
}
