import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="emoji.png"',
        'Content-Type': 'image/png',
      },
    })
  } catch (error) {
    console.error('Error downloading emoji:', error)
    return NextResponse.json({ error: 'Failed to download emoji' }, { status: 500 })
  }
}