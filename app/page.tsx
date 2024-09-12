'use client'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import EmojiGenerator from '../components/emoji-generator'
import EmojiGrid from '@/components/emoji-grid'
import { Emoji } from '@/components/emoji-grid';
import { generateEmoji, fetchEmojis } from '@/lib/api';
import toast from 'react-hot-toast';
import { Suspense } from 'react';

export const revalidate = 0; // This will revalidate the page on every request

async function EmojiData() {
  const emojis = await fetchEmojis();
  return <EmojiGrid initialEmojis={emojis} />;
}

export default function Home() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const onNewEmoji = async (prompt: string) => {
    const newEmoji = await generateEmoji(prompt);
    setEmojis(prev => [...prev, newEmoji as Emoji]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-4xl"> {/* Wrapper to constrain width */}
        <EmojiGenerator onNewEmoji={onNewEmoji} />
        <Suspense fallback={<div>Loading...</div>}>
          <EmojiData />
        </Suspense>
      </div>
    </main>
  );
}
