// Category: Market & portfolio
import NewCoinsList from '@/components/NewCoinsList'
import newCoinsDemo from '@/data/newCoinsDemo'

export const revalidate = 600 // Demo data; revalidate kept for parity with other pages

export default async function NewCoinsPage() {
  // TODO: Wire to real API for recent listings. Using demo/mock data for now.
  const newCoins = newCoinsDemo

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10 mt-8">
      <section className="mx-auto max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] rounded-3xl bg-[var(--brand-color,#2563eb)] p-6 space-y-4">
        <header>
          <h1 className="text-3xl font-semibold text-white">New Coins Discovery</h1>
          <p className="mt-1 text-sm text-slate-100 max-w-2xl">
            Explore recently listed and trending demo cryptocurrencies. (Demo data only)
          </p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <NewCoinsList coins={newCoins} />
        </div>
      </section>
    </div>
  )
}
