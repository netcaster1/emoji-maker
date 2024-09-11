import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/solid'
import Image from 'next/image'

function AIChatHistory() {
  const [images, setImages] = useState([
    { url: '...', prompt: 'A beautiful sunset', liked: false },
    { url: '...', prompt: 'A cute puppy', liked: true },
    // ... more images
  ])

  const toggleLike = (index: number) => {
    setImages(prevImages => 
      prevImages.map((img, i) => 
        i === index ? { ...img, liked: !img.liked } : img
      )
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6 mt-4">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col">
          <div className="relative mb-2">
            <Image
              src={image.url}
              alt={`Generated image ${index + 1}`}
              width={256}
              height={256}
              className="rounded-lg"
            />
            <button
              onClick={() => toggleLike(index)}
              className="absolute top-2 right-2 bg-white bg-opacity-50 rounded-full p-1"
            >
              <HeartIcon 
                className={`w-6 h-6 ${image.liked ? 'text-red-500' : 'text-gray-600'}`} 
              />
            </button>
          </div>
          <p className="text-sm text-gray-600 break-words">
            {image.prompt}
          </p>
        </div>
      ))}
    </div>
  )
}