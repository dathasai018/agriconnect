import React from 'react';
import { useAgriStore } from '../context/AgriStoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  Radio,
  ArrowRight,
  User,
  ShoppingBag,
  Building2,
  CheckCircle2,
  Truck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveRole, setFarmerTab, openAuthModal } = useAgriStore();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#212121]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-teal-50/20 to-[#FAFAFA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0D7377] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0D7377]" />
              <span>{t('hero_pill')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#212121] tracking-tight leading-[1.15]">
              {t('hero_title')}{' '}
              <span className="text-gradient">{t('hero_title_highlight')}</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#323232]/80 leading-relaxed font-normal">
              {t('hero_subtitle')}
            </p>

            {/* Role Gateway CTAs */}
            <div className="pt-4 flex flex-wrap justify-center gap-3.5">
              <button
                onClick={() => {
                  openAuthModal('farmer');
                }}
                className="px-6 py-3.5 rounded-xl gradient-agri text-[#212121] font-bold text-sm shadow-lg shadow-[#0D7377]/20 hover:opacity-95 transition-all flex items-center gap-2 glow-btn"
              >
                <User className="w-4 h-4 text-[#212121]" />
                <span>{t('launch_farmer_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  openAuthModal('customer');
                }}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#212121] font-bold text-sm border border-gray-300 shadow-sm transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#0D7377]" />
                <span>{t('open_marketplace_btn')}</span>
              </button>

              <button
                onClick={() => {
                  openAuthModal('admin');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#212121] hover:bg-black text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#14FFEC]" />
                <span>{t('centre_admin_btn')}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-[#0D7377]">74%</p>
              <p className="text-xs font-semibold text-[#212121] mt-1">{t('metric_wait_reduction')}</p>
              <p className="text-[11px] text-gray-500">{t('metric_wait_sub')}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-[#0D7377]">₹480+ Cr</p>
              <p className="text-xs font-semibold text-[#212121] mt-1">{t('metric_dbt_disbursed')}</p>
              <p className="text-[11px] text-gray-500">{t('metric_dbt_sub')}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-[#0D7377]">14,200+</p>
              <p className="text-xs font-semibold text-[#212121] mt-1">{t('metric_farmers_enrolled')}</p>
              <p className="text-[11px] text-gray-500">{t('metric_farmers_sub')}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-soft text-center">
              <p className="text-3xl font-extrabold text-[#0D7377]">99.4%</p>
              <p className="text-xs font-semibold text-[#212121] mt-1">{t('metric_settlement_rate')}</p>
              <p className="text-[11px] text-gray-500">{t('metric_settlement_sub')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs AgriConnect Solution */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121]">
            {t('why_mandi_fails_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {t('why_mandi_fails_sub')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Way */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{t('traditional_mandi_reality')}</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{t('trad_point_1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{t('trad_point_2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{t('trad_point_3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{t('trad_point_4')}</span>
              </li>
            </ul>
          </div>

          {/* AgriConnect Way */}
          <div className="bg-gradient-to-br from-white to-teal-50/50 p-6 rounded-2xl border border-teal-200 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-[#0D7377] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('the_agriconnect_advantage')}</span>
            </div>
            <ul className="space-y-3 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#0D7377] font-bold">✓</span>
                <span>{t('agri_point_1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0D7377] font-bold">✓</span>
                <span>{t('agri_point_2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0D7377] font-bold">✓</span>
                <span>{t('agri_point_3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0D7377] font-bold">✓</span>
                <span>{t('agri_point_4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0D7377] uppercase tracking-wider">
              {t('features_pill')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121] mt-2">
              {t('features_heading')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <MapPin className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_1_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_1_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <Calendar className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_2_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_2_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <Clock className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_3_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_3_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <Radio className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_4_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_4_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <TrendingUp className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_5_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_5_desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-white hover:border-[#0D7377]/40 hover:shadow-soft transition-all">
              <div className="w-10 h-10 rounded-xl gradient-agri flex items-center justify-center text-[#212121] mb-4">
                <ShoppingBag className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="font-bold text-sm text-[#212121]">{t('feat_6_title')}</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {t('feat_6_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
