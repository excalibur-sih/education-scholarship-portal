import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  Cpu,
  Building2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Filter
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { JsonViewer } from './JsonViewer';
import { XmlViewer } from './XmlViewer';
import { mockMahasetuService } from '../../services/mockMahasetuService';

export const TransformationPipeline = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('request'); // 'request' (JSON -> XML) or 'response' (XML -> JSON)
  const [inspectPayload, setInspectPayload] = useState('both');

  const sampleJsonReq = mockMahasetuService.getSampleEducationRequest();
  const sampleXmlRes = mockMahasetuService.getSampleRevenueXmlResponse();
  const sampleJsonRes = mockMahasetuService.getSampleEducationResponse();

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-blue-500/20 text-blue-400">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                MahaSetu Protocol & Transformation Pipeline
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visualizing live interoperability between JSON-native Education & legacy XML-native Revenue portals.
            </p>
          </div>

          {/* Toggle Request / Response pipeline */}
          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'request'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 1: JSON → XML (Outbound)
            </button>
            <button
              onClick={() => setActiveTab('response')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'response'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phase 2: XML → JSON (Inbound)
            </button>
          </div>
        </div>
      </div>

      {/* Main Flow Content */}
      <div className="p-6">
        {activeTab === 'request' ? (
          <div>
            {/* Stage Indicator */}
            <div className="flex items-center justify-between mb-6 bg-blue-50/60 p-3.5 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">Phase 1 Workflow</Badge>
                <span className="text-xs font-bold text-slate-800">
                  Education Request to Revenue Department Query
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Status: Ready / Verified
              </span>
            </div>

            {/* Visual Steps Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Step 1 */}
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Step 1</span>
                  <Badge variant="saffron" size="sm">JSON</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-slate-800">Education Request</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Portal creates structured JSON with Student ID & Citizen ID requesting only <code className="text-amber-800 font-mono font-semibold">annualIncome</code>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Step 2</span>
                  <Badge variant="primary" size="sm">MahaSetu</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-blue-700" />
                  <h4 className="text-xs font-bold text-slate-800">Schema Mapping</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  MahaSetu ingests JSON, validates consent token, and resolves dictionary mapping for Revenue Dept.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Step 3</span>
                  <Badge variant="purple" size="sm">Engine</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold text-slate-800">JSON → XML Trans</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Converts request structure into Revenue XML query schema with digital signatures.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Step 4</span>
                  <Badge variant="success" size="sm">XML</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-800">Revenue Portal</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Legacy Revenue XML gateway ingests query and prepares citizen income record.
                </p>
              </div>
            </div>

            {/* Live Payloads Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <JsonViewer
                data={sampleJsonReq}
                title="1. Origin: Education Request JSON"
                subtitle="Sent by Education Portal"
              />
              <XmlViewer
                data={`<?xml version="1.0" encoding="UTF-8"?>
<IncomeVerificationRequest xmlns="https://revenue.gov.in/schemas/v2">
    <Transaction_ID>TXN_MAHASETU_90823412</Transaction_ID>
    <Citizen_ID>CIT001</Citizen_ID>
    <Requested_Field>Yearly_Income</Requested_Field>
    <Purpose>Scholarship Eligibility Verification</Purpose>
    <Consent_Reference>CST_982348_2026_VERIFIED</Consent_Reference>
</IncomeVerificationRequest>`}
                title="3. Transformed: Revenue Query XML"
                subtitle="Generated by MahaSetu"
              />
            </div>
          </div>
        ) : (
          <div>
            {/* Phase 2 (Response flow) */}
            <div className="flex items-center justify-between mb-6 bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">Phase 2 Workflow</Badge>
                <span className="text-xs font-bold text-slate-800">
                  Revenue XML Response to Minimized Education JSON Ingestion
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Minimization: Enforced
              </span>
            </div>

            {/* Steps Flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Step 1 */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Step 1</span>
                  <Badge variant="success" size="sm">XML</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-slate-800">Revenue Response</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Revenue Department returns full XML citizen tax, land & income dossier.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Step 2</span>
                  <Badge variant="gov" size="sm">Filter</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Filter className="w-4 h-4 text-indigo-700" />
                  <h4 className="text-xs font-bold text-slate-800">Data Minimization</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  MahaSetu redacts bank accounts, tax brackets & property details. Only requested income is preserved.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-lg bg-purple-50/70 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Step 3</span>
                  <Badge variant="purple" size="sm">XML → JSON</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <FileCode className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold text-slate-800">Transformation</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Transforms XML tags (<code className="font-mono text-purple-800">&lt;Yearly_Income&gt;</code>) into target JSON format.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Step 4</span>
                  <Badge variant="saffron" size="sm">JSON</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-slate-800">Education Ingestion</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Education portal receives verified income amount without exposing citizen private assets.
                </p>
              </div>
            </div>

            {/* Response Payloads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <XmlViewer
                data={sampleXmlRes}
                title="1. Inbound: Full Revenue XML Response"
                subtitle="Contains unredacted records before MahaSetu filter"
              />
              <JsonViewer
                data={sampleJsonRes}
                title="4. Outbound: Verified & Minimized Education JSON"
                subtitle="Delivered to Education Scholarship Portal"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
