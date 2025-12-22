'use client';

import { Exchange } from '@/types/exchange';
import { useState } from 'react';

interface ComparisonBarProps {
  selectedExchanges: Exchange[];
  onClearSelection: () => void;
}

export default function ComparisonBar({ selectedExchanges, onClearSelection }: ComparisonBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedExchanges.length === 0) {
    return null;
  }

  const maxExchanges = 3;
  const displayExchanges = selectedExchanges.slice(0, maxExchanges);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Selected ({selectedExchanges.length}):
              </span>
              <div className="flex gap-2 flex-wrap">
                {displayExchanges.map((exchange) => (
                  <span
                    key={exchange.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {exchange.name}
                  </span>
                ))}
                {selectedExchanges.length > maxExchanges && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    +{selectedExchanges.length - maxExchanges} more
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClearSelection}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
              >
                Compare now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Compare Exchanges</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 pr-6 font-semibold text-gray-900">Feature</th>
                        {displayExchanges.map((exchange) => (
                          <th key={exchange.id} className="pb-3 px-4 font-semibold text-gray-900">
                            {exchange.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 pr-6 font-medium text-gray-700">Legal status</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-gray-600">
                            {exchange.licensed ? (
                              <span className="text-green-600 font-medium">Licensed</span>
                            ) : (
                              <span className="text-red-600 font-medium">Unlicensed</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 pr-6 font-medium text-gray-700">Products</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-gray-600">
                            {exchange.products.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 pr-6 font-medium text-gray-700">Fees</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-gray-600">
                            Maker {exchange.makerFee}% · Taker {exchange.takerFee}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 pr-6 font-medium text-gray-700">Tokens</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-gray-600">
                            {exchange.tokensTotal}+ total
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 pr-6 font-medium text-gray-700">Min deposit</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-gray-600">
                            ${exchange.minDepositUsd} USD
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

