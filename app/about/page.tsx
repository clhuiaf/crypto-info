// Category: About
import { Metadata } from 'next';
import PageShell from '@/components/PageShell';

export const metadata: Metadata = {
  title: 'About Cryptopedia | Hong Kong Crypto Hub',
  description: 'Learn about Cryptopedia, your independent Hong Kong-focused crypto hub for comparing exchanges, wallets, and market opportunities.',
};

export default function AboutPage() {
  return (
    <div className="py-8">
      <PageShell>
        <section className="rounded-3xl bg-[var(--brand-color,#2563eb)] p-6 space-y-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">About Cryptopedia</h1>
          <p className="mt-2 text-sm text-slate-100 max-w-2xl mx-auto">
            Learn about Cryptopedia, your independent Hong Kong-focused crypto hub for comparing exchanges, wallets, and market opportunities.
          </p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-6">
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
      </PageShell>
    </div>
  );
}