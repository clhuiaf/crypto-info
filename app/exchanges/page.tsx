'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeaderFilters from '@/components/HeaderFilters';
import Sidebar from '@/components/Sidebar';
import ExchangeCard from '@/components/ExchangeCard';
import ComparisonBar from '@/components/ComparisonBar';
import { mockExchanges } from '@/data/mockExchanges';
import { Exchange, Country, FilterType, SortType, SidebarFilters } from '@/types/exchange';

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
  const [country, setCountry] = useState<Country>('HK');
  const [filter, setFilter] = useState<FilterType>('Licensed only');
  const [sort, setSort] = useState<SortType>('Fees (low to high)');
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(initialSidebarFilters);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort exchanges
  const filteredAndSortedExchanges = useMemo(() => {
    let filtered = [...mockExchanges];

    // Apply country filter
    filtered = filtered.filter((ex) => ex.country === country);

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
  }, [country, filter, sort, sidebarFilters]);

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
  };

  const handleClearSelection = () => {
    setSelectedExchangeIds(new Set());
  };

  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <HeaderFilters
        country={country}
        filter={filter}
        sort={sort}
        onCountryChange={setCountry}
        onFilterChange={setFilter}
        onSortChange={setSort}
        onShowExchanges={() => {}}
      />

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <Sidebar
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
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium"
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

          {/* Exchange Cards Grid */}
          <div className="space-y-4">
            {filteredAndSortedExchanges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No exchanges found matching your filters.</p>
              </div>
            ) : (
              filteredAndSortedExchanges.map((exchange) => (
                <ExchangeCard
                  key={exchange.id}
                  exchange={exchange}
                  isSelected={selectedExchangeIds.has(exchange.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedExchanges={selectedExchanges}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}

