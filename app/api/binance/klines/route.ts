import { NextResponse } from 'next/server'
import { BinanceInterval } from '@/lib/binanceMarketData'

export const runtime = 'nodejs'

function isValidInterval(v: string): v is BinanceInterval {
  return [
    '1m',
    '3m',
    '5m',
    '15m',
    '30m',
    '1h',
    '2h',
    '4h',
    '6h',
    '8h',
    '12h',
    '1d',
    '3d',
    '1w',
    '1M',
  ].includes(v)
}

function isValidSymbol(v: string): boolean {
  // Binance symbols are uppercase letters/numbers, no separators.
  return /^[A-Z0-9]{5,20}$/.test(v)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const symbol = (searchParams.get('symbol') || '').toUpperCase()
  const interval = searchParams.get('interval') || ''
  const limitRaw = searchParams.get('limit') || '500'
  const limit = Math.max(1, Math.min(1000, Number(limitRaw) || 500))

  if (!isValidSymbol(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 })
  }
  if (!isValidInterval(interval)) {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 })
  }

  const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(String(limit))}`

  const res = await fetch(url, {
    // allow Next to cache briefly on the server; the chart will still live-update via WS
    next: { revalidate: 10 },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return NextResponse.json(
      { error: `Binance upstream error (${res.status})`, details: body.slice(0, 200) },
      { status: 502 }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}

