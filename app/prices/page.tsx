import { fetchTopCryptos, type CryptoPrice } from '@/lib/api'
import PriceTable from '@/components/PriceTable'

export const revalidate = 300 // Revalidate every 5 minutes (reduced API calls to avoid rate limits)

export default async function PricesPage() {
  let cryptos: CryptoPrice[] = []
  let error: string | null = null

  try {
    cryptos = await fetchTopCryptos(50, true) // true = server component
  } catch (err) {
    error = 'Failed to load cryptocurrency prices. Please try again later.'
    console.error(err)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Cryptocurrency Prices
        </h1>
        <p className="text-slate-600">
          Top cryptocurrencies by market capitalization
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <PriceTable cryptos={cryptos} />
      )}
    </div>
  )
}
