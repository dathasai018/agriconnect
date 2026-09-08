import React from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Clock,
  AlertTriangle,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const MissedSlotWidget: React.FC = () => {
  const {
    myBookedSlot,
    missedSlotSeconds,
    isReassigningSlot,
    fastForwardTimer,
    triggerMissedSlotReassignment
  } = useAgriStore();
  const { t } = useLanguage();

  const minutes = Math.floor(missedSlotSeconds / 60);
  const seconds = missedSlotSeconds % 60;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5 relative overflow-hidden">
      {/* Reassigning Loading Banner Overlay */}
      {isReassigningSlot && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#0D7377] border-t-[#14FFEC] animate-spin" />
          <h4 className="font-extrabold text-base text-[#212121]">
            {t('auto_reassign_notice')}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs">
            {t('loading_bay_sub')}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#212121] flex items-center gap-1.5">
              <span>{t('countdown_title')}</span>
              <span className="text-[10px] bg-teal-100 text-[#0D7377] px-2 py-0.5 rounded-full font-semibold">
                {t('bay_label')} #{myBookedSlot?.bayNumber || 4}
              </span>
            </h4>
            <p className="text-xs text-gray-500">
              Reserved: {myBookedSlot?.timeWindow || '10:00 AM - 12:00 PM'} ({myBookedSlot?.dayLabel || t('today_label')})
            </p>
          </div>
        </div>

        {/* Live Countdown & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="text-xs text-gray-400 font-medium">{t('arrival_timer')}:</span>
            <span className="font-mono text-base font-extrabold text-amber-700 tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={fastForwardTimer}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            title="Fast forward countdown for demonstration"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('fast_forward')}</span>
          </button>

          <button
            onClick={triggerMissedSlotReassignment}
            disabled={isReassigningSlot}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isReassigningSlot ? 'animate-spin' : ''}`} />
            <span>{t('reassign_next_btn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
