// Category: Learning
// Placeholder page for Learning Paths
// TODO: Implement curated collections of guides

import Link from 'next/link';

export default function LearningPathsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-10 mt-8">
      <section className="mx-auto max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] rounded-3xl bg-[var(--brand-color,#2563eb)] p-6 space-y-4">
        <header>
          <Link href="/guides" className="inline-flex items-center text-blue-100 hover:text-blue-200 mb-1">
            ← Back to Guides
          </Link>
          <h1 className="text-3xl font-semibold text-white mb-1">Learning Paths</h1>
          <p className="text-sm text-slate-100">Curated collections of guides for structured learning journeys</p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
            <p className="text-slate-600 mb-6">
              This page will feature curated learning paths that guide users through
              structured sequences of guides, from beginner basics to advanced topics.
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
    </div>
  );
}