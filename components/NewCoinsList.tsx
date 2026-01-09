'use client'

import { NewCoin } from '@/lib/api'
import { formatCurrency, formatMarketCap, formatDate } from '@/lib/utils'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NewCoinsListProps {
  coins: NewCoin[]
}

export default function NewCoinsList({ coins }: NewCoinsListProps) {
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const ids = new Set<string>()
    coins.forEach((coin) => {
      if (isInWatchlist(coin.id)) {
        ids.add(coin.id)
      }
    })
    setWatchlistIds(ids)
  }, [coins])

  const handleWatchlistToggle = (coin: NewCoin) => {
    const isWatched = watchlistIds.has(coin.id)
    
    if (isWatched) {
      removeFromWatchlist(coin.id)
      setWatchlistIds((prev) => {
        const next = new Set(prev)
        next.delete(coin.id)
        return next
      })
    } else {
      addToWatchlist({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
      })
      setWatchlistIds((prev) => new Set(prev).add(coin.id))
    }
  }

  if (coins.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No new coins available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {coins.map((coin) => {
        const isWatched = watchlistIds.has(coin.id)
        const platforms = coin.platforms ? Object.keys(coin.platforms).slice(0, 3) : [] // Show top 3 platforms

        return (
          <div
            key={coin.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <Link
                href={`/assets/${coin.symbol.toUpperCase()}`}
                className="hover:underline"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                    {coin.name}
                  </h3>
                  <p className="text-sm text-slate-500 uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleWatchlistToggle(coin)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isWatched
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isWatched ? '✓' : '+'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Price:</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(coin.current_price)}
                </span>
              </div>

              {coin.market_cap && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Market Cap:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatMarketCap(coin.market_cap)}
                  </span>
                </div>
              )}

              {coin.fully_diluted_valuation && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">FDV:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatMarketCap(coin.fully_diluted_valuation)}
                  </span>
                </div>
              )}

              {coin.listing_date && coin.listing_date !== 'N/A' && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Listing Date:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {formatDate(coin.listing_date)}
                  </span>
                </div>
              )}

              {platforms.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Platforms:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {platforms.map((platform) => (
                      <span
                        key={platform}
                        className="pill-tab bg-slate-50 border-slate-200 text-[11px]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
