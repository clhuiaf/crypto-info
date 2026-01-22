'use client'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import FooterDisclaimer from '@/components/FooterDisclaimer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
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

      {/* Dark background wrapper for content area */}
      <div className="bg-slate-800 min-h-screen">
        {/* White rounded content frame */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] rounded-3xl bg-white shadow-lg overflow-hidden p-6 sm:p-8">
            {/* Main Content Area with optional Right Sidebar */}
            <div className="flex">
              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Right Sidebar Ad - Only visible on lg+ screens */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-20 p-4">
                  <div className="h-72 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img
                      src="/banners/square-ad-sq-mcm.jpg"
                      alt="Sidebar advertisement"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Separate white rounded frame for footer disclaimer */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mx-auto max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] rounded-3xl bg-white shadow-lg overflow-hidden p-6 sm:p-8">
            <FooterDisclaimer />
          </div>
        </div>
      </div>
    </>
  )
}