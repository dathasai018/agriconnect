import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import { AdminOverview } from './AdminOverview';
import { LiveQueueTable } from './LiveQueueTable';
import { TimetableManagement } from './TimetableManagement';
import { RFIDMonitoring } from './RFIDMonitoring';
import { ProcurementPaymentControl } from './ProcurementPaymentControl';
import { WeatherDashboard } from '../farmer/govt/WeatherDashboard';
import {
  Building2,
  ShieldCheck,
  Radio,
  FileSpreadsheet,
  Download,
  Printer
} from 'lucide-react';

export const CentreAdminDashboard: React.FC = () => {
  const { addToast } = useAgriStore();

  const handleExport = () => {
    addToast('success', 'e-NAM Report Exported', 'Downloaded today\'s procurement and DBT audit log as PDF/Excel.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-white via-teal-50/20 to-white p-6 rounded-2xl border border-gray-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0D7377] text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mandi Yard Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212121]">
            Warangal Agricultural Market Committee (Enumamula)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Station Code: TS-WGL-01 • Operating 8 Weighbridges & 6 Hydraulic Unloading Bays
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#212121] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#0D7377]" />
            <span>Export e-NAM Ledger</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <AdminOverview />

      {/* Live Queue Management */}
      <LiveQueueTable />

      {/* Loading Bay & Timetable Schedule */}
      <TimetableManagement />

      {/* RFID Gate Antenna Monitoring */}
      <RFIDMonitoring />

      {/* Grading & DBT Payment Control */}
      <ProcurementPaymentControl />

      {/* Operations Weather Planner */}
      <WeatherDashboard />
    </div>
  );
};
