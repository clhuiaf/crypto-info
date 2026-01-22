// Category: Market & portfolio
import { Metadata } from 'next';
import Link from 'next/link';
import { type CryptoPrice } from '@/lib/api';
import { formatCurrency, formatPercentage } from '@/lib/utils';

// Make this page dynamic with ISR - revalidate every 60 seconds
// This allows it to show fresh data without hitting CoinGecko during build
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Cryptocurrency Listing Info | Cryptopedia',
  description:
    'Recently listed and key cryptocurrencies with listing details. Explore major crypto assets available on Hong Kong exchanges.',
};

export default async function AssetsIndex() {
  let cryptos: CryptoPrice[] = [];
  let error: string | null = null;

  try {
    // Fetch from internal API that reads only from cache
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/prices`, {
      next: { revalidate: 60 } // Match page revalidation
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || data.error);
    }

    // Take top 20 coins from cached data
    cryptos = data.data.slice(0, 20);
  } catch (err) {
    error = 'Failed to load cryptocurrencies. The cache may not be warmed yet. Please try again in a few moments.';
    console.error('Error fetching from /api/prices:', err);
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Asset Listings & Details
        </h1>
        <p className="text-slate-600">
          Detailed information cards for major cryptocurrencies and their exchange listings.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cryptos.map((crypto) => (
            <Link
              key={crypto.id}
              href={`/assets/${crypto.symbol.toUpperCase()}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
                <div className="flex items-center mb-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                      {crypto.name}
                    </h3>
                    <p className="text-sm text-slate-500 uppercase">
                      {crypto.symbol}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Price:</span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(crypto.current_price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">24h Change:</span>
                    <span
                      className={`text-sm font-medium ${
                        crypto.price_change_percentage_24h == null
                          ? 'text-gray-400'
                          : crypto.price_change_percentage_24h >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}
                    >
                      {crypto.price_change_percentage_24h == null
                        ? '—'
                        : `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                      }
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                    View details
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}

