import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const ok = await register(username, email, password);
      if (ok) {
        setCurrentPage('dashboard');
      } else {
        setError('Failed to create account. Please try another username.');
      }
    } catch {
      setError('Registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#1d3557] tracking-tight">PocketSmart</h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          AI-Powered Budget Planning
        </p>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#1e3a6a] hover:bg-[#162c52] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="font-bold text-blue-600 hover:text-blue-700 underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
