'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { navConfig } from '@/lib/navConfig';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check if a route is active
  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  // Check if category is active based on its primary href
  const isCategoryActive = (categoryId: string) => {
    const category = navConfig.find(cat => cat.id === categoryId);
    if (!category) return false;

    return isActive(category.primaryHref);
  };

  // Handle mega menu open/close with delay for better UX
  const handleMouseEnter = (categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(categoryId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150); // Small delay to prevent flickering
  };

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        const navElement = document.querySelector('nav');
        if (navElement && !navElement.contains(event.target as Node)) {
          setActiveMegaMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu on escape and improve keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
      }
      // Handle Tab navigation within mega menu
      if (activeMegaMenu && event.key === 'Tab') {
        const menuElement = megaMenuRef.current;
        if (menuElement) {
          const focusableElements = menuElement.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            // Shift+Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              setActiveMegaMenu(null);
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              setActiveMegaMenu(null);
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeMegaMenu]);

  // Focus management for accessibility
  const handleMegaMenuKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const firstLink = megaMenuRef.current?.querySelector('a');
      firstLink?.focus();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          <div className="flex items-center space-x-2 relative flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              CP
            </div>
            <Link href="/" className="text-xl font-semibold text-slate-900 tracking-tight">
              Cryptopedia
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 text-sm relative">
            {navConfig.map((category) => {
              const active = isCategoryActive(category.id);
              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={category.primaryHref}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      active
                        ? 'text-slate-900 bg-blue-50 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    onMouseEnter={() => handleMouseEnter(category.id)}
                    onMouseLeave={handleMouseLeave}
                    onKeyDown={category.sections.length > 0 ? handleMegaMenuKeyDown : undefined}
                    aria-expanded={category.sections.length > 0 ? activeMegaMenu === category.id : undefined}
                    aria-haspopup={category.sections.length > 0 ? "true" : undefined}
                  >
                    {category.label}
                  </Link>

                  {/* Mega Menu - only for categories with sections */}
                  {activeMegaMenu === category.id && category.sections.length > 0 && (
                    <div
                      ref={megaMenuRef}
                      className="absolute top-full left-0 mt-1 w-72 max-w-[90vw] bg-white border border-slate-200 rounded-xl shadow-xl z-50"
                      role="menu"
                      aria-label={`${category.label} menu`}
                      onMouseEnter={() => handleMouseEnter(category.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-5 text-left">
                        <ul className="space-y-1" role="none">
                          {category.sections.flatMap(section => section.links).map((link) => (
                            <li key={link.href} role="none">
                              <Link
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  isActive(link.href) ? 'bg-blue-50 text-blue-700' : 'text-slate-900 hover:text-blue-600'
                                }`}
                                role="menuitem"
                                onClick={() => setActiveMegaMenu(null)}
                              >
                                {/* Icon placeholder - ready for future icons */}
                                <span className="flex-shrink-0 w-4 h-4"></span>
                                <span>{link.label}</span>
                                {link.badge && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {link.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
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
            <div className="px-2 pt-2 pb-3 space-y-2">
              {navConfig.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    {category.label}
                  </div>
                  {category.sections.map((section) => (
                    <div key={section.title} className="ml-4 space-y-1">
                      <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {section.title}
                      </div>
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(link.href)
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-medium">{link.label}</div>
                          {link.description && (
                            <div className="text-xs text-slate-500 mt-1">
                              {link.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
