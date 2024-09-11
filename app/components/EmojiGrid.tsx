import React from 'react';
import Image from 'next/image';

interface Emoji {
  id: string;
  image_url: string;
  prompt: string;
}

function EmojiGrid({ emojis }: { emojis: Emoji[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {emojis.map((emoji) => (
        <div key={emoji.id} className="relative group">
          <div className="aspect-square relative">
            <Image
              src={emoji.image_url}
              alt={emoji.prompt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-lg"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end p-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Download and like buttons here */}
          </div>
          <div className="mt-2 text-center bg-white p-2 rounded">
            <p className="text-sm font-medium text-black">{emoji.prompt}</p>
            <span className="text-red-500 text-xl block mt-1">♥</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmojiGrid;