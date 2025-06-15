'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserLogin } from '@/components/user-login'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Add console logs for debugging
  console.log('LoginPage - user:', user)
  console.log('LoginPage - loading:', loading)
  console.log('LoginPage - user?.metadata:', user?.metadata)

  useEffect(() => {
    console.log('LoginPage useEffect triggered', { user, loading })
    
    if (user && !loading) {
      console.log('User exists and not loading, checking if new user...')
      
      try {
        const isNewUser = user.metadata?.creationTime === user.metadata?.lastSignInTime
        console.log('isNewUser:', isNewUser)
        
        if (isNewUser) {
          console.log('Redirecting to onboarding...')
          router.push('/onboarding')
        } else {
          console.log('Redirecting to home...')
          router.push('/')
        }
      } catch (error) {
        console.error('Error in redirect logic:', error)
      }
    }
  }, [user, loading, router])

  console.log('LoginPage rendering, loading:', loading)

  if (loading) {
    console.log('Showing loading state')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  // If user exists, don't render the login form (should redirect)
  if (user) {
    console.log('User exists, should redirect soon...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering login form')
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