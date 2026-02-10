import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Coins } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
            The Future of Microgigs on Stacks
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Decentralized task marketplace secured by Bitcoin. Post tasks, get work done, and earn crypto instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/marketplace">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-gray-700 hover:bg-gray-800">
                Post a Task
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
              <div className="p-4 bg-indigo-500/10 rounded-full">
                <Shield className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold">Bitcoin Secured</h3>
              <p className="text-gray-400">
                Leveraging Stacks to settle transactions on the Bitcoin network for ultimate security.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-colors">
              <div className="p-4 bg-cyan-500/10 rounded-full">
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold">Instant Settlement</h3>
              <p className="text-gray-400">
                Smart contracts ensure payments are released immediately upon task approval.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="p-4 bg-purple-500/10 rounded-full">
                <Coins className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Minimal Fees</h3>
              <p className="text-gray-400">
                Keep more of what you earn. Our decentralized model cuts out the middleman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanics Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-800 -z-10 transform scale-x-75"></div>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-gray-900 border-4 border-indigo-600 flex items-center justify-center text-3xl font-bold z-10">
                1
              </div>
              <h3 className="text-2xl font-semibold">Post a Task</h3>
              <p className="text-gray-400">
                Define the requirements, set a bounty in STX, and lock the funds in escrow.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-gray-900 border-4 border-cyan-600 flex items-center justify-center text-3xl font-bold z-10">
                2
              </div>
              <h3 className="text-2xl font-semibold">Work & Submit</h3>
              <p className="text-gray-400">
                Workers accept tasks, complete the deliverables, and submit proof of work.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-gray-900 border-4 border-purple-600 flex items-center justify-center text-3xl font-bold z-10">
                3
              </div>
              <h3 className="text-2xl font-semibold">Get Paid</h3>
              <p className="text-gray-400">
                Review the submission and approve. Funds are automatically transferred to the worker.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

