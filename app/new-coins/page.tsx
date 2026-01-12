// Category: Market & portfolio
import { fetchNewCoins, type NewCoin } from '@/lib/api'
import NewCoinsList from '@/components/NewCoinsList'

export const revalidate = 600 // Revalidate every 10 minutes (reduced API calls to avoid rate limits)

export default async function NewCoinsPage() {
  let newCoins: NewCoin[] = []
  let error: string | null = null

  try {
    newCoins = await fetchNewCoins(true) // true = server component
  } catch (err) {
    error = 'Failed to load new coins. Please try again later.'
    console.error(err)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          New Coins Discovery
        </h1>
        <p className="text-slate-600">
          Explore recently listed and trending cryptocurrencies
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <NewCoinsList coins={newCoins} />
      )}
    </div>
  )
}
