'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserLogin } from '@/components/user-login'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      // Check if user is new (recently created account)
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime
      if (isNewUser) {
        router.push('/onboarding')
      } else {
        router.push('/')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <UserLogin />
      </main>
      <Footer />
    </div>
  )
}