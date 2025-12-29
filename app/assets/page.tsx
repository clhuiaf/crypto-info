import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';
import { assets } from '@/data/assets';

export const metadata: Metadata = {
  title: 'CryptoCompare Hub – Crypto assets for Hong Kong traders',
  description:
    'Explore major crypto assets and cryptocurrencies available on Hong Kong exchanges. Find where to trade Bitcoin, Ethereum, and other digital assets with our exchange comparison.',
};

export default function AssetsIndex() {
  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow="CryptoCompare Hub · Assets"
        title="Crypto assets for Hong Kong traders"
        subtitle="Explore major cryptocurrencies and digital assets available on Hong Kong exchanges. Find where to trade each asset with our exchange comparison."
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/assets/${asset.symbol}`}
              className="card-surface p-5 md:p-6 hover:border-blue-500 hover:shadow-md transition-all block"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                  {asset.logo || asset.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">{asset.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">{asset.symbol}</span>
                  </div>
                  <span className="badge-soft bg-slate-50 text-slate-700 border border-slate-200 text-[10px]">
                    {asset.category}
                  </span>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">{asset.description}</p>
                  <div className="mt-3 text-xs text-blue-600 font-medium">View details →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

