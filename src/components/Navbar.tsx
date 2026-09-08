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
          <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center shadow-md shadow-[#0D7377]/20 text-[#212121]">
            <Sprout className="w-6 h-6 text-[#212121]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#212121]">{t('brand_title').slice(0, 4)}</span>
              <span className="text-xl font-extrabold tracking-tight text-[#0D7377]">{t('brand_title').slice(4)}</span>
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-[#0D7377] border border-teal-200">
                Official
              </span>
            </div>
            <p className="text-[11px] text-[#323232]/70 font-medium hidden sm:block">
              {t('brand_tagline')}
            </p>
          </div>
        </div>

        {/* Farmer Segmented Tab Toggle (Only in Farmer Dashboard) */}
        {activeRole === 'farmer' && (
          <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setFarmerTab('govt')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                farmerTab === 'govt'
                  ? 'bg-white text-[#0D7377] shadow-sm ring-1 ring-black/5'
                  : 'text-[#323232] hover:text-[#212121]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#0D7377]" />
              {t('govt_procurement')}
            </button>
            <button
              onClick={() => setFarmerTab('market')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                farmerTab === 'market'
                  ? 'bg-white text-[#0D7377] shadow-sm ring-1 ring-black/5'
                  : 'text-[#323232] hover:text-[#212121]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#0D7377]" />
              {t('open_market')}
            </button>
          </div>
        )}

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini AI Quick Bubble Button in Nav */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 bg-[#0D7377]/10 hover:bg-[#0D7377]/15 text-[#0D7377] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#0D7377]/20 transition-all glow-btn"
          >
            <Bot className="w-4 h-4 text-[#0D7377]" />
            <span className="hidden sm:inline">{t('gemini_ai_button')}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-medium text-[#212121] transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#0D7377]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-50">
                {languageOptions.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      language === item.code
                        ? 'bg-[#0D7377]/10 text-[#0D7377] font-semibold'
                        : 'text-[#212121] hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[11px] text-gray-400">{item.nativeLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                <p className="text-xs font-bold text-[#212121] truncate max-w-[120px]">
                  {activeRole === 'admin' ? t('admin_role') : activeRole === 'customer' ? t('customer_role') : currentUser.name}
                </p>
                <p className="text-[10px] text-[#323232]/70 font-medium">
                  {activeRole === 'admin' ? 'Warangal APMC' : activeRole === 'customer' ? 'Bulk Trader' : 'Warangal Rural'}
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
