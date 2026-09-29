import React from 'react';
import { Home, PartyPopper, Gem, ArrowRight, Star, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();

  const handleStartPlanner = (plannerPage: string) => {
    setCurrentPage(plannerPage);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-[#152449] via-[#1a3064] to-[#203c7d] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Powered by Google Gemini 1.5 Flash Pro Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            PocketSmart
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-100 max-w-2xl mx-auto">
            AI-Powered Budget Planning for Everyday Needs
          </h2>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Make smarter financial decisions with personalized budget recommendations for home interiors, parties, and jewelry purchases. Our AI helps you get the most value for your money.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage(user ? 'dashboard' : 'register')}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition flex items-center space-x-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#planners"
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition cursor-pointer"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Our Smart Budget Planners Section */}
      <section id="planners" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Our Smart Budget Planners
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Discover how PocketSmart helps you make better financial decisions across different areas of your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-44 bg-linear-to-r from-teal-700 to-emerald-800 p-6 flex flex-col justify-end text-white relative">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Home Interior Budget Planner</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Get personalized recommendations for furniture, lighting, and decor that fit your style preferences and budget constraints. Our AI helps you create a beautiful space without overspending.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleStartPlanner('home-planner')}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-44 bg-linear-to-r from-blue-700 to-indigo-800 p-6 flex flex-col justify-end text-white relative">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
                <PartyPopper className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Party Budget Planner</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Plan your perfect event with smart budget allocations for venue, catering, decorations, and entertainment. Our AI suggests the best ways to create memorable events while staying within your budget.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleStartPlanner('party-planner')}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-44 bg-linear-to-r from-slate-700 to-indigo-950 p-6 flex flex-col justify-end text-white relative">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Jewelry Budget Planner</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Find the ideal jewelry pieces for any occasion that match your outfit and budget. Our AI recommends options based on your style preferences, occasion, and available budget.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleStartPlanner('jewelry-planner')}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-slate-100 border-t border-b border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Our Users Say</h2>
            <p className="text-slate-600 text-sm">
              Real experiences from people who have transformed their financial planning with PocketSmart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic text-sm leading-relaxed">
                "PocketSmart helped me furnish my new apartment without breaking the bank. The recommendations were spot on and I saved nearly 30% of my original budget!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  SK
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Sarah K.</h4>
                  <p className="text-[11px] text-slate-500">Home Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic text-sm leading-relaxed">
                "Planning my daughter's birthday party was so much easier with PocketSmart's budget breakdown. The AI suggestions for affordable decorations and catering options were fantastic."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Michael R.</h4>
                  <p className="text-[11px] text-slate-500">Parent</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex text-amber-400 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic text-sm leading-relaxed">
                "The jewelry recommendations perfectly matched my outfit for the wedding. Saved me hours of searching and I received so many compliments on my accessories!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                  PM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Priya M.</h4>
                  <p className="text-[11px] text-slate-500">Fashion Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Optimize Your Budget CTA */}
      <section className="bg-linear-to-b from-[#1b2b52] to-[#121e3b] text-white py-14 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Optimize Your Budget?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join PocketSmart today and start making smarter financial decisions across all areas of your life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setCurrentPage('login')}
              className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
