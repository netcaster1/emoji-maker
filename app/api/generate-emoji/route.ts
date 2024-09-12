import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Replicate from "replicate"
import { uploadEmojiImage, addEmojiToDatabase } from '@/lib/emoji'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prompt } = await req.json()
    console.log('Starting emoji generation with prompt:', prompt)
    // Generate emoji using Replicate
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: prompt,
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 50
        }
      }
    )
    console.log('Emoji generation successful, output:', output)
    
    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error('Invalid output from emoji generation')
    }

    const OutputUrl = output[0]

    if (typeof OutputUrl !== 'string') {
      throw new Error('Invalid image URL in output')
    }

    // Download the image from the URL
    const response = await fetch(OutputUrl)
    if (!response.ok) {
      console.error('Emoji generation failed:', await response.text())
      throw new Error(`Emoji generation failed: ${response.statusText}`)
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase storage
    const fileName = `${userId}_${Date.now()}.png`
    const imageUrl = await uploadEmojiImage(buffer, fileName)

    // Add to emojis table
    const emoji = await addEmojiToDatabase(imageUrl, prompt, userId)

    return NextResponse.json({ success: true, emoji })
  } catch (error) {
    console.error('Error generating emoji:', error)
    return NextResponse.json({ error: 'Failed to generate emoji' }, { status: 500 })
  }
}

export const runtime = 'edge';
export const maxDuration = 60;