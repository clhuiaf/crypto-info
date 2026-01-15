'use client'

export default function SidebarPlaceholder() {
  return (
    <div className="card-surface p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Sponsored
      </h3>
      <div className="space-y-3">
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}