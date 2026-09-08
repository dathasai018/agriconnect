import React, { useState } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { CentreLocator } from './govt/CentreLocator';
import { SmartSlotScheduler } from './govt/SmartSlotScheduler';
import { MissedSlotWidget } from './govt/MissedSlotWidget';
import { TruckDashboard } from './govt/TruckDashboard';
import { MSPPriceDashboard } from './govt/MSPPriceDashboard';
import { QueueTokenWidget } from './govt/QueueTokenWidget';
import { PaymentTracker } from './govt/PaymentTracker';
import { WeatherDashboard } from './govt/WeatherDashboard';
import { MyListingsGrid } from './market/MyListingsGrid';
import { CreateListingModal } from './market/CreateListingModal';
import { HarvestAdvisory } from './market/HarvestAdvisory';
import {
  Building2,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { farmerTab, setFarmerTab, currentUser } = useAgriStore();
  const { t } = useLanguage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-white via-teal-50/30 to-white p-5 rounded-2xl border border-gray-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl gradient-agri flex items-center justify-center text-[#212121] font-extrabold text-lg shadow-md shadow-[#0D7377]/15">
            {currentUser.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#212121]">
                {t('namaste_greeting')}, {currentUser.name}
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {t('aadhaar_verified_badge')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('village_label')}: {currentUser.village} • {t('aadhaar_label')}: {currentUser.aadhaar} • {t('registered_mandi_label')}: Warangal Enumamula
            </p>
          </div>
        </div>

        {/* Interface Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setFarmerTab('govt')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              farmerTab === 'govt'
                ? 'bg-[#0D7377] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#212121]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('govt_procurement')}</span>
          </button>
          <button
            onClick={() => setFarmerTab('market')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              farmerTab === 'market'
                ? 'bg-[#0D7377] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#212121]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('open_market')}</span>
          </button>
        </div>
      </div>

      {/* Render Govt Procurement View */}
      {farmerTab === 'govt' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Missed Slot Grace Timer */}
          <MissedSlotWidget />

          {/* Top Row: Centre Locator + Live Queue Counter */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CentreLocator />
            </div>
            <div>
              <QueueTokenWidget />
            </div>
          </div>

          {/* Smart Slot Timetable */}
          <SmartSlotScheduler />

          {/* Middle Row: Truck Flow + Weather Dashboard */}
          <div className="grid lg:grid-cols-2 gap-6">
            <TruckDashboard />
            <WeatherDashboard />
          </div>

          {/* Procurement & Payment Stepper */}
          <PaymentTracker />

          {/* MSP Prices & Agmarknet Comparison */}
          <MSPPriceDashboard />
        </div>
      ) : (
        /* Render Open Market View */
        <div className="space-y-6 animate-in fade-in duration-200">
          <HarvestAdvisory />
          <MyListingsGrid onOpenCreateModal={() => setIsCreateModalOpen(true)} />
          <WeatherDashboard />

          <CreateListingModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
