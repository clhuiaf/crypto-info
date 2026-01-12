// Category: Market & portfolio
'use client'

import { useEffect, useState } from 'react'
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from '@/lib/watchlist'
import { fetchTopCryptos, fetchCoinById, type CryptoPrice } from '@/lib/api'
import { formatCurrency, formatPercentage, formatMarketCap } from '@/lib/utils'

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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Coin
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {watchlist.map((item) => {
                  const crypto = cryptoData.get(item.id)
                  const changeColor =
                    crypto && crypto.price_change_percentage_24h >= 0
                      ? 'text-green-600'
                      : 'text-red-600'

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {crypto?.image && (
                            <img
                              src={crypto.image}
                              alt={item.name}
                              className="h-8 w-8 rounded-full mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-slate-500 uppercase">
                              {item.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                        {crypto ? formatCurrency(crypto.current_price) : 'N/A'}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${changeColor}`}
                      >
                        {crypto
                          ? formatPercentage(crypto.price_change_percentage_24h)
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                        {crypto ? formatMarketCap(crypto.market_cap) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          aria-label="Remove from watchlist"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
