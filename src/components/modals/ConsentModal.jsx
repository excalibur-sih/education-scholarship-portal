import React, { useState } from 'react';
import { ShieldCheck, Calendar, Building, FileText, CheckCircle2, Lock, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ConsentModal = ({
  isOpen,
  onClose,
  onAllow,
  onReject,
  requestId = 'REQ1001',
  citizenId = 'CIT001'
}) => {
  const [granted, setGranted] = useState(false);

  const handleAllow = () => {
    setGranted(true);
    setTimeout(() => {
      onAllow && onAllow();
    }, 1000);
  };

  const handleReject = () => {
    onReject && onReject();
    onClose();
  };

  const handleModalClose = () => {
    setGranted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Citizen Consent for Income Verification"
      subtitle="Digital Personal Data Protection & Automated Department Authorization"
      maxWidth="max-w-xl"
    >
      {granted ? (
        <div className="py-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Consent Authorized Successfully</h4>
          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your consent has been recorded. The portal is now fetching your verified annual family income from the Revenue Department database.
          </p>
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-mono inline-block">
            Authorization Ref: CST_982348_VERIFIED • Valid for AY 2026-2027
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gov-primary shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950">
              <p className="font-bold">Automated Income Verification Authorization</p>
              <p className="mt-0.5 text-slate-600">
                You are authorizing the Education Department to retrieve your verified annual family income directly from the state Revenue Department records.
              </p>
            </div>
          </div>

          {/* Consent Details Grid */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 divide-y divide-slate-200">
            <div className="grid grid-cols-2 gap-2 pb-2.5 text-xs">
              <span className="text-slate-500 font-medium">Request Reference:</span>
              <span className="font-mono font-bold text-slate-800 text-right">{requestId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Citizen ID:</span>
              <span className="font-mono font-bold text-slate-800 text-right">{citizenId}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Requester Department:</span>
              <span className="font-bold text-slate-800 text-right flex items-center justify-end gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Department of Higher Education
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Data Requested:</span>
              <span className="font-bold text-emerald-800 text-right">Annual Family Income</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Purpose:</span>
              <span className="font-medium text-slate-800 text-right">Scholarship Eligibility Verification</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Source Department:</span>
              <span className="font-bold text-slate-800 text-right flex items-center justify-end gap-1">
                <Building className="w-3.5 h-3.5 text-amber-600" />
                Revenue Department
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Requested At:</span>
              <span className="text-slate-700 text-right">30 August 2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5 text-xs">
              <span className="text-slate-500 font-medium">Consent Validity:</span>
              <span className="text-slate-700 text-right">30 September 2026</span>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="text-[11px] text-slate-500 flex items-center gap-2 px-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Privacy assurance: Only annual income is retrieved. Other personal records remain confidential.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="secondary" onClick={handleReject}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAllow} icon={ShieldCheck}>
              Authorize & Verify
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
