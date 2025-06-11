'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Welcome } from '@/components/onboarding/welcome'
import { InterestSelection } from '@/components/onboarding/interest-selection'
import { Preferences } from '@/components/onboarding/preferences'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push('/')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {step === 1 && <Welcome onNext={handleNext} />}
        {step === 2 && <InterestSelection onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Preferences onNext={handleNext} onBack={handleBack} />}
      </main>
      <Footer />
    </div>
  )
}