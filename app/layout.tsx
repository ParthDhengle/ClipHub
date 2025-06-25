'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AuthProvider } from '@/lib/auth-context' // Import AuthProvider

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider> {/* Add AuthProvider here */}
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      const protectedRoutes = ['/upload', '/dashboard']
      const isProtectedRoute = protectedRoutes.includes(pathname)
      if (isProtectedRoute && !user) {
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return <>{children}</>
}