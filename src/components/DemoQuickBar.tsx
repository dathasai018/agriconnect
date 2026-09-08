import React from 'react';
import { useAgriStore } from '../context/AgriStoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, User, ShoppingBag, ShieldCheck, Play, ArrowRight } from 'lucide-react';

export const DemoQuickBar: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    farmerTab,
    setFarmerTab,
    runSimulatedE2EFlow,
    isE2ERunning,
    addToast
  } = useAgriStore();
  const { t } = useLanguage();

  return (
    <div className="bg-[#212121] text-white text-xs py-2 px-4 sticky top-0 z-40 border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-[#0D7377] text-[#14FFEC] text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#14FFEC]" />
            {t('demo_mode')}
          </span>
          <span className="text-gray-300 hidden sm:inline text-[11px]">
            {t('switch_roles_text')}
          </span>
        </div>

        {/* Role & Interface Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveRole(null)}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeRole === null
                ? 'bg-white text-[#212121] shadow-sm font-semibold'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            {t('landing_hero')}
          </button>

          <button
            onClick={() => {
              setActiveRole('farmer');
              setFarmerTab('govt');
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeRole === 'farmer' && farmerTab === 'govt'
                ? 'bg-[#0D7377] text-white shadow-sm ring-1 ring-[#14FFEC]'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <User className="w-3 h-3 text-[#14FFEC]" />
            {t('farmer_govt')}
          </button>

          <button
            onClick={() => {
              setActiveRole('farmer');
              setFarmerTab('market');
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeRole === 'farmer' && farmerTab === 'market'
                ? 'bg-[#0D7377] text-white shadow-sm ring-1 ring-[#14FFEC]'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-3 h-3 text-[#14FFEC]" />
            {t('farmer_market')}
          </button>

          <button
            onClick={() => setActiveRole('customer')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeRole === 'customer'
                ? 'bg-[#0D7377] text-white shadow-sm ring-1 ring-[#14FFEC]'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-3 h-3 text-emerald-400" />
            {t('customer_role')}
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              activeRole === 'admin'
                ? 'bg-[#0D7377] text-white shadow-sm ring-1 ring-[#14FFEC]'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            {t('admin_role')}
          </button>
        </div>

        {/* E2E Simulation Trigger */}
        <button
          onClick={runSimulatedE2EFlow}
          disabled={isE2ERunning}
          className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isE2ERunning
              ? 'bg-amber-600 text-white cursor-not-allowed'
              : 'bg-[#14FFEC] text-[#212121] hover:bg-[#14FFEC]/90'
          }`}
        >
          <Play className={`w-3 h-3 ${isE2ERunning ? 'animate-spin' : ''}`} />
          <span>{isE2ERunning ? t('running_sim') : t('run_e2e_btn')}</span>
        </button>
      </div>
    </div>
  );
};
