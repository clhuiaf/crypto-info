'use client'

import { useEffect } from 'react'
import { startPriceUpdater } from '@/lib/priceUpdater'

/**
 * Client component that initializes the price updater on app start
 * This ensures the background polling starts when the app loads
 */
export default function PriceUpdaterInitializer() {
  useEffect(() => {
    // Start the price updater when the app initializes
    startPriceUpdater()
  }, [])

  // This component doesn't render anything
  return null
}