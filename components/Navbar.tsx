import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              CryptoCompare HK
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/exchanges" className="text-gray-700 hover:text-gray-900 font-medium">
              Exchanges
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-gray-900">
              News
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link href="/prices" className="text-gray-600 hover:text-gray-900">
              Prices
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

