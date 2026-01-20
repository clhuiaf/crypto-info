// API endpoint for individual asset details
// Returns coin details and basic market data from cache only
// Never calls CoinGecko directly

import { NextRequest, NextResponse } from 'next/server'
import { getCoinDetails, getPrices, hasData } from '@/lib/priceCache'
import { startPriceUpdater, isPriceUpdaterActive } from '@/lib/priceUpdater'
import { getAssetBySymbol, assets } from '@/data/assets'

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

    // Ensure the background updater is running
    if (!isPriceUpdaterActive()) {
      console.log('Starting price updater from asset API request')
      startPriceUpdater()
    }

    // Get asset data from static assets
    const asset = getAssetBySymbol(symbol)
    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Get CoinGecko ID
    const coinGeckoId = symbolToCoinGeckoId[symbol]

    let coinDetails = null
    let marketData = null

    if (coinGeckoId) {
      // Get detailed coin data from cache
      const cachedDetails = getCoinDetails(coinGeckoId)
      if (cachedDetails) {
        coinDetails = cachedDetails.data
      }

      // Get market data from cache
      const allPrices = getPrices()
      marketData = allPrices.find(price => price.id === coinGeckoId) || null
    }

    // Check if we have any data at all
    const hasCacheData = hasData()

    const response = {
      asset, // Static asset data
      coinDetails, // Detailed CoinGecko data (if available)
      marketData, // Market price data (if available)
      lastUpdated: coinDetails ? getCoinDetails(coinGeckoId!)?.lastUpdated?.toISOString() : null,
      cacheWarmed: hasCacheData,
      // Debug info in development
      ...(process.env.NODE_ENV === 'development' && {
        _debug: {
          coinGeckoId,
          hasCoinDetails: !!coinDetails,
          hasMarketData: !!marketData,
          cacheWarmed: hasCacheData
        }
      })
    }

    // Set cache headers - cache for 30 seconds since this is dynamic data
    const headers = new Headers()
    headers.set('Cache-Control', 'public, max-age=30')

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('Error in /api/assets/[symbol]:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve asset data. Please try again later.'
      },
      { status: 500 }
    )
  }
}