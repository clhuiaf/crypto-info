'use client';

import { Exchange } from '@/types/exchange';
import { useState } from 'react';

interface ExchangeCardProps {
  exchange: Exchange;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function ExchangeCard({ exchange, isSelected, onToggleSelect }: ExchangeCardProps) {
  const productsText = exchange.products.join(', ');
  const fundingCountdown = '08:15:23'; // Static placeholder

  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 shadow-sm hover:shadow-md transition-shadow ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="relative">
        {/* Ad badge placeholder */}
        <div className="absolute top-0 right-0">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Ad</span>
        </div>

        {/* Top row: Name and License badge */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{exchange.name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              exchange.licensed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {exchange.licensed ? 'LICENSED' : 'UNLICENSED'}
          </span>
        </div>

        {/* Second row: Products and Funding */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Products: {productsText}
          </p>
          {exchange.hasPerps && exchange.fundingRate !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Funding: {exchange.fundingRate}%</span>
              <span className="text-gray-400">·</span>
              <span>Resets in {fundingCountdown}</span>
            </div>
          )}
        </div>

        {/* Third row: Tokens */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">
            Tokens: {exchange.tokensTotal}+
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Majors: {exchange.tokensMajors} · Altcoins: {exchange.tokensAltcoins} · Memecoins: {exchange.tokensMemecoins}
          </p>
        </div>

        {/* Fourth row: Fees and Min deposit */}
        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-700">
            Fees: Maker {exchange.makerFee}% · Taker {exchange.takerFee}%
          </p>
          <p className="text-sm text-gray-700">
            Min deposit: ${exchange.minDepositUsd} USD
          </p>
        </div>

        {/* Bottom row: Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onToggleSelect(exchange.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Compare
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm">
            Open with referral
          </button>
        </div>
      </div>
    </div>
  );
}

