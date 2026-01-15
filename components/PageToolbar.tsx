'use client'

import { ReactNode } from 'react'

interface PageToolbarProps {
  left?: ReactNode
  right?: ReactNode
  className?: string
}

export default function PageToolbar({ left, right, className = '' }: PageToolbarProps) {
  return (
    <div className={`w-full rounded-xl border border-slate-100 bg-white shadow-sm px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {left && (
        <div className="flex flex-wrap items-center gap-3">
          {left}
        </div>
      )}

      {right && (
        <div className="flex items-center gap-3">
          {right}
        </div>
      )}
    </div>
  )
}