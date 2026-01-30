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