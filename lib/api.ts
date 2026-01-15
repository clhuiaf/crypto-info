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
  price_change_percentage_1h_in_currency: number | null
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number | null
  total_volume: number
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
      // For client components, prefer fresh data (no-store) to surface near real-time prices
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    const response = await fetchWithRetry(url, Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' })
    
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
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 600 }
    }
    
    // Using trending coins as a proxy for new/interesting coins
    // In a real app, you might want to use a different API or maintain your own list
    const response = await fetchWithRetry(
      'https://api.coingecko.com/api/v3/search/trending',
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
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
      Object.keys(pricesFetchOptions).length > 0 ? pricesFetchOptions : { cache: 'no-store' }
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
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=false`
    const response = await fetchWithRetry(
      url,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
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
      fetchOptions.cache = 'no-store'
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

import { OHLCVPoint, Timeframe, TIMEFRAME_CONFIGS } from '@/types/chart'

// Fetch historical price data for charts (legacy format)
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

// Fetch OHLCV data for advanced charts
// Works in both server and client components
export async function fetchOHLCVData(
  coinId: string,
  timeframe: Timeframe = '1D',
  isServer: boolean = false
): Promise<OHLCVPoint[]> {
  try {
    const config = TIMEFRAME_CONFIGS[timeframe]
    const fetchOptions: any = {}

    // Only add Next.js revalidate option in server components
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 } // Revalidate every 10 minutes
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }

    // Use CoinGecko OHLC endpoint for intraday data when available
    let url: string
    if (['1m', '5m', '15m', '1H', '4H'].includes(timeframe)) {
      // For intraday data, use the OHLC endpoint
      url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${config.days}`
    } else {
      // For daily+ data, use market_chart_range for better granularity
      const to = Math.floor(Date.now() / 1000)
      const from = to - (config.days * 24 * 60 * 60)
      url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
    }

    const response = await fetchWithRetry(
      url,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch OHLCV data')
    }

    const data = await response.json()

    if (['1m', '5m', '15m', '1H', '4H'].includes(timeframe)) {
      // OHLC data format: [timestamp, open, high, low, close]
      return data.map(([time, open, high, low, close]: [number, number, number, number, number]) => {
        // CoinGecko OHLC endpoint returns timestamps in milliseconds.
        // Normalize to seconds for lightweight-charts which expects unix seconds.
        const normalizedTime = time > 1e12 ? Math.floor(time / 1000) : time
        return {
          time: normalizedTime,
          open,
          high,
          low,
          close,
          volume: 0, // OHLC endpoint doesn't provide volume
        }
      })
    } else {
      // Market chart range format: prices and volumes are separate arrays
      const prices = data.prices || []
      const volumes = data.total_volumes || []

      return prices.map(([time, close]: [number, number], index: number) => {
        // For daily+ data, we need to construct OHLC from close prices
        // This is a limitation of the free CoinGecko API
        // In a production app, you'd want a paid data provider for accurate OHLC
        const volume = volumes[index]?.[1] || 0
        const normalizedTime = time > 1e12 ? Math.floor(time / 1000) : time
        return {
          time: normalizedTime,
          open: close, // Approximation
          high: close, // Approximation
          low: close,  // Approximation
          close,
          volume,
        }
      })
    }
  } catch (error) {
    console.error('Error fetching OHLCV data:', error)
    // Fall back to mock data for development
    console.warn('Falling back to mock OHLCV data')
    return generateMockOHLCVData(coinId, timeframe)
  }
}

