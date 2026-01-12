// Category: About
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Cryptopedia | Hong Kong Crypto Hub',
  description: 'Learn about Cryptopedia, your independent Hong Kong-focused crypto hub for comparing exchanges, wallets, and market opportunities.',
};

export default function AboutPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            About Cryptopedia
          </h1>

          <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
            <p>
              Cryptopedia is a Hong Kong–focused crypto hub that helps investors compare exchanges, wallets, and opportunities in one place.
            </p>

            <p>
              The platform brings together live prices, asset data, and campaign information so you can make informed decisions across licensed and unlicensed platforms in Hong Kong.
            </p>

            <p>
              Cryptopedia is independent and product‑agnostic: listings and comparisons are based on transparent criteria such as regulation status, fees, supported tokens, and user experience. Our goal is not to tell you what to buy, but to give you clear tools and data so you can decide with confidence.
            </p>

            <p>
              Today, Cryptopedia covers an Exchange Finder for Hong Kong platforms, a Wallet Finder for storage options, promotions and airdrops from major exchanges, and market pages for prices, new coins, charts, and watchlists.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}