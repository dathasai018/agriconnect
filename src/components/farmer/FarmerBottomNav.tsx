import React, { useState } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { FarmerView } from '../../types';
import {
  Home,
  MapPin,
  Bot,
  Menu,
  X,
  ClipboardList,
  Landmark,
  HelpCircle,
  CloudSun,
  TrendingUp,
  Globe,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface FarmerBottomNavProps {
  activeView: FarmerView;
  onNavigate: (view: FarmerView) => void;
}

export const FarmerBottomNav: React.FC<FarmerBottomNavProps> = ({ activeView, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { setIsAssistantOpen, logout, currentUser } = useAgriStore();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleNavClick = (view: FarmerView) => {
    setShowMoreMenu(false);
    if (view === 'ai') {
      setIsAssistantOpen(true);
    } else {
      onNavigate(view);
    }
  };

  return (
    <>
      {/* "More" Slide-up Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl border-t border-gray-200 p-5 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-gray-900">
                  {t('nav_more')}
                </span>
                <span className="text-xs text-gray-400">({currentUser.name})</span>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Menu Options */}
            <div className="grid grid-cols-1 gap-2 text-sm">
              <button
                onClick={() => handleNavClick('bookings')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-900 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📋</span>
                  <span>{t('card_bookings')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNavClick('weather')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-900 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌦</span>
                  <span>{t('card_weather')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNavClick('prices')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-900 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">💰</span>
                  <span>{t('card_prices')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNavClick('schemes')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-900 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏛</span>
                  <span>{t('card_schemes')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => handleNavClick('help')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-emerald-50 text-gray-900 font-bold transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🆘</span>
                  <span>{t('card_help')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Language Switcher in Drawer */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-gray-500 font-medium">भाषा / Language:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    language === 'hi'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    language === 'te'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                setShowMoreMenu(false);
                logout();
              }}
              className="w-full py-3 rounded-2xl bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('sign_out')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-2 py-1.5 sm:hidden"
      >
        <div className="flex items-center justify-around">
          {/* 1. Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex-1 flex flex-col items-center justify-center py-1 touch-target rounded-xl transition-all ${
              activeView === 'home'
                ? 'text-emerald-800 font-bold bg-emerald-50/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">{t('nav_home')}</span>
          </button>

          {/* 2. Mandi */}
          <button
            onClick={() => handleNavClick('mandi')}
            className={`flex-1 flex flex-col items-center justify-center py-1 touch-target rounded-xl transition-all ${
              activeView === 'mandi'
                ? 'text-emerald-800 font-bold bg-emerald-50/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="text-base leading-none">🌾</span>
            <span className="text-[11px] mt-0.5">{t('nav_mandi')}</span>
          </button>

          {/* 3. Nearby */}
          <button
            onClick={() => handleNavClick('nearby')}
            className={`flex-1 flex flex-col items-center justify-center py-1 touch-target rounded-xl transition-all ${
              activeView === 'nearby'
                ? 'text-emerald-800 font-bold bg-emerald-50/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">{t('nav_nearby')}</span>
          </button>

          {/* 4. AI */}
          <button
            onClick={() => handleNavClick('ai')}
            className="flex-1 flex flex-col items-center justify-center py-1 touch-target rounded-xl text-teal-800 font-bold hover:bg-teal-50/60 transition-all"
          >
            <Bot className="w-5 h-5 text-teal-700" />
            <span className="text-[11px] mt-0.5">{t('nav_ai')}</span>
          </button>

          {/* 5. More */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 touch-target rounded-xl transition-all ${
              showMoreMenu
                ? 'text-emerald-800 font-bold bg-emerald-50/60'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px] mt-0.5">{t('nav_more')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
