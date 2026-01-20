// Category: Market & portfolio

import { startPriceUpdater } from '@/lib/priceUpdater'
import PricesClient from './PricesClient'

// Server component that ensures updater is running and passes initial data
export default async function PricesPage() {
  // Ensure the background updater is running
  startPriceUpdater()

  try {
    // Try to fetch initial data from internal API (cache)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/prices`,
      { next: { revalidate: 30 } } // Short revalidation for initial load
    );

    if (response.ok) {
      const data = await response.json();
      if (!data.error && data.data) {
        return <PricesClient initialPrices={data.data} />
      }
    }

    // If API fails, pass empty array - client will handle loading
    console.warn('Failed to fetch initial prices from API, falling back to client loading');
    return <PricesClient initialPrices={[]} />

  } catch (error) {
    console.error('Failed to fetch initial prices:', error)
    // Fall back to client-side loading if server fetch fails
    return <PricesClient initialPrices={[]} />
  }
}
