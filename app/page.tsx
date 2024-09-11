import EmojiGenerator from '../components/emoji-generator'
import EmojiGrid from '../components/emoji-grid'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Emoji Maker</h1>
      <EmojiGenerator />
      <EmojiGrid />
    </main>
  )
}
