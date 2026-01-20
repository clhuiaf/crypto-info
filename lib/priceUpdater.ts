// Background price updater singleton
// Polls CoinGecko API and updates the in-memory cache
// Runs as a background process to keep data fresh

import { coinGeckoClient } from './coingeckoClient'
import {
  setPrices,
  markPricesStale,
  getPricesLastUpdated,
  setHistoricalData,
  setOHLCVData,
  setCoinDetails,
  getCacheStats
} from './priceCache'

// Coins that need detailed data (from assets.ts)
const PRIORITY_COINS = [
  { symbol: 'BTC', coinGeckoId: 'bitcoin' },
  { symbol: 'ETH', coinGeckoId: 'ethereum' },
  { symbol: 'USDT', coinGeckoId: 'tether' },
  { symbol: 'USDC', coinGeckoId: 'usd-coin' },
  { symbol: 'SOL', coinGeckoId: 'solana' },
  { symbol: 'BNB', coinGeckoId: 'binancecoin' },
  { symbol: 'XRP', coinGeckoId: 'ripple' },
  { symbol: 'ADA', coinGeckoId: 'cardano' },
  { symbol: 'DOGE', coinGeckoId: 'dogecoin' },
  { symbol: 'MATIC', coinGeckoId: 'matic-network' },
  { symbol: 'AVAX', coinGeckoId: 'avalanche-2' },
  { symbol: 'LINK', coinGeckoId: 'chainlink' },
  { symbol: 'UNI', coinGeckoId: 'uniswap' },
  { symbol: 'ATOM', coinGeckoId: 'cosmos' },
  { symbol: 'DOT', coinGeckoId: 'polkadot' }
]

interface UpdaterConfig {
  intervalMs: number
  maxRetries: number
  backoffMultiplier: number
  maxBackoffMs: number
  limit: number
  enableHistoricalData: boolean
  enableOHLCVData: boolean
  enableCoinDetails: boolean
  historicalDays: number[]
  ohlcvTimeframes: string[]
}

class PriceUpdater {
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false
  private isUpdating = false // Prevent concurrent updates
  private config: UpdaterConfig
  private consecutiveErrors = 0
  private lastUpdateAttempt: Date | null = null

  constructor(config: Partial<UpdaterConfig> = {}) {
    this.config = {
      intervalMs: 30 * 1000, // 30 seconds default (longer to avoid rate limits)
      maxRetries: 3,
      backoffMultiplier: 2,
      maxBackoffMs: 300 * 1000, // 5 minutes max backoff
      limit: 250, // Top 250 coins for market data
      enableHistoricalData: true,
      enableOHLCVData: true,
      enableCoinDetails: true,
      historicalDays: [7, 30], // Days for historical charts
      ohlcvTimeframes: ['1D'], // Timeframes for OHLCV data
      ...config
    }
  }

  /**
   * Start the background updater
   * Safe to call multiple times - only starts if not already running
   */
  start(): void {
    if (this.isRunning) {
      console.log('Price updater already running')
      return
    }

    console.log('Starting price updater with interval:', this.config.intervalMs, 'ms')
    this.isRunning = true
    this.updateAllData() // Initial update
    this.scheduleNextUpdate()
  }

