'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';
import { guides } from '@/data/guides';

export default function GuidesIndex() {
  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow="CryptoCompare Hub · Guides"
        title="Crypto trading guides for beginners in Hong Kong"
        subtitle="Learn essential trading concepts, technical analysis, and market patterns to make informed decisions when choosing and using crypto exchanges."
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="card-surface p-5 md:p-6 hover:border-blue-500 hover:shadow-md transition-all block"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-soft bg-blue-50 text-blue-700 border border-blue-200">
                      {guide.tag}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight mb-2">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-slate-600">{guide.description}</p>
                </div>
                <div className="text-slate-400">
                  <svg
                    className="w-5 h-5"
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

