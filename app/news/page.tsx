'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';

export default function NewsIndex() {
  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow="CryptoCompare Hub · News"
        title="Country-specific regulatory and market structure news"
        subtitle="Start with Hong Kong below. We surface regulatory and listing updates that matter for retail traders choosing an exchange."
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            href="/news/hong-kong"
            className="card-surface p-5 md:p-6 hover:border-blue-500 hover:shadow-md transition-colors flex flex-col justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Hong Kong
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                SFC &amp; HKEX virtual asset and ETF updates
              </p>
              <p className="mt-2 text-xs text-slate-500">
                View curated regulatory and listing news for Hong Kong crypto venues.
              </p>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              Tap to view the latest regulatory items from SFC and HKEX.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}


