'use client'

import { useState } from 'react'

interface SponsoredPlacementNoticeProps {
  bannerUrl?: string
  websiteUrl?: string
  label?: string
  className?: string
}

export default function SponsoredPlacementNotice({ bannerUrl, websiteUrl, label = 'Sponsored placement – may offer referral bonuses or promotions.', className = '' }: SponsoredPlacementNoticeProps) {
  const [bannerError, setBannerError] = useState(false)

  if (bannerUrl && !bannerError) {
    return (
      <div className={`mb-4 relative rounded-xl overflow-hidden border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm ${className}`}>
        <div className="absolute top-2 left-2 z-10">
          <span className="badge-soft bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-1">
            Ad
          </span>
        </div>
        <a
          href={websiteUrl || '#'}
          target="_blank"
          rel="noreferrer sponsored"
          className="block w-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="relative w-full" style={{ minHeight: '90px' }}>
            <img
              src={bannerUrl}
              alt={label}
              className="w-full h-auto object-cover block"
              style={{ minHeight: '90px', display: 'block', width: '100%' }}
              loading="lazy"
              onError={(e) => {
                try {
                  setBannerError(true)
                  e.currentTarget.style.display = 'none'
                } catch (err) {
                  // ignore
                }
              }}
            />
          </div>
        </a>
        <p className="absolute bottom-2 right-2 text-[10px] font-medium text-amber-800 bg-amber-200/90 px-2 py-1 rounded border border-amber-300 backdrop-blur-sm">
          Sponsored
        </p>
      </div>
    )
  }

  return (
    <div className={`mb-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="badge-soft bg-amber-100 text-amber-800 border border-amber-200">Ad</span>
        <p className="text-xs text-amber-900">{label}</p>
      </div>
    </div>
  )
}

