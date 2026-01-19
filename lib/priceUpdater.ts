// Background price updater singleton
// Polls CoinGecko API and updates the in-memory cache
// Runs as a background process to keep data fresh

import { setPrices, markStale, getLastUpdated } from './priceCache'

// Simple local retry helper for HTTP requests
async function fetchJsonWithBasicRetry(
  url: string,
  init?: RequestInit,
  retries = 2,
  delayMs = 500
): Promise<any> {
  let lastError: Error

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, init)

      if (response.ok) {
        return await response.json()
      }

      // Handle rate limiting (429) with delay
      if (response.status === 429 && attempt < retries) {
        const retryAfter = response.headers.get('Retry-After')
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delayMs * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 10000))) // Max 10s
        continue
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < retries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError
}

interface UpdaterConfig {
  intervalMs: number
  maxRetries: number
  backoffMultiplier: number
  maxBackoffMs: number
  limit: number
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
      intervalMs: 15 * 1000, // 15 seconds default
      maxRetries: 3,
      backoffMultiplier: 2,
      maxBackoffMs: 300 * 1000, // 5 minutes max backoff
      limit: 250, // Top 250 coins
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
    this.updatePrices() // Initial update
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
    if (intervalMs < 5000) {
      console.warn('Interval too short, setting to minimum 5 seconds')
      intervalMs = 5000
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

    await this.updatePrices()
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

    console.log(`Scheduling next price update in ${delay}ms${backoffDelay > 0 ? ' (backoff)' : ''}`)

    this.intervalId = setTimeout(() => {
      if (this.isRunning) {
        this.updatePrices()
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

  private async updatePrices(): Promise<void> {
    if (!this.isRunning || this.isUpdating) return

    this.isUpdating = true
    this.lastUpdateAttempt = new Date()

    try {
      console.log('Fetching prices from CoinGecko...')

      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${this.config.limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`

      const data = await fetchJsonWithBasicRetry(url, {}, this.config.maxRetries)

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid response format from CoinGecko')
      }

      // Update cache
      setPrices(data)
      this.consecutiveErrors = 0 // Reset error counter

      const lastUpdated = getLastUpdated()
      console.log(`Successfully updated ${data.length} prices. Last updated: ${lastUpdated?.toISOString()}`)

    } catch (error) {
      this.consecutiveErrors++
      markStale() // Mark cache as stale on error

      console.error(`Price update failed (${this.consecutiveErrors} consecutive errors):`, error)

      // If too many consecutive errors, log a warning
      if (this.consecutiveErrors >= 5) {
        console.warn('Multiple consecutive price update failures. Consider checking CoinGecko API status.')
      }
    } finally {
      this.isUpdating = false
    }
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