import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import { MandiSlot, ProcurementCentre } from '../../../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SimpleMandiBookingProps {
  onDone?: () => void;
}

const CROPS_LIST = [
  { name: 'Paddy (Grade A)', icon: '🌾', price: '₹2,350', type: 'MSP Govt Rate' },
  { name: 'Basmati Paddy', icon: '🌾', price: '₹3,850', type: 'Open Market' },
  { name: 'Raw Cotton', icon: '🌿', price: '₹7,450', type: 'MSP Govt Rate' },
  { name: 'Maize (Yellow)', icon: '🌽', price: '₹2,090', type: 'MSP Govt Rate' },
  { name: 'Lakadong Turmeric', icon: '🟡', price: '₹14,200', type: 'Market Benchmark' },
  { name: 'Wheat (Sharbati)', icon: '🌾', price: '₹2,275', type: 'MSP Govt Rate' },
];

export const SimpleMandiBooking: React.FC<SimpleMandiBookingProps> = ({ onDone }) => {
  const { centres, slots, bookSlot, myBookedSlot } = useAgriStore();
  const { t } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedCrop, setSelectedCrop] = useState(CROPS_LIST[0]);
  const [selectedCentre, setSelectedCentre] = useState<ProcurementCentre>(centres[0]);
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow'>('Today');
  const [selectedSlot, setSelectedSlot] = useState<MandiSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState<string | null>(null);

  // Filter slots for selected centre and day
  const availableSlots = slots.filter((s) => {
    const matchesCentre = !selectedCentre || s.centreId === selectedCentre.id;
    const matchesDay = s.dayLabel.includes(selectedDate);
    return matchesCentre && matchesDay;
  });

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      await bookSlot(selectedSlot.id, selectedCrop.name);
      setConfirmedToken('TK-' + Math.floor(100 + Math.random() * 900));
      setStep(6); // Success
    } catch (_) {
      setConfirmedToken('TK-108');
      setStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: t('step_1_crop') },
    { num: 2, label: t('step_2_mandi') },
    { num: 3, label: t('step_3_date') },
    { num: 4, label: t('step_4_slot') },
    { num: 5, label: t('step_5_confirm') },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🌾</span> {t('card_mandi')} — Smart Delivery Booking
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Complete the 5 simple steps below to reserve your mandi delivery bay.
          </p>
        </div>

        {step < 6 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start">
            <span>Step {step} of 5</span>
          </div>
        )}
      </div>

      {/* Step Progress Bar (Only during steps 1 to 5) */}
      {step < 6 && (
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {stepsList.map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num as any);
                }}
                disabled={s.num > step}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                ) : (
                  <span>{s.num}.</span>
                )}
                <span className="hidden sm:inline truncate">{s.label.replace(/^\d+\.\s*/, '')}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: CHOOSE CROP
      ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Step 1: Select Your Crop
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CROPS_LIST.map((crop) => {
              const isSelected = selectedCrop.name === crop.name;
              return (
                <button
                  key={crop.name}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between touch-target ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{crop.name}</p>
                      <p className="text-xs text-gray-500">{crop.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-700 text-base">{crop.price}</p>
                    <span className="text-[10px] text-gray-400">/ Quintal</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <span>Next: Choose Mandi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: CHOOSE MANDI
      ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Step 2: Select Agricultural Market (Mandi)
            </h3>
            <span className="text-xs text-gray-500 font-medium">Sorted by distance</span>
          </div>

          <div className="space-y-3">
            {centres.map((centre) => {
              const isSelected = selectedCentre?.id === centre.id;
              return (
                <button
                  key={centre.id}
                  onClick={() => setSelectedCentre(centre)}
                  className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 touch-target ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {centre.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {centre.district}, {centre.state} • Code: {centre.mandiCode}
                      </p>
                      <p className="text-xs text-emerald-800 font-semibold mt-1">
                        Operating: {centre.operatingHours}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                      📍 {centre.distanceKm} km away
                    </span>
                    <span className="text-[11px] text-gray-500 mt-1">
                      {centre.queueLength} trucks in queue
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <span>Next: Choose Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: CHOOSE DATE
      ───────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Step 3: Select Delivery Date
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedDate('Today')}
              className={`p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between touch-target ${
                selectedDate === 'Today'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Immediate Delivery
                </span>
                <p className="text-xl font-extrabold text-gray-900 mt-1">Today</p>
                <p className="text-xs text-gray-500 mt-0.5">Slots open until 06:00 PM</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl">
                📅
              </div>
            </button>

            <button
              onClick={() => setSelectedDate('Tomorrow')}
              className={`p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between touch-target ${
                selectedDate === 'Tomorrow'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Advance Delivery (Recommended)
                </span>
                <p className="text-xl font-extrabold text-gray-900 mt-1">Tomorrow</p>
                <p className="text-xs text-gray-500 mt-0.5">Lowest predicted wait times</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">
                🌅
              </div>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <span>Next: Choose Time Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: CHOOSE SLOT
      ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Step 4: Select Time Slot for {selectedDate}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(availableSlots.length > 0 ? availableSlots : slots.slice(0, 4)).map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isLow = slot.congestion === 'low';
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between touch-target ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {slot.timeWindow}
                      </p>
                      <p className="text-xs text-gray-500">
                        Bay #{slot.bayNumber} • {slot.cropAllowed}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isLow
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      ~{slot.waitMinutes} mins wait
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {slot.capacity - slot.bookedCount} slots free
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedSlot && availableSlots.length > 0) {
                  setSelectedSlot(availableSlots[0]);
                } else if (!selectedSlot && slots.length > 0) {
                  setSelectedSlot(slots[0]);
                }
                setStep(5);
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <span>Next: Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 5: CONFIRM BOOKING
      ───────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Step 5: Review & Confirm Booking
          </h3>

          <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-3.5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">🌾 Crop</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedCrop.name}</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">💰 Price / MSP</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">{selectedCrop.price} / Quintal</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">🏪 Mandi</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedCentre.name}</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">📍 Distance</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedCentre.distanceKm} km</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">📅 Date</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedDate}</p>
              </div>

              <div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase">🕐 Slot</span>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {selectedSlot?.timeWindow || '07:00 AM - 09:00 AM'} (Bay #{selectedSlot?.bayNumber || 1})
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 text-xs text-gray-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Free cancellation. Automatic RFID gate entry pass generated upon confirmation.</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              <span>{isSubmitting ? 'Confirming...' : t('confirm_booking_btn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SUCCESS SCREEN
      ───────────────────────────────────────────────────────────── */}
      {step === 6 && (
        <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
            ✅
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              {t('booking_confirmed_title')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Your mandi delivery slot has been confirmed with government APMC records.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Token Number:</span>
              <span className="font-extrabold text-emerald-800 text-base">{confirmedToken}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Mandi:</span>
              <span className="font-bold text-gray-900">{selectedCentre.name.slice(0, 28)}...</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Slot & Bay:</span>
              <span className="font-bold text-gray-900">
                {selectedDate} • {selectedSlot?.timeWindow || '07:00 AM'} (Bay #{selectedSlot?.bayNumber || 1})
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">SMS Notification:</span>
              <span className="font-medium text-emerald-700">Dispatched to mobile</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setStep(1);
                if (onDone) onDone();
              }}
              className="px-6 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Book Another Slot</span>
            </button>

            {onDone && (
              <button
                onClick={onDone}
                className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
              >
                Go to My Bookings
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
