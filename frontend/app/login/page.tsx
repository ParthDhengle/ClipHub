'use client'

import React from 'react'
import { UserLogin } from '@/components/user-login'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function LoginPage() {
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