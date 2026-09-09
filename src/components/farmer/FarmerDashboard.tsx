import React, { useState } from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { FarmerView } from '../../types';
import { FarmerHomeScreen } from './FarmerHomeScreen';
import { FarmerBottomNav } from './FarmerBottomNav';
import { SimpleMandiBooking } from './govt/SimpleMandiBooking';
import { CentreLocator } from './govt/CentreLocator';
import { WeatherDashboard } from './govt/WeatherDashboard';
import { MSPPriceDashboard } from './govt/MSPPriceDashboard';
import { QueueTokenWidget } from './govt/QueueTokenWidget';
import { PaymentTracker } from './govt/PaymentTracker';
import { MissedSlotWidget } from './govt/MissedSlotWidget';
import { TruckDashboard } from './govt/TruckDashboard';
import { GovernmentSchemesView } from './govt/GovernmentSchemesView';
import { FarmerHelpView } from './govt/FarmerHelpView';
import { MyListingsGrid } from './market/MyListingsGrid';
import { CreateListingModal } from './market/CreateListingModal';
import { HarvestAdvisory } from './market/HarvestAdvisory';
import {
  Home,
  ArrowLeft,
  Calendar,
  MapPin,
  CloudSun,
  TrendingUp,
  ClipboardList,
  Landmark,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, fetchMyListings } = useAgriStore();
  const { t } = useLanguage();
  const [view, setView] = useState<FarmerView>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState<any>(null);

  React.useEffect(() => {
    if (view === 'market') {
      fetchMyListings();
    }
  }, [view]);

  return (
    <div className="min-h-screen pb-20 sm:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Desktop View Navigation Bar */}
        {view !== 'home' && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setView('home')}
              className="px-4 py-2 rounded-2xl bg-white border border-gray-200 hover:border-emerald-600 text-gray-800 text-xs sm:text-sm font-bold shadow-2xs flex items-center gap-1.5 transition-colors touch-target"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-700" />
              <span>← Back to Home</span>
            </button>

            {/* Quick View Switcher on Desktop */}
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-200 text-xs">
              <button
                onClick={() => setView('mandi')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  view === 'mandi' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌾 Mandi
              </button>
              <button
                onClick={() => setView('nearby')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  view === 'nearby' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📍 Nearby
              </button>
              <button
                onClick={() => setView('weather')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  view === 'weather' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌦 Weather
              </button>
              <button
                onClick={() => setView('prices')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  view === 'prices' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                💰 Prices
              </button>
              <button
                onClick={() => setView('bookings')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  view === 'bookings' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Bookings
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            ACTIVE VIEW RENDERING
        ───────────────────────────────────────────────────────────── */}
        {view === 'home' && (
          <FarmerHomeScreen onNavigate={setView} />
        )}

        {view === 'mandi' && (
          <div className="space-y-6">
            <SimpleMandiBooking onDone={() => setView('bookings')} />
            <MissedSlotWidget />
          </div>
        )}

        {view === 'nearby' && (
          <div className="space-y-6">
            <CentreLocator />
          </div>
        )}

        {view === 'weather' && (
          <div className="space-y-6">
            <WeatherDashboard />
          </div>
        )}

        {view === 'prices' && (
          <div className="space-y-6">
            <MSPPriceDashboard />
          </div>
        )}

        {view === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PaymentTracker />
              </div>
              <div>
                <QueueTokenWidget />
              </div>
            </div>
            <TruckDashboard />
          </div>
        )}

        {view === 'schemes' && (
          <GovernmentSchemesView onBack={() => setView('home')} />
        )}

        {view === 'help' && (
          <FarmerHelpView onBack={() => setView('home')} />
        )}

        {view === 'market' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <HarvestAdvisory />
            <MyListingsGrid onOpenCreateModal={(listing) => {
              setListingToEdit(listing || null);
              setIsCreateModalOpen(true);
            }} />
            <CreateListingModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              listingToEdit={listingToEdit}
            />
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation (Mobile) */}
      <FarmerBottomNav activeView={view} onNavigate={setView} />
    </div>
  );
};
