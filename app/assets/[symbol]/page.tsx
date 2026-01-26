// Category: Market & portfolio
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAssetBySymbol, assets } from '@/data/assets';
import AssetDetailClient from '@/components/AssetDetailClient';
import { getCache, isExpired, setCache } from '@/lib/cache';
import { fetchAssetDetails, fetchGlobalStats } from '@/lib/coingeckoClient';

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
  let coinDetails = null;
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
      coinDetails = details;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Listing Information
        </h1>
        {lastUpdated && (
          <p className="text-sm text-slate-600" suppressHydrationWarning>
            Last updated: {new Date(lastUpdated).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
            {isStale && <span className="text-orange-600 ml-2">(Data ~10min old)</span>}
          </p>
        )}
      </div>

      <AssetDetailClient asset={asset} coinDetails={coinDetails} chartData={chartData} />
    </div>
  );
}

