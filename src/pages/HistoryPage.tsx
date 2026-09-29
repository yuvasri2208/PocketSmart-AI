import React, { useState, useEffect } from 'react';
import { Home, PartyPopper, Gem, Trash2, Eye, X, Calendar, CheckCircle, Printer, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RecommendationHistoryItem } from '../types';
import { ShoppingLinks } from '../components/ShoppingLinks';

interface HistoryPageProps {
  selectedHistoryItem?: RecommendationHistoryItem | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ selectedHistoryItem: initialItem }) => {
  const { user, formatPrice } = useAuth();
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'home' | 'party' | 'jewelry'>('all');
  const [activeItem, setActiveItem] = useState<RecommendationHistoryItem | null>(initialItem || null);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommendation-history?username=${user?.username || 'sai'}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    if (initialItem) {
      setActiveItem(initialItem);
    }
  }, [initialItem]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this recommendation from your history?')) return;
    try {
      await fetch(`/api/recommendation-history/${id}?username=${user?.username || 'sai'}`, {
        method: 'DELETE',
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (activeItem?.id === id) setActiveItem(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner (Matches Screenshot Page 38) */}
        <div className="bg-[#1f3366] text-white rounded-xl p-8 text-center space-y-2 shadow-md">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Recommendation History
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto">
            View and manage all your previous budget plans and recommendations
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Plans ({history.length})
            </button>
            <button
              onClick={() => setFilter('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                filter === 'home'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-emerald-500" />
              <span>Home Interior</span>
            </button>
            <button
              onClick={() => setFilter('party')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                filter === 'party'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
              <span>Party Planning</span>
            </button>
            <button
              onClick={() => setFilter('jewelry')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                filter === 'jewelry'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-rose-500" />
              <span>Jewelry</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredHistory.length} recorded plans
          </span>
        </div>

        {/* History Cards Grid (Matches Screenshot Page 38) */}
        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHistory.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition"
                >
                  <div className="p-5 space-y-4">
                    {/* Top Row: Type & Date */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {item.type === 'home' && (
                          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                            <Home className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'party' && (
                          <div className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                            <PartyPopper className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === 'jewelry' && (
                          <div className="p-1.5 rounded-md bg-rose-100 text-rose-700">
                            <Gem className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-xs text-slate-900 leading-tight">
                            {item.type === 'home' && 'Home Interior Budget'}
                            {item.type === 'party' && 'Party Planning Budget'}
                            {item.type === 'jewelry' && 'Jewelry Budget'}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {dateStr}
                      </span>
                    </div>

                    {/* Budgets Row */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Total Budget</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatPrice(item.result_summary.total_budget)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Remaining</span>
                        <span className="font-extrabold text-emerald-600 text-sm">
                          {formatPrice(item.result_summary.remaining_budget)}
                        </span>
                      </div>
                    </div>

                    {/* Specific details based on type */}
                    <div className="text-xs text-slate-600 space-y-1.5 min-h-[48px]">
                      {item.type === 'home' && (
                        <>
                          <p>
                            <strong>Rooms:</strong>{' '}
                            {item.input_summary.rooms?.join(', ') || 'Living Room, Kitchen'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Lights: {item.input_summary.lights} • Fans: {item.input_summary.fans} • Furniture: {item.input_summary.furniture}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">lighting</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">ceiling fans</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">furniture</span>
                          </div>
                        </>
                      )}

                      {item.type === 'party' && (
                        <>
                          <p>
                            <strong>Party Type:</strong> {item.input_summary.party_type} • <strong>Guests:</strong> {item.input_summary.num_guests}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">venue</span>
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">catering</span>
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">entertainment</span>
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">contingency</span>
                          </div>
                        </>
                      )}

                      {item.type === 'jewelry' && (
                        <>
                          <p>
                            <strong>Occasion:</strong> {item.input_summary.occasion}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            With outfit image: <strong>{item.input_summary.has_outfit_image ? 'Yes' : 'No'}</strong>
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">bracelet</span>
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">ring</span>
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">watch</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Details</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Saved History Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run any of the budget planners to generate your personalized AI recommendations and save them automatically here.
            </p>
          </div>
        )}

        {/* MODAL: Full Recommendation Details */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#192b57] text-white rounded-t-xl">
                <div>
                  <h3 className="text-base font-bold">
                    {activeItem.type === 'home' && 'Home Interior Budget Breakdown'}
                    {activeItem.type === 'party' && 'Party Event Budget Breakdown'}
                    {activeItem.type === 'jewelry' && 'Jewelry & Outfit Recommendation'}
                  </h3>
                  <p className="text-xs text-blue-200">
                    Created on {new Date(activeItem.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                {/* Budget Summary Bar */}
                <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Total Budget</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatPrice(activeItem.result_summary.total_budget)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Remaining</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatPrice(activeItem.result_summary.remaining_budget)}
                    </span>
                  </div>
                </div>

                {/* Home Breakdown Content */}
                {activeItem.type === 'home' && (
                  <div className="space-y-4">
                    {activeItem.full_result?.budget_breakdown?.map((cat: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 font-bold text-slate-800 flex justify-between">
                          <span>{cat.category}</span>
                          <span>Allocation: {formatPrice(cat.allocation)}</span>
                        </div>
                        <div className="p-3 divide-y divide-slate-100">
                          {cat.items?.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="py-2 space-y-1">
                              <div className="flex justify-between font-semibold text-slate-900">
                                <span>{item.name} (Qty: {item.quantity})</span>
                                <span>{formatPrice(item.estimated_price)}</span>
                              </div>
                              <p className="text-slate-500">{item.description}</p>
                              <div className="pt-1">
                                <ShoppingLinks links={item.shopping_links} size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Party Breakdown Content */}
                {activeItem.type === 'party' && (
                  <div className="space-y-4">
                    {activeItem.full_result?.venue_suggestions?.map((venue: any, vIdx: number) => (
                      <div key={vIdx} className="border border-slate-200 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Venue: {venue.name}</span>
                          <span>{formatPrice(venue.estimated_cost)}</span>
                        </div>
                        <p className="text-slate-500">{venue.type} • Capacity: {venue.capacity}</p>
                        <ShoppingLinks links={venue.shopping_links} size="sm" />
                      </div>
                    ))}

                    {activeItem.full_result?.budget_breakdown?.map((cat: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 font-bold text-slate-800 flex justify-between">
                          <span>{cat.category}</span>
                          <span>Allocation: {formatPrice(cat.allocation)}</span>
                        </div>
                        <div className="p-3 divide-y divide-slate-100">
                          {cat.items?.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="py-2 space-y-1">
                              <div className="flex justify-between font-semibold text-slate-900">
                                <span>{item.name}</span>
                                <span>{formatPrice(item.estimated_price)}</span>
                              </div>
                              <p className="text-slate-500">{item.description}</p>
                              <ShoppingLinks links={item.shopping_links} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Jewelry Breakdown Content */}
                {activeItem.type === 'jewelry' && (
                  <div className="space-y-4">
                    {activeItem.full_result?.outfit_analysis && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                        <h4 className="font-bold text-purple-900">Outfit Analysis</h4>
                        <p>
                          Colors: {activeItem.full_result.outfit_analysis.colors?.join(', ')} • Style: {activeItem.full_result.outfit_analysis.style}
                        </p>
                      </div>
                    )}

                    {activeItem.full_result?.jewelry_recommendations?.map((item: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 text-sm capitalize">{item.item_type}</h4>
                          <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                            {formatPrice(item.estimated_price)}
                          </span>
                        </div>
                        <p className="text-slate-600">{item.description}</p>
                        <p className="text-slate-400">Style: {item.style}</p>
                        <div className="pt-1 flex items-center space-x-2">
                          <span className="font-semibold text-slate-700">Shop on:</span>
                          <ShoppingLinks links={item.shopping_links} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-xl">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Details</span>
                </button>
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
