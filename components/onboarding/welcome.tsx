'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface WelcomeProps {
  onNext: () => void
}

export function Welcome({ onNext }: WelcomeProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to ClipHub!</h2>
      <p className="text-lg text-gray-600 mb-8">
        Let’s personalize your experience. Choose your interests to see content you love.
      </p>
      <Button onClick={onNext} className="bg-blue-600 text-white hover:bg-blue-700">
        Get Started
      </Button>
    </div>
  )
}