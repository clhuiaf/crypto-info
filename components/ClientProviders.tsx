'use client'

import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import PriceUpdaterInitializer from '@/components/PriceUpdaterInitializer'
import { ToastProvider } from '@/lib/useToast'
import { ToastWrapper } from '@/components/ToastWrapper'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      <PriceUpdaterInitializer />
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <ToastWrapper />
    </ToastProvider>
  )
}