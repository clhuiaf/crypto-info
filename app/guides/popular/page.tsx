// Category: Learning
// Placeholder page for Most Viewed Guides
// TODO: Implement analytics tracking and popular guides display

import Link from 'next/link';
import PageShell from '@/components/PageShell';

export default function PopularGuidesPage() {
  return (
    <div className="py-8">
      <PageShell>
        <section className="rounded-3xl bg-[var(--brand-color,#2563eb)] p-6 space-y-4">
        <header>
          <Link href="/guides" className="inline-flex items-center text-blue-100 hover:text-blue-200 mb-1">
            ← Back to Guides
          </Link>
          <h1 className="text-3xl font-semibold text-white mb-1">Most Viewed Guides</h1>
          <p className="text-sm text-slate-100">Popular educational content based on user engagement</p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
            <p className="text-slate-600 mb-6">
              This page will show the most popular guides based on user views and engagement.
              Analytics tracking will be implemented to determine popularity.
            </p>
            <Link
              href="/guides"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Guides
            </Link>
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  );
}