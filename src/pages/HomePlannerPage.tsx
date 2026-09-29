import React, { useState } from 'react';
import { Home, Lightbulb, Wind, Armchair, UtensilsCrossed, Sparkles, CheckCircle2, RotateCcw, Printer, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HomeRecommendationResult } from '../types';
import { ShoppingLinks } from '../components/ShoppingLinks';

export const HomePlannerPage: React.FC = () => {
  const { user, currency, formatPrice } = useAuth();

  // Form State
  const [totalBudget, setTotalBudget] = useState('5000');
  const [numLights, setNumLights] = useState(5);
  const [numFans, setNumFans] = useState(4);
  const [numFurniture, setNumFurniture] = useState(2);
  const [numDiningTables, setNumDiningTables] = useState(1);
  const [livingRoom, setLivingRoom] = useState(true);
  const [kitchen, setKitchen] = useState(true);
  const [bedroom, setBedroom] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Execution State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HomeRecommendationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: parseFloat(totalBudget) || 5000,
          num_lights: numLights,
          num_fans: numFans,
          num_furniture: numFurniture,
          num_dining_tables: numDiningTables,
          has_living_room: livingRoom,
          has_kitchen: kitchen,
          has_bedroom: bedroom,
          additional_requirements: additionalRequirements,
          currency,
          username: user?.username || 'sai',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate recommendations');
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Home Interior Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Home Interior Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Create a customized budget plan for your dream home interior with platform-aware product sourcing
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

            {/* Section 1: Budget Details */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  ₹
                </div>
                <h3>Budget Details</h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Budget ({currency === 'INR' ? '₹ INR' : '$ USD'})
                </label>
                <div className="relative max-w-md">
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
            </div>

            {/* Section 2: Fixtures & Furniture */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Armchair className="w-4 h-4" />
                </div>
                <h3>Fixtures & Furniture</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Lightbulb className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    Number of Lights / Fixtures
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={numLights}
                    onChange={(e) => setNumLights(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Wind className="w-3.5 h-3.5 mr-1 text-sky-500" />
                    Number of Ceiling Fans
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={numFans}
                    onChange={(e) => setNumFans(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <Armchair className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Number of Furniture Pieces
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={numFurniture}
                    onChange={(e) => setNumFurniture(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                    <UtensilsCrossed className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Number of Dining Tables
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={numDiningTables}
                    onChange={(e) => setNumDiningTables(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Rooms to Include */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <h3>Rooms to Include</h3>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={livingRoom}
                    onChange={(e) => setLivingRoom(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Living Room</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kitchen}
                    onChange={(e) => setKitchen(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Kitchen</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bedroom}
                    onChange={(e) => setBedroom(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>Bedroom</span>
                </label>
              </div>
            </div>

            {/* Section 4: Additional Information */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Special Requirements or Preferences (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Any specific requirements or preferences (e.g. minimalist wood style, smart WiFi fans, warm dimmable lights)..."
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
                    <span>Analyzing Budget & Products with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS VIEW */}
        {results && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300 print:m-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Your Personalized Budget Plan
              </h2>
              <div className="flex items-center space-x-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Plan</span>
                </button>
                <button
                  onClick={() => {
                    setResults(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Budget Summary Bar (Matches Screenshot Page 33) */}
            <div className="bg-[#192b57] text-white rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-200 block">Total Budget</span>
                <span className="text-xl sm:text-2xl font-extrabold">
                  {formatPrice(results.total_budget)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-300 block">Remaining Budget</span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                  {formatPrice(results.remaining_budget)}
                </span>
              </div>
            </div>

            {/* Categorized Recommendations Cards */}
            <div className="space-y-6">
              {results.budget_breakdown?.map((cat, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">{cat.category}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      Allocation: <strong className="text-slate-800">{formatPrice(cat.allocation)}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Item</th>
                          <th className="py-2.5 px-4 font-semibold">Description</th>
                          <th className="py-2.5 px-4 font-semibold">Price</th>
                          <th className="py-2.5 px-4 font-semibold">Quantity</th>
                          <th className="py-2.5 px-4 font-semibold">Shopping Links</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {cat.items?.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="py-3 px-4 max-w-xs text-slate-600">
                              {item.description}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                              {formatPrice(item.estimated_price)}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-4">
                              <ShoppingLinks links={item.shopping_links} size="sm" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Suggestions */}
            {results.additional_suggestions && results.additional_suggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-[#192b57] text-white px-6 py-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <h3 className="font-bold text-sm">Additional Suggestions</h3>
                </div>
                <div className="p-6 space-y-3">
                  {results.additional_suggestions.map((suggestion, sIdx) => (
                    <div key={sIdx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
