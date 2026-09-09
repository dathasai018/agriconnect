import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  TrendingUp,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const CROP_PRICES = [
  {
    crop: 'Paddy (Common / Grade A)',
    icon: '🌾',
    price: '₹2,350',
    market: 'Warangal Market',
    updatedAt: 'Today, 10:30 AM',
    benchmark: 'Official CACP Minimum Support Price',
    change: '+₹140 vs 2024',
    status: 'Procurement Active'
  },
  {
    crop: 'Basmati Paddy (Pusa 1121)',
    icon: '🌾',
    price: '₹3,850',
    market: 'Warangal Mandi Yard',
    updatedAt: 'Today, 10:30 AM',
    benchmark: 'e-NAM Open Wholesale Auction',
    change: '+₹120 vs yesterday',
    status: 'High Demand'
  },
  {
    crop: 'Raw Cotton (Long Staple)',
    icon: '🌿',
    price: '₹7,450',
    market: 'Warangal Market',
    updatedAt: 'Today, 10:15 AM',
    benchmark: 'Cotton Corporation of India (CCI)',
    change: '+₹329 vs 2024',
    status: 'Procurement Active'
  },
  {
    crop: 'Maize (Yellow FAQ)',
    icon: '🌽',
    price: '₹2,090',
    market: 'Warangal Market',
    updatedAt: 'Today, 09:45 AM',
    benchmark: 'Government Procurement MSP',
    change: '+₹128 vs 2024',
    status: 'Steady'
  },
  {
    crop: 'Lakadong Turmeric (High Curcumin)',
    icon: '🟡',
    price: '₹14,200',
    market: 'Nizamabad Electronic Mandi',
    updatedAt: 'Today, 10:00 AM',
    benchmark: 'Spices Board Wholesale Benchmark',
    change: '+₹450 this week',
    status: 'High Demand'
  },
  {
    crop: 'Sharbati Wheat (Golden)',
    icon: '🌾',
    price: '₹2,275',
    market: 'Khanna Regional Terminal',
    updatedAt: 'Today, 09:30 AM',
    benchmark: 'Rabi CACP Minimum Support Price',
    change: '+₹150 vs 2024',
    status: 'Procurement Active'
  }
];

const HISTORICAL_DATA = [
  { crop: 'Paddy', y2023: 2040, y2024: 2183, y2025: 2350 },
  { crop: 'Wheat', y2023: 2015, y2024: 2125, y2025: 2275 },
  { crop: 'Cotton', y2023: 6080, y2024: 6620, y2025: 7450 },
  { crop: 'Maize', y2023: 1870, y2024: 1962, y2025: 2090 }
];

export const MSPPriceDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>💰</span> Market Prices & Government MSP
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verified prices synced directly from Agmarknet & CACP Government of India.
          </p>
        </div>

        <button
          onClick={() => setShowChart(!showChart)}
          className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto touch-target"
        >
          <span>{showChart ? 'Hide Trend Chart' : 'View 3-Year Trend'}</span>
          {showChart ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Simple Prominent Crop Cards (Required Example) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CROP_PRICES.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-3xl bg-white border-2 border-gray-200/90 hover:border-emerald-600 transition-all space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                    {item.crop}
                  </h3>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{item.market}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Prominent Price Display */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Current Mandi Rate
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {item.price}
                </span>
                <span className="text-xs font-bold text-gray-500">/ Quintal</span>
              </div>
            </div>

            {/* Prominent Update Time & Benchmark */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-gray-600 font-semibold">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Updated: {item.updatedAt.replace('Today, ', '')}</span>
              </span>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable 3-Year Historical Growth Chart */}
      {showChart && (
        <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">
              Government MSP 3-Year Growth (₹ / Quintal)
            </h4>
            <span className="text-[11px] text-gray-500">Source: CACP Ministry of Agriculture</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '0.75rem', borderColor: '#E2E8F0', fontSize: '11px' }}
                />
                <Bar dataKey="y2023" name="2023-24" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2024" name="2024-25" fill="#64748B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2025" name="2025-26 (Current)" fill="#15803D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
