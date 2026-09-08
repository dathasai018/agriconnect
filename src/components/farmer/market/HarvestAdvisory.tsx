import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Sprout, Sun, Droplets, Clock, ArrowRight } from 'lucide-react';

export const HarvestAdvisory: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
          <Sprout className="w-4 h-4 text-[#212121]" />
        </div>
        <h3 className="text-base font-bold text-[#212121]">
          {t('harvest_advisory_title')}
        </h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
            <Droplets className="w-4 h-4" />
            <span>Target Moisture: &lt;14%</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Paddy below 14% moisture qualifies for Grade A without refanning fees at both Mandi and wholesale millers.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
          <div className="flex items-center gap-1.5 text-[#0D7377] font-bold mb-1">
            <Sun className="w-4 h-4" />
            <span>Optimal Sun Drying Window</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Wednesday & Thursday forecasted with clear sunshine (33°C). Ideal 36-hour drying interval.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>Peak Demand Window</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Rice export millers in Telangana are buying Pusa 1121 with immediate 24-hr payment clearance.
          </p>
        </div>
      </div>
    </div>
  );
};
