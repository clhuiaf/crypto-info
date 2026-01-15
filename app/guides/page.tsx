// Category: Learning
'use client';

import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { guideCategories } from '@/data/guideCategories';
import { getGuidesByCategory } from '@/data/guides';

export default function GuidesIndex() {
  return (
    <PageShell
      hero={
        <div className="bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="py-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cryptopedia · Guides</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Crypto Trading Education</h1>
              <p className="mt-2 text-slate-500 max-w-2xl">
                Structured learning guides covering trading concepts, technical analysis, risk management, and market patterns.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {guideCategories.map((category) => {
            const categoryGuides = getGuidesByCategory(category.slug);
            return (
              <Link
                key={category.id}
                href={`/guides/${category.slug}`}
                className="rounded-2xl border border-slate-100 bg-white px-6 py-5 hover:shadow-sm block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight mb-2">
                      {category.name}
                    </h2>
                    <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                    <p className="text-xs text-slate-500">
                      {categoryGuides.length} {categoryGuides.length === 1 ? 'guide' : 'guides'} available
                    </p>
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
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
