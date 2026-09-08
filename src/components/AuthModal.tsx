import React, { useState } from 'react';
import { useAgriStore } from '../context/AgriStoreContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { api, setAuthToken, setStoredUser } from '../api/client';
import {
  X, Phone, ShieldCheck, Smartphone, Loader2, ChevronRight,
  Leaf, Users, Building2, KeyRound, Info
} from 'lucide-react';

const ROLE_CONFIG: Record<UserRole, {
  label: string;
  icon: React.FC<{ className?: string }>;
  demo: string;
  desc: string;
}> = {
  farmer: { label: 'Farmer / Kisan', icon: Leaf, demo: '9848023456', desc: 'Book slots, track payments, sell produce' },
  customer: { label: 'Buyer / Customer', icon: Users, demo: '9911223344', desc: 'Browse marketplace, contact farmers' },
  admin: { label: 'Centre Admin', icon: Building2, demo: '8702421102', desc: 'Manage queue, update payment status' },
};

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAs, authPreselectedRole } = useAgriStore();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(authPreselectedRole || 'farmer');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.sendOtp(cleanPhone);
      if (result.devOtp) setDevOtp(result.devOtp);
      setStep(2);
    } catch (_) {
      // Backend offline — dev fallback
      setDevOtp('123456');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) { setError('Please enter the OTP'); return; }
    setLoading(true);
    setError(null);
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const result = await api.verifyOtp(cleanPhone, otp, selectedRole);
      setAuthToken(result.token);
      setStoredUser(result.user);
      loginAs(selectedRole);
      handleClose();
    } catch (_) {
      // Dev mode fallback
      if (otp === devOtp || otp === '123456') {
        loginAs(selectedRole);
        handleClose();
      } else {
        setError(`Invalid OTP. ${devOtp ? `Dev OTP: ${devOtp}` : 'Try 123456'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeAuthModal();
    setTimeout(() => {
      setStep(1); setPhone(''); setOtp(''); setDevOtp(null); setError(null);
    }, 300);
  };

  const cfg = ROLE_CONFIG[selectedRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#212121]">Sign In to AgriConnect</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 1 ? 'Select your role and enter mobile number' : 'Enter the OTP sent to your phone'}
            </p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#0D7377]' : 'bg-gray-200'}`} />
            ))}
          </div>

          {/* Step 1: Role + Phone */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">{t('select_role')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(ROLE_CONFIG) as [UserRole, typeof cfg][]).map(([role, rc]) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                        selectedRole === role
                          ? 'border-[#0D7377] bg-teal-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <rc.icon className={`w-5 h-5 mx-auto mb-1.5 ${selectedRole === role ? 'text-[#0D7377]' : 'text-gray-400'}`} />
                      <span className={`text-[11px] font-bold block ${selectedRole === role ? 'text-[#0D7377]' : 'text-gray-500'}`}>{rc.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 text-center">{cfg.desc}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                  <Phone className="w-3.5 h-3.5 inline mr-1" />
                  {t('enter_phone')}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-gray-100 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 whitespace-nowrap">+91</div>
                  <input
                    type="tel" placeholder="98480 23456" value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 outline-none text-sm transition-all"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Demo quick-fill */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-blue-800">🚀 Demo Mode</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Pre-filled demo number for <strong>{cfg.label}</strong>:</p>
                    <button
                      onClick={() => setPhone(cfg.demo)}
                      className="mt-1.5 px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Use {cfg.demo}
                    </button>
                    <span className="ml-2 text-[11px] text-blue-600">→ then OTP: <strong>123456</strong></span>
                  </div>
                </div>
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}

              <button
                onClick={handleSendOtp} disabled={loading}
                className="w-full py-3 bg-[#0D7377] hover:bg-[#095457] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                {loading ? 'Sending OTP...' : t('send_otp')}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">OTP sent to <strong>+91 {phone}</strong></p>

              {/* Dev OTP Banner */}
              {devOtp && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-xs font-bold text-emerald-800">🔓 Dev Mode — Your OTP</p>
                  <p className="text-3xl font-black text-emerald-700 tracking-[0.3em] mt-1">{devOtp}</p>
                  <p className="text-[11px] text-emerald-600 mt-1">Universal test OTP: <strong>123456</strong> also works</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">
                  <KeyRound className="w-3.5 h-3.5 inline mr-1" />
                  {t('enter_otp')}
                </label>
                <input
                  type="text" placeholder="• • • • • •" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/10 outline-none text-center text-3xl tracking-[0.4em] font-black transition-all"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}

              <button
                onClick={handleVerifyOtp} disabled={loading || otp.length < 4}
                className="w-full py-3 bg-[#0D7377] hover:bg-[#095457] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {loading ? 'Verifying...' : t('verify')}
              </button>

              <button
                onClick={() => { setStep(1); setOtp(''); setError(null); }}
                className="w-full py-2 text-xs text-gray-500 hover:text-[#0D7377] transition-colors font-medium"
              >
                ← Change number or role
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
