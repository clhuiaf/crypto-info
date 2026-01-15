'use client'

import React, { useState } from 'react'
import { IndicatorKey } from '@/types/chart'

interface Props {
  enabledIndicators: IndicatorKey[]
  onChange: (inds: IndicatorKey[]) => void
}

const ADVANCED: { key: IndicatorKey; label: string }[] = [
  { key: 'stochRsi', label: 'Stochastic RSI' },
  { key: 'vwap', label: 'VWAP' },
  { key: 'atr', label: 'ATR' },
]

export default function MoreIndicatorsDrawer({ enabledIndicators, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const toggle = (key: IndicatorKey) => {
    const next = enabledIndicators.includes(key)
      ? enabledIndicators.filter(k => k !== key)
      : [...enabledIndicators, key]
    onChange(next)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-sm text-blue-600 hover:underline"
        aria-expanded={open}
      >
        More indicators
      </button>

      <div
        className={`mt-2 overflow-hidden transition-all duration-200 ease-out ${open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!open}
      >
        <div className="p-2 bg-gray-50 border border-gray-100 rounded">
          <div className="text-xs text-gray-600 font-medium mb-2">Advanced indicators</div>
          <div className="grid grid-cols-1 gap-1">
            {ADVANCED.map(item => (
              <label key={item.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={enabledIndicators.includes(item.key)}
                  onChange={() => toggle(item.key)}
                  className="form-checkbox"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

