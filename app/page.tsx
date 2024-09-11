import EmojiGenerator from '../components/emoji-generator'
import EmojiGrid from '../components/emoji-grid'
import { EmojiProvider } from '../contexts/emoji-context'

export default function Home() {
  return (
    <EmojiProvider>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Emoji Maker</h1>
        <EmojiGenerator />
        <EmojiGrid />
      </main>
    </EmojiProvider>
  )
}
