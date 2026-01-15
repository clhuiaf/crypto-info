// Chart types for the ProChart component

export type OHLCVPoint = {
  time: number; // Unix timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type ChartType = 'line' | 'candlestick' | 'ohlc';

export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W' | '1M';

export type OverlayType = 'sma20' | 'sma50' | 'sma200' | 'bbands';

export type IndicatorType =
  | 'rsi'
  | 'macd'
  | 'volume'
  | 'stochRsi'
  | 'vwap'
  | 'atr';

// Generic indicator key alias
export type IndicatorKey = IndicatorType;

export interface ChartConfig {
  symbol: string;
  timeframe: Timeframe;
  chartType: ChartType;
  overlays: OverlayType[];
  indicators: IndicatorKey[];
  showVolume: boolean;
}

export interface ChartTooltipData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number; // percentage change
  changeValue: number; // absolute change
}

// Timeframe configurations for API calls
export const TIMEFRAME_CONFIGS = {
  '1m': { label: '1M', interval: '1', days: 1 },
  '5m': { label: '5M', interval: '5', days: 1 },
  '15m': { label: '15M', interval: '15', days: 1 },
  '1H': { label: '1H', interval: '1', days: 7 },
  '4H': { label: '4H', interval: '4', days: 30 },
  '1D': { label: '1D', interval: '1', days: 365 },
  '1W': { label: '1W', interval: '7', days: 365 * 2 },
  '1M': { label: '1M', interval: '30', days: 365 * 3 },
} as const;

// Color schemes for consistent theming
export const CHART_COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#ef4444', // red-500
  volume: 'rgba(59, 130, 246, 0.3)',
  grid: '#e2e8f0',
  text: '#64748b',
  overlay: {
    sma20: '#10b981', // emerald-500
    sma50: '#f59e0b', // amber-500
    sma200: '#ef4444', // red-500
  },
  indicator: {
    rsi: '#8b5cf6', // violet-500
    macd: '#06b6d4', // cyan-500
  },
} as const;