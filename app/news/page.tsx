// Category: News
'use client';

import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { newsDemo, type NewsItem } from '@/data/newsDemo';
import NewsCard from '@/components/NewsCard';

const SOURCES: Array<'All' | 'SFC' | 'HKEX' | 'ETFs'> = ['All', 'SFC', 'HKEX', 'ETFs'];

export default function NewsIndex() {
  const [filter, setFilter] = useState<'All' | 'SFC' | 'HKEX' | 'ETFs'>('All');

  const filtered = newsDemo.filter((n) => {
    if (filter === 'All') return true;
    return n.source === filter;
  });

  return (
    <PageShell
      hero={
        <div className="bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cryptopedia · News</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Regulatory &amp; Market News</h1>
              <p className="mt-2 text-slate-500 max-w-2xl">
                Stay updated with regulatory developments and listing news for Hong Kong crypto traders.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      filter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((item: NewsItem) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}


