'use client'

import { ReactNode } from 'react'
import Layout from '@/components/Layout'
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
      <Layout>
        {children}
      </Layout>
      <ToastWrapper />
    </ToastProvider>
  )
}