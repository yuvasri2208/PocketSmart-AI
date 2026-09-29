import React from 'react';
import { ExternalLink, ShoppingBag, ShoppingCart, MapPin, Film, Music, Utensils, Home, Sparkles } from 'lucide-react';

interface ShoppingLinksProps {
  links: Record<string, string>;
  className?: string;
  size?: 'sm' | 'md';
}

const PLATFORM_CONFIG: Record<
  string,
  { name: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  amazon: {
    name: 'Amazon',
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: <ShoppingCart className="w-3.5 h-3.5 text-amber-600 mr-1" />,
  },
  flipkart: {
    name: 'Flipkart',
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: <ShoppingBag className="w-3.5 h-3.5 text-blue-600 mr-1" />,
  },
  ikea: {
    name: 'IKEA',
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    text: 'text-blue-900 font-semibold',
    border: 'border-yellow-300',
    icon: <Home className="w-3.5 h-3.5 text-blue-700 mr-1" />,
  },
  myntra: {
    name: 'Myntra',
    bg: 'bg-pink-50 hover:bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    icon: <Sparkles className="w-3.5 h-3.5 text-pink-600 mr-1" />,
  },
  ajio: {
    name: 'Ajio',
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: <ShoppingBag className="w-3.5 h-3.5 text-indigo-600 mr-1" />,
  },
  swiggy: {
    name: 'Swiggy',
    bg: 'bg-orange-50 hover:bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: <Utensils className="w-3.5 h-3.5 text-orange-600 mr-1" />,
  },
  zomato: {
    name: 'Zomato',
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: <Utensils className="w-3.5 h-3.5 text-rose-600 mr-1" />,
  },
  bigbasket: {
    name: 'BigBasket',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: <ShoppingCart className="w-3.5 h-3.5 text-emerald-600 mr-1" />,
  },
  google: {
    name: 'Google Maps',
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    icon: <MapPin className="w-3.5 h-3.5 text-red-500 mr-1" />,
  },
  booking: {
    name: 'Booking.com',
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-900',
    border: 'border-blue-200',
    icon: <Home className="w-3.5 h-3.5 text-blue-700 mr-1" />,
  },
  makemytrip: {
    name: 'MakeMyTrip',
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: <MapPin className="w-3.5 h-3.5 text-red-600 mr-1" />,
  },
  oyorooms: {
    name: 'OYO Rooms',
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-700 font-bold',
    border: 'border-red-200',
    icon: <Home className="w-3.5 h-3.5 text-red-600 mr-1" />,
  },
  nobroker: {
    name: 'NoBroker',
    bg: 'bg-teal-50 hover:bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    icon: <Home className="w-3.5 h-3.5 text-teal-600 mr-1" />,
  },
  bookmyshow: {
    name: 'BookMyShow',
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: <Film className="w-3.5 h-3.5 text-red-600 mr-1" />,
  },
  spotify: {
    name: 'Spotify',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: <Music className="w-3.5 h-3.5 text-emerald-600 mr-1" />,
  },
  bluestone: {
    name: 'BlueStone',
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-200',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />,
  },
  tanishq: {
    name: 'Tanishq',
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    text: 'text-amber-950 font-medium',
    border: 'border-amber-300',
    icon: <Sparkles className="w-3.5 h-3.5 text-amber-700 mr-1" />,
  },
  caratlane: {
    name: 'CaratLane',
    bg: 'bg-purple-50 hover:bg-purple-100',
    text: 'text-purple-900',
    border: 'border-purple-200',
    icon: <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1" />,
  },
  melorra: {
    name: 'Melorra',
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-900',
    border: 'border-rose-200',
    icon: <Sparkles className="w-3.5 h-3.5 text-rose-600 mr-1" />,
  },
  meesho: {
    name: 'Meesho',
    bg: 'bg-pink-50 hover:bg-pink-100',
    text: 'text-pink-900',
    border: 'border-pink-200',
    icon: <ShoppingBag className="w-3.5 h-3.5 text-pink-600 mr-1" />,
  },
};

export const ShoppingLinks: React.FC<ShoppingLinksProps> = ({ links, className = '', size = 'sm' }) => {
  if (!links || Object.keys(links).length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {Object.entries(links).map(([platform, url]) => {
        const key = platform.toLowerCase();
        const conf = PLATFORM_CONFIG[key] || {
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          bg: 'bg-slate-50 hover:bg-slate-100',
          text: 'text-slate-800',
          border: 'border-slate-200',
          icon: <ExternalLink className="w-3.5 h-3.5 text-slate-500 mr-1" />,
        };

        const sizeClasses =
          size === 'sm'
            ? 'px-2 py-1 text-xs'
            : 'px-2.5 py-1.5 text-sm';

        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded border transition-colors shadow-xs ${conf.bg} ${conf.text} ${conf.border} ${sizeClasses}`}
            title={`Search on ${conf.name}`}
          >
            {conf.icon}
            <span>{conf.name}</span>
          </a>
        );
      })}
    </div>
  );
};
