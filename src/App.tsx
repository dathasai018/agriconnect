import React from 'react';
import { AgriStoreProvider, useAgriStore } from './context/AgriStoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CentreAdminDashboard } from './components/admin/CentreAdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/shared/ToastContainer';
import { GeminiAssistant } from './components/shared/GeminiAssistant';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRole } = useAgriStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#212121] selection:bg-[#14FFEC] selection:text-[#212121]">
      {/* Main App Navigation */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {activeRole === null && <LandingPage />}
        {activeRole === 'farmer' && <FarmerDashboard />}
        {activeRole === 'customer' && <CustomerDashboard />}
        {activeRole === 'admin' && <CentreAdminDashboard />}
      </main>

      {/* Global Shared Widgets */}
      <AuthModal />
      <ToastContainer />
      <GeminiAssistant />

      {/* Modern Light SaaS Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <Sprout className="w-4 h-4 text-[#212121]" />
            </div>
            <span className="font-bold text-[#212121]">AgriConnect Platform</span>
            <span className="text-gray-300">|</span>
            <span>Government of India e-NAM & APMC Compliant Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Data synced with Agmarknet & CACP</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Light Theme Design System
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AgriStoreProvider>
        <AppContent />
      </AgriStoreProvider>
    </LanguageProvider>
  );
}

export default App;
