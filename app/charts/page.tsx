// Category: Market & portfolio
'use client'

import { useState, useEffect, Suspense } from 'react'
import { fetchOHLCVData } from '@/lib/api'
import dynamic from 'next/dynamic'
import AssetSelector from '@/components/AssetSelector'
import TimeframeSelector from '@/components/TimeframeSelector'
import ChartControls from '@/components/ChartControls'
import MoreIndicatorsDrawer from '@/components/MoreIndicatorsDrawer'
import { OHLCVPoint, ChartType, Timeframe, OverlayType, IndicatorType } from '@/types/chart'
import { getAssetBySymbol } from '@/data/assets'
import { fetchTopCryptos } from '@/lib/api'
import { CryptoPrice } from '@/lib/api'
import tokenIcons from '@/config/tokenIcons'

// Dynamically import the ProChart component to reduce initial bundle size
const ProChart = dynamic(() => import('@/components/ProChart'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <p className="text-slate-500">Loading advanced chart...</p>
    </div>
  ),
  ssr: false // Disable SSR for chart component to avoid hydration issues
})

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC')
  const [timeframe, setTimeframe] = useState<Timeframe>('1D')
  const [chartType, setChartType] = useState<ChartType>('candlestick')
  const [overlays, setOverlays] = useState<OverlayType[]>(() => {
    try { return JSON.parse(localStorage.getItem('chart-overlays') || 'null') || ['sma20'] } catch { return ['sma20'] }
  })
  const [indicators, setIndicators] = useState<IndicatorKey[]>(() => {
    try { return JSON.parse(localStorage.getItem('chart-indicators') || 'null') || ['volume'] } catch { return ['volume'] }
  })

  const [chartData, setChartData] = useState<OHLCVPoint[]>([])
  const [cryptoData, setCryptoData] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const selectedAsset = getAssetBySymbol(selectedSymbol)
  // Find real crypto data for icons
  const selectedCrypto = cryptoData.find(crypto => crypto.symbol.toUpperCase() === selectedSymbol.toUpperCase())

  // Fetch crypto data for icons and prices
  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        const data = await fetchTopCryptos(100, false) // Get top 100 cryptos
        setCryptoData(data)
      } catch (err) {
        console.error('Error loading crypto data:', err)
        // Don't set error state as this is secondary data
      }
    }
    loadCryptoData()
  }, [])

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Load main asset data
        const mainData = await fetchOHLCVData(
          selectedSymbol.toLowerCase(),
          timeframe,
          false
        )
        setChartData(mainData)

    // No comparison data; only load main asset OHLCV
      } catch (err) {
        console.error('Error loading chart data:', err)
        setError('Failed to load chart data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [selectedSymbol, timeframe])

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Chart
        </h1>
        <p className="text-slate-600">
          Advanced technical analysis tools for cryptocurrency trading
        </p>
      </div>

      {/* Main Controls Toolbar */}
      <div className="bg-white rounded-xl shadow p-5 border border-gray-200 mb-6">
        <div className="space-y-3">
          {/* Row 1: Asset + Timeframe */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <label className="text-sm font-medium text-gray-700 shrink-0">Asset</label>
              <AssetSelector
                selectedSymbol={selectedSymbol}
                onSymbolChange={handleSymbolChange}
                cryptoData={cryptoData}
              />
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <label className="text-sm font-medium text-gray-700 shrink-0">Timeframe</label>
              <TimeframeSelector
                selectedTimeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>
          </div>

          {/* Row 2: Chart type toggles */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Chart Type</span>
              <div className="ml-2">
                <ChartControls
                  chartType={chartType}
                  onChartTypeChange={(t) => { setChartType(t); localStorage.setItem('chart-type', JSON.stringify(t)) }}
                  overlays={overlays}
                  onOverlaysChange={(ov) => { setOverlays(ov); localStorage.setItem('chart-overlays', JSON.stringify(ov)) }}
                  indicators={indicators}
                  onIndicatorsChange={(inds) => { setIndicators(inds); localStorage.setItem('chart-indicators', JSON.stringify(inds)) }}
                  className="!p-0"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Overlays + Indicators + More link */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Overlays</span>
                <div className="flex gap-1">
                  {/* reuse ChartControls overlay buttons by rendering a small subset inline */}
                  <button onClick={() => { const next = overlays.includes('sma20') ? overlays.filter(x=>x!=='sma20') : [...overlays,'sma20']; setOverlays(next); localStorage.setItem('chart-overlays', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${overlays.includes('sma20') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'}`}>SMA 20</button>
                  <button onClick={() => { const next = overlays.includes('sma50') ? overlays.filter(x=>x!=='sma50') : [...overlays,'sma50']; setOverlays(next); localStorage.setItem('chart-overlays', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${overlays.includes('sma50') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'}`}>SMA 50</button>
                  <button onClick={() => { const next = overlays.includes('sma200') ? overlays.filter(x=>x!=='sma200') : [...overlays,'sma200']; setOverlays(next); localStorage.setItem('chart-overlays', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${overlays.includes('sma200') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'}`}>SMA 200</button>
                  <button onClick={() => { const next = overlays.includes('bbands') ? overlays.filter(x=>x!=='bbands') : [...overlays,'bbands']; setOverlays(next); localStorage.setItem('chart-overlays', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${overlays.includes('bbands') ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border'}`}>BBands (20,2)</button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Indicators</span>
                <div className="flex gap-1">
                  <button onClick={() => { const next = indicators.includes('rsi') ? indicators.filter(x=>x!=='rsi') : [...indicators,'rsi']; setIndicators(next); localStorage.setItem('chart-indicators', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${indicators.includes('rsi') ? 'bg-purple-100 text-purple-800' : 'bg-white text-gray-600 border'}`}>RSI (14)</button>
                  <button onClick={() => { const next = indicators.includes('macd') ? indicators.filter(x=>x!=='macd') : [...indicators,'macd']; setIndicators(next); localStorage.setItem('chart-indicators', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${indicators.includes('macd') ? 'bg-purple-100 text-purple-800' : 'bg-white text-gray-600 border'}`}>MACD</button>
                  <button onClick={() => { const next = indicators.includes('volume') ? indicators.filter(x=>x!=='volume') : [...indicators,'volume']; setIndicators(next); localStorage.setItem('chart-indicators', JSON.stringify(next)) }} className={`px-3 py-1 rounded-md text-xs font-medium ${indicators.includes('volume') ? 'bg-purple-100 text-purple-800' : 'bg-white text-gray-600 border'}`}>Volume</button>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-sm text-gray-500 mr-4">Advanced</div>
              <div>
                <MoreIndicatorsDrawer
                  enabledIndicators={indicators}
                  onChange={(inds) => { setIndicators(inds); localStorage.setItem('chart-indicators', JSON.stringify(inds)) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-slate-500">Loading chart data...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {/* Chart Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {tokenIcons[selectedSymbol.toUpperCase()] ? (
                <img
                  src={tokenIcons[selectedSymbol.toUpperCase()]}
                  alt={selectedAsset?.name || selectedSymbol}
                  className="h-8 w-8 rounded-full"
                />
              ) : selectedCrypto ? (
                <img
                  src={selectedCrypto.image}
                  alt={selectedCrypto.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  {selectedSymbol.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedAsset?.name || selectedSymbol} ({selectedSymbol})
                </h2>
                <p className="text-sm text-gray-500">
                  {timeframe} Chart
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <Suspense fallback={
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading advanced chart...</p>
            </div>
          }>
            <ProChart
              symbol={selectedSymbol}
              data={chartData}
              timeframe={timeframe}
              chartType={chartType}
              overlays={overlays}
              indicators={indicators}
              height={600}
            />
          </Suspense>
        </div>
      )}

      {/* Feature Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Chart Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800">
          <div>
            <strong>Chart Types:</strong> Line, Candlestick, OHLC with dedicated volume scale
          </div>
          <div>
            <strong>Timeframes:</strong> 1m to 1M with persistence
          </div>
          <div>
            <strong>Overlays:</strong> SMA 20/50/200 moving averages
          </div>
          <div>
            <strong>Indicators:</strong> RSI and MACD in separate panels
          </div>
        </div>
      </div>
    </div>
  )
}
