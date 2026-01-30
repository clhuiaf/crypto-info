 'use client'
import { ReactNode } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import FooterDisclaimer from '@/components/FooterDisclaimer'
import PageShell from '@/components/PageShell'

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
      <div className="w-full border-b bg-white">
        <div className="w-full py-3">
          <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: '970/90' }}>
            <img
              src="/banners/square-ad-rec-mcm.jpg"
              alt="Top advertisement"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      {children}

      {/* Footer disclaimer — place inside the blue rounded frame and use the same white inner card as About page */}
      <div className="pb-8">
        <PageShell>
          <section className="brand-frame">
            <div className="brand-inner">
              <FooterDisclaimer />
            </div>
          </section>
        </PageShell>
      </div>
    </div>
  )
}