'use client'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import FooterDisclaimer from '@/components/FooterDisclaimer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Top Horizontal Ad Banner */}
      <div className="flex justify-center border-b bg-white">
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="h-24 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center">
            <img
              src="/banners/square-ad-rec-mcm.jpg"
              alt="Top advertisement"
              className="h-full w-full object-cover rounded-md"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      {children}

      {/* Separate dark-blue rounded frame for footer disclaimer */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mx-auto max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] rounded-2xl bg-white border border-gray-200 px-4 py-4 text-xs text-gray-500">
          <FooterDisclaimer />
        </div>
      </div>
    </div>
  )
}