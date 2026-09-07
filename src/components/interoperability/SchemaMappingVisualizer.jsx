import React, { useState } from 'react';
import { ArrowRightLeft, Layers, CheckCircle, Info, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SchemaMappingVisualizer = ({ className = '' }) => {
  const [selectedMapping, setSelectedMapping] = useState(null);

  const mappings = [
    {
      id: 1,
      eduKey: 'citizenId',
      eduType: 'string (JSON)',
      eduSample: '"CIT001"',
      revKey: 'Citizen_ID',
      revType: 'xs:string (XML)',
      revSample: '<Citizen_ID>CIT001</Citizen_ID>',
      description: 'Primary unique citizen identifier mapped across departments'
    },
    {
      id: 2,
      eduKey: 'annualIncome',
      eduType: 'number (JSON)',
      eduSample: '250000',
      revKey: 'Yearly_Income',
      revType: 'xs:decimal (XML)',
      revSample: '<Yearly_Income>250000</Yearly_Income>',
      description: 'Assessed annual family income mapped from Revenue tax assessment'
    },
    {
      id: 3,
      eduKey: 'verificationStatus',
      eduType: 'string (JSON)',
      eduSample: '"VERIFIED"',
      revKey: 'Verification',
      revType: 'xs:string (XML)',
      revSample: '<Verification>VERIFIED</Verification>',
      description: 'Cross-verification audit compliance indicator'
    },
    {
      id: 4,
      eduKey: 'currency',
      eduType: 'string (JSON)',
      eduSample: '"INR"',
      revKey: 'Currency',
      revType: 'xs:string (XML)',
      revSample: '<Currency>INR</Currency>',
      description: 'Standard ISO monetary unit'
    }
  ];

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gov-primary to-blue-900 text-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
              <Layers className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Schema Mapping</h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Different systems use different field names & structures for equivalent information.
              </p>
            </div>
          </div>
          <Badge variant="saffron" size="sm" className="hidden sm:inline-flex bg-amber-400 text-slate-950 font-bold">
            <Sparkles className="w-3 h-3" /> MahaSetu Engine
          </Badge>
        </div>
      </div>

      {/* Visual Table */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Education System (JSON Format)</span>
          </div>
          <div className="md:col-span-2 text-center hidden md:block">
            <span>Mapping Logic</span>
          </div>
          <div className="md:col-span-5 flex items-center gap-2 md:justify-end">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Revenue System (XML Format)</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {mappings.map((item) => {
            const isSelected = selectedMapping === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMapping(isSelected ? null : item.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  {/* Left: JSON */}
                  <div className="md:col-span-5 bg-amber-50/70 border border-amber-200/80 rounded-md p-2.5">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-amber-900 font-mono">{item.eduKey}</code>
                      <span className="text-[10px] text-amber-700 font-mono bg-amber-100/70 px-1.5 py-0.5 rounded">
                        {item.eduType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">Sample: {item.eduSample}</p>
                  </div>

                  {/* Middle: Converter */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center my-1 md:my-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-gov-primary flex items-center justify-center shadow-xs">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-gov-primary mt-1 hidden md:block">
                      MahaSetu
                    </span>
                  </div>

                  {/* Right: XML */}
                  <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-200/80 rounded-md p-2.5">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-emerald-900 font-mono">{item.revKey}</code>
                      <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        {item.revType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">Sample: {item.revSample}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-blue-200/60 flex items-center gap-2 text-xs text-slate-600 bg-white/80 p-2 rounded">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item.description}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>MahaSetu schema dictionary automatically translates keys bidirectionally without code modifications.</span>
          </div>
          <span className="text-[11px] font-semibold text-gov-primary hidden sm:inline">Active Rule v2.4</span>
        </div>
      </div>
    </div>
  );
};
