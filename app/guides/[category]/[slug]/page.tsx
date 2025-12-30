import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import NewsHero from '@/components/NewsHero';
import { getGuideBySlug, guides } from '@/data/guides';
import { getCategoryBySlug } from '@/data/guideCategories';

interface GuideDetailPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateStaticParams() {
  return guides.map((guide) => ({
    category: guide.categorySlug,
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | CryptoCompare Hub',
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
  };
}

export default function GuideDetailPage({ params }: GuideDetailPageProps) {
  const guide = getGuideBySlug(params.slug);
  const category = guide ? getCategoryBySlug(guide.categorySlug) : null;

  if (!guide || !category) {
    notFound();
  }

  return (
    <div className="app-shell flex flex-col">
      <Navbar />
      <NewsHero
        eyebrow={`Guides · ${category.name}`}
        title={guide.title}
        subtitle={guide.description}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href={`/guides/${category.slug}`}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
          >
            ← Back to {category.name}
          </Link>
        </div>

        <article className="card-surface p-6 md:p-8">
          <div className="prose prose-slate max-w-none">
            {/* Definition Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Definition</h2>
              <p className="text-slate-700 leading-relaxed">{guide.definition}</p>
            </div>

            {/* How It Works Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">How It Works</h2>
              <p className="text-slate-700 leading-relaxed">{guide.howItWorks}</p>
            </div>

            {/* How to Read Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">How to Read It on Charts</h2>
              <p className="text-slate-700 leading-relaxed">{guide.howToRead}</p>
            </div>

            {/* Example Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Simple Example</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-slate-700 leading-relaxed">{guide.example}</p>
              </div>
            </div>

            {/* Pros and Cons Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Pros</h2>
                <ul className="space-y-2">
                  {guide.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Cons</h2>
                <ul className="space-y-2">
                  {guide.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <span className="text-rose-600 mt-1">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Common Mistakes Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Common Mistakes</h2>
              <ul className="space-y-3">
                {guide.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related Resources */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Related Resources</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/guides/${category.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                More {category.name} Guides
              </Link>
              <Link
                href="/exchanges"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Compare Hong Kong Exchanges
              </Link>
              <Link
                href="/news/hong-kong"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                Hong Kong Crypto News
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}


