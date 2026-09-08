import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import {
  Calendar,
  Clock,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const TimetableManagement: React.FC = () => {
  const { slots, triggerMissedSlotReassignment, isReassigningSlot } = useAgriStore();

  const todaySlots = slots.filter((s) => s.dayLabel === 'Today');

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <Calendar className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              Loading Bay & Timetable Schedule Control
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Day scheduler showing booked slots, bay assignments, and dynamic reallocation
          </p>
        </div>

        <button
          onClick={triggerMissedSlotReassignment}
          disabled={isReassigningSlot}
          className="px-3.5 py-1.5 rounded-xl border border-[#0D7377] text-[#0D7377] hover:bg-[#0D7377]/10 font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isReassigningSlot ? 'animate-spin' : ''}`} />
          <span>Reassign Next Open Slot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {todaySlots.map((slot) => {
          let statusBg = 'border-emerald-200 bg-emerald-50/40';
          let statusText = 'Optimal Load';

          if (slot.congestion === 'medium') {
            statusBg = 'border-amber-200 bg-amber-50/40';
            statusText = 'Moderate';
          } else if (slot.congestion === 'high') {
            statusBg = 'border-rose-200 bg-rose-50/40';
            statusText = 'High Traffic';
          }

          return (
            <div
              key={slot.id}
              className={`p-3.5 rounded-xl border ${statusBg} flex flex-col justify-between space-y-2.5`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#212121]">{slot.timeWindow}</span>
                  <span className="text-[10px] font-bold text-[#0D7377]">Bay #{slot.bayNumber}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Booked: {slot.bookedCount} / {slot.capacity} Trucks
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-gray-700">{statusText}</span>
                <span className="text-gray-500">~{slot.waitMinutes}m Wait</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
