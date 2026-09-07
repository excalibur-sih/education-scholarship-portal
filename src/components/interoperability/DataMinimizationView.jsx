import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Info, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { mockMahasetuService } from '../../services/mockMahasetuService';

export const DataMinimizationView = ({ className = '' }) => {
  const summary = mockMahasetuService.getDataMinimizationSummary();

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/50 rounded-lg backdrop-blur-xs border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Data Minimization Engine</h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Privacy-First Interoperability: Only strictly necessary data fields cross departmental boundaries.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="bg-emerald-400 text-emerald-950 font-bold self-start sm:self-auto">
            100% Privacy Compliant
          </Badge>
        </div>
      </div>

      {/* Overview 3-Box Flow */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Box 1: Revenue Total Data */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Revenue Dept Available Data</span>
              <Badge variant="default" size="sm">5 Datasets</Badge>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Citizen Demographics & Name</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Assessed Annual Income</span>
              </li>
              <li className="flex items-center gap-2 text-rose-600 line-through">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Property & Land Holdings</span>
              </li>
              <li className="flex items-center gap-2 text-rose-600 line-through">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>PAN & Tax Filing Brackets</span>
              </li>
              <li className="flex items-center gap-2 text-rose-600 line-through">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Bank Account Numbers</span>
              </li>
            </ul>
          </div>

          {/* Box 2: Education Requested */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900">Education Dept Requested</span>
              <Badge variant="primary" size="sm">1 Dataset</Badge>
            </div>
            <div className="bg-white rounded border border-blue-200 p-3 mt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Annual Family Income</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Purpose: Determining income threshold eligibility for scholarship grant.
              </p>
            </div>
          </div>

          {/* Box 3: MahaSetu Transferred */}
          <div className="border border-emerald-300 rounded-lg p-4 bg-emerald-50/60 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900">MahaSetu Transferred</span>
              <Badge variant="success" size="sm">Target Only</Badge>
            </div>
            <div className="bg-white rounded border border-emerald-300 p-3 mt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Annual Income (₹2,50,000)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                All unrequested property, tax, and bank details are actively purged and redacted by MahaSetu.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Rules Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700">
            Field-by-Field Privacy & Redaction Audit Trail
          </div>
          <div className="divide-y divide-slate-100">
            {summary.rules.map((rule, idx) => (
              <div key={idx} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  {rule.transferred ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-800">{rule.field}</span>
                    <span className="text-[11px] text-slate-400 ml-2 font-mono">({rule.category})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <span className="text-[11px] text-slate-500 max-w-sm">{rule.reason}</span>
                  {rule.transferred ? (
                    <Badge variant="success" size="sm">Transferred</Badge>
                  ) : (
                    <Badge variant="danger" size="sm">Purged / Redacted</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Core SIH Architectural Principle:</span> Data minimization ensures that the Education Department only receives the specific data point authorized by citizen consent, preventing unauthorized surveillance and cross-department data exposure.
          </p>
        </div>
      </div>
    </div>
  );
};
