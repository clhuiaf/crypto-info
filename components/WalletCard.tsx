'use client';

import Link from 'next/link';
import { Wallet } from '@/types/wallet';

interface WalletCardProps {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  return (
    <div className="card-surface border-2 p-5 md:p-6 transition-all border-slate-200">
      <div className="relative">
        {/* Top row: Name and Type badge */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
              {wallet.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{wallet.type} · {wallet.custody}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="badge-soft bg-blue-50 text-blue-700 border border-blue-200">
              {wallet.type}
            </span>
            <span className={`badge-soft ${
              wallet.custody === 'Non-custodial'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {wallet.custody}
            </span>
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {wallet.platforms.map((platform) => (
              <span key={platform} className="pill-tab bg-slate-50 border-slate-200 text-[11px]">
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Networks */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Supported networks
          </p>
          <div className="flex flex-wrap gap-2">
            {wallet.networks.map((network) => (
              <span key={network} className="pill-tab bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px]">
                {network}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Key features
          </p>
          <p className="text-xs text-slate-600">{wallet.features.join(' · ')}</p>
        </div>

        {/* Supported Assets */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Supported major assets
          </p>
          <p className="text-sm text-slate-900 font-mono">{wallet.supportedAssets.join(', ')}</p>
        </div>

        {/* Pros and Cons */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-[0.16em] mb-1">
              Pros
            </p>
            <p className="text-xs text-emerald-900">{wallet.pros}</p>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-[0.16em] mb-1">
              Cons
            </p>
            <p className="text-xs text-rose-900">{wallet.cons}</p>
          </div>
        </div>

        {/* Bottom row: Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <a
            href={wallet.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium text-sm text-center transition-colors"
          >
            Visit wallet
          </a>
          <Link
            href={`/wallets/${wallet.slug}`}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm text-center"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}


