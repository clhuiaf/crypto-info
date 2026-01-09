// API utilities for fetching cryptocurrency data
// Using CoinGecko API (free tier, no API key required)
// Note: Free tier has rate limits (10-50 calls/minute), so we use longer cache times

// Helper function to retry requests with exponential backoff
async function fetchWithRetry(
  url: string,
  options: any = {},
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const waitTime = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : Math.min(1000 * Math.pow(2, attempt), 10000) // Exponential backoff, max 10s
        
        if (attempt < maxRetries - 1) {
          console.warn(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }
      
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxRetries - 1) {
        const waitTime = 1000 * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded')
}

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image: string
}

export interface NewCoin {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number | null
  fully_diluted_valuation: number | null
  listing_date: string
  platforms: Record<string, string>
}

// Fetch top cryptocurrencies by market cap
// Works in both server and client components
export async function fetchTopCryptos(limit: number = 50, isServer: boolean = false): Promise<CryptoPrice[]> {
  try {
    // Increase revalidation time to reduce API calls and avoid rate limits
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 300 } // Revalidate every 5 minutes (was 60s)
    } else {
      // For client components, use cache to reduce requests
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    const response = await fetchWithRetry(url, Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch crypto prices: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top cryptos:', error)
    throw error
  }
}

// Fetch recently listed coins
// Note: CoinGecko doesn't have a direct "new listings" endpoint, so we'll use a workaround
// by fetching coins sorted by listing date or using trending coins
// Works in both server and client components
// Simplified to reduce API calls and avoid rate limits
export async function fetchNewCoins(isServer: boolean = false): Promise<NewCoin[]> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 } // Revalidate every 10 minutes (was 5)
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }
    
    // Using trending coins as a proxy for new/interesting coins
    // In a real app, you might want to use a different API or maintain your own list
    const response = await fetchWithRetry(
      'https://api.coingecko.com/api/v3/search/trending',
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch new coins')
    }
    
    const data = await response.json()
    
    // Transform the trending data into our NewCoin format
    const coinIds = data.coins.map((coin: any) => coin.item.id).join(',')
    
    if (!coinIds) {
      return []
    }
    
    const pricesFetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      pricesFetchOptions.next = { revalidate: 600 }
    } else {
      pricesFetchOptions.cache = 'force-cache'
      pricesFetchOptions.next = { revalidate: 600 }
    }
    
    const pricesResponse = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=20&page=1&sparkline=false`,
      Object.keys(pricesFetchOptions).length > 0 ? pricesFetchOptions : { cache: 'force-cache' }
    )
    
    if (!pricesResponse.ok) {
      if (pricesResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch coin prices')
    }
    
    const pricesData = await pricesResponse.json()
    
    // Simplified: Use market data from prices endpoint instead of fetching individual details
    // This reduces API calls from 10+ to just 2 calls total
    return pricesData.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      listing_date: 'N/A', // Would require additional API call
      platforms: {}, // Would require additional API call
    })) as NewCoin[]
  } catch (error) {
    console.error('Error fetching new coins:', error)
    throw error
  }
}

// Fetch individual coin data by ID
// Works in both server and client components
export async function fetchCoinById(coinId: string, isServer: boolean = false): Promise<CryptoPrice | null> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 300 } // Increased from 60s
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=false`
    const response = await fetchWithRetry(
      url, 
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limited when fetching coin ${coinId}`)
      } else {
        console.warn(`Failed to fetch coin ${coinId}: ${response.status} ${response.statusText}`)
      }
      return null
    }
    
    const data = await response.json()
    if (data.length === 0) {
      return null
    }
    
    return data[0] as CryptoPrice
  } catch (error) {
    console.error(`Error fetching coin ${coinId}:`, error)
    return null
  }
}

// Fetch detailed coin information for Listing Info page
// Works in both server and client components
export interface CoinDetails {
  id: string
  symbol: string
  name: string
  image: {
    large: string
    small: string
  }
  market_data: {
    current_price: { usd: number }
    price_change_percentage_24h: number
    market_cap: { usd: number }
    fully_diluted_valuation: { usd: number }
  }
  genesis_date: string | null
  platforms: Record<string, string>
  links: {
    homepage?: string[]
    whitepaper?: string
    twitter_screen_name?: string
    telegram_channel_identifier?: string
    subreddit_url?: string
  }
  description: {
    en: string
  }
  tickers?: Array<{
    base: string
    target: string
    market: {
      name: string
    }
    last: number
  }>
}

export async function fetchCoinDetails(coinId: string, isServer: boolean = false): Promise<CoinDetails | null> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 } // Revalidate every 10 minutes
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }
    
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limited when fetching coin details for ${coinId}`)
      } else {
        console.warn(`Failed to fetch coin details for ${coinId}: ${response.status} ${response.statusText}`)
      }
      return null
    }
    
    const data = await response.json()
    return data as CoinDetails
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error)
    return null
  }
}

// Fetch historical price data for charts
// Works in both server and client components
export async function fetchHistoricalData(
  coinId: string,
  days: number = 7,
  isServer: boolean = false
): Promise<{ time: number; price: number }[]> {
  try {
    const fetchOptions: any = {}
    
    // Only add Next.js revalidate option in server components
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 } // Revalidate every 10 minutes (was 5)
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }
    
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch historical data')
    }
    
    const data = await response.json()
    
    // Transform the data into a simpler format
    return data.prices.map(([time, price]: [number, number]) => ({
      time,
      price,
    }))
  } catch (error) {
    console.error('Error fetching historical data:', error)
    throw error
  }
}
