import { notFound } from 'next/navigation';
import Link from 'next/link';
import NewsHero from '@/components/NewsHero';
import { hongKongNewsItems } from '@/data/newsHongKong';

const SUPPORTED_COUNTRIES = ['hong-kong'] as const;

type SupportedCountrySlug = (typeof SUPPORTED_COUNTRIES)[number];

interface NewsPageProps {
  params: {
    country: string;
  };
}

const countryLabels: Record<SupportedCountrySlug, string> = {
  'hong-kong': 'Hong Kong',
};

export default function CountryNewsPage({ params }: NewsPageProps) {
  const slug = params.country as SupportedCountrySlug;

  if (!SUPPORTED_COUNTRIES.includes(slug)) {
    notFound();
  }

  const countryLabel = countryLabels[slug];

  const items = hongKongNewsItems;

  return (
    <div className="app-shell flex flex-col">
      <NewsHero
        eyebrow={`Regulatory news · ${countryLabel}`}
        title={`${countryLabel} crypto & virtual asset news`}
        subtitle="Official updates from the SFC and HKEX focused on virtual assets, exchanges, and ETFs that impact Hong Kong traders."
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex justify-end">
          <Link
            href="/news"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
          >
            ← Back to news
          </Link>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="card-surface p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-stretch gap-4">
                {/* Left: meta + text */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge-soft border ${
                        item.source === 'SFC'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>

                  <h2 className="mt-3 text-sm md:text-base font-semibold text-slate-900">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600"
                    >
                      {item.headline}
                    </a>
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">{item.summary}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
                    >
                      View source
                    </a>
                  </div>
                </div>

                {/* Right: internal CTA */}
                {item.relatedExchangesUrl && (
                  <div className="md:w-56 flex md:justify-end items-start md:items-center">
                    <Link
                      href={item.relatedExchangesUrl}
                      className="w-full md:w-auto px-4 py-2.5 rounded-xl text-xs font-medium border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 text-center"
                    >
                      View related HK licensed exchanges
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}



