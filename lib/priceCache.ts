// In-memory price cache for cryptocurrency data
// This provides a central store for price data across the application
// and can later be extended to Redis for multi-server deployments

import { CryptoPrice, CoinDetails } from './api'

// Historical price data format
export interface HistoricalData {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// OHLCV data format
export interface OHLCVData {
  data: [number, number, number, number, number][] // [timestamp, open, high, low, close]
  lastUpdated: Date
}

// Cached coin details with timestamp
export interface CachedCoinDetails {
  data: CoinDetails
  lastUpdated: Date
}

// Comprehensive cache data structure
interface PriceCacheData {
  // Market data for all coins
  prices: CryptoPrice[]
  pricesLastUpdated: Date | null
  pricesStale: boolean

  // Historical data cache (keyed by coinId-days, e.g. "bitcoin-7")
  historicalData: Map<string, HistoricalData & { lastUpdated: Date }>

  // OHLCV data cache (keyed by coinId-timeframe, e.g. "bitcoin-1D")
  ohlcvData: Map<string, OHLCVData>

  // Coin details cache (keyed by coinId)
  coinDetails: Map<string, CachedCoinDetails>
}

// Global cache instance (process-local)
let priceCache: PriceCacheData = {
  prices: [],
  pricesLastUpdated: null,
  pricesStale: true,
  historicalData: new Map(),
  ohlcvData: new Map(),
  coinDetails: new Map()
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
  priceCache.pricesLastUpdated = new Date()
  priceCache.pricesStale = false
}

/**
 * Get the timestamp of the last price update
 */
export function getPricesLastUpdated(): Date | null {
  return priceCache.pricesLastUpdated
}

/**
 * Check if the prices cache is stale (no data or very old)
 */
export function arePricesStale(): boolean {
  return priceCache.pricesStale
}

/**
 * Mark the prices cache as stale (useful during errors)
 */
export function markPricesStale(): void {
  priceCache.pricesStale = true
}

/**
 * Get cached historical data for a coin
 */
export function getHistoricalData(coinId: string, days: number): (HistoricalData & { lastUpdated: Date }) | null {
  const key = `${coinId}-${days}`
  return priceCache.historicalData.get(key) || null
}

/**
 * Set cached historical data for a coin
 */
export function setHistoricalData(coinId: string, days: number, data: HistoricalData): void {
  const key = `${coinId}-${days}`
  priceCache.historicalData.set(key, {
    ...data,
    lastUpdated: new Date()
  })
}

/**
 * Get cached OHLCV data for a coin
 */
export function getOHLCVData(coinId: string, timeframe: string): OHLCVData | null {
  const key = `${coinId}-${timeframe}`
  return priceCache.ohlcvData.get(key) || null
}

/**
 * Set cached OHLCV data for a coin
 */
export function setOHLCVData(coinId: string, timeframe: string, data: [number, number, number, number, number][]): void {
  const key = `${coinId}-${timeframe}`
  priceCache.ohlcvData.set(key, {
    data,
    lastUpdated: new Date()
  })
}

/**
 * Get cached coin details
 */
export function getCoinDetails(coinId: string): CachedCoinDetails | null {
  return priceCache.coinDetails.get(coinId) || null
}

/**
 * Set cached coin details
 */
export function setCoinDetails(coinId: string, details: CoinDetails): void {
  priceCache.coinDetails.set(coinId, {
    data: details,
    lastUpdated: new Date()
  })
}

/**
 * Get all cached coin IDs that have details
 */
export function getCachedCoinIds(): string[] {
  return Array.from(priceCache.coinDetails.keys())
}

/**
 * Check if cache has any data (for determining if cache is warmed up)
 */
export function hasData(): boolean {
  return priceCache.prices.length > 0
}

/**
 * Get cache statistics for debugging/monitoring
 */
export function getCacheStats() {
  return {
    hasData: priceCache.prices.length > 0,
    pricesCount: priceCache.prices.length,
    pricesLastUpdated: priceCache.pricesLastUpdated,
    pricesStale: priceCache.pricesStale,
    historicalDataCount: priceCache.historicalData.size,
    ohlcvDataCount: priceCache.ohlcvData.size,
    coinDetailsCount: priceCache.coinDetails.size,
    cacheAge: priceCache.pricesLastUpdated ? Date.now() - priceCache.pricesLastUpdated.getTime() : null
  }
}

/**
 * Legacy compatibility functions
 */
export function getLastUpdated(): Date | null {
  return priceCache.pricesLastUpdated
}

export function isStale(): boolean {
  return priceCache.pricesStale
}

export function markStale(): void {
  priceCache.pricesStale = true
}