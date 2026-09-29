import React from 'react';
import { Home, PartyPopper, Gem, History, LogOut, LogIn, UserPlus, Code2, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onOpenGuide }) => {
  const { user, logout, currency, setCurrency } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#152449] text-white shadow-md border-b border-[#21356b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')}>
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-amber-500 via-rose-500 to-blue-500 flex items-center justify-center shadow-xs">
              <span className="font-extrabold text-white text-base">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white hover:text-blue-200 transition">
              PocketSmart
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {user ? (
              <>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-[#1f3263] hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4 text-blue-300" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentPage('home-planner')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition ${
                    currentPage === 'home-planner'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-[#1f3263] hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>Home Planner</span>
                </button>

                <button
                  onClick={() => setCurrentPage('party-planner')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition ${
                    currentPage === 'party-planner'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-[#1f3263] hover:text-white'
                  }`}
                >
                  <PartyPopper className="w-4 h-4 text-amber-400" />
                  <span>Party Planner</span>
                </button>

                <button
                  onClick={() => setCurrentPage('jewelry-planner')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition ${
                    currentPage === 'jewelry-planner'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-[#1f3263] hover:text-white'
                  }`}
                >
                  <Gem className="w-4 h-4 text-rose-400" />
                  <span>Jewelry Planner</span>
                </button>

                <button
                  onClick={() => setCurrentPage('history')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition ${
                    currentPage === 'history'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-[#1f3263] hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4 text-purple-300" />
                  <span>History</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage('landing')}
                  className="px-3 py-1.5 text-xs lg:text-sm text-slate-200 hover:text-white transition font-medium"
                >
                  Home
                </button>
                <a
                  href="#features"
                  className="px-3 py-1.5 text-xs lg:text-sm text-slate-200 hover:text-white transition font-medium"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="px-3 py-1.5 text-xs lg:text-sm text-slate-200 hover:text-white transition font-medium"
                >
                  Testimonials
                </a>
              </>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Currency Switcher */}
            <div className="flex items-center bg-[#0d1833] rounded-md p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-1 rounded font-medium transition ${
                  currency === 'INR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Indian Rupee"
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded font-medium transition flex items-center ${
                  currency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="US Dollar"
              >
                <DollarSign className="w-3 h-3 mr-0.5" />
                USD
              </button>
            </div>

            {/* VS Code Guide Trigger */}
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[#1e346b] hover:bg-[#28448b] text-blue-200 border border-blue-500/30 transition shadow-xs"
              title="Open VS Code setup & execution guide"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">VS Code Setup</span>
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-700">
                <span className="hidden xl:inline text-xs text-blue-200">
                  Hi, <span className="font-semibold text-white">{user.username}</span>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setCurrentPage('landing');
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 transition"
                  title="Log out of session"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1f3263] transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-md text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
