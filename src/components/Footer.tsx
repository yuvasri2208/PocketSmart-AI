import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-[#0b1426] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-amber-500 via-rose-500 to-blue-500 flex items-center justify-center shadow-xs">
                <span className="font-extrabold text-white text-sm">P</span>
              </div>
              <span className="font-bold text-lg text-white">PocketSmart</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              AI-powered budget planning tools to help you make smarter financial decisions every day across home decor, celebrations, and occasion styling.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition text-slate-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 hover:text-white flex items-center justify-center transition text-slate-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-700 hover:text-white flex items-center justify-center transition text-slate-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center transition text-slate-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('home-planner')} className="hover:text-white transition text-left">Home Planner</button></li>
              <li><button onClick={() => setCurrentPage('party-planner')} className="hover:text-white transition text-left">Party Planner</button></li>
              <li><button onClick={() => setCurrentPage('jewelry-planner')} className="hover:text-white transition text-left">Jewelry Planner</button></li>
              <li><a href="#" className="hover:text-white transition">Pricing & API</a></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs">Resources & Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Blog & Guides</a></li>
              <li><a href="#" className="hover:text-white transition">Support & FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <p>© 2026 PocketSmart. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Powered by Google Gemini 1.5 Flash / 3.8 Flash Pro & FastAPI architecture.</p>
        </div>
      </div>
    </footer>
  );
};
