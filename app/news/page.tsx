// Category: News
'use client';

import Link from 'next/link';
import NewsHero from '@/components/NewsHero';

export default function NewsIndex() {
  return (
    <div className="app-shell flex flex-col">
      <NewsHero
        eyebrow="Cryptopedia · News"
        title="Regulatory & Market News"
        subtitle="Stay updated with regulatory developments and listing news for Hong Kong crypto traders."
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link
            href="/news/hong-kong"
            className="card-surface p-5 md:p-6 hover:border-blue-500 flex flex-col justify-between"
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
            <p className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                Tap to view latest
                <svg
                  className="w-3 h-3"
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
              <span className="text-[11px] text-slate-400">
                regulatory items from SFC and HKEX
              </span>
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}


