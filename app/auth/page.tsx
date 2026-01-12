// Category: Auth
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up / Log in | Cryptopedia',
  description: 'Join Cryptopedia for enhanced features and personalized crypto insights.',
};

export default function AuthPage() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Membership Features
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Coming soon
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 max-w-lg">
          <p className="text-slate-700 leading-relaxed">
            Enhanced features for registered users are currently in development.
            Stay tuned for personalized watchlists, advanced analytics, and exclusive market insights.
          </p>
        </div>
      </div>
    </main>
  );
}