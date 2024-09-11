"use client"

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()

  useEffect(() => {
    if (isLoaded && userId) {
      fetch('/api/auth', { method: 'POST' })
        .then(res => res.json())
        .catch(error => console.error('Error syncing user:', error))
    }
  }, [isLoaded, userId])

  return <>{children}</>
}