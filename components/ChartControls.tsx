'use client'

import React from 'react'
import { ChartType, OverlayType, IndicatorType } from '@/types/chart'

interface ChartControlsProps {
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
  overlays: OverlayType[]
  onOverlaysChange: (overlays: OverlayType[]) => void
  indicators: IndicatorType[]
  onIndicatorsChange: (indicators: IndicatorType[]) => void
  className?: string
}

export default function ChartControls({
  chartType,
  onChartTypeChange,
  overlays,
  onOverlaysChange,
  indicators,
  onIndicatorsChange,
  className = ''
}: ChartControlsProps) {
  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Line' },
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'ohlc', label: 'OHLC' },
  ]

  const availableOverlays: { value: OverlayType; label: string; color: string }[] = [
    { value: 'sma20', label: 'SMA 20', color: '#10b981' },
    { value: 'sma50', label: 'SMA 50', color: '#f59e0b' },
    { value: 'sma200', label: 'SMA 200', color: '#ef4444' },
  ]

  const availableIndicators: { value: IndicatorType; label: string; color: string }[] = [
    { value: 'rsi', label: 'RSI', color: '#8b5cf6' },
    { value: 'macd', label: 'MACD', color: '#06b6d4' },
  ]

  const toggleOverlay = (overlay: OverlayType) => {
    const newOverlays = overlays.includes(overlay)
      ? overlays.filter(o => o !== overlay)
      : [...overlays, overlay]
    onOverlaysChange(newOverlays)
  }

  const toggleIndicator = (indicator: IndicatorType) => {
    const newIndicators = indicators.includes(indicator)
      ? indicators.filter(i => i !== indicator)
      : [...indicators, indicator]
    onIndicatorsChange(newIndicators)
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Chart Type Selector */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {chartTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onChartTypeChange(type.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === type.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Overlays */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Overlays:</span>
        <div className="flex gap-1">
          {availableOverlays.map((overlay) => (
            <button
              key={overlay.value}
              onClick={() => toggleOverlay(overlay.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                overlays.includes(overlay.value)
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: overlays.includes(overlay.value) ? overlay.color : undefined,
                backgroundColor: overlays.includes(overlay.value) ? `${overlay.color}20` : undefined,
              }}
            >
              {overlay.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Indicators:</span>
        <div className="flex gap-1">
          {availableIndicators.map((indicator) => (
            <button
              key={indicator.value}
              onClick={() => toggleIndicator(indicator.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                indicators.includes(indicator.value)
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
              style={{
                borderColor: indicators.includes(indicator.value) ? indicator.color : undefined,
                backgroundColor: indicators.includes(indicator.value) ? `${indicator.color}20` : undefined,
              }}
            >
              {indicator.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}