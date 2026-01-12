// Category: Learning
// Placeholder page for Learning Paths
// TODO: Implement curated collections of guides

import Link from 'next/link';

export default function LearningPathsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/guides"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Guides
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Learning Paths
        </h1>
        <p className="text-slate-600">
          Curated collections of guides for structured learning journeys
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
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
  );
}