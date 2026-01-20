// Centralized CoinGecko API client
// All CoinGecko HTTP calls should go through this client for consistent retry logic and rate limiting

import { CryptoPrice, CoinDetails } from './api'
import { OHLCVPoint } from '@/types/chart'

// Base URL for CoinGecko API
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Retry configuration
interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 60000 // 1 minute max delay
}

// Helper function to retry requests with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(retryConfig.baseDelayMs * Math.pow(2, attempt), retryConfig.maxDelayMs)

        if (attempt < retryConfig.maxRetries) {
          console.warn(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${retryConfig.maxRetries}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }

      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < retryConfig.maxRetries) {
        const waitTime = Math.min(retryConfig.baseDelayMs * Math.pow(2, attempt), retryConfig.maxDelayMs)
        console.warn(`Request failed, retrying in ${waitTime}ms:`, error)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

// CoinGecko API client class
export class CoinGeckoClient {
  private baseUrl: string
  private retryConfig: RetryConfig

  constructor(baseUrl: string = COINGECKO_BASE_URL, retryConfig: Partial<RetryConfig> = {}) {
    this.baseUrl = baseUrl
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
  }

  /**
   * Fetch top cryptocurrencies by market cap
   */
  async fetchMarkets(params: {
    vs_currency?: string
    order?: string
    per_page?: number
    page?: number
    sparkline?: boolean
    price_change_percentage?: string
    ids?: string
  } = {}): Promise<CryptoPrice[]> {
    const defaultParams = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250,
      page: 1,
      sparkline: false,
      price_change_percentage: '1h,24h,7d'
    }

    const queryParams = new URLSearchParams()
    Object.entries({ ...defaultParams, ...params }).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })

    const url = `${this.baseUrl}/coins/markets?${queryParams}`

    const response = await fetchWithRetry(url, {}, this.retryConfig)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch markets: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data as CryptoPrice[]
  }

  /**
   * Fetch detailed information for a specific coin
   */
  async fetchCoinDetails(
    coinId: string,
    options: {
      localization?: boolean
      tickers?: boolean
      market_data?: boolean
      community_data?: boolean
      developer_data?: boolean
      sparkline?: boolean
    } = {}
  ): Promise<CoinDetails | null> {
    const defaultOptions = {
      localization: false,
      tickers: true,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false
    }

    const queryParams = new URLSearchParams()
    Object.entries({ ...defaultOptions, ...options }).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })

    const url = `${this.baseUrl}/coins/${coinId}?${queryParams}`

    const response = await fetchWithRetry(url, {}, this.retryConfig)

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`Rate limited when fetching coin details for ${coinId}`)
      } else if (response.status === 404) {
        return null // Coin not found
      }
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Failed to fetch coin details for ${coinId}: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data as CoinDetails
  }

  /**
   * Fetch historical price data for charts
   */
  async fetchCoinHistory(
    coinId: string,
    days: number = 7,
    vs_currency: string = 'usd'
  ): Promise<{ prices: [number, number][], market_caps: [number, number][], total_volumes: [number, number][] }> {
    const queryParams = new URLSearchParams({
      vs_currency,
      days: days.toString()
    } as any)

    const url = `${this.baseUrl}/coins/${coinId}/market_chart?${queryParams}`

    const response = await fetchWithRetry(url, {}, this.retryConfig)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch historical data for ${coinId}: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data
  }

  /**
   * Fetch OHLCV data for advanced charts
   */
  async fetchOHLCV(
    coinId: string,
    params: {
      vs_currency?: string
      days?: number
    } = {}
  ): Promise<[number, number, number, number, number][]> {
    const defaultParams = {
      vs_currency: 'usd',
      days: 7
    }

    const queryParams = new URLSearchParams()
    Object.entries({ ...defaultParams, ...params }).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value))
      }
    })

    const url = `${this.baseUrl}/coins/${coinId}/ohlc?${queryParams}`

    const response = await fetchWithRetry(url, {}, this.retryConfig)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch OHLCV data for ${coinId}: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data
  }

  /**
   * Fetch trending coins
   */
  async fetchTrending(): Promise<{ coins: Array<{ item: { id: string; name: string; symbol: string } }> }> {
    const url = `${this.baseUrl}/search/trending`

    const response = await fetchWithRetry(url, {}, this.retryConfig)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch trending coins: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data
  }
}

// Export singleton instance
export const coinGeckoClient = new CoinGeckoClient()

// Convenience functions for common operations
export async function fetchTopCryptos(limit: number = 250): Promise<CryptoPrice[]> {
  return coinGeckoClient.fetchMarkets({ per_page: limit })
}

export async function fetchCoinDetails(coinId: string): Promise<CoinDetails | null> {
  return coinGeckoClient.fetchCoinDetails(coinId)
}

export async function fetchCoinHistory(
  coinId: string,
  days: number = 7
): Promise<{ prices: [number, number][], market_caps: [number, number][], total_volumes: [number, number][] }> {
  return coinGeckoClient.fetchCoinHistory(coinId, days)
}

export async function fetchOHLCVData(
  coinId: string,
  days: number = 7
): Promise<[number, number, number, number, number][]> {
  return coinGeckoClient.fetchOHLCV(coinId, { days })
}