'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Define nav items with their routes
  const navItems = [
    { href: '/exchanges', label: 'Exchanges' },
    { href: '/wallets', label: 'Wallets' },
    { href: '/events', label: 'Events' },
    { href: '/news', label: 'News' },
    { href: '/guides', label: 'Guides' },
    { href: '/assets', label: 'Assets' },
    { href: '/blog', label: 'Blog' },
    { href: '/prices', label: 'Prices' },
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
          <div className="hidden md:flex items-center space-x-6 text-sm">
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
        </div>
      </div>
    </nav>
  );
}
