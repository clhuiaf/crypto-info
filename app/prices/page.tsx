// Category: Market & portfolio
'use client'

import { useState, useEffect } from 'react'
import { fetchTopCryptos, type CryptoPrice } from '@/lib/api'
import CryptoRow from '@/components/CryptoRow'
import MarketHeaderRow from '@/components/MarketHeaderRow'
import PageShell from '@/components/PageShell'
import PageToolbar from '@/components/PageToolbar'
import { useMemo } from 'react'

export default function PricesPage() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Filters / view state
  const [assetFilter, setAssetFilter] = useState<'all' | 'highlights'>('all')
  const VIEW = {
    ALL: 'all',
    GAINERS: 'gainers',
    LOSERS: 'losers',
    VOLUME: 'volume',
    MARKET_CAP: 'marketcap',
  } as const
  type ViewKey = (typeof VIEW)[keyof typeof VIEW]
  const [view, setView] = useState<ViewKey>(VIEW.ALL)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTopCryptos(50, false) // false = client component
        setCryptos(data)
      } catch (err) {
        setError('Failed to load cryptocurrency prices. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toolbar = (
    <PageToolbar
      left={
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center space-x-3">
            <label htmlFor="view" className="sr-only">View</label>
            <select
              id="view"
              value={view}
              onChange={(e) => setView(e.target.value as ViewKey)}
              className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={VIEW.ALL}>All assets</option>
              <option value={VIEW.GAINERS}>Top gainers (24h)</option>
              <option value={VIEW.LOSERS}>Top losers (24h)</option>
              <option value={VIEW.VOLUME}>Highest volume (24h)</option>
              <option value={VIEW.MARKET_CAP}>Largest market cap</option>
            </select>
          </div>

          <div>
            <label htmlFor="assetFilter" className="sr-only">Asset filter</label>
            <select
              id="assetFilter"
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value as 'all' | 'highlights')}
              className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All assets</option>
              <option value="highlights">Highlights</option>
            </select>
          </div>
        </div>
      }
      right={
        <span className="text-xs text-slate-500">Live data · Updated every minute</span>
      }
    />
  )

  // derive the displayed assets from raw `cryptos`, applying the asset filter first,
  // then the selected view sorting. All of this is client-side and memoized.
  const displayAssets = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return []

    let list = [...cryptos]

    // Apply asset filter first
    if (assetFilter === 'highlights') {
      // simple heuristic: highlights are large-cap assets (> $1B)
      list = list.filter((c) => (c.market_cap ?? 0) > 1_000_000_000)
    }

    // Apply view sorting
    switch (view) {
      case VIEW.GAINERS:
        return list
          .slice()
          .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
          .slice(0, 50)
      case VIEW.LOSERS:
        return list
          .slice()
          .sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0))
          .slice(0, 50)
      case VIEW.VOLUME:
        return list
          .slice()
          .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
          .slice(0, 50)
      case VIEW.MARKET_CAP:
        return list
          .slice()
          .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0))
          .slice(0, 50)
      case VIEW.ALL:
      default:
        return list
    }
  }, [cryptos, assetFilter, view])

  const mainContent = error ? (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800">{error}</p>
    </div>
  ) : loading ? (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-slate-200 rounded-lg"></div>
      ))}
    </div>
  ) : (
    <section className="mt-6">
      <div className="mx-auto overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <MarketHeaderRow />
        <div className="space-y-0">
          {displayAssets.map((crypto, index) => (
            <CryptoRow
              key={crypto.id}
              crypto={crypto}
              index={index}
              isLast={index === displayAssets.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )

  return (
    <PageShell
      title="Live Market Overview"
      subtitle="Real-time cryptocurrency prices and market data"
      toolbar={toolbar}
    >
      {mainContent}
    </PageShell>
  )
}
