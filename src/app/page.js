'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading-container">
        <div className="loading-spinner" />
        <h3 className="loading-title">Redirecting to Dashboard...</h3>
      </div>
    </div>
  )
}