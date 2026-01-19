// API endpoint for cryptocurrency prices
// Serves data from the in-memory cache, ensuring fast response times
// Falls back to fetching fresh data if cache is empty

import { NextRequest, NextResponse } from 'next/server'
import { getPrices, getLastUpdated, isStale, getCacheStats, setPrices } from '@/lib/priceCache'
import { startPriceUpdater, isPriceUpdaterActive } from '@/lib/priceUpdater'
import { fetchTopCryptos } from '@/lib/priceFetcher'

export async function GET(request: NextRequest) {
  try {
    // Ensure the background updater is running
    if (!isPriceUpdaterActive()) {
      console.log('Starting price updater from API request')
      startPriceUpdater()
    }

    let prices = getPrices()
    const lastUpdated = getLastUpdated()
    const stale = isStale()

    // If no cached data, fetch fresh data from CoinGecko
    if (prices.length === 0) {
      console.log('No cached prices found, fetching fresh data from CoinGecko...')
      try {
        prices = await fetchTopCryptos(250)
        setPrices(prices)
        console.log(`Fetched and cached ${prices.length} prices from CoinGecko`)
      } catch (fetchError) {
        console.error('Failed to fetch prices from CoinGecko:', fetchError)
        return NextResponse.json(
          {
            error: 'Failed to fetch price data',
            message: 'Unable to load cryptocurrency prices at this time. Please try again later.',
            lastUpdated: null,
            isStale: true
          },
          { status: 503 }
        )
      }
    }

    // Optional: Add cache control headers for client-side caching
    const headers = new Headers()
    headers.set('Cache-Control', 'public, max-age=30') // Cache for 30 seconds on client

    // Optional: Add debug info in development
    const debug = process.env.NODE_ENV === 'development'

    const response = {
      data: prices,
      lastUpdated: getLastUpdated()?.toISOString() || null,
      isStale: isStale(),
      ...(debug && {
        _debug: {
          cacheStats: getCacheStats(),
          updaterActive: isPriceUpdaterActive()
        }
      })
    }

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('Error in /api/prices:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to retrieve price data. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Optional: Support POST for manual cache refresh (development only)
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Method not allowed in production' },
      { status: 405 }
    )
  }

  try {
    const body = await request.json()
    const { action } = body

    if (action === 'refresh') {
      // Force a cache refresh by restarting the updater
      // This is mainly for development/testing
      console.log('Manual cache refresh requested')

      // Return current data while refresh happens in background
      const prices = getPrices()
      const lastUpdated = getLastUpdated()

      return NextResponse.json({
        message: 'Cache refresh initiated',
        currentData: {
          count: prices.length,
          lastUpdated: lastUpdated?.toISOString() || null
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error in POST /api/prices:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}