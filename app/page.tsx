'use client'

import { useState, useCallback, Dispatch, SetStateAction, useEffect } from 'react'
import EmojiGenerator from '../components/emoji-generator'
import { EmojiGrid, Emoji } from '@/components/emoji-grid'
import { generateEmoji, fetchEmojis } from '@/lib/api';
import toast from 'react-hot-toast';

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    const loadEmojis = async () => {
      try {
        const { emojis: fetchedEmojis } = await fetchEmojis();
        setEmojis(fetchedEmojis);
      } catch (error) {
        console.error('Error loading emojis:', error);
        toast.error('Failed to load emojis');
      }
    };

    loadEmojis();
  }, []);

  const handleNewEmoji = async (prompt: string) => {
    const toastId = toast.loading('Generating emoji...');
    try {
      const newEmoji = await generateEmoji(prompt);
      
      const completeEmoji: Emoji = {
        id: newEmoji.id || Date.now(),
        image_url: newEmoji.image_url || '',
        prompt: newEmoji.prompt || prompt,
        likes_count: newEmoji.likes_count || 0,
        isLoading: true
      };
      
      setEmojis(prevEmojis => [completeEmoji, ...prevEmojis]);

      // Add a delay to give the server time to process and store the image
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Fetch all emojis again, including the newly generated one
      const { emojis: refreshedEmojis } = await fetchEmojis();
      setEmojis(refreshedEmojis);

      toast.success('Emoji generated successfully!', { id: toastId });

    } catch (error) {
      console.error('Error generating or loading emoji:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate or load emoji', { id: toastId });
    }
  }

  const memoizedSetEmojis: Dispatch<SetStateAction<Emoji[]>> = useCallback(setEmojis, [setEmojis]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Emoji Maker</h1>
      <EmojiGenerator onNewEmoji={handleNewEmoji} />
      <EmojiGrid emojis={emojis} setEmojis={memoizedSetEmojis} />
    </main>
  )
}
