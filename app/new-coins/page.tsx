// Category: Market & portfolio
import NewCoinsList from '@/components/NewCoinsList'
import newCoinsDemo from '@/data/newCoinsDemo'

export const revalidate = 600 // Demo data; revalidate kept for parity with other pages

export default async function NewCoinsPage() {
  // TODO: Wire to real API for recent listings. Using demo/mock data for now.
  const newCoins = newCoinsDemo

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">New Coins Discovery</h1>
          <p className="text-slate-600 max-w-2xl">
            Explore recently listed and trending demo cryptocurrencies. (Demo data only)
          </p>
        </div>

        <NewCoinsList coins={newCoins} />
      </div>
    </div>
  )
}
