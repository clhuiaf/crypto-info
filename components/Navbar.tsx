import Link from 'next/link';

export default function Navbar() {
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
            <Link
              href="/exchanges"
              className="text-slate-900 font-medium border-b-2 border-blue-600 pb-1"
            >
              Exchanges
            </Link>
            <Link href="/news" className="text-slate-500 hover:text-slate-900 transition-colors">
              News
            </Link>
            <Link href="/blog" className="text-slate-500 hover:text-slate-900 transition-colors">
              Blog
            </Link>
            <Link href="/prices" className="text-slate-500 hover:text-slate-900 transition-colors">
              Prices
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

