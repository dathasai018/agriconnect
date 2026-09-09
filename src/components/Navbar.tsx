import React, { useState } from 'react';
import { useAgriStore } from '../context/AgriStoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Globe,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Building2,
  ShoppingBag,
  ExternalLink,
  Bot
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    farmerTab,
    setFarmerTab,
    isAuthenticated,
    openAuthModal,
    logout,
    currentUser,
    setIsAssistantOpen
  } = useAgriStore();

  const { language, setLanguage, t, languageOptions } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveRole(null)}>
          <div className="w-10 h-10 rounded-2xl gradient-agri flex items-center justify-center shadow-sm text-white">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-gray-900">Agri</span>
              <span className="text-xl font-extrabold tracking-tight text-emerald-700">Connect</span>
              <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
              {t('brand_tagline')}
            </p>
          </div>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Bilingual English | తెలుగు Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                language === 'te'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* AI Quick Button in Nav */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
          >
            <Bot className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 relative transition-all"
            >
              <Bell className="w-4 h-4 text-[#323232]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0D7377] ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#212121]">{t('notifications_title')}</span>
                  <span className="text-[10px] text-[#0D7377] font-medium">{t('notifications_new')}</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="text-xs p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100">
                    <p className="font-semibold text-[11px]">{t('notif_1_title')}</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">{t('notif_1_desc')}</p>
                  </div>
                  <div className="text-xs p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-100">
                    <p className="font-semibold text-[11px]">{t('notif_2_title')}</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">{t('notif_2_desc')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Login CTA */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full gradient-agri flex items-center justify-center font-bold text-xs text-[#212121] shadow-xs">
                {currentUser.name.slice(0, 1)}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-[#212121] truncate max-w-[140px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#323232]/70 font-medium capitalize">
                  {activeRole === 'farmer' ? 'Kisan Member' : activeRole === 'admin' ? 'Centre Admin' : 'Buyer / Trader'}
                </p>
              </div>
              <button
                onClick={logout}
                title={t('sign_out')}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="px-4 py-2 rounded-xl gradient-agri text-[#212121] font-bold text-xs shadow-md shadow-[#0D7377]/15 hover:opacity-95 transition-all glow-btn"
            >
              {t('sign_in')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
