// Category: Platforms & opportunities
'use client';

import { useState, useMemo } from 'react';
import WalletHeaderFilters from '@/components/WalletHeaderFilters';
import WalletSidebar from '@/components/WalletSidebar';
import WalletCard from '@/components/WalletCard';
import { mockWallets } from '@/data/mockWallets';
import { WalletFilterType, WalletSortType, WalletSidebarFilters } from '@/types/wallet';

const initialSidebarFilters: WalletSidebarFilters = {
  walletType: {
    hardware: false,
    software: false,
    browser: false,
    mobile: false,
  },
  custody: {
    custodial: false,
    nonCustodial: false,
  },
  networks: {
    bitcoin: false,
    ethereum: false,
    solana: false,
    multiChain: false,
  },
  useCase: {
    beginnerFriendly: false,
    defi: false,
    nfts: false,
    longTermStorage: false,
  },
};

export default function WalletsPage() {
  const [filter, setFilter] = useState<WalletFilterType>('All');
  const [sort, setSort] = useState<WalletSortType>('Name (A-Z)');
  const [sidebarFilters, setSidebarFilters] = useState<WalletSidebarFilters>(initialSidebarFilters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort wallets
  const filteredAndSortedWallets = useMemo(() => {
    let filtered = [...mockWallets];

    // Apply main filter (top bar)
    if (filter === 'Hardware only') {
      filtered = filtered.filter((w) => w.type === 'Hardware');
    } else if (filter === 'Non-custodial only') {
      filtered = filtered.filter((w) => w.custody === 'Non-custodial');
    } else if (filter === 'Beginner friendly') {
      filtered = filtered.filter((w) => w.useCases.includes('Beginner friendly'));
    }

    // Apply sidebar filters
    const { walletType, custody, networks, useCase } = sidebarFilters;

    // Wallet type filters
    const typeFilters: string[] = [];
    if (walletType.hardware) typeFilters.push('Hardware');
    if (walletType.software) typeFilters.push('Software');
    if (walletType.browser) typeFilters.push('Browser');
    if (walletType.mobile) typeFilters.push('Mobile');

    if (typeFilters.length > 0) {
      filtered = filtered.filter((w) => typeFilters.includes(w.type));
    }

    // Custody filters
    const custodyFilters: string[] = [];
    if (custody.custodial) custodyFilters.push('Custodial');
    if (custody.nonCustodial) custodyFilters.push('Non-custodial');

    if (custodyFilters.length > 0) {
      filtered = filtered.filter((w) => custodyFilters.includes(w.custody));
    }

    // Network filters
    const networkFilters: string[] = [];
    if (networks.bitcoin) networkFilters.push('Bitcoin');
    if (networks.ethereum) networkFilters.push('Ethereum');
    if (networks.solana) networkFilters.push('Solana');
    if (networks.multiChain) networkFilters.push('Multi-chain');

    if (networkFilters.length > 0) {
      filtered = filtered.filter((w) =>
        w.networks.some((n) => networkFilters.includes(n))
      );
    }

    // Use case filters
    const useCaseFilters: string[] = [];
    if (useCase.beginnerFriendly) useCaseFilters.push('Beginner friendly');
    if (useCase.defi) useCaseFilters.push('DeFi');
    if (useCase.nfts) useCaseFilters.push('NFTs');
    if (useCase.longTermStorage) useCaseFilters.push('Long-term storage');

    if (useCaseFilters.length > 0) {
      filtered = filtered.filter((w) =>
        w.useCases.some((uc) => useCaseFilters.includes(uc))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'Name (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Name (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filter, sort, sidebarFilters]);

  const handleClearFilters = () => {
    setSidebarFilters(initialSidebarFilters);
  };

  return (
    <div className="app-shell flex flex-col">
      <WalletHeaderFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <WalletSidebar
          filters={sidebarFilters}
          onFilterChange={setSidebarFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filters Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all shadow-sm hover:shadow-md"
            >
              Filters
            </button>
          </div>

          {/* Mobile Sidebar Modal */}
          <WalletSidebar
            filters={sidebarFilters}
            onFilterChange={setSidebarFilters}
            onClearFilters={handleClearFilters}
            isMobile={true}
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
          />

          {/* Wallet Cards Grid */}
          <div className="space-y-4">
            {filteredAndSortedWallets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No wallets found matching your filters.</p>
              </div>
            ) : (
              filteredAndSortedWallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


