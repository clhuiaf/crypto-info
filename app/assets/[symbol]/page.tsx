import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';
import { getAssetBySymbol, assets } from '@/data/assets';

interface AssetPageProps {
  params: {
    symbol: string;
  };
}

export async function generateStaticParams() {
  return assets.map((asset) => ({
    symbol: asset.symbol,
  }));
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const asset = getAssetBySymbol(params.symbol);

  if (!asset) {
    return {
      title: 'Asset Not Found | CryptoCompare Hub',
    };
  }

  return {
    title: `${asset.name} (${asset.symbol}) – overview and where to trade in Hong Kong | CryptoCompare Hub`,
    description: `Learn about ${asset.name} (${asset.symbol}), a ${asset.category.toLowerCase()} crypto asset. Find where to trade ${asset.symbol} on licensed and unlicensed exchanges in Hong Kong.`,
  };
}

export default function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetBySymbol(params.symbol);

  if (!asset) {
    notFound();
  }

  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow={`Crypto Asset · ${asset.category}`}
        title={`${asset.name} (${asset.symbol})`}
        subtitle="Overview and where to trade in Hong Kong"
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/assets"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
          >
            ← Back to assets
          </Link>
        </div>

        <article className="card-surface p-6 md:p-8">
          {/* Overview Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Overview</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">{asset.description}</p>
              <p className="text-slate-700 leading-relaxed">
                {asset.name} is one of the major crypto assets available for trading on Hong Kong
                exchanges. Whether you're looking for a licensed platform with regulatory oversight
                or exploring unlicensed options, understanding the asset's fundamentals helps inform
                your trading decisions.
              </p>
            </div>
          </div>

          {/* Key Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Info</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Category</dt>
                <dd className="text-sm text-slate-900">{asset.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Base Chain</dt>
                <dd className="text-sm text-slate-900">{asset.baseChain}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Launch Year</dt>
                <dd className="text-sm text-slate-900">{asset.launchYear}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">Typical Trading Pairs</dt>
                <dd className="text-sm text-slate-900">{asset.tradingPairs.join(', ')}</dd>
              </div>
            </dl>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-medium text-amber-900">Risk Note</p>
              <p className="text-xs text-amber-800 mt-1">{asset.riskNote}</p>
            </div>
          </div>

          {/* Where to Trade Section */}
          <div className="pt-8 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Where to trade in Hong Kong
            </h2>
            <p className="text-slate-700 mb-4">
              Compare licensed and unlicensed crypto exchanges in Hong Kong that support{' '}
              <strong>{asset.symbol}</strong>. Review fees, supported tokens, minimum deposits, and
              regulatory status to find the right platform for your trading needs.
            </p>
            <Link
              href="/exchanges?country=HK&filter=Licensed+only"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              View Hong Kong Exchanges →
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

