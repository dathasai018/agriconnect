import React, { useState } from 'react';
import { useAgriStore } from '../../../context/AgriStoreContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  HelpCircle,
  PhoneCall,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const FarmerHelpView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { currentUser, addToast } = useAgriStore();
  const { t } = useLanguage();

  const [topic, setTopic] = useState('Payment Delay or UTR Issue');
  const [description, setDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    const ticketId = 'AGRI-TKT-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedTicket(ticketId);
    addToast('success', 'Grievance Registered', `Ticket #${ticketId} submitted to Mandi Officer.`);
    setDescription('');
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🆘</span> Farmer Support & Mandi Grievances
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Official redressal under APMC Market Committee & Government e-NAM.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors self-start sm:self-auto touch-target"
          >
            ← Back to Home
          </button>
        )}
      </div>

      {/* Direct Contact Helplines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">National Kisan Helpline</span>
          <p className="text-lg font-black text-gray-900">1800-180-1551</p>
          <p className="text-[11px] text-gray-500">Toll-free · 6:00 AM – 10:00 PM</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-left space-y-1">
          <span className="text-[11px] font-bold text-blue-800 uppercase">Warangal APMC Control</span>
          <p className="text-lg font-black text-gray-900">+91 870 242 1102</p>
          <p className="text-[11px] text-gray-500">Mandi Secretary Direct Line</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase">PFMS DBT Payment Support</span>
          <p className="text-lg font-black text-gray-900">1800-118-111</p>
          <p className="text-[11px] text-gray-500">Bank Transfer & UTR Tracking</p>
        </div>
      </div>

      {/* Ticket Success Confirmation */}
      {submittedTicket && (
        <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold">
              Official Grievance Ticket Created: {submittedTicket}
            </p>
            <p>
              Your concern has been assigned to the District Marketing Officer. Resolution is guaranteed within 4 hours. You will receive an SMS status update on your registered phone.
            </p>
          </div>
        </div>
      )}

      {/* Submit Grievance Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Open Official Grievance Ticket
        </h3>

        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">
            Category
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-semibold text-gray-800 outline-none focus:border-emerald-600"
          >
            <option>Payment Delay or UTR Issue</option>
            <option>Weighbridge / Gross Weight Dispute</option>
            <option>Moisture Cut / Quality Grade Dispute</option>
            <option>Mandi Slot Rescheduling Request</option>
            <option>Unloading Bay Delay Complaint</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">
            Describe your issue
          </label>
          <textarea
            rows={3}
            placeholder="Provide produce lot, token number, or details of the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-emerald-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!description.trim()}
          className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 touch-target"
        >
          <Send className="w-4 h-4" />
          <span>Submit Grievance Ticket</span>
        </button>
      </form>
    </div>
  );
};
