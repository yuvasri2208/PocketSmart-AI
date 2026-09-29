import React, { useState, useEffect } from 'react';
import { Home, PartyPopper, Gem, History, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RecommendationHistoryItem } from '../types';

interface DashboardPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedHistoryItem?: (item: RecommendationHistoryItem) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentPage, setSelectedHistoryItem }) => {
  const { user, formatPrice } = useAuth();
  const [historyItems, setHistoryItems] = useState<RecommendationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/recommendation-history?username=${user?.username || 'sai'}`);
        if (res.ok) {
          const data = await res.json();
          setHistoryItems(data.history || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleOpenDetails = (item: RecommendationHistoryItem) => {
    if (setSelectedHistoryItem) {
      setSelectedHistoryItem(item);
    }
    setCurrentPage('history');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Welcome Banner */}
      <section className="bg-linear-to-b from-[#182852] to-[#243c78] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>AI Budget Intelligence Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.username || 'sai'}!
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto">
            Choose a budget planner to get started with your personalized financial planning experience
          </p>
        </div>
      </section>

      {/* Main Grid: 3 Planners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Planner 1: Home Interior */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            {/* Visual Thumbnail */}
            <div className="h-44 bg-linear-to-tr from-teal-800 via-emerald-700 to-teal-600 relative overflow-hidden flex items-end p-5">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 text-white flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base leading-tight">Home Budget Planner</h3>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Plan your interior design budget efficiently with AI-powered recommendations for furniture, lighting, and more.
              </p>
              <button
                onClick={() => setCurrentPage('home-planner')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1a2d59] hover:bg-[#12203f] text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Planner 2: Party Planner */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-44 bg-linear-to-tr from-indigo-800 via-blue-700 to-indigo-600 relative overflow-hidden flex items-end p-5">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 text-white flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <PartyPopper className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base leading-tight">Party Budget Planner</h3>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Plan your perfect event with budget allocations for venue, catering, decorations, and entertainment.
              </p>
              <button
                onClick={() => setCurrentPage('party-planner')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1a2d59] hover:bg-[#12203f] text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Planner 3: Jewelry Planner */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition">
            <div className="h-44 bg-linear-to-tr from-slate-900 via-purple-950 to-indigo-900 relative overflow-hidden flex items-end p-5">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 text-white flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base leading-tight">Jewelry Budget Planner</h3>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Find the ideal jewelry pieces for any occasion that match your outfit and stay within your budget.
              </p>
              <button
                onClick={() => setCurrentPage('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1a2d59] hover:bg-[#12203f] text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* View All Recommendation History Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentPage('history')}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>View All Recommendation History</span>
          </button>
        </div>

        {/* Recent Activity Card */}
        <div className="mt-8 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-[#1f3366] text-white px-6 py-3.5 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-300" />
            <h3 className="font-bold text-sm">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {historyItems.length > 0 ? (
              historyItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetails(item)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-700">
                      {item.type === 'home' && <Home className="w-5 h-5 text-emerald-600" />}
                      {item.type === 'party' && <PartyPopper className="w-5 h-5 text-amber-600" />}
                      {item.type === 'jewelry' && <Gem className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {item.type === 'home' && 'Home Budget Plan'}
                        {item.type === 'party' && 'Birthday / Party Budget Plan'}
                        {item.type === 'jewelry' && 'Jewelry Budget Plan'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Budget: {formatPrice(item.result_summary.total_budget)} • {item.result_summary.highlight} •{' '}
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Saved {formatPrice(item.result_summary.remaining_budget)}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center space-x-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No recent planning activity yet. Select a planner above to create your first budget!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
