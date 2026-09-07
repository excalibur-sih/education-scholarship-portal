import React, { useState } from 'react';
import { Activity, ShieldCheck, Layers, FileCode, Code2, ArrowRightLeft, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SchemaMappingVisualizer } from '../../components/interoperability/SchemaMappingVisualizer';
import { TransformationPipeline } from '../../components/interoperability/TransformationPipeline';
import { DataMinimizationView } from '../../components/interoperability/DataMinimizationView';

export const InteroperabilityActivityPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('pipeline');

  const logs = [
    {
      id: "LOG-90214",
      time: "Just now",
      event: "DATA_MINIMIZATION_SUCCESS",
      source: "MahaSetu Privacy Engine",
      message: "Purged 4 confidential fields (PAN, Land Acres, Bank Account) from Revenue XML response for Citizen CIT001.",
      status: "PASS"
    },
    {
      id: "LOG-90213",
      time: "1 min ago",
      event: "SCHEMA_MAPPING_TRANSFORM",
      source: "MahaSetu Core",
      message: "Translated tag <Yearly_Income>250000</Yearly_Income> to JSON key 'income.amount: 250000'.",
      status: "PASS"
    },
    {
      id: "LOG-90212",
      time: "2 mins ago",
      event: "OUTBOUND_XML_DISPATCH",
      source: "Education Gateway Node",
      message: "Dispatched SOAP/XML query to Revenue Department registry endpoint for Request REQ1001.",
      status: "SUCCESS"
    },
    {
      id: "LOG-90211",
      time: "5 mins ago",
      event: "CONSENT_TOKEN_VERIFIED",
      source: "MahaSetu Auth Guard",
      message: "Valid cryptographic signature verified for Consent Token CST_982348_2026_VERIFIED.",
      status: "SUCCESS"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 font-mono">MahaSetu Gateway Live Monitor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Interoperability Activity & Protocol Audits
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry of JSON/XML transformations, field mapping engines, and privacy filters.
          </p>
        </div>

        <Badge variant="saffron" size="sm" className="bg-amber-400 text-slate-950 font-bold self-start sm:self-auto">
          Mesh Protocol v2.4
        </Badge>
      </div>

      {/* Live Logs Feed */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Live Event Log</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Auto-refreshing stream</span>
        </div>

        <div className="divide-y divide-slate-800/80 p-2 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-3 hover:bg-slate-900/60 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="text-slate-500 text-[10px] mt-0.5">{log.time}</span>
                <div>
                  <span className="text-amber-400 font-bold">{log.event}</span>
                  <span className="text-slate-500 text-[11px] ml-2">[{log.source}]</span>
                  <p className="text-slate-300 font-sans text-xs mt-0.5">{log.message}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700 self-start sm:self-auto">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Suite Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-800 gap-2 bg-slate-950 px-4 pt-2 rounded-t-xl border-t border-x">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeSubTab === 'pipeline'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Transformation Pipeline</span>
          </button>
          <button
            onClick={() => setActiveSubTab('mapping')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeSubTab === 'mapping'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Schema Dictionary</span>
          </button>
          <button
            onClick={() => setActiveSubTab('minimization')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeSubTab === 'minimization'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Data Minimization Proof</span>
          </button>
        </div>

        <div>
          {activeSubTab === 'pipeline' && <TransformationPipeline />}
          {activeSubTab === 'mapping' && <SchemaMappingVisualizer />}
          {activeSubTab === 'minimization' && <DataMinimizationView />}
        </div>
      </div>
    </div>
  );
};
