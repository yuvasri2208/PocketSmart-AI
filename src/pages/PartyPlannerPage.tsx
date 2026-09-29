import React, { useState } from 'react';
import { PartyPopper, Users, MapPin, Utensils, Sparkles, Music, Gift, Printer, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PartyRecommendationResult } from '../types';
import { ShoppingLinks } from '../components/ShoppingLinks';

export const PartyPlannerPage: React.FC = () => {
  const { user, currency, formatPrice } = useAuth();

  // Form State
  const [totalBudget, setTotalBudget] = useState('5000');
  const [numGuests, setNumGuests] = useState(3);
  const [partyType, setPartyType] = useState('Wedding');
  const [venueType, setVenueType] = useState('Home');
  const [needsCatering, setNeedsCatering] = useState(true);
  const [needsDecoration, setNeedsDecoration] = useState(true);
  const [needsEntertainment, setNeedsEntertainment] = useState(true);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Execution State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PartyRecommendationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: parseFloat(totalBudget) || 5000,
          num_guests: numGuests,
          party_type: partyType,
          venue_type: venueType,
          needs_catering: needsCatering,
          needs_decoration: needsDecoration,
          needs_entertainment: needsEntertainment,
          additional_requirements: additionalRequirements,
          currency,
          username: user?.username || 'sai',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate party recommendations');
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
            <PartyPopper className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Event & Party Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Party Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Plan your perfect event with AI-powered budget recommendations across catering, venue, and decor
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  ₹
                </div>
                <h3>Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Budget ({currency === 'INR' ? '₹ INR' : '$ USD'})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                      {currency === 'INR' ? '₹' : '$'}
                    </div>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={numGuests}
                    onChange={(e) => setNumGuests(parseInt(e.target.value, 10) || 1)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <PartyPopper className="w-4 h-4" />
                </div>
                <h3>Event Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Party Type
                  </label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="House Party">House Party</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Graduation Party">Graduation Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                    Venue Type
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Banquet Hall">Banquet Hall</option>
                    <option value="Resort">Resort</option>
                    <option value="Rooftop">Rooftop Lounge</option>
                    <option value="Hotel">Hotel Ballroom</option>
                    <option value="Outdoor Lawn">Outdoor Lawn</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Party Needs */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <h3>Party Needs</h3>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsCatering}
                    onChange={(e) => setNeedsCatering(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <Utensils className="w-3.5 h-3.5 text-orange-600" />
                  <span>Catering</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsDecoration}
                    onChange={(e) => setNeedsDecoration(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <span>Decoration</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsEntertainment}
                    onChange={(e) => setNeedsEntertainment(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <Music className="w-3.5 h-3.5 text-blue-600" />
                  <span>Entertainment</span>
                </label>
              </div>
            </div>

            {/* Section 4: Additional Requirements */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Requirements (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Special requests, themes, dietary restrictions, preferred music vibe, etc."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Planning Party Budget with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Budget Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS VIEW (Matches Screenshot Page 35) */}
        {results && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            {/* Header & Print/Save Action */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Your Party Budget Plan
                </h2>
                <p className="text-sm font-bold text-blue-600 mt-1">
                  Budget: {formatPrice(results.total_budget)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save</span>
                </button>
                <button
                  onClick={() => setResults(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Venue Section */}
            {results.venue_suggestions && results.venue_suggestions.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800">Venue</h3>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {formatPrice(results.venue_suggestions[0]?.estimated_cost || 0)}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {results.venue_suggestions[0]?.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {results.venue_suggestions[0]?.type} • Capacity: {results.venue_suggestions[0]?.capacity} guests • {results.venue_suggestions[0]?.location || 'City'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500 font-medium">Shop on:</span>
                    <ShoppingLinks links={results.venue_suggestions[0]?.shopping_links} size="sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Categories (Catering, Entertainment, Decor, Contingency) */}
            <div className="space-y-4">
              {results.budget_breakdown?.map((cat, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {cat.category.toLowerCase().includes('cater') && <Utensils className="w-4 h-4 text-orange-600" />}
                      {cat.category.toLowerCase().includes('entertain') && <Music className="w-4 h-4 text-blue-600" />}
                      {cat.category.toLowerCase().includes('decor') && <Sparkles className="w-4 h-4 text-pink-600" />}
                      <h3 className="font-bold text-xs sm:text-sm text-slate-800">{cat.category}</h3>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {formatPrice(cat.allocation)}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 p-2">
                    {cat.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-3 space-y-1.5 hover:bg-slate-50/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800">{item.name}</h4>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                          <span className="font-bold text-xs sm:text-sm text-slate-900 whitespace-nowrap ml-4">
                            {formatPrice(item.estimated_price)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <span className="text-[11px] text-slate-500 font-medium">Shop on:</span>
                          <ShoppingLinks links={item.shopping_links} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Calculation Table */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total Budget</span>
                <span className="font-bold text-slate-900">{formatPrice(results.total_budget)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Allocated</span>
                <span className="font-bold text-slate-900">{formatPrice(results.allocated_budget || results.total_budget - (results.remaining_budget || 0))}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Remaining</span>
                <span className="font-bold text-emerald-600">{formatPrice(results.remaining_budget)}</span>
              </div>
            </div>

            {/* Additional Suggestions */}
            {results.additional_suggestions && (
              <div className="border border-slate-200 rounded-lg p-5 bg-blue-50/30 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3>Additional Suggestions</h3>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {results.additional_suggestions.map((s, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
