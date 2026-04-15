'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'   // ✅ IMPORT NAVBAR

export function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [router])

  // Prevent UI flicker before auth check
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking authentication...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ✅ NAVBAR ADDED HERE */}
      <Navbar />

      {/* ✅ PAGE CONTENT */}
      <main>
        {children}
      </main>
    </div>
  )
}
