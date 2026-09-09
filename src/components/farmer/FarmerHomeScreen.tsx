import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { FarmerView } from '../../types';
import {
  Calendar,
  MapPin,
  CloudSun,
  TrendingUp,
  Bot,
  ClipboardList,
  Landmark,
  HelpCircle,
  Bell,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ShoppingBag,
  Tag,
  ArrowRight
} from 'lucide-react';

interface FarmerHomeScreenProps {
  onNavigate: (view: FarmerView) => void;
  onOpenSellModal: () => void;
}

export const FarmerHomeScreen: React.FC<FarmerHomeScreenProps> = ({ onNavigate, onOpenSellModal }) => {
  const { currentUser, weatherForecast, myBookedSlot, setIsAssistantOpen } = useAgriStore();
  const { t } = useLanguage();

  const todayWeather = weatherForecast[0] || {
    tempC: 32,
    condition: 'Partly Cloudy',
    rainProbability: 20
  };

  const displayName = currentUser?.name?.trim() || 'Farmer';

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Top Farmer Greeting & Status Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-emerald-800">🌾 AgriConnect</span>
              {currentUser.aadhaarVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Kisan
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t('namaste_farmer').replace('Farmer', displayName)}
            </h1>
          </div>

          {/* Quick Snapshot: Location & Weather */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{currentUser.village || 'Warangal, Telangana'}</span>
            </div>

            <button
              onClick={() => onNavigate('weather')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 font-medium hover:bg-amber-100 transition-colors"
            >
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>{todayWeather.tempC}°C • {todayWeather.condition}</span>
            </button>
          </div>
        </div>

        {/* Important Alert Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start sm:items-center gap-3 text-xs text-emerald-950">
          <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 sm:mt-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-emerald-900">
              MSP Procurement Active at Warangal Mandi
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Paddy Grade A @ ₹2,350/Qtl. Book your delivery time slot to avoid highway waiting.
            </p>
          </div>
          {myBookedSlot && (
            <button
              onClick={() => onNavigate('bookings')}
              className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0 hover:bg-emerald-800 transition-colors"
            >
              My Slot
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          🌾 SELL MY CROP — Prominent Hero Action Card
          Opens the existing CreateListingModal directly from home screen.
          No separate page, no duplicate form.
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-1 shadow-lg">
        <div className="rounded-[22px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-inner">
                🌾
              </div>
              <div>
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-widest mb-1">
                  Open Direct Marketplace
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Sell My Crop
                </h2>
                <p className="text-emerald-100 text-sm mt-1 leading-snug">
                  List your harvested produce and connect directly with wholesale buyers — no middlemen.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSellModal}
              aria-label="Sell my crop — open listing form"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-emerald-800 font-extrabold text-base shadow-lg hover:bg-emerald-50 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>SELL MY CROP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Sub-info strip */}
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs text-emerald-100">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              AI-suggested prices
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified buyers only
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Zero commission
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Heading */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          {t('what_do_you_need')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Tap any option below to get started immediately.
        </p>
      </div>

      {/* 8 Large Farmer Cards — 5 Primary at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Mandi (Primary #1) */}
        <button
          onClick={() => onNavigate('mandi')}
          className="group text-left p-5 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">{t('card_mandi')}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  5-Step
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_mandi_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 2. Nearby Centers (Primary #2) */}
        <button
          onClick={() => onNavigate('nearby')}
          className="group text-left p-5 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-blue-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              📍
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_nearby')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_nearby_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 3. Weather (Primary #3) */}
        <button
          onClick={() => onNavigate('weather')}
          className="group text-left p-5 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🌦
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_weather')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_weather_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 4. Market Prices (Primary #4) */}
        <button
          onClick={() => onNavigate('prices')}
          className="group text-left p-5 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              💰
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_prices')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_prices_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 5. AI Farmer Assistant (Primary #5) */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group text-left p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 border-2 border-emerald-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">{t('card_ai')}</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> 24x7
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_ai_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-700 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 6. My Bookings */}
        <button
          onClick={() => onNavigate('bookings')}
          className="group text-left p-5 rounded-3xl bg-white border border-gray-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              📋
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_bookings')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_bookings_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 7. Government Schemes */}
        <button
          onClick={() => onNavigate('schemes')}
          className="group text-left p-5 rounded-3xl bg-white border border-gray-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🏛
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_schemes')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_schemes_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>

        {/* 8. Help & Support */}
        <button
          onClick={() => onNavigate('help')}
          className="group text-left p-5 rounded-3xl bg-white border border-gray-200 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🆘
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{t('card_help')}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t('card_help_sub')}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Kisan Helpline Footer Strip */}
      <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Toll-Free National Kisan Call Centre: <strong>1800-180-1551</strong> (6 AM – 10 PM)</span>
        </div>
        <span className="text-[11px] text-gray-400">Government of India APMC / e-NAM Portal</span>
      </div>
    </div>
  );
};
