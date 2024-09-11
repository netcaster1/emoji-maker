import React from 'react';
import Image from 'next/image';
import { Heart, Download } from 'lucide-react';
import { Button } from './ui/button';
import { likeEmoji } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Emoji {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
}

function EmojiGrid({ emojis, setEmojis }: { emojis: Emoji[], setEmojis: React.Dispatch<React.SetStateAction<Emoji[]>> }) {
  const handleLike = async (emojiId: string) => {
    try {
      const response = await likeEmoji(emojiId);
      setEmojis(prevEmojis => prevEmojis.map(emoji => 
        emoji.id === emojiId 
          ? { ...emoji, likes_count: response.likes_count } 
          : emoji
      ));
    } catch (error) {
      console.error('Error liking/unliking emoji:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(`/api/download-emoji?url=${encodeURIComponent(imageUrl)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `emoji-${prompt}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading emoji:', error);
      toast.error('Failed to download emoji');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={emoji.image_url}
              alt={emoji.prompt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{emoji.prompt}</p>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(emoji.id)}
                className="flex items-center space-x-1"
              >
                <Heart className={`w-5 h-5 ${emoji.likes_count > 0 ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                <span>{emoji.likes_count}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(emoji.image_url, emoji.prompt)}
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmojiGrid;