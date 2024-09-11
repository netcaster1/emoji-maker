import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserExists, createUser } from '@/lib/user'

export async function POST() {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userExists = await checkUserExists(userId)

    if (!userExists) {
      await createUser(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in auth route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}