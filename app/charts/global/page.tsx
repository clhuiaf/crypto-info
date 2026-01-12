// Category: Market & portfolio
// Placeholder page for Global Market Chart
// TODO: Implement overall market cap and dominance visualization

import Link from 'next/link';

export default function GlobalChartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/charts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Charts
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Global Market Chart
        </h1>
        <p className="text-slate-600">
          Overall cryptocurrency market capitalization and dominance trends
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
        <p className="text-slate-600 mb-6">
          This page will show the total cryptocurrency market capitalization
          and dominance charts for major cryptocurrencies like Bitcoin and Ethereum.
        </p>
        <Link
          href="/charts"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Individual Charts
        </Link>
      </div>
    </div>
  );
}