'use client'

import { useState, useEffect, Suspense } from 'react'
import { fetchHistoricalData } from '@/lib/api'
import dynamic from 'next/dynamic'

// Dynamically import the chart component to reduce initial bundle size
const PriceChart = dynamic(() => import('@/components/PriceChart'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <p className="text-slate-500">Loading chart...</p>
    </div>
  ),
  ssr: false // Disable SSR for chart component to avoid hydration issues
})

type Timeframe = '1' | '7' | '30' | '90' | '365'

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
  { value: '365', label: '1Y' },
]

export default function ChartsPage() {
  const [selectedCoin, setSelectedCoin] = useState<'bitcoin' | 'ethereum'>('bitcoin')
  const [timeframe, setTimeframe] = useState<Timeframe>('7')
  const [chartData, setChartData] = useState<{ time: number; price: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchHistoricalData(selectedCoin, Number(timeframe), false) // false = client component
        setChartData(data)
      } catch (err) {
        console.error('Error loading chart data:', err)
        setError('Failed to load chart data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [selectedCoin, timeframe])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Price Charts
        </h1>
        <p className="text-slate-600">
          Historical price data for Bitcoin and Ethereum
        </p>
      </div>

      {/* Coin selector */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCoin('bitcoin')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedCoin === 'bitcoin'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Bitcoin (BTC)
          </button>
          <button
            onClick={() => setSelectedCoin('ethereum')}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              selectedCoin === 'ethereum'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Ethereum (ETH)
          </button>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                timeframe === tf.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-500">Loading chart data...</p>
        </div>
      ) : (
        <Suspense fallback={
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-slate-500">Loading chart...</p>
          </div>
        }>
          <PriceChart data={chartData} coinName={selectedCoin === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} />
        </Suspense>
      )}
    </div>
  )
}
