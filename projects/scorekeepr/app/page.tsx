import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import Pricing from '@/components/Pricing';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeatureGrid />
      <Pricing />

      {/* CTA Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Tracking Scores?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Create your first leaderboard in seconds. No credit card required.
          </p>
          <Link href="/create" className="btn-primary text-lg px-10 py-4 inline-block">
            Create Free Leaderboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🏆 ScoreKeepr</h3>
              <p className="text-gray-400">
                Simple, shareable leaderboards for teams and gamers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/create" className="hover:text-white">Create Board</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ScoreKeepr. Built with ⚡ by indie makers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
