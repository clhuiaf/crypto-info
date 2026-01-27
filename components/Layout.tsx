 'use client'
import { ReactNode } from 'react'
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

      {/* Footer disclaimer — place inside the blue rounded frame and use the same white inner card as About page */}
      <div className="pb-8">
        <PageShell>
          <section className="rounded-3xl bg-[var(--brand-color,#2563eb)] p-6">
            <div className="rounded-2xl bg-white shadow-sm p-6">
              <FooterDisclaimer />
            </div>
          </section>
        </PageShell>
      </div>
    </div>
  )
}