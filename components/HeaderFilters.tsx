'use client';

import { Country, FilterType, SortType } from '@/types/exchange';

interface HeaderFiltersProps {
  country: Country;
  filter: FilterType;
  sort: SortType;
  onCountryChange: (country: Country) => void;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  onShowExchanges: () => void;
}

export default function HeaderFilters({
  country,
  filter,
  sort,
  onCountryChange,
  onFilterChange,
  onSortChange,
  onShowExchanges,
}: HeaderFiltersProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex flex-wrap gap-4 flex-1 w-full md:w-auto">
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value as Country)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="HK">HK</option>
              <option value="UK">UK</option>
              <option value="US">US</option>
              <option value="SG">SG</option>
            </select>

            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="Licensed only">Licensed only</option>
              <option value="Spot only">Spot only</option>
              <option value="Derivatives only">Derivatives only</option>
            </select>

            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortType)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Fees (low to high)">Fees (low to high)</option>
              <option value="Fees (high to low)">Fees (high to low)</option>
              <option value="Tokens (high to low)">Tokens (high to low)</option>
              <option value="Min deposit (low to high)">Min deposit (low to high)</option>
            </select>
          </div>

          <button
            onClick={onShowExchanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium whitespace-nowrap"
          >
            Show Exchanges
          </button>
        </div>
      </div>
    </div>
  );
}

