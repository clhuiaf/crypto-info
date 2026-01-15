// Category: Platforms & opportunities
'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import ExchangeCard from '@/components/ExchangeCard';
import ComparisonBar from '@/components/ComparisonBar';
import PageShell from '@/components/PageShell';
import PageToolbar from '@/components/PageToolbar';
// SidebarPlaceholder removed — sponsored sidebar removed per design
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { mockExchanges } from '@/data/mockExchanges';
import { Exchange, FilterType, SortType, SidebarFilters } from '@/types/exchange';

const DEFAULT_FILTER: FilterType = 'Licensed only';

const initialSidebarFilters: SidebarFilters = {
  legalStatus: {
    licensed: false,
    unlicensed: false,
  },
  products: {
    spot: false,
    derivatives: false,
  },
  minDeposit: {
    under50: false,
    between50and500: false,
    over500: false,
  },
};

export default function ExchangesPage() {
  const [filter, setFilter] = useState<FilterType>(DEFAULT_FILTER);
  const [sort, setSort] = useState<SortType>('Fees (low to high)');
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(initialSidebarFilters);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort exchanges (locked to Hong Kong)
  const filteredAndSortedExchanges = useMemo(() => {
    let filtered = [...mockExchanges];

    // Apply country filter (locked to HK)
    filtered = filtered.filter((ex) => ex.country === 'HK');

    // Apply main filter (top bar)
    if (filter === 'Licensed only') {
      filtered = filtered.filter((ex) => ex.licensed);
    } else if (filter === 'Spot only') {
      filtered = filtered.filter((ex) => ex.products.includes('Spot'));
    } else if (filter === 'Derivatives only') {
      filtered = filtered.filter((ex) => ex.products.includes('Derivatives'));
    }
    // "Licensed + unlicensed" shows all by license; sidebar can further restrict

    // Apply sidebar filters
    const { legalStatus, products, minDeposit } = sidebarFilters;

    // Legal status filters
    if (legalStatus.licensed && !legalStatus.unlicensed) {
      filtered = filtered.filter((ex) => ex.licensed);
    } else if (legalStatus.unlicensed && !legalStatus.licensed) {
      filtered = filtered.filter((ex) => !ex.licensed);
    }

    // Products filters
    if (products.spot && !products.derivatives) {
      filtered = filtered.filter((ex) => ex.products.includes('Spot') && !ex.products.includes('Derivatives'));
    } else if (products.derivatives && !products.spot) {
      filtered = filtered.filter((ex) => ex.products.includes('Derivatives') && !ex.products.includes('Spot'));
    } else if (products.spot && products.derivatives) {
      filtered = filtered.filter((ex) => ex.products.includes('Spot') && ex.products.includes('Derivatives'));
    }

    // Min deposit filters
    const depositFilters: boolean[] = [];
    if (minDeposit.under50) depositFilters.push(true);
    if (minDeposit.between50and500) depositFilters.push(true);
    if (minDeposit.over500) depositFilters.push(true);

    if (depositFilters.length > 0) {
      filtered = filtered.filter((ex) => {
        if (minDeposit.under50 && ex.minDepositUsd < 50) return true;
        if (minDeposit.between50and500 && ex.minDepositUsd >= 50 && ex.minDepositUsd <= 500) return true;
        if (minDeposit.over500 && ex.minDepositUsd > 500) return true;
        return false;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'Fees (low to high)':
          return a.takerFee - b.takerFee;
        case 'Fees (high to low)':
          return b.takerFee - a.takerFee;
        case 'Tokens (high to low)':
          return b.tokensTotal - a.tokensTotal;
        case 'Min deposit (low to high)':
          return a.minDepositUsd - b.minDepositUsd;
        default:
          return 0;
      }
    });

    return sorted;
  }, [filter, sort, sidebarFilters]);

  const selectedExchanges = useMemo(() => {
    return mockExchanges.filter((ex) => selectedExchangeIds.has(ex.id));
  }, [selectedExchangeIds]);

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedExchangeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 3) {
        newSet.add(id);
      }
    }
    setSelectedExchangeIds(newSet);
  };

  const handleClearFilters = () => {
    setSidebarFilters(initialSidebarFilters);
    setFilter(DEFAULT_FILTER);
  };

  const handleClearSelection = () => {
    setSelectedExchangeIds(new Set());
  };

  const toolbar = (
    <PageToolbar
      left={
        <>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
            Hong Kong 🇭🇰
          </span>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Licensed only">Licensed only</option>
            <option value="Licensed + unlicensed">All exchanges</option>
            <option value="Spot only">Spot only</option>
            <option value="Derivatives only">Derivatives only</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Fees (low to high)">Fees (low to high)</option>
            <option value="Fees (high to low)">Fees (high to low)</option>
            <option value="Tokens (high to low)">Tokens (high to low)</option>
            <option value="Min deposit (low to high)">Min deposit (low to high)</option>
            <option value="Name (A-Z)">Name (A-Z)</option>
          </select>
        </>
      }
      right={
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 font-medium text-sm shadow-sm hover:shadow-md transition-all"
        >
          Show exchanges
        </button>
      }
    />
  )

  const mainContent = (
    <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
      {/* Filter Sidebar */}
      <Sidebar
        filters={sidebarFilters}
        onFilterChange={setSidebarFilters}
        onClearFilters={handleClearFilters}
        isMobile={false}
      />

      {/* Exchange Cards */}
      <div className="space-y-4">
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
        <Sidebar
          filters={sidebarFilters}
          onFilterChange={setSidebarFilters}
          onClearFilters={handleClearFilters}
          isMobile={true}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {filteredAndSortedExchanges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exchanges found matching your filters.</p>
            <p className="text-gray-400 text-sm mt-2">Country: HK, Filter: {filter}</p>
          </div>
        ) : (
          filteredAndSortedExchanges.map((exchange) => (
            <ErrorBoundary key={`${exchange.id}-${filter}`}>
              <ExchangeCard
                exchange={exchange}
                isSelected={selectedExchangeIds.has(exchange.id)}
                onToggleSelect={handleToggleSelect}
              />
            </ErrorBoundary>
          ))
        )}
      </div>

    </div>
  )

  return (
    <div>
      <PageShell
        title="Find the right crypto exchange"
        subtitle="Compare licensed crypto exchanges in Hong Kong by fees and features."
        toolbar={toolbar}
      >
        {mainContent}
      </PageShell>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedExchanges={selectedExchanges}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}


