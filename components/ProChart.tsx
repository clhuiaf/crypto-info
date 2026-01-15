'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  HistogramData,
  ColorType,
  CrosshairMode,
  PriceScaleMode,
  TickMarkType,
} from 'lightweight-charts'
import {
  OHLCVPoint,
  ChartType,
  Timeframe,
  OverlayType,
  IndicatorType,
  ChartTooltipData,
  CHART_COLORS,
  TIMEFRAME_CONFIGS,
} from '@/types/chart'
import { formatCurrency } from '@/lib/utils'

interface ProChartProps {
  symbol: string
  data: OHLCVPoint[]
  timeframe: Timeframe
  chartType: ChartType
  overlays: OverlayType[]
  indicators: IndicatorType[]
  height?: number
  onTimeframeChange?: (timeframe: Timeframe) => void
  onSymbolChange?: (symbol: string) => void
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  data: ChartTooltipData | null
}

export default function ProChart({
  symbol,
  data,
  timeframe,
  chartType,
  overlays,
  indicators,
  height = 600,
  onTimeframeChange,
  onSymbolChange,
}: ProChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const overlaySeriesRef = useRef<Map<string, ISeriesApi<'Line'>>>(new Map())
  const indicatorSeriesRef = useRef<Map<IndicatorType, Map<string, ISeriesApi<any>>>>(new Map())

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  })

  // Transform OHLCV data for lightweight-charts
  // CoinGecko API returns timestamps in seconds (Unix timestamp format)
  // Lightweight-charts expects timestamps in seconds, so no conversion needed
  const chartData = useMemo(() => {
    return data.map(point => ({
      time: point.time as any, // Already in seconds from CoinGecko API
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
    }))
  }, [data])

  const volumeData = useMemo(() => {
    return data.map(point => ({
      time: point.time as any, // Already in seconds from CoinGecko API
      value: point.volume,
      color: point.close >= point.open ? CHART_COLORS.volume : 'rgba(239, 68, 68, 0.3)',
    }))
  }, [data])

  // No comparison support (removed feature)
  // const comparisonChartData = []

  // Calculate overlay data (SMA)
  const overlayData = useMemo(() => {
    const result: Record<string, any> = {
      sma20: [],
      sma50: [],
      sma200: [],
      bbands: { upper: [], lower: [] },
    }

    overlays.forEach(overlay => {
      const period = overlay === 'sma20' ? 20 : overlay === 'sma50' ? 50 : 200
      const smaData: LineData[] = []

      for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, p) => acc + p.close, 0)
        const average = sum / period

        smaData.push({
          time: data[i].time as any, // Already in seconds
          value: average,
        })
      }

      result[overlay] = smaData
    })

    // Bollinger Bands (20, 2) - independent calculation
    if (overlays.includes('bbands')) {
      const period = 20
      const mult = 2
      const upper: LineData[] = []
      const lower: LineData[] = []
      for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1).map(d => d.close)
        const mean = slice.reduce((a, b) => a + b, 0) / period
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period
        const sd = Math.sqrt(variance)
        upper.push({ time: data[i].time as any, value: mean + mult * sd })
        lower.push({ time: data[i].time as any, value: mean - mult * sd })
      }
      result.bbands = { upper, lower }
    }

    return result
  }, [data, overlays])

  // Calculate indicator data
  const indicatorData = useMemo(() => {
    const result: Record<IndicatorType, Record<string, any[]>> = {
      rsi: { rsi: [] },
      macd: { macd: [], signal: [], histogram: [] },
    }

    // RSI calculation
    if (indicators.includes('rsi')) {
      const period = 14
      const gains: number[] = []
      const losses: number[] = []

      // Calculate price changes
      for (let i = 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close
        gains.push(change > 0 ? change : 0)
        losses.push(change < 0 ? Math.abs(change) : 0)
      }

      // Calculate RSI
      for (let i = period - 1; i < gains.length; i++) {
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period

        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss
        let rsi = 100 - (100 / (1 + rs))

        result.rsi.rsi.push({
          time: data[i + 1].time as any, // Already in seconds
          value: rsi,
        })
      }
    }

    // MACD calculation
    if (indicators.includes('macd')) {
      const fastPeriod = 12
      const slowPeriod = 26
      const signalPeriod = 9

      // Calculate EMAs
      const ema12 = calculateEMA(data.map(d => d.close), fastPeriod)
      const ema26 = calculateEMA(data.map(d => d.close), slowPeriod)

      // Calculate MACD line
      const macdLine: number[] = []
      for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
        macdLine.push(ema12[ema26.length - ema12.length + i] - ema26[i])
      }

      // Calculate signal line
      const signalLine = calculateEMA(macdLine, signalPeriod)

      // Calculate histogram
      const histogram: number[] = []
      const startIndex = macdLine.length - signalLine.length
      for (let i = 0; i < signalLine.length; i++) {
        histogram.push(macdLine[startIndex + i] - signalLine[i])
      }

      // Format data
      const dataOffset = data.length - macdLine.length
      result.macd.macd = macdLine.map((value, i) => ({
        time: data[dataOffset + i].time as any, // Already in seconds
        value,
      }))

      const signalOffset = data.length - signalLine.length
      result.macd.signal = signalLine.map((value, i) => ({
        time: data[signalOffset + i].time as any, // Already in seconds
        value,
      }))

      const histOffset = data.length - histogram.length
      result.macd.histogram = histogram.map((value, i) => ({
        time: data[histOffset + i].time as any, // Already in seconds
        value,
        color: value >= 0 ? CHART_COLORS.primary : CHART_COLORS.secondary,
      }))
    }

    return result
  }, [data, indicators])

  // Helper function for EMA calculation
  const calculateEMA = (data: number[], period: number): number[] => {
    const multiplier = 2 / (period + 1)
    const ema: number[] = []

    // Start with SMA
    let sum = 0
    for (let i = 0; i < period; i++) {
      sum += data[i]
    }
    ema.push(sum / period)

    // Calculate EMA
    for (let i = period; i < data.length; i++) {
      ema.push((data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1])
    }

    return ema
  }

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: CHART_COLORS.text,
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid },
        horzLines: { color: CHART_COLORS.grid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.grid,
        mode: PriceScaleMode.Normal,
      },
      timeScale: {
        borderColor: CHART_COLORS.grid,
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    })

    chartRef.current = chart

    // Add main price series based on chart type (using 'right' scale for price)
    if (chartType === 'candlestick') {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: CHART_COLORS.primary,
        downColor: CHART_COLORS.secondary,
        borderVisible: false,
        wickUpColor: CHART_COLORS.primary,
        wickDownColor: CHART_COLORS.secondary,
        priceScaleId: 'right', // Explicitly use right scale for price
      })
      candlestickSeries.setData(chartData as CandlestickData[])
      candlestickSeriesRef.current = candlestickSeries
    } else if (chartType === 'line') {
      const lineSeries = chart.addLineSeries({
        color: CHART_COLORS.primary,
        lineWidth: 2,
        priceScaleId: 'right', // Explicitly use right scale for price
      })
      lineSeries.setData(chartData.map(d => ({ time: d.time, value: d.close })))
      lineSeriesRef.current = lineSeries
    } else if (chartType === 'ohlc') {
      // OHLC is similar to candlestick but with different styling
      const ohlcSeries = chart.addCandlestickSeries({
        upColor: CHART_COLORS.primary,
        downColor: CHART_COLORS.secondary,
        borderVisible: true,
        wickUpColor: CHART_COLORS.primary,
        wickDownColor: CHART_COLORS.secondary,
        priceScaleId: 'right', // Explicitly use right scale for price
      })
      ohlcSeries.setData(chartData as CandlestickData[])
      candlestickSeriesRef.current = ohlcSeries
    }

    // Add volume series only if 'volume' indicator is enabled
    if (indicators.includes('volume')) {
      const volumeSeries = chart.addHistogramSeries({
        color: CHART_COLORS.volume,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume', // Separate scale from price data
      })
      volumeSeries.setData(volumeData)
      volumeSeriesRef.current = volumeSeries

      // Configure volume scale to be visible and clearly separated from price
      chart.priceScale('volume').applyOptions({
        visible: true,
        borderColor: CHART_COLORS.grid,
      })
    }

    // comparison feature removed

    // Add overlay series (SMA overlays should use same scale as price)
    overlays.forEach(overlay => {
      if (overlay === 'bbands') {
        // render upper and lower bands
        const upperSeries = chart.addLineSeries({ color: '#93c5fd', lineWidth: 1, priceScaleId: 'right' })
        const lowerSeries = chart.addLineSeries({ color: '#bfdbfe', lineWidth: 1, priceScaleId: 'right' })
        upperSeries.setData(overlayData.bbands.upper)
        lowerSeries.setData(overlayData.bbands.lower)
        overlaySeriesRef.current.set('bbands-upper', upperSeries)
        overlaySeriesRef.current.set('bbands-lower', lowerSeries)
      } else {
        const overlaySeries = chart.addLineSeries({
          color: CHART_COLORS.overlay[overlay as OverlayType] || CHART_COLORS.overlay.sma20,
          lineWidth: 1,
          priceScaleId: 'right', // Use same scale as main price series
        })
        overlaySeries.setData(overlayData[overlay])
        overlaySeriesRef.current.set(overlay, overlaySeries)
      }
    })

    // Add indicator series in separate panes
    indicators.forEach(indicator => {
      if (indicator === 'rsi') {
        const rsiSeries = chart.addLineSeries({
          color: CHART_COLORS.indicator.rsi,
          lineWidth: 1,
          priceScaleId: 'rsi',
        })
        rsiSeries.setData(indicatorData.rsi.rsi)
        if (!indicatorSeriesRef.current.has('rsi')) {
          indicatorSeriesRef.current.set('rsi', new Map())
        }
        indicatorSeriesRef.current.get('rsi')!.set('rsi', rsiSeries)
      } else if (indicator === 'macd') {
        const macdSeries = chart.addLineSeries({
          color: CHART_COLORS.indicator.macd,
          lineWidth: 1,
          priceScaleId: 'macd',
        })
        macdSeries.setData(indicatorData.macd.macd)

        const signalSeries = chart.addLineSeries({
          color: CHART_COLORS.secondary,
          lineWidth: 1,
          priceScaleId: 'macd',
        })
        signalSeries.setData(indicatorData.macd.signal)

        const histSeries = chart.addHistogramSeries({
          priceScaleId: 'macd',
        })
        histSeries.setData(indicatorData.macd.histogram)

        if (!indicatorSeriesRef.current.has('macd')) {
          indicatorSeriesRef.current.set('macd', new Map())
        }
        const macdMap = indicatorSeriesRef.current.get('macd')!
        macdMap.set('macd', macdSeries)
        macdMap.set('signal', signalSeries)
        macdMap.set('histogram', histSeries)
      } else if (indicator === 'volume') {
        // volume handled separately via histogram series at init
      } else {
        // advanced/unsupported indicators (stochRsi, vwap, atr) - not implemented yet
      }
    })

    // Set up crosshair and tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData.size || !param.point) {
        setTooltip(prev => ({ ...prev, visible: false }))
        return
      }

      const mainSeries = candlestickSeriesRef.current || lineSeriesRef.current
      if (!mainSeries) return

      const priceData = param.seriesData.get(mainSeries)
      if (!priceData) return

      const point = chartData.find(d => d.time === param.time)
      if (!point) return

      const prevPoint = data[data.indexOf(point) - 1]
      const prevClose = prevPoint?.close || point.open

      const tooltipData: ChartTooltipData = {
        time: point.time * 1000, // Convert from seconds to milliseconds for display
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
        volume: point.volume,
        change: ((point.close - prevClose) / prevClose) * 100,
        changeValue: point.close - prevClose,
      }

      setTooltip({
        visible: true,
        x: param.point.x,
        y: param.point.y,
        data: tooltipData,
      })
    })

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      chartRef.current = null
      candlestickSeriesRef.current = null
      lineSeriesRef.current = null
      volumeSeriesRef.current = null
      // comparison removed
      overlaySeriesRef.current.clear()
      indicatorSeriesRef.current.clear()
    }
  }, [symbol, chartType, height])

  // Update data when it changes
  useEffect(() => {
    if (!chartRef.current) return

    if (candlestickSeriesRef.current && (chartType === 'candlestick' || chartType === 'ohlc')) {
      candlestickSeriesRef.current.setData(chartData as CandlestickData[])
    } else if (lineSeriesRef.current && chartType === 'line') {
      lineSeriesRef.current.setData(chartData.map(d => ({ time: d.time, value: d.close })))
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(volumeData)
    }

    // Update overlays
    overlays.forEach(overlay => {
      const series = overlaySeriesRef.current.get(overlay)
      if (series) {
        series.setData(overlayData[overlay])
      }
    })

    // Update indicators
    indicators.forEach(indicator => {
      const indicatorMap = indicatorSeriesRef.current.get(indicator)
      if (indicatorMap) {
        if (indicator === 'rsi') {
          const rsiSeries = indicatorMap.get('rsi')
          if (rsiSeries) {
            rsiSeries.setData(indicatorData.rsi.rsi)
          }
        } else if (indicator === 'macd') {
          const macdSeries = indicatorMap.get('macd')
          const signalSeries = indicatorMap.get('signal')
          const histSeries = indicatorMap.get('histogram')
          if (macdSeries) macdSeries.setData(indicatorData.macd.macd)
          if (signalSeries) signalSeries.setData(indicatorData.macd.signal)
          if (histSeries) histSeries.setData(indicatorData.macd.histogram)
        }
      }
    })
  }, [chartData, volumeData, overlayData, indicatorData, chartType, overlays, indicators])

  // Reset zoom function
  const resetZoom = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [])

  return (
    <div className="relative">
      <div ref={chartContainerRef} className="w-full" style={{ height }} />

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: tooltip.x > window.innerWidth / 2 ? 'translateX(-100%)' : 'none',
          }}
        >
          <div className="text-sm font-medium text-gray-900 mb-1">
            {new Date(tooltip.data.time).toLocaleString()}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>O: {formatCurrency(tooltip.data.open)}</div>
            <div>H: {formatCurrency(tooltip.data.high)}</div>
            <div>L: {formatCurrency(tooltip.data.low)}</div>
            <div>C: {formatCurrency(tooltip.data.close)}</div>
            <div>Volume: {formatCurrency(tooltip.data.volume)}</div>
            <div className={tooltip.data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {tooltip.data.change >= 0 ? '+' : ''}{tooltip.data.change.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Reset Zoom Button */}
      <button
        onClick={resetZoom}
        className="absolute top-2 right-2 bg-white border border-gray-200 rounded px-2 py-1 text-xs hover:bg-gray-50"
      >
        Reset Zoom
      </button>
    </div>
  )
}