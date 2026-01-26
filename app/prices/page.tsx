// Category: Market & portfolio

import PricesClient from './PricesClient'

// Server component that passes initial data
export default async function PricesPage() {
  try {
    // Try to fetch initial data from internal API (cache).
    // Use a relative URL so server-side rendering on Vercel does not attempt to call localhost.
    const response = await fetch('/api/prices', { next: { revalidate: 30 } }); // Short revalidation for initial load

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
