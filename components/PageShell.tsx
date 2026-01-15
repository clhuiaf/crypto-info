'use client'

import { ReactNode } from 'react'

interface PageShellProps {
  // legacy title/subtitle/toolbar kept for backwards compatibility
  title?: string
  subtitle?: string
  toolbar?: ReactNode
  // new hero slot (full-bleed allowed)
  hero?: ReactNode
  children: ReactNode
}

// Reusable page shell used across Prices, News and Guides.
// Wraps content in a centered container matching the Prices page:
// mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16
export default function PageShell({ title, subtitle, toolbar, hero, children }: PageShellProps) {
  return (
    <>
      {/* hero can be a full-bleed component (e.g., gradient) */}
      {hero ? (
        <div>{hero}</div>
      ) : title ? (
        <div className="bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-0">
            <div className="pt-6 pb-2">
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                {title}
              </h1>
              {subtitle ? <p className="mt-2 text-slate-500 max-w-2xl">{subtitle}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* toolbar sits below the hero/title */}
        {toolbar ? <div className="mt-6">{toolbar}</div> : null}

        {/* main content */}
        <main className="mt-8">{children}</main>
      </div>
    </>
  )
}