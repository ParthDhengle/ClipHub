import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { auth } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClipHub - Free Stock Photos, Videos & Music',
  description: 'The best free stock photos, royalty free images & videos shared by creators.',
  keywords: ['stock photos', 'free images', 'royalty free', 'stock videos', 'creators', 'free music'],
  authors: [{ name: 'ClipHub Team' }],
  viewport: 'width=device-width, initial-scale=1',
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthWrapper>{children}</AuthWrapper>
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