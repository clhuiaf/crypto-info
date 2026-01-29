'use client'

import MarketHeaderRow from '@/components/MarketHeaderRow'
import CryptoRow from '@/components/CryptoRow'
import { CryptoPrice } from '@/lib/api'
import React from 'react'

interface MarketTableProps {
  assets: CryptoPrice[]
  onRemove?: (id: string) => void
  showActions?: boolean
}

export default function MarketTable({ assets, onRemove, showActions = false }: MarketTableProps) {
  return (
    <section className="mt-6">
      <div className="mx-auto overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <MarketHeaderRow />
        <div className="space-y-0">
          {assets.map((asset, index) => {
            const action = showActions ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onRemove?.(asset.id)
                }}
                className="px-2 py-1 rounded-md text-xs bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
              >
                Remove
              </button>
            ) : undefined

            return (
              <CryptoRow
                key={asset.id}
                crypto={asset}
                index={index}
                isLast={index === assets.length - 1}
                action={action}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

