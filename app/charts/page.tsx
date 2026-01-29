// Category: Market & portfolio
'use client'

import { useMemo, useState } from 'react'
import AssetSelector from '@/components/AssetSelector'
import TimeframeSelector from '@/components/TimeframeSelector'
import { Timeframe } from '@/types/chart'
import { getAssetBySymbol } from '@/data/assets'
import { usePricesPolling } from '@/lib/usePricesPolling'
import tokenIcons from '@/config/tokenIcons'
import PageShell from '@/components/PageShell'
import TradingChart from '@/components/charts/TradingChart'

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC')
  const [timeframe, setTimeframe] = useState<Timeframe>('5m')
  const timeframeOptions = useMemo(() => ['5m', '15m', '1H', '4H', '1D'] as Timeframe[], [])

  // Use polling hook for crypto data (for asset selector)
  const { prices: cryptoData } = usePricesPolling({
    pollingInterval: 30000 // 30 seconds for charts page
  })

  const selectedAsset = getAssetBySymbol(selectedSymbol)
  // Find real crypto data for icons
  const selectedCrypto = cryptoData.find(crypto => crypto.symbol.toUpperCase() === selectedSymbol.toUpperCase())

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol)
  }

  const chartSymbol = useMemo(() => {
    // Default to the most liquid USDT pair on Binance for this app
    // TradingChart accepts "BTC", "BTCUSDT" or "BINANCE:BTCUSDT"
    return `${selectedSymbol}USDT`
  }, [selectedSymbol])

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel */}
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header>
          <h1 className="text-3xl font-semibold text-white">Chart</h1>
          <p className="mt-1 text-sm text-slate-100">Live candlesticks powered by real exchange data</p>
        </header>

        {/* Card 1: Controls (keeps the previous stacked layout) */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="space-y-3">
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
                  timeframes={timeframeOptions}
                  storageKey="charts-timeframe"
                  enablePersistence={false}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Live candles via Binance (USDT pairs). No API keys required.
            </div>
          </div>
        </div>

        {/* Card 2: Chart Display */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div>
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
                <div className="ml-auto text-xs text-gray-500">
                  {chartSymbol}
                </div>
              </div>
            </div>

            {/* Live TradingView-style chart */}
            <div className="p-2 sm:p-4">
              <TradingChart symbol={chartSymbol} interval={timeframe} height={600} />
            </div>
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  )
}
