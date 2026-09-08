import React from 'react';
import { useAgriStore } from '../../context/AgriStoreContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ProcurementPaymentControl: React.FC = () => {
  const { paymentRecords, updatePaymentRecord } = useAgriStore();

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-agri flex items-center justify-center text-[#212121]">
              <CreditCard className="w-4 h-4 text-[#212121]" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              Produce Quality Grading & DBT Payment Management
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            Assign quality grade, verify net weight, and release Direct Benefit Transfer (DBT) to farmer bank
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
          Syncs instantly with Farmer Tracker
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-3.5 pl-5">Farmer Name</th>
              <th className="p-3.5">Produce / Qty</th>
              <th className="p-3.5">Assigned Grade</th>
              <th className="p-3.5">MSP Total</th>
              <th className="p-3.5">Bank Account / UTR</th>
              <th className="p-3.5">Payment Status & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paymentRecords.map((record) => {
              const isPaid = record.paymentStatus === 'paid';
              const isProcessing = record.paymentStatus === 'processing';

              return (
                <tr key={record.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 pl-5">
                    <p className="font-bold text-[#212121]">{record.farmerName}</p>
                    <p className="text-[10px] text-gray-400">{record.farmerPhone}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-gray-800">{record.crop}</p>
                    <p className="text-[10px] text-gray-500">{record.quantityQuintals} Quintals @ ₹{record.ratePerQuintal}</p>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={record.qualityGrade}
                      onChange={(e) =>
                        updatePaymentRecord(record.id, record.paymentStatus, e.target.value as any)
                      }
                      className="px-2 py-1 text-xs font-bold rounded-lg border border-gray-300 bg-white text-[#0D7377] outline-none"
                    >
                      <option value="Grade A">Grade A (MSP + Bonus)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                      <option value="Grade C">Grade C (Refanning)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-[#0D7377] text-sm">
                      ₹{record.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-mono text-gray-700">{record.bankAccountMasked}</p>
                    {record.utrNumber ? (
                      <p className="text-[10px] text-emerald-700 font-mono font-semibold">
                        UTR: {record.utrNumber}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400">Awaiting clearance</p>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          DBT Settled
                        </span>
                      ) : (
                        <button
                          onClick={() => updatePaymentRecord(record.id, 'paid', record.qualityGrade)}
                          className="px-3 py-1.5 bg-[#0D7377] hover:bg-[#095457] text-white rounded-lg font-bold text-xs transition-all shadow-xs flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#14FFEC]" />
                          <span>Approve & Disburse</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
