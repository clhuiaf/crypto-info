// Shared utility for fetching cryptocurrency prices from CoinGecko
// Used by both server-side rendering and API routes

import { CryptoPrice } from './api'

// Simple retry helper for HTTP requests
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

/**
 * Fetch top cryptocurrencies from CoinGecko
 * @param limit - Number of coins to fetch (default: 250)
 * @returns Promise<CryptoPrice[]>
 */
export async function fetchTopCryptos(limit: number = 250): Promise<CryptoPrice[]> {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`

    const data = await fetchJsonWithBasicRetry(url, {}, 2)

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response format from CoinGecko')
    }

    return data as CryptoPrice[]
  } catch (error) {
    console.error('Error fetching top cryptos:', error)
    throw error
  }
}