'use client';

import { useEffect, useState } from 'react';
import { type CryptoPrice } from '@/lib/api'
import CryptoRow from '@/components/CryptoRow'
import MarketHeaderRow from '@/components/MarketHeaderRow'
import PageShell from '@/components/PageShell'
import PageToolbar from '@/components/PageToolbar'
import { useMemo } from 'react'

interface MarketData {
  data: CryptoPrice[];
  stale: boolean;
  lastUpdated: number;
  message?: string;
}

interface PricesClientProps {
  initialPrices: CryptoPrice[]
}

export default function PricesClient({ initialPrices }: PricesClientProps) {
  const [market, setMarket] = useState<MarketData | null>(initialPrices.length > 0 ? {
    data: initialPrices,
    stale: true, // Assume stale since this is from server cache
    lastUpdated: Date.now(),
    message: 'Data loaded from cache'
  } : null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(initialPrices.length === 0);

  const fetchMarkets = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const res = await fetch('/api/prices');

      if (!res.ok) {
        throw new Error(`Failed to load market data: ${res.status}`);
      }

      const data = await res.json();
      setMarket(data);
      setError(null);
      setLoading(false);

      // Show appropriate messages based on data state
      if (data.fetchAttempted && (!data.data || data.data.length === 0)) {
        setError('Market data is loading. Please wait a moment.');
      }
    } catch (err) {
      setError('Unable to load market data. The service may be temporarily unavailable.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we have initial data, fetch updates in background without loading state
    // If no initial data, show loading state while fetching
    fetchMarkets(initialPrices.length === 0);

    // Poll every 30 seconds for updates (background updates, no loading state)
    const interval = setInterval(() => fetchMarkets(false), 30000);
    return () => clearInterval(interval);
  }, [initialPrices.length]);

  // Use market data if available, otherwise fall back to initial server data
  const displayPrices = market?.data?.length ? market.data : initialPrices;

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
        <span className="text-xs text-slate-500" suppressHydrationWarning>
          {market && market.data.length > 0
            ? `Last updated: ${new Date(market.lastUpdated).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}${market.stale ? ' (Data ~2min old)' : ''}`
            : 'Loading data...'
          }
        </span>
      }
    />
  )

  // derive the displayed assets from raw `cryptos`, applying the asset filter first,
  // then the selected view sorting. All of this is client-side and memoized.
  const displayAssets = useMemo(() => {
    if (!displayPrices || displayPrices.length === 0) return []

    let list = [...displayPrices]

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
  }, [displayPrices, assetFilter, view])

  const sidebarAd = (
    <div className="h-72 w-full rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
      <img
        src="/banners/square-ad-sq-mcm.jpg"
        alt="Sidebar advertisement"
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  )

  const tableSection = loading && !market ? (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-slate-200 rounded-lg"></div>
      ))}
    </div>
  ) : error && !market ? (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-yellow-800">{error}</p>
    </div>
  ) : !market?.data || market.data.length === 0 ? (
    <div className="p-4 text-center">
      <p className="text-slate-600">Loading market data...</p>
      <p className="text-sm text-slate-500 mt-2">Data will appear shortly.</p>
    </div>
  ) : (
    <div className="overflow-hidden">
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
  )

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel */}
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header>
          <h1 className="text-3xl font-semibold text-white">
            Live Market Overview
          </h1>
          <p className="mt-1 text-sm text-slate-200">
            Real-time cryptocurrency prices and market data
          </p>
        </header>

        {/* Card 1: filters bar */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          {toolbar}  {/* existing filters + last-updated; remove its old outer card */}
        </div>

        {/* Card 2 + 3: table + sidebar ad */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Card 2: table */}
          <div className="flex-1 rounded-2xl bg-white shadow-sm p-4">
            {tableSection}   {/* existing table content without extra outer card */}
          </div>

          {/* Card 3: sidebar ad */}
          <aside className="w-full lg:w-72 shrink-0 rounded-2xl bg-white shadow-sm p-4">
            {sidebarAd}      {/* existing ad content */}
          </aside>
        </div>
        </section>
      </PageShell>
    </div>
  )
}