// Generate mock OHLCV data for development and testing
// Prices are approximate real-world values as of 2024 for demo purposes
export function generateMockOHLCVData(
  coinId: string,
  timeframe: Timeframe = '1D',
  dataPoints: number = 200
): OHLCVPoint[] {
  const config = TIMEFRAME_CONFIGS[timeframe]
  const now = Date.now()
  const intervalMs = getTimeframeIntervalMs(timeframe)

  // Base price based on coin - realistic demo values (approximate market prices as of 2024)
  const basePrices: Record<string, number> = {
    // Major cryptocurrencies - realistic market prices
    btc: 95000,      // ~$95k (realistic 2024 price)
    bitcoin: 95000,  // ~$95k (realistic 2024 price)
    eth: 3200,       // ~$3.2k (realistic 2024 price)
    ethereum: 3200,  // ~$3.2k (realistic 2024 price)
    sol: 180,        // ~$180 (realistic 2024 price)
    solana: 180,     // ~$180 (realistic 2024 price)
    bnb: 420,        // ~$420 (realistic 2024 price)
    binancecoin: 420, // ~$420 (realistic 2024 price)
    ada: 0.58,       // ~$0.58 (realistic 2024 price)
    cardano: 0.58,   // ~$0.58 (realistic 2024 price)
    xrp: 1.20,       // ~$1.20 (realistic 2024 price)
    ripple: 1.20,    // ~$1.20 (realistic 2024 price)
    dot: 8.50,       // ~$8.50 (realistic 2024 price)
    polkadot: 8.50,  // ~$8.50 (realistic 2024 price)
    avax: 42,        // ~$42 (realistic 2024 price)
    avalanche: 42,   // ~$42 (realistic 2024 price)
    link: 18,        // ~$18 (realistic 2024 price)
    chainlink: 18,   // ~$18 (realistic 2024 price)
    ltc: 95,         // ~$95 (realistic 2024 price)
    litecoin: 95,    // ~$95 (realistic 2024 price)
    polygon: 0.72,   // ~$0.72 (realistic 2024 price)
    uniswap: 12.80,  // ~$12.80 (realistic 2024 price)
    cosmos: 11.20,  // ~$11.20 (realistic 2024 price)
    algorand: 0.18,  // ~$0.18 (realistic 2024 price)
    vechain: 0.035,  // ~$0.035 (realistic 2024 price)
    stellar: 0.15,   // ~$0.15 (realistic 2024 price)
    tron: 0.12,      // ~$0.12 (realistic 2024 price)
    internetcomputer: 12.50, // ~$12.50 (realistic 2024 price)
    filecoin: 5.80,  // ~$5.80 (realistic 2024 price)
    hedera: 0.08,    // ~$0.08 (realistic 2024 price)
    flow: 0.95,      // ~$0.95 (realistic 2024 price)
    multiversx: 48,  // ~$48 (realistic 2024 price)
    theta: 1.85,     // ~$1.85 (realistic 2024 price)
    axieinfinity: 8.50, // ~$8.50 (realistic 2024 price)
    fantom: 0.48,    // ~$0.48 (realistic 2024 price)
    near: 3.20,      // ~$3.20 (realistic 2024 price)
    eos: 0.95,       // ~$0.95 (realistic 2024 price)
    apecoin: 1.80,   // ~$1.80 (realistic 2024 price)
    thegraph: 0.18,  // ~$0.18 (realistic 2024 price)
    sand: 0.55,      // ~$0.55 (realistic 2024 price)
    mana: 0.48,      // ~$0.48 (realistic 2024 price)
    enjincoin: 0.32, // ~$0.32 (realistic 2024 price)
    gala: 0.042,     // ~$0.042 (realistic 2024 price)

    // Stablecoins and wrapped assets
    'matic-network': 0.72,   // ~$0.72 (same as polygon)
    'wrapped-bitcoin': 95000, // ~$95k (same as bitcoin)
    'dai': 1.00,             // $1.00 (stablecoin)
    'shiba-inu': 0.000028,   // ~$0.000028 (realistic 2024 price)
    'leo-token': 5.20,       // ~$5.20 (realistic 2024 price)
    'crypto-com-chain': 0.12, // ~$0.12 (realistic 2024 price)
    'okb': 58,               // ~$58 (realistic 2024 price)
    'bitcoin-cash': 320,     // ~$320 (realistic 2024 price)
    'quant-network': 95,     // ~$95 (realistic 2024 price)
    'iota': 0.28,            // ~$0.28 (realistic 2024 price)
    'neutrino': 18,          // ~$18 (realistic 2024 price)
    'maker': 2200,           // ~$2.2k (realistic 2024 price)
    'helium': 4.80,          // ~$4.80 (realistic 2024 price)
    'lido-dao': 2.80,        // ~$2.80 (realistic 2024 price)
    'bitcoin-cash-sv': 85,   // ~$85 (realistic 2024 price)
    'ecash': 0.000052,       // ~$0.000052 (realistic 2024 price)
    'zcash': 42,             // ~$42 (realistic 2024 price)
    'neo': 15,               // ~$15 (realistic 2024 price)
    'waves': 2.50,           // ~$2.50 (realistic 2024 price)
    'basic-attention-token': 0.28, // ~$0.28 (realistic 2024 price)
    'dash': 38,              // ~$38 (realistic 2024 price)
    'decentraland': 0.52,    // ~$0.52 (realistic 2024 price)
    'aave': 125,             // ~$125 (realistic 2024 price)
    'compound-governance-token': 65, // ~$65 (realistic 2024 price)
    'sushi': 1.45,           // ~$1.45 (realistic 2024 price)
    '1inch': 0.42,           // ~$0.42 (realistic 2024 price)
    'curve-dao-token': 0.68, // ~$0.68 (realistic 2024 price)
    'yearn-finance': 8200,   // ~$8.2k (realistic 2024 price)
    'balancer': 4.50,        // ~$4.50 (realistic 2024 price)
    'ren': 0.072,            // ~$0.072 (realistic 2024 price)
    'loopring': 0.32,        // ~$0.32 (realistic 2024 price)
    'republic-protocol': 0.058, // ~$0.058 (realistic 2024 price)
    'bancor': 0.62,          // ~$0.62 (realistic 2024 price)
    'kyber-network-crystal': 0.85, // ~$0.85 (realistic 2024 price)
    '0x': 0.48,              // ~$0.48 (realistic 2024 price)
    'synthetix': 3.20,       // ~$3.20 (realistic 2024 price)
    'reserve-rights-token': 0.0038, // ~$0.0038 (realistic 2024 price)
    'origin-protocol': 0.12, // ~$0.12 (realistic 2024 price)
    'uma': 2.40,             // ~$2.40 (realistic 2024 price)
    'band-protocol': 1.85,   // ~$1.85 (realistic 2024 price)
  }

  const basePrice = basePrices[coinId.toLowerCase()] || 100
  let currentPrice = basePrice

  const data: OHLCVPoint[] = []

  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = now - (i * intervalMs)
    // convert to seconds so mock data matches CoinGecko's seconds output after normalization
    const timeSec = Math.floor(time / 1000)
    const volatility = 0.02 // 2% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility
    const open = currentPrice
    const close = open * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    const volume = Math.random() * 1000000 + 100000 // Random volume

    data.push({
      time: timeSec,
      open,
      high,
      low,
      close,
      volume,
    })

    currentPrice = close
  }

  return data
}

// Helper function to get timeframe interval in milliseconds
function getTimeframeIntervalMs(timeframe: Timeframe): number {
  switch (timeframe) {
    case '1m': return 60 * 1000
    case '5m': return 5 * 60 * 1000
    case '15m': return 15 * 60 * 1000
    case '1H': return 60 * 60 * 1000
    case '4H': return 4 * 60 * 60 * 1000
    case '1D': return 24 * 60 * 60 * 1000
    case '1W': return 7 * 24 * 60 * 60 * 1000
    case '1M': return 30 * 24 * 60 * 60 * 1000
    default: return 24 * 60 * 60 * 1000
  }
}
