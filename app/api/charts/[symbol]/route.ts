// API endpoint for asset chart data
// Returns historical price data from cache only
// Never calls CoinGecko directly

import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalData, getOHLCVData, hasData } from '@/lib/priceCache'
import { startPriceUpdater, isPriceUpdaterActive } from '@/lib/priceUpdater'

// Symbol to CoinGecko ID mapping
const symbolToCoinGeckoId: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'SOL': 'solana',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'DOT': 'polkadot',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase()
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '7')
    const timeframe = url.searchParams.get('timeframe') || '1D'

    // Ensure the background updater is running
    if (!isPriceUpdaterActive()) {
      console.log('Starting price updater from charts API request')
      startPriceUpdater()
    }

    // Get CoinGecko ID
    const coinGeckoId = symbolToCoinGeckoId[symbol]
    if (!coinGeckoId) {
      return NextResponse.json(
        {
          error: 'Chart data not available for this symbol',
          message: 'Historical data is only available for major cryptocurrencies'
        },
        { status: 404 }
      )
    }

    // Check if we have any data at all
    const hasCacheData = hasData()

    // Get historical price data (for line charts)
    const historicalData = getHistoricalData(coinGeckoId, days)

    // Get OHLCV data (for candlestick/advanced charts)
    const ohlcvData = getOHLCVData(coinGeckoId, timeframe)

    // Transform historical data to the expected format
    const chartData = historicalData ? {
      prices: historicalData.prices.map(([time, price]) => ({
        time: Math.floor(time / 1000), // Convert to seconds
        price
      })),
      market_caps: historicalData.market_caps,
      total_volumes: historicalData.total_volumes
    } : null

    const response = {
      symbol,
      coinGeckoId,
      days,
      timeframe,
      chartData, // Historical price data for line charts
      ohlcvData: ohlcvData?.data || null, // OHLCV data for advanced charts
      lastUpdated: historicalData?.lastUpdated?.toISOString() || ohlcvData?.lastUpdated?.toISOString() || null,
      cacheWarmed: hasCacheData,
      // Debug info in development
      ...(process.env.NODE_ENV === 'development' && {
        _debug: {
          hasHistoricalData: !!historicalData,
          hasOHLCVData: !!ohlcvData,
          historicalDataAge: historicalData ? Date.now() - historicalData.lastUpdated.getTime() : null,
          ohlcvDataAge: ohlcvData ? Date.now() - ohlcvData.lastUpdated.getTime() : null,
          cacheWarmed: hasCacheData
        }
      })
    }

    // Set cache headers - cache for 30 seconds since this is dynamic data
    const headers = new Headers()
    headers.set('Cache-Control', 'public, max-age=30')

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('Error in /api/charts/[symbol]:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve chart data. Please try again later.'
      },
      { status: 500 }
    )
  }
}