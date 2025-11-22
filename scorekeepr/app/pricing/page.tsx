import Pricing from '@/components/Pricing';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            🏆 ScoreKeepr
          </Link>
          <Link href="/create" className="btn-primary text-sm px-6 py-2">
            Create Free Board
          </Link>
        </div>
      </nav>

      <Pricing />

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Can I try before upgrading to Pro?
              </h3>
              <p className="text-gray-600">
                Yes! Start with the free plan and create your first leaderboard. You can upgrade to Pro anytime when you need more boards or custom branding.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                How does billing work?
              </h3>
              <p className="text-gray-600">
                Pro plan is billed monthly at $5/month. You can cancel anytime, and your boards will remain accessible on the free plan (limited to 1 board).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Your leaderboard data is stored securely in your browser's local storage. Pro users get cloud backup and sync across devices (coming soon).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Can I use ScoreKeepr for my business?
              </h3>
              <p className="text-gray-600">
                Absolutely! Many teams use ScoreKeepr for sales leaderboards, customer service metrics, and team competitions. Pro plan includes commercial use.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
