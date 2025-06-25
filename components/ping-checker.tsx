'use client'

import { useEffect } from 'react'
import { pingBackend } from '@/lib/api'

export default function PingChecker() {
  useEffect(() => {
    pingBackend()
  }, [])

  return null
}
