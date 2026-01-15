'use client'

export default function MarketHeaderRow() {
  return (
    <div className="hidden lg:grid lg:grid-cols-[40px,minmax(0,2.4fr),minmax(120px,1fr),80px,80px,80px,minmax(150px,1.1fr),minmax(150px,1.1fr)] lg:items-center gap-3 px-6 py-3 text-xs font-semibold text-slate-500">
      <div>#</div>
      <div>Coin</div>
      <div className="text-right">Price</div>
      <div className="text-right">1h</div>
      <div className="text-right">24h</div>
      <div className="text-right">7d</div>
      <div className="text-right">24h Volume</div>
      <div className="text-right">Market Cap</div>
    </div>
  )
}