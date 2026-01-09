'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define nav items with their routes
  const navItems = [
    { href: '/exchanges', label: 'Exchanges' },
    { href: '/wallets', label: 'Wallets' },
    { href: '/events', label: 'Events' },
    { href: '/news', label: 'HK News' },
    { href: '/guides', label: 'Guides' },
    { href: '/assets', label: 'Assets' },
    { href: '/prices', label: 'Prices' },
    { href: '/new-coins', label: 'New Coins' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/charts', label: 'Charts' },
  ];

  // Check if a route is active
  // Root "/" should highlight "Exchanges" since it redirects there
  const isActive = (href: string) => {
    if (href === '/exchanges' && pathname === '/') {
      return true;
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              CH
            </div>
            <Link href="/" className="text-xl font-semibold text-slate-900 tracking-tight">
              CryptoCompare Hub
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    active
                      ? 'text-slate-900 font-medium border-b-2 border-blue-600 pb-1'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      active
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
