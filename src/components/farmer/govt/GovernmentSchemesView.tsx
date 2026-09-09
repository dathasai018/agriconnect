import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Landmark,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

const SCHEMES_LIST = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    tagline: '₹6,000 per year direct income support in 3 equal installments',
    eligibility: 'All small & marginal landholder farmer families',
    benefit: '₹2,000 every 4 months directly transferred via DBT',
    portalUrl: 'https://pmkisan.gov.in',
    status: 'Active · Apply Online',
    helpline: '155261 / 011-24300606'
  },
  {
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    tagline: 'Comprehensive crop insurance against drought, floods, & pests',
    eligibility: 'All farmers growing notified crops in notified areas',
    benefit: 'Only 2% premium for Kharif crops, 1.5% for Rabi crops',
    portalUrl: 'https://pmfby.gov.in',
    status: 'Active · Kharif Season Enrolment',
    helpline: '1800-180-1551'
  },
  {
    name: 'National Soil Health Card Scheme',
    tagline: 'Free testing of soil nutrient status (NPK & micro-nutrients)',
    eligibility: 'Every agricultural landholder across all districts',
    benefit: 'Crop-wise fertilizer dosage recommendations to reduce costs by 25%',
    portalUrl: 'https://soilhealth.dac.gov.in',
    status: 'Free at Mandal Agriculture Office',
    helpline: '1800-180-1551'
  },
  {
    name: 'PM-KUSUM (Solar Agricultural Pumps)',
    tagline: 'Up to 60% government subsidy on stand-alone solar irrigation pumps',
    eligibility: 'Individual farmers, farmer groups, water user associations',
    benefit: 'Reliable daytime irrigation with zero electricity bill',
    portalUrl: 'https://pmkusum.mnre.gov.in',
    status: 'Active Application Window',
    helpline: '1800-180-3333'
  },
  {
    name: 'Rythu Bharosa / State Agricultural Investment Support',
    tagline: 'Direct financial assistance for seeds, fertilizers, & farm machinery',
    eligibility: 'Eligible resident farmers & tenant farmers',
    benefit: '₹10,000 – ₹15,000 per acre per year',
    portalUrl: 'https://rythubharosa.telangana.gov.in',
    status: 'Verified via Agriculture Extension Officers',
    helpline: '1800-425-3500'
  }
];

export const GovernmentSchemesView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>🏛</span> Government Agricultural Schemes
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Official government subsidies, crop insurance, and DBT welfare programs for farmers.
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

      <div className="space-y-4">
        {SCHEMES_LIST.map((scheme, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl border border-gray-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/20 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {scheme.name}
                </h3>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  {scheme.tagline}
                </p>
              </div>

              <span className="self-start sm:self-auto text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 shrink-0">
                {scheme.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 pt-1">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-gray-800 block mb-0.5">Who can apply:</span>
                <span>{scheme.eligibility}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-emerald-900 block mb-0.5">Direct Benefit:</span>
                <span>{scheme.benefit}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>Helpline: <strong>{scheme.helpline}</strong></span>
              </span>

              <a
                href={scheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors touch-target"
              >
                <span>Official Govt Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
