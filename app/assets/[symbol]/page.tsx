import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAssetBySymbol, assets } from '@/data/assets';
import AssetDetailClient from '@/components/AssetDetailClient';
import { fetchCoinDetails, fetchHistoricalData } from '@/lib/api';

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
      title: 'Asset Not Found | Cryptopedia',
    };
  }

  return {
    title: `${asset.name} (${asset.symbol}) – overview and where to trade in Hong Kong | Cryptopedia`,
    description: `Learn about ${asset.name} (${asset.symbol}), a ${asset.category.toLowerCase()} crypto asset. Find where to trade ${asset.symbol} on licensed and unlicensed exchanges in Hong Kong.`,
  };
}

// Helper function to map symbol to CoinGecko ID
// This is a simplified mapping - in production, you might want a more comprehensive mapping
const symbolToCoinGeckoId: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'SOL': 'solana',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'DOT': 'polkadot',
};

export default async function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetBySymbol(params.symbol);

  if (!asset) {
    notFound();
  }

  // Try to fetch CoinGecko data for enhanced details
  const coinGeckoId = symbolToCoinGeckoId[asset.symbol.toUpperCase()];
  let coinDetails = null;
  let chartData: { time: number; price: number }[] = [];

  if (coinGeckoId) {
    try {
      coinDetails = await fetchCoinDetails(coinGeckoId, true);
      if (coinDetails) {
        try {
          chartData = await fetchHistoricalData(coinGeckoId, 7, true);
        } catch (err) {
          console.warn('Failed to fetch chart data:', err);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch coin details:', err);
    }
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

