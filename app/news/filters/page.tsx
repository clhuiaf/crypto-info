// Category: News
// Placeholder page for News Filters and Saved Filters
// TODO: Implement news filtering and saved filter functionality

import Link from 'next/link';

export default function NewsFiltersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to News
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          News Filters
        </h1>
        <p className="text-slate-600">
          Customize your news feed with saved filters and personalized preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
        <p className="text-slate-600 mb-6">
          This page will allow you to create and save custom filters for news content,
          including regulatory updates, exchange announcements, and market events.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse All News
        </Link>
      </div>
    </div>
  );
}