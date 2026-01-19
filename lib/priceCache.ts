// In-memory price cache for cryptocurrency data
// This provides a central store for price data across the application
// and can later be extended to Redis for multi-server deployments

import { CryptoPrice } from './api'

interface PriceCacheData {
  prices: CryptoPrice[]
  lastUpdated: Date | null
  isStale: boolean
}

// Global cache instance (process-local)
let priceCache: PriceCacheData = {
  prices: [],
  lastUpdated: null,
  isStale: true
}

/**
 * Get the current cached prices
 * Returns empty array if no data is cached
 */
export function getPrices(): CryptoPrice[] {
  return priceCache.prices
}

/**
 * Set/update the cached prices
 * @param prices - Array of cryptocurrency price data from CoinGecko
 */
export function setPrices(prices: CryptoPrice[]): void {
  priceCache.prices = prices
  priceCache.lastUpdated = new Date()
  priceCache.isStale = false
}

/**
 * Get the timestamp of the last price update
 */
export function getLastUpdated(): Date | null {
  return priceCache.lastUpdated
}

/**
 * Check if the cache is stale (no data or very old)
 */
export function isStale(): boolean {
  return priceCache.isStale
}

/**
 * Mark the cache as stale (useful during errors)
 */
export function markStale(): void {
  priceCache.isStale = true
}

/**
 * Get cache statistics for debugging/monitoring
 */
export function getCacheStats() {
  return {
    hasData: priceCache.prices.length > 0,
    dataCount: priceCache.prices.length,
    lastUpdated: priceCache.lastUpdated,
    isStale: priceCache.isStale,
    age: priceCache.lastUpdated ? Date.now() - priceCache.lastUpdated.getTime() : null
  }
}