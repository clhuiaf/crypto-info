'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Asset } from '@/types/asset';
import { CoinDetails } from '@/lib/api';
import { formatCurrency, formatPercentage, formatMarketCap, formatDate } from '@/lib/utils';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist';
import PriceChart from '@/components/PriceChart';

interface AssetDetailClientProps {
  asset: Asset;
  coinDetails: CoinDetails | null;
  chartData: { time: number; price: number }[];
}

export default function AssetDetailClient({ asset, coinDetails, chartData }: AssetDetailClientProps) {
  const [isWatched, setIsWatched] = useState(false);

  // Use coinDetails ID if available, otherwise use asset symbol
  const watchlistId = coinDetails?.id || asset.symbol.toLowerCase();

  useEffect(() => {
    setIsWatched(isInWatchlist(watchlistId));
  }, [watchlistId]);

  const handleWatchlistToggle = () => {
    if (isWatched) {
      removeFromWatchlist(watchlistId);
      setIsWatched(false);
    } else {
      addToWatchlist({
        id: watchlistId,
        symbol: asset.symbol,
        name: asset.name,
      });
      setIsWatched(true);
    }
  };

  // Extract data from coinDetails if available
  const price = coinDetails?.market_data?.current_price?.usd;
  const change24h = coinDetails?.market_data?.price_change_percentage_24h;
  const marketCap = coinDetails?.market_data?.market_cap?.usd;
  const fdv = coinDetails?.market_data?.fully_diluted_valuation?.usd;
  const genesisDate = coinDetails?.genesis_date;

  // Memoize expensive computations
  const tradingPairs = useMemo(() => {
    return coinDetails?.tickers
      ?.slice(0, 10)
      .map((ticker) => `${ticker.base}/${ticker.target}`)
      .filter((pair, index, self) => self.indexOf(pair) === index)
      .slice(0, 5) || asset.tradingPairs.map((pair) => `${asset.symbol}/${pair}`);
  }, [coinDetails?.tickers, asset.tradingPairs, asset.symbol]);

  const exchanges = useMemo(() => {
    return coinDetails?.tickers
      ?.map((ticker) => ticker.market.name)
      .filter((name, index, self) => self.indexOf(name) === index)
      .slice(0, 5) || [];
  }, [coinDetails?.tickers]);

  // Use coinDetails image if available, otherwise use asset logo
  const coinImage = coinDetails?.image?.large;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            {coinImage ? (
              <img
                src={coinImage}
                alt={asset.name}
                className="h-16 w-16 rounded-full mr-4"
              />
            ) : (
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mr-4">
                {asset.logo || asset.symbol}
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{asset.name}</h2>
              <p className="text-lg text-slate-500 uppercase">{asset.symbol}</p>
            </div>
          </div>
          <button
            onClick={handleWatchlistToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isWatched
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isWatched ? '✓ In Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>

        {/* Price Stats Grid */}
        {(price !== undefined || marketCap !== undefined) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {price !== undefined && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Price</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(price)}</p>
              </div>
            )}
            {change24h !== undefined && (
              <div>
                <p className="text-sm text-slate-600 mb-1">24h Change</p>
                <p
                  className={`text-xl font-semibold ${
                    change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercentage(change24h)}
                </p>
              </div>
            )}
            {marketCap !== undefined && (
              <div>
                <p className="text-sm text-slate-600 mb-1">Market Cap</p>
                <p className="text-xl font-semibold text-slate-900">{formatMarketCap(marketCap)}</p>
              </div>
            )}
            {fdv !== undefined && (
              <div>
                <p className="text-sm text-slate-600 mb-1">FDV</p>
                <p className="text-xl font-semibold text-slate-900">
                  {fdv ? formatMarketCap(fdv) : 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <div className="prose max-w-none">
              {coinDetails?.description?.en ? (
                <p className="text-slate-700 whitespace-pre-line">
                  {coinDetails.description.en.replace(/<[^>]*>/g, '').substring(0, 500)}
                  {coinDetails.description.en.length > 500 && '...'}
                </p>
              ) : (
                <p className="text-slate-700">{asset.description}</p>
              )}
            </div>
          </div>

          {/* Key Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Info</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Category</p>
                <p className="text-base text-slate-900">{asset.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Base Chain</p>
                <p className="text-base text-slate-900">{asset.baseChain}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Launch Year</p>
                <p className="text-base text-slate-900">{asset.launchYear}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Typical Trading Pairs</p>
                <p className="text-base text-slate-900">{asset.tradingPairs.join(', ')}</p>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-900">Risk Note</p>
                <p className="text-xs text-amber-800 mt-1">{asset.riskNote}</p>
              </div>
            </div>
          </div>

          {/* Listing Details Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Listing Details</h2>
            <div className="space-y-4">
              {genesisDate && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Listing/IDO Date</p>
                  <p className="text-base text-slate-900">{formatDate(genesisDate)}</p>
                </div>
              )}

              {exchanges.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Main Exchanges</p>
                  <div className="flex flex-wrap gap-2">
                    {exchanges.map((exchange) => (
                      <span
                        key={exchange}
                        className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-md"
                      >
                        {exchange}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tradingPairs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Trading Pairs</p>
                  <div className="flex flex-wrap gap-2">
                    {tradingPairs.map((pair) => (
                      <span
                        key={pair}
                        className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-md"
                      >
                        {pair}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {price !== undefined && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Initial Price</p>
                  <p className="text-base text-slate-900">{formatCurrency(price)}</p>
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Price Chart */}
          {chartData.length > 0 && (
            <PriceChart data={chartData} coinName={asset.name} />
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Links */}
          {coinDetails?.links && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Links</h2>
              <div className="space-y-3">
                {coinDetails.links.homepage && coinDetails.links.homepage[0] && (
                  <a
                    href={coinDetails.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Website
                  </a>
                )}

                {coinDetails.links.whitepaper && (
                  <a
                    href={coinDetails.links.whitepaper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Whitepaper
                  </a>
                )}

                {coinDetails.links.twitter_screen_name && (
                  <a
                    href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter/X
                  </a>
                )}

                {coinDetails.links.telegram_channel_identifier && (
                  <a
                    href={`https://t.me/${coinDetails.links.telegram_channel_identifier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    Telegram
                  </a>
                )}

                {coinDetails.links.subreddit_url && (
                  <a
                    href={coinDetails.links.subreddit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                    Reddit
                  </a>
                )}

                {!coinDetails.links.homepage?.[0] &&
                  !coinDetails.links.whitepaper &&
                  !coinDetails.links.twitter_screen_name &&
                  !coinDetails.links.telegram_channel_identifier &&
                  !coinDetails.links.subreddit_url && (
                    <p className="text-slate-500 text-sm italic">No links available</p>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
