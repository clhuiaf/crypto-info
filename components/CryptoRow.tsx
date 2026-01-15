'use client'

import Image from 'next/image'
import { CryptoPrice } from '@/lib/api'
import { ReactNode } from 'react'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '@/lib/utils'

interface CryptoRowProps {
  crypto: CryptoPrice
  index: number
  isLast?: boolean
  action?: ReactNode
}

export default function CryptoRow({ crypto, index, isLast = false, action }: CryptoRowProps) {
  const getChangeColor = (change: number | null | undefined) => {
    if (change === null || change === undefined) return 'text-slate-500'
    return change >= 0 ? 'text-emerald-500' : 'text-red-500'
  }

  const getTrendText = (change7d: number | null | undefined) => {
    if (change7d === null || change7d === undefined) return 'N/A'
    if (change7d > 5) return 'Strong Up'
    if (change7d > 0) return 'Uptrend'
    if (change7d > -5) return 'Flat'
    return 'Downtrend'
  }

  return (
    <article className={`px-6 py-4 lg:grid lg:grid-cols-[40px,minmax(0,2.4fr),minmax(120px,1fr),80px,80px,80px,minmax(150px,1.1fr),minmax(150px,1.1fr)] lg:items-center lg:gap-3 ${isLast ? 'rounded-b-xl' : ''}`}>
      {/* Mobile layout */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-sm text-slate-500 w-8">
            {index + 1}
          </div>

          <div className="flex items-center gap-3 flex-1">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-6 w-6 rounded-full"
            />
            <div className="flex-1 min-w-0 before:content-[''] after:content-[''] flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900 truncate">
                  {crypto.name}
                </div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {crypto.symbol}
                </div>
              </div>
              {action ? <div className="ml-3 flex-shrink-0">{action}</div> : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="text-sm font-medium text-slate-900">
            {formatCurrency(crypto.current_price)}
          </div>
          <div className={`text-sm font-medium ${getChangeColor(crypto.price_change_percentage_24h)}`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </div>
        </div>
      </div>

      {/* Desktop grid layout */}
      <div className="hidden lg:block text-sm text-slate-500">
        {index + 1}
      </div>

      <div className="hidden lg:flex lg:items-center gap-3 min-w-0 before:content-[''] after:content-['']">
        <Image
          src={crypto.image}
          alt={crypto.name}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full"
        />
        <div className="min-w-0 flex items-center justify-between w-full">
          <div>
            <p className="truncate text-sm font-medium text-slate-900">
              {crypto.name}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {crypto.symbol}
            </p>
          </div>
          {action ? <div className="ml-3 flex-shrink-0">{action}</div> : null}
        </div>
      </div>

      <div className="hidden lg:block text-sm font-medium text-slate-900 text-right whitespace-nowrap">
        {formatCurrency(crypto.current_price)}
      </div>

      <div className={`hidden lg:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_1h_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
      </div>

      <div className={`hidden lg:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_24h)}`}>
        {formatPercentage(crypto.price_change_percentage_24h)}
      </div>

      <div className={`hidden lg:block text-sm font-medium text-right whitespace-nowrap ${getChangeColor(crypto.price_change_percentage_7d_in_currency)}`}>
        {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
      </div>

      <div className="hidden lg:block text-sm text-slate-500 text-right whitespace-nowrap">
        {formatVolume(crypto.total_volume)}
      </div>

      <div className="hidden lg:block text-sm text-slate-500 text-right whitespace-nowrap">
        {formatMarketCap(crypto.market_cap)}
      </div>

    </article>
  )
}