import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { JsonViewer } from '../interoperability/JsonViewer';
import { XmlViewer } from '../interoperability/XmlViewer';
import { mockMahasetuService } from '../../services/mockMahasetuService';

export const PayloadViewModal = ({
  isOpen,
  onClose,
  initialTab = 'request', // 'request', 'xml', 'response'
  requestId = 'REQ1001'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const reqJson = mockMahasetuService.getSampleEducationRequest({ requestId });
  const revXml = mockMahasetuService.getSampleRevenueXmlResponse();
  const resJson = mockMahasetuService.getSampleEducationResponse({ requestId });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interoperability Payload Inspector"
      subtitle={`Request Audit Reference: ${requestId}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'request'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. Education Request (JSON)
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'xml'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2. Revenue Response (XML)
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'response'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            3. Minimized Result (JSON)
          </button>
        </div>

        {/* Payload Body */}
        <div>
          {activeTab === 'request' && (
            <JsonViewer
              data={reqJson}
              title="Education Department Outbound Request"
              subtitle="Sent via MahaSetu Gateway"
              maxHeight="max-h-[420px]"
            />
          )}

          {activeTab === 'xml' && (
            <XmlViewer
              data={revXml}
              title="Sample Revenue Department XML Inbound Response"
              subtitle="Demonstration Data - Unredacted XML Dossier"
              maxHeight="max-h-[420px]"
            />
          )}

          {activeTab === 'response' && (
            <JsonViewer
              data={resJson}
              title="MahaSetu Ingested & Minimized JSON Response"
              subtitle="Delivered to Education Scholarship Portal"
              maxHeight="max-h-[420px]"
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
