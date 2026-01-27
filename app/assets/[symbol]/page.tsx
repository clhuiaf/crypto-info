// Category: Market & portfolio
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAssetBySymbol, assets } from '@/data/assets';
import AssetDetailClient from '@/components/AssetDetailClient';
import { getCache, isExpired, setCache } from '@/lib/cache';
import { fetchAssetDetails } from '@/lib/coingeckoClient';
import { CoinDetails } from '@/lib/api';
import PageShell from '@/components/PageShell';

interface AssetPageProps {
  params: {
    symbol: string;
  };
}

// Remove generateStaticParams - make this page dynamic/ISR instead
// This prevents build-time CoinGecko calls while still allowing good performance
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const asset = getAssetBySymbol(params.symbol);

  if (!asset) {
    return {
      title: 'Asset Not Found | Cryptopedia',
    };
  }

  return {
    title: `${asset.name} (${asset.symbol}) – overview and where to trade in Hong Kong | Cryptopedia`,
    description: `Learn about ${asset.name} (${asset.symbol}), a ${asset.category.toLowerCase()} crypto asset. Find where to trade ${asset.symbol} on licensed and unlicensed exchanges in Hong Kong.`,
  };
}

export default async function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetBySymbol(params.symbol);

  if (!asset) {
    notFound();
  }

  // Fetch data from internal API that reads only from cache
  let coinDetails: CoinDetails | null = null;
  let chartData: { time: number; price: number }[] = [];
  let lastUpdated: number | null = null;
  let isStale = false;

  try {
    // Prefer calling data sources directly on the server rather than HTTPing our own API routes.
    // This avoids "Invalid URL" errors in Node and is deploy-safe.
    // Try to read cached asset details first (if you have a cache key strategy you can use it here).
    // For simplicity, fetch directly from CoinGecko if needed.
    const details = await fetchAssetDetails(params.symbol);
    if (details) {
      // fetchAssetDetails returns data from CoinGecko; assert to CoinDetails so TypeScript understands the shape.
      coinDetails = details as CoinDetails;
      lastUpdated = Date.now();
      isStale = false;
    } else {
      console.warn(`No asset details returned for ${params.symbol}`);
    }

    // Fetch chart data directly from CoinGecko via lib/api helper for historical data.
    // Using fetchCoinById or fetchHistoricalData would be ideal, but reuse fetchGlobalStats as a placeholder
    // if detailed chart endpoint wrapper is not available in coingeckoClient.
    // Here we call the helper in lib/api.ts for historical data instead.
    const { fetchHistoricalData } = await import('@/lib/api');
    chartData = await fetchHistoricalData(params.symbol, 7, true);
  } catch (err) {
    console.warn('Failed to fetch data for asset page:', err);
  }
  // Try to pick up a market image from cached markets so we always have a logo for listing symbols.
  let assetWithLogo = asset;
  try {
    const marketsEntry = getCache<any>('markets');
    const markets = (marketsEntry?.value ?? []) as any[];
    const marketMatch = markets.find((m: any) => (m.symbol ?? '').toUpperCase() === params.symbol.toUpperCase());
    if (marketMatch?.image) {
      assetWithLogo = { ...asset, logoUrl: marketMatch.image };
    }
  } catch (e) {
    // ignore cache errors; asset will render with existing fallbacks
  }
  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-white">
            Listing Information
          </h1>
          <p className="mt-1 text-sm brand-icon">
            Detailed information for this cryptocurrency and its listings.
          </p>

          {lastUpdated && (
            <p className="mt-2 text-sm brand-icon" suppressHydrationWarning>
              Last updated: {new Date(lastUpdated).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
              {isStale && <span className="text-amber-200 ml-2">(Data ~10min old)</span>}
            </p>
          )}
        </header>

        {/* White content area with separate cards (AssetDetailClient already renders card sections) */}
        <div className="space-y-4">
          <div className="space-y-6">
            <AssetDetailClient asset={assetWithLogo} coinDetails={coinDetails} chartData={chartData} />
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  );
}

