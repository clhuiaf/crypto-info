'use client'

import Image from 'next/image'
import { CryptoPrice } from '@/lib/api'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '@/lib/utils'
import { isInWatchlist, toggleWatchlist, type WatchlistItem } from '@/lib/watchlist'
import { useToast } from '@/lib/useToast'

interface CryptoRowProps {
  crypto: CryptoPrice
  index: number
  isLast?: boolean
  action?: ReactNode
}

export default function CryptoRow({ crypto, index, isLast = false, action }: CryptoRowProps) {
  const [isInWatchlistState, setIsInWatchlistState] = useState(() => isInWatchlist(crypto.id))
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number; placement: 'top' | 'bottom' }>({
    left: 0,
    top: 0,
    placement: 'top'
  })
  const { addToast } = useToast()

  useEffect(() => {
    // Hide tooltip on scroll to avoid stale position
    const onScroll = () => setShowTooltip(false)
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [])

  const getChangeColor = (change: number | null | undefined) => {
    if (change === null || change === undefined) return 'text-slate-500'
    return change >= 0 ? 'text-emerald-500' : 'text-red-500'
  }

  const getTrendText = (change7d: number | null | undefined) => {
    if (change7d === null || change7d === undefined) return 'N/A'
    if (change7d > 5) return 'Strong Up'
    if (change7d > 0) return 'Uptrend'
    if (change7d > -5) return 'Flat'
    return 'Downtrend'
  }

  const handleWatchlistToggle = () => {
    const watchlistItem: WatchlistItem = {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name
    }

    const wasAdded = toggleWatchlist(watchlistItem)
    setIsInWatchlistState(wasAdded)

    if (wasAdded) {
      addToast(`Added ${crypto.name} to Watchlist`)
    }
  }

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "fill-blue-600 text-blue-600" : "text-slate-400"}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )

  const starIcon = <StarIcon filled={isInWatchlistState} />

  const updateTooltipPositionFromRect = (rect: DOMRect, preferred: 'top' | 'bottom' = 'top') => {
    const centerX = Math.min(Math.max(rect.left + rect.width / 2, 8), window.innerWidth - 8)
    let top = rect.top - 8
    let placement: 'top' | 'bottom' = 'top'
    if (preferred === 'bottom' || rect.top < 48) {
      top = rect.bottom + 8
      placement = 'bottom'
    }
    setTooltipPos({ left: centerX, top, placement })
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateTooltipPositionFromRect(e.currentTarget.getBoundingClientRect())
    setShowTooltip(true)
  }
  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <>
      <article
        className={[
          // Mobile sizing/tap targets
          'min-h-16 px-4 py-3',
          // Desktop grid stays exactly as before
          'md:grid md:grid-cols-[32px,40px,minmax(0,2.4fr),minmax(120px,1fr),80px,80px,80px,minmax(150px,1.1fr),minmax(150px,1.1fr)] md:items-center md:gap-3 md:px-6 md:py-4',
          isLast ? 'rounded-b-xl' : ''
        ].join(' ')}
      >
      {/* Mobile layout */}
        <div className="grid grid-cols-[auto,minmax(0,1fr),auto] items-center gap-3 md:hidden">
          <button
            onClick={handleWatchlistToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-pressed={isInWatchlistState}
            aria-label={isInWatchlistState ? `Remove ${crypto.name} from watchlist` : `Add ${crypto.name} to watchlist`}
          >
            {starIcon}
          </button>

          <div className="min-w-0 flex items-center gap-3">
            <div className="text-sm text-slate-500 w-8 tabular-nums">
              {index + 1}
            </div>

            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="h-7 w-7 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex items-center justify-between w-full">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {crypto.name}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 truncate">
                    {crypto.symbol}
                  </div>
                </div>
                {action ? <div className="ml-3 flex-shrink-0">{action}</div> : null}
              </div>
            </div>
          </div>

          <div className="text-right min-w-[96px]">
            <div className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
              {formatCurrency(crypto.current_price)}
            </div>
            <div className={`text-sm font-semibold tabular-nums whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_24h)}`}>
              {formatPercentage(crypto.price_change_percentage_24h)}
            </div>
          </div>
        </div>

      {/* Desktop grid layout */}
      <div className="hidden md:flex md:items-center md:justify-center">
        <button
          onClick={handleWatchlistToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-8 h-8 rounded-md hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          aria-pressed={isInWatchlistState}
          aria-label={isInWatchlistState ? `Remove ${crypto.name} from watchlist` : `Add ${crypto.name} to watchlist`}
        >
          {starIcon}
        </button>
      </div>

      <div className="hidden md:block text-sm text-slate-500">
        {index + 1}
      </div>

      <div className="hidden md:flex md:items-center gap-3 min-w-0 before:content-[''] after:content-['']">
        <Image
          src={crypto.image}
          alt={crypto.name}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full"
        />
        <div className="min-w-0 flex items-center justify-between w-full">
          <div>
            <p className="text-sm font-medium text-slate-900 whitespace-normal break-words">
              {crypto.name}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {crypto.symbol}
            </p>
          </div>
          {action ? <div className="ml-3 flex-shrink-0">{action}</div> : null}
        </div>
      </div>

      <div className="hidden md:block text-sm font-medium text-slate-900 text-right whitespace-nowrap">
        {formatCurrency(crypto.current_price)}
      </div>

      <div className={`hidden md:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_1h)}`}>
        {formatPercentage(crypto.price_change_percentage_1h)}
      </div>

      <div className={`hidden md:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_24h)}`}>
        {formatPercentage(crypto.price_change_percentage_24h)}
      </div>

      <div className={`hidden md:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_7d)}`}>
        {formatPercentage(crypto.price_change_percentage_7d)}
      </div>

      <div className="hidden md:block text-sm text-slate-500 text-right whitespace-nowrap">
        {formatVolume(crypto.total_volume)}
      </div>

      <div className="hidden md:block text-sm text-slate-500 text-right whitespace-nowrap">
        {formatMarketCap(crypto.market_cap)}
      </div>

      </article>

      {/* Tooltip rendered as fixed element so it's not clipped by parent overflow */}
      {showTooltip && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPos.left}px`,
            top: `${tooltipPos.top}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
          className="px-2 py-1 bg-slate-900 text-white text-xs rounded max-w-xs break-words"
        >
          {isInWatchlistState ? 'Remove from watchlist' : 'Add to watchlist'}
        </div>
      )}
    </>
  )
}