  /**
   * Stop the background updater
   */
  stop(): void {
    if (!this.isRunning) {
      return
    }

    console.log('Stopping price updater')
    this.isRunning = false

    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Check if the updater is currently running
   */
  isActive(): boolean {
    return this.isRunning
  }

  /**
   * Get the current configuration
   */
  getConfig(): UpdaterConfig {
    return { ...this.config }
  }

  /**
   * Update the polling interval (will take effect on next cycle)
   */
  setInterval(intervalMs: number): void {
    if (intervalMs < 10000) {
      console.warn('Interval too short, setting to minimum 10 seconds')
      intervalMs = 10000
    }

    this.config.intervalMs = intervalMs
    console.log('Updated price updater interval to:', intervalMs, 'ms')

    // Reschedule if running
    if (this.isRunning) {
      this.scheduleNextUpdate()
    }
  }

  /**
   * Force an immediate update (outside the regular schedule)
   */
  async forceUpdate(): Promise<void> {
    if (!this.isRunning) {
      console.warn('Cannot force update - updater not running')
      return
    }

    await this.updateAllData()
  }

  private scheduleNextUpdate(): void {
    if (!this.isRunning) return

    // Clear existing timeout
    if (this.intervalId) {
      clearTimeout(this.intervalId)
    }

    // Calculate backoff delay if there were recent errors
    const backoffDelay = this.calculateBackoffDelay()
    const delay = backoffDelay > 0 ? backoffDelay : this.config.intervalMs

    console.log(`Scheduling next data update in ${delay}ms${backoffDelay > 0 ? ' (backoff)' : ''}`)

    this.intervalId = setTimeout(() => {
      if (this.isRunning) {
        this.updateAllData()
        this.scheduleNextUpdate()
      }
    }, delay)
  }

  private calculateBackoffDelay(): number {
    if (this.consecutiveErrors === 0) return 0

    // Exponential backoff: base interval * (multiplier ^ errors)
    const backoffMs = Math.min(
      this.config.intervalMs * Math.pow(this.config.backoffMultiplier, this.consecutiveErrors),
      this.config.maxBackoffMs
    )

    return backoffMs
  }

  private async updateAllData(): Promise<void> {
    if (!this.isRunning || this.isUpdating) return

    this.isUpdating = true
    this.lastUpdateAttempt = new Date()

    try {
      console.log('Starting comprehensive data update from CoinGecko...')

      // Update market prices (highest priority)
      await this.updateMarketPrices()

      // Update detailed data for priority coins (with delays to avoid rate limits)
      if (this.config.enableCoinDetails) {
        await this.updateCoinDetails()
      }

      // Update historical data for charts
      if (this.config.enableHistoricalData) {
        await this.updateHistoricalData()
      }

      // Update OHLCV data for advanced charts
      if (this.config.enableOHLCVData) {
        await this.updateOHLCVData()
      }

      this.consecutiveErrors = 0 // Reset error counter

      const cacheStats = getCacheStats()
      console.log(`Data update completed. Cache stats:`, cacheStats)

    } catch (error) {
      this.consecutiveErrors++
      markPricesStale() // Mark cache as stale on error

      console.error(`Data update failed (${this.consecutiveErrors} consecutive errors):`, error)

      // If too many consecutive errors, log a warning
      if (this.consecutiveErrors >= 5) {
        console.warn('Multiple consecutive data update failures. Consider checking CoinGecko API status.')
      }
    } finally {
      this.isUpdating = false
    }
  }

  private async updateMarketPrices(): Promise<void> {
    console.log('Fetching market prices...')

    const data = await coinGeckoClient.fetchMarkets({
      per_page: this.config.limit,
      price_change_percentage: '1h,24h,7d'
    })

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid market data response from CoinGecko')
    }

    setPrices(data)
    console.log(`Updated ${data.length} market prices`)
  }

  private async updateCoinDetails(): Promise<void> {
    console.log('Fetching coin details for priority coins...')

    // Process coins in batches with delays to avoid rate limits
    const batchSize = 3
    for (let i = 0; i < PRIORITY_COINS.length; i += batchSize) {
      const batch = PRIORITY_COINS.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async ({ coinGeckoId }) => {
          try {
            const details = await coinGeckoClient.fetchCoinDetails(coinGeckoId)
            if (details) {
              setCoinDetails(coinGeckoId, details)
            }
          } catch (error) {
            console.warn(`Failed to fetch details for ${coinGeckoId}:`, error)
          }
        })
      )

      // Small delay between batches
      if (i + batchSize < PRIORITY_COINS.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log('Coin details update completed')
  }

  private async updateHistoricalData(): Promise<void> {
    console.log('Fetching historical data for charts...')

    for (const { coinGeckoId } of PRIORITY_COINS) {
      for (const days of this.config.historicalDays) {
        try {
          const data = await coinGeckoClient.fetchCoinHistory(coinGeckoId, days)
          setHistoricalData(coinGeckoId, days, data)
        } catch (error) {
          console.warn(`Failed to fetch ${days}-day history for ${coinGeckoId}:`, error)
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log('Historical data update completed')
  }

  private async updateOHLCVData(): Promise<void> {
    console.log('Fetching OHLCV data for advanced charts...')

    for (const { coinGeckoId } of PRIORITY_COINS) {
      for (const timeframe of this.config.ohlcvTimeframes) {
        try {
          // Map timeframe to days (simplified mapping)
          const daysMap: Record<string, number> = {
            '1D': 30, // Last 30 days for daily data
            '1W': 90, // Last 90 days for weekly data
            '1M': 365 // Last year for monthly data
          }

          const days = daysMap[timeframe] || 30
          const data = await coinGeckoClient.fetchOHLCV(coinGeckoId, { days })
          setOHLCVData(coinGeckoId, timeframe, data)
        } catch (error) {
          console.warn(`Failed to fetch OHLCV data for ${coinGeckoId} (${timeframe}):`, error)
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log('OHLCV data update completed')
  }
}

// Export singleton instance
export const priceUpdater = new PriceUpdater()

// Convenience functions for external use
export function startPriceUpdater(): void {
  priceUpdater.start()
}

export function stopPriceUpdater(): void {
  priceUpdater.stop()
}

export function isPriceUpdaterActive(): boolean {
  return priceUpdater.isActive()
}

// For debugging/testing
export function getUpdaterStats() {
  return {
    isActive: priceUpdater.isActive(),
    config: priceUpdater.getConfig(),
    lastUpdateAttempt: priceUpdater['lastUpdateAttempt'],
    consecutiveErrors: priceUpdater['consecutiveErrors']
  }
}