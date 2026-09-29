import React, { useState, useRef } from 'react';
import { Gem, Upload, X, Sparkles, Image as ImageIcon, CheckCircle2, RotateCcw, Printer, Loader2, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JewelryRecommendationResult } from '../types';
import { ShoppingLinks } from '../components/ShoppingLinks';

export const JewelryPlannerPage: React.FC = () => {
  const { user, currency, formatPrice } = useAuth();

  // Form State
  const [totalBudget, setTotalBudget] = useState('5000');
  const [occasion, setOccasion] = useState('Birthday');
  const [stylePreferences, setStylePreferences] = useState('Casual minimalist with metal accents');
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  // Execution State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JewelryRecommendationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOutfitImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setOutfitImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_budget: parseFloat(totalBudget) || 5000,
          occasion,
          preferences: stylePreferences,
          image_data: outfitImage,
          image_mime_type: imageMimeType,
          currency,
          username: user?.username || 'sai',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to generate jewelry recommendations');
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
            <Gem className="w-3.5 h-3.5 text-rose-600" />
            <span>AI Multimodal Jewelry & Style Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Jewelry Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Get AI-powered jewelry recommendations within your budget for any occasion with optional outfit color matching
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

            {/* Section 2: Occasion & Preferences */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Gem className="w-4 h-4" />
                </div>
                <h3>Occasion & Preferences</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Occasion
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Birthday, Wedding, Anniversary, Cocktail Party, Festival"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Style Preferences
                </label>
                <textarea
                  rows={2}
                  value={stylePreferences}
                  onChange={(e) => setStylePreferences(e.target.value)}
                  placeholder="Describe your style preferences, materials (silver, gold, rose gold, pearls), aesthetics (minimalist, chunky, vintage, boho)..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Section 3: Upload Outfit Image (Matches Screenshot Page 36) */}
            <div className="space-y-3 pb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3>Upload Outfit Image (Optional Multimodal Analysis)</h3>
              </div>
              <p className="text-xs text-slate-500">
                Upload a photo of your dress, suit, or traditional attire. Gemini AI will analyze colors, neckline, and style formality.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {!outfitImage ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline">
                      Click to upload outfit image
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 10MB</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
                      <img
                        src={outfitImage}
                        alt="Outfit Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        Outfit Image Attached
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium flex items-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready for Gemini Multimodal Analysis</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                </div>
              )}
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
                    <span>Analyzing Outfit & Sourcing Jewelry with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS VIEW (Matches Screenshot Page 37) */}
        {results && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Your Personalized Jewelry Recommendations
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
                  onClick={() => setResults(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Budget Summary Bar (Matches Screenshot Page 37) */}
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

            {/* Outfit Analysis Card (if available or detected) */}
            {results.outfit_analysis && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs sm:text-sm">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <h3>Outfit Analysis</h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-medium">Colors:</span>
                    <span className="font-semibold text-slate-800">
                      {results.outfit_analysis.colors?.join(', ') || 'Blue, White'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-medium">Style:</span>
                    <span className="font-semibold text-slate-800">
                      {results.outfit_analysis.style || 'Casual Chic'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-medium">Formality:</span>
                    <span className="font-semibold text-slate-800">
                      {results.outfit_analysis.formality || 'Informal'}
                    </span>
                  </div>
                </div>
                {results.outfit_analysis.summary && (
                  <p className="text-xs text-slate-600 italic border-t border-slate-100 pt-2">
                    "{results.outfit_analysis.summary}"
                  </p>
                )}
              </div>
            )}

            {/* Jewelry Recommendations List (Matches Screenshot Page 37) */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-[#192b57] text-white px-6 py-3 flex items-center space-x-2">
                <Gem className="w-4 h-4 text-pink-300" />
                <h3 className="font-bold text-sm">Jewelry Recommendations</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {results.jewelry_recommendations?.map((item, idx) => (
                  <div key={idx} className="p-6 space-y-3 hover:bg-slate-50/50 transition">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <h4 className="text-sm font-bold text-slate-900 capitalize">
                            {item.item_type}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                          <strong className="text-slate-700">Description:</strong> {item.description}
                        </p>
                        <p className="text-xs text-slate-500">
                          <strong>Style:</strong> <span className="text-slate-700">{item.style}</span>
                        </p>
                      </div>

                      <div className="ml-4 shrink-0">
                        <span className="inline-block px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs">
                          {formatPrice(item.estimated_price)}
                        </span>
                      </div>
                    </div>

                    {/* Shop For This Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700 shrink-0">
                        Shop For This:
                      </span>
                      <ShoppingLinks links={item.shopping_links} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Styling Tips (Matches Screenshot Page 37) */}
            {results.styling_tips && results.styling_tips.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-[#192b57] text-white px-6 py-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <h3 className="font-bold text-sm">Styling Tips</h3>
                </div>
                <div className="p-6 space-y-3">
                  {results.styling_tips.map((tip, tipIdx) => (
                    <div key={tipIdx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
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
