'use client'

import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import BackgroundUpdaterInitializer from '@/components/BackgroundUpdaterInitializer'
import { ToastProvider } from '@/lib/useToast'
import { ToastWrapper } from '@/components/ToastWrapper'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ToastProvider>
      <BackgroundUpdaterInitializer />
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <ToastWrapper />
    </ToastProvider>
  )
}