import Link from 'next/link';
import PageShell from '@/components/PageShell';

export default function GoogleComingSoonPage() {
  return (
    <div className="py-8">
      <PageShell
        title="Authentication"
        subtitle="Options for logging in and signing up"
      >
        <section className="brand-frame space-y-4">
          <header>
            <Link href="/" className="inline-flex items-center brand-icon mb-1">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-semibold text-white mb-1">Google Login Coming Soon</h1>
            <p className="text-sm text-slate-100">Google authentication will be available after we complete integration.</p>
          </header>

          <div className="rounded-2xl bg-white shadow-sm p-4">
            <div className="p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
              <p className="text-slate-600 mb-6">
                We're working on adding Google Login to make signing in easier. Once integrated,
                you'll be able to sign in with your Google account directly.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    </div>
  );
}

