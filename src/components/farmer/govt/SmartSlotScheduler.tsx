import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import { MandiSlot } from '../../../types';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const SmartSlotScheduler: React.FC = () => {
  const { slots, myBookedSlot, bookSlot } = useAgriStore();
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow'>('Today');
  const [activeSlotModal, setActiveSlotModal] = useState<MandiSlot | null>(null);
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Grade A)');
  const [isBooking, setIsBooking] = useState(false);

  const filteredSlots = slots.filter((s) => s.dayLabel.includes(selectedDay));

  const handleOpenBookingModal = (slot: MandiSlot) => {
    setActiveSlotModal(slot);
  };

  const handleConfirmBooking = async () => {
    if (!activeSlotModal) return;
    setIsBooking(true);
    await bookSlot(activeSlotModal.id, selectedCrop);
    setIsBooking(false);
    setActiveSlotModal(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white via-teal-50/10 to-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <Calendar className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              {t('slot_scheduler_title')}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#0D7377]">
              <Sparkles className="w-3 h-3 text-[#0D7377]" />
              {t('vertex_ai_tag')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('slot_scheduler_sub')}
          </p>
        </div>

        {/* Day Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => setSelectedDay('Today')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              selectedDay === 'Today' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            {t('today_label')}
          </button>
          <button
            onClick={() => setSelectedDay('Tomorrow')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
              selectedDay === 'Tomorrow' ? 'bg-white text-[#0D7377] shadow-xs' : 'text-gray-500'
            }`}
          >
            {t('tomorrow_label')}
          </button>
        </div>
      </div>

      {/* Grid of Slots */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSlots.map((slot) => {
          const isFull = slot.bookedCount >= slot.capacity;
          const isUserBooked = slot.isUserBooked;

          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let badgeText = `${t('status_open')} (Low)`;
          let cardBg = 'hover:border-[#0D7377]/60 hover:shadow-xs';

          if (slot.congestion === 'medium') {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
            badgeText = `${t('status_moderate')} (~35m)`;
          } else if (slot.congestion === 'high') {
            badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
            badgeText = `${t('status_high')} (~70m)`;
          }

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between space-y-3 ${
                isUserBooked
                  ? 'border-[#0D7377] bg-teal-50/40 shadow-xs ring-1 ring-[#0D7377]'
                  : 'border-gray-200 bg-white ' + cardBg
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-extrabold text-[#212121]">
                    {slot.timeWindow}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-gray-600">
                  <span>{t('bay_label')} #{slot.bayNumber}</span>
                  <span className="font-semibold text-[#0D7377]">
                    {slot.waitMinutes || slot.totalEstMinutes || 20} {t('mins_to_bay').split(' ')[0]} wait
                  </span>
                </div>

                {/* Progress Fill Bar */}
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      slot.congestion === 'low'
                        ? 'bg-emerald-500'
                        : slot.congestion === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>{slot.bookedCount} / {slot.capacity} {t('trucks_label')}</span>
                  <span>{slot.cropAllowed}</span>
                </div>
              </div>

              {/* Action CTA */}
              <div>
                {isUserBooked ? (
                  <div className="w-full py-2 bg-[#0D7377] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('booked_by_you')}</span>
                  </div>
                ) : isFull ? (
                  <div className="w-full py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold text-center cursor-not-allowed">
                    {t('capacity_full')}
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenBookingModal(slot)}
                    className="w-full py-2 bg-white hover:bg-teal-50 border border-[#0D7377] text-[#0D7377] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <span>{t('book_this_slot')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Confirmation Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0D7377]" />
                <h3 className="font-bold text-sm text-[#212121]">{t('book_this_slot')}</h3>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
                <p className="text-gray-500">{t('hours_label')}</p>
                <p className="font-mono font-bold text-sm text-[#0D7377]">{activeSlotModal.timeWindow}</p>
                <p className="text-gray-600">
                  {t('bay_label')} #{activeSlotModal.bayNumber} • Warangal Main Mandi Yard
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">{t('crop')}</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0D7377]"
                >
                  <option>Paddy (Grade A - Basmati)</option>
                  <option>Paddy (Common FAQ)</option>
                  <option>Cotton (Long Staple)</option>
                  <option>Yellow Maize</option>
                  <option>Desi Chana (Chickpeas)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setActiveSlotModal(null)}
                className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="flex-1 py-2.5 gradient-agri text-[#212121] rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isBooking ? t('running_sim') : t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
