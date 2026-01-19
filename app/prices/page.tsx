// Category: Market & portfolio

import { fetchTopCryptos } from '@/lib/priceFetcher'
import { setPrices } from '@/lib/priceCache'
import PricesClient from './PricesClient'

// Server component that fetches initial data
export default async function PricesPage() {
  try {
    // Fetch initial data on the server
    const initialPrices = await fetchTopCryptos(250)

    // Cache the data for future API calls
    setPrices(initialPrices)

    return <PricesClient initialPrices={initialPrices} />
  } catch (error) {
    console.error('Failed to fetch initial prices:', error)
    // Fall back to client-side loading if server fetch fails
    return <PricesClient initialPrices={[]} />
  }
}
