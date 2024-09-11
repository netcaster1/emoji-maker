import { Emoji } from '@/components/emoji-grid';

let isGenerating = false;

export async function generateEmoji(prompt: string): Promise<Partial<Emoji>> {
  if (isGenerating) {
    throw new Error('An emoji is already being generated. Please wait.');
  }

  isGenerating = true;

  try {
    const response = await fetch('/api/generate-emoji', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate emoji');
    }

    const data = await response.json();

    return {
      id: data.id || Date.now(),
      image_url: data.image_url || '',
      prompt: data.prompt || prompt,
      likes_count: data.likes_count || 0,
      isLoading: true
    };
  } finally {
    isGenerating = false;
  }
}

export async function fetchEmojis(): Promise<{ emojis: Emoji[] }> {
  const response = await fetch('/api/emojis');
  if (!response.ok) {
    throw new Error('Failed to fetch emojis');
  }
  return response.json();
}

export async function likeEmoji(emojiId: number) {
  const response = await fetch(`/api/emojis/${emojiId}/like`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to update emoji like status')
  }
  return response.json()
}