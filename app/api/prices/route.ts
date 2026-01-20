// API endpoint for cryptocurrency prices
// Serves data from the in-memory cache only - NEVER calls CoinGecko directly
// Returns stale data or error if cache is not warmed yet

import { NextRequest, NextResponse } from 'next/server'
import { getPrices, getPricesLastUpdated, arePricesStale, getCacheStats } from '@/lib/priceCache'
import { startPriceUpdater, isPriceUpdaterActive } from '@/lib/priceUpdater'

export async function GET(request: NextRequest) {
  try {
    // Ensure the background updater is running
    if (!isPriceUpdaterActive()) {
      console.log('Starting price updater from API request')
      startPriceUpdater()
    }

    const prices = getPrices()
    const lastUpdated = getPricesLastUpdated()
    const stale = arePricesStale()

    // If no cached data, return an error instead of fetching from CoinGecko
    if (prices.length === 0) {
      return NextResponse.json(
        {
          error: 'Cache not warmed yet',
          message: 'Price data is not available yet. The background updater is warming the cache. Please try again in a few moments.',
          data: [],
          lastUpdated: null,
          isStale: true,
          cacheWarmed: false
        },
        { status: 503 }
      )
    }

    // Optional: Add cache control headers for client-side caching
    const headers = new Headers()
    headers.set('Cache-Control', 'public, max-age=30') // Cache for 30 seconds on client

    // Optional: Add debug info in development
    const debug = process.env.NODE_ENV === 'development'

    const response = {
      data: prices,
      lastUpdated: lastUpdated?.toISOString() || null,
      isStale: stale,
      cacheWarmed: true,
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
        message: 'Failed to retrieve price data. Please try again later.',
        data: [],
        lastUpdated: null,
        isStale: true,
        cacheWarmed: false
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
      const lastUpdated = getPricesLastUpdated()

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