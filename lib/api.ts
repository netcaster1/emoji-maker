export async function generateEmoji(prompt: string) {
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

  return response.json()
}

export async function fetchEmojis() {
  const response = await fetch('/api/emojis')
  if (!response.ok) {
    throw new Error('Failed to fetch emojis')
  }
  return response.json()
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