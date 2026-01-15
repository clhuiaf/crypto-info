// Category: Market & portfolio
'use client'

import { useEffect, useState } from 'react'
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from '@/lib/watchlist'
import { fetchTopCryptos, fetchCoinById, type CryptoPrice } from '@/lib/api'
import { formatCurrency, formatPercentage, formatMarketCap } from '@/lib/utils'
import MarketTable from '@/components/MarketTable'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [cryptoData, setCryptoData] = useState<Map<string, CryptoPrice>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load watchlist and fetch current prices
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const items = getWatchlist()
        setWatchlist(items)

        if (items.length === 0) {
          setLoading(false)
          return
        }

        // Fetch current prices for all watchlist items
        // First try to get from top 250 list
        const allCryptos = await fetchTopCryptos(250, false) // false = client component
        const dataMap = new Map<string, CryptoPrice>()
        
        allCryptos.forEach((crypto) => {
          if (items.some((item) => item.id === crypto.id)) {
            dataMap.set(crypto.id, crypto)
          }
        })

        // For any items not found in top 250, fetch individually
        // Add small delays to avoid rate limiting
        const missingItems = items.filter((item) => !dataMap.has(item.id))
        if (missingItems.length > 0) {
          // Fetch with delays to avoid rate limiting
          for (let i = 0; i < missingItems.length; i++) {
            const item = missingItems[i]
            if (i > 0) {
              // Add 200ms delay between requests to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 200))
            }
            try {
              const coinData = await fetchCoinById(item.id, false)
              if (coinData) {
                dataMap.set(item.id, coinData)
              }
            } catch (err) {
              console.warn(`Failed to fetch data for ${item.name} (${item.id}):`, err)
              // Continue with other coins even if one fails
            }
          }
        }

        setCryptoData(dataMap)
        setLoading(false)
      } catch (err) {
        console.error('Error loading watchlist:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Failed to load watchlist: ${errorMessage}. Please try again later.`)
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [])

  const handleRemove = (coinId: string) => {
    removeFromWatchlist(coinId)
    setWatchlist((prev) => prev.filter((item) => item.id !== coinId))
    setCryptoData((prev) => {
      const next = new Map(prev)
      next.delete(coinId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-500">Loading watchlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          My Watchlist
        </h1>
        <p className="text-slate-600">
          Track your favorite cryptocurrencies
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-500 mb-4">
            Your watchlist is empty.
          </p>
          <p className="text-sm text-slate-400">
            Add coins from the Prices or New Coins pages to get started.
          </p>
        </div>
      ) : (
        // Build assets array in the same order as the watchlist, omitting missing market data
        (() => {
          const assets = watchlist
            .map((item) => cryptoData.get(item.id))
            .filter((a): a is CryptoPrice => !!a)

          return <MarketTable assets={assets} showActions onRemove={handleRemove} />
        })()
      )}
    </div>
  )
}
