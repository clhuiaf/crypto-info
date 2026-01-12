// Category: Learning
// Placeholder page for Most Viewed Guides
// TODO: Implement analytics tracking and popular guides display

import Link from 'next/link';

export default function PopularGuidesPage() {
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
          Most Viewed Guides
        </h1>
        <p className="text-slate-600">
          Popular educational content based on user engagement
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
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
  );
}