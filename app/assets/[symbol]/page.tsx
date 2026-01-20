// Category: Market & portfolio
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAssetBySymbol, assets } from '@/data/assets';
import AssetDetailClient from '@/components/AssetDetailClient';

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

  // Fetch data from internal APIs that read only from cache
  let coinDetails = null;
  let chartData: { time: number; price: number }[] = [];

  try {
    // Fetch asset data from internal API
    const assetResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/assets/${params.symbol}`,
      { next: { revalidate: 60 } }
    );

    if (assetResponse.ok) {
      const assetData = await assetResponse.json();
      coinDetails = assetData.coinDetails;
    } else {
      console.warn(`Failed to fetch asset data for ${params.symbol}:`, assetResponse.status);
    }

    // Fetch chart data from internal API
    const chartResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/charts/${params.symbol}?days=7`,
      { next: { revalidate: 60 } }
    );

    if (chartResponse.ok) {
      const chartApiData = await chartResponse.json();
      if (chartApiData.chartData) {
        chartData = chartApiData.chartData.prices;
      }
    } else {
      console.warn(`Failed to fetch chart data for ${params.symbol}:`, chartResponse.status);
    }
  } catch (err) {
    console.warn('Failed to fetch data from internal APIs:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Listing Information
        </h1>
      </div>

      <AssetDetailClient asset={asset} coinDetails={coinDetails} chartData={chartData} />
    </div>
  );
}

