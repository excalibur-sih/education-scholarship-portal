import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Building,
  ShieldCheck,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const MahaSetuSimulationModal = ({
  isOpen,
  onClose,
  onComplete,
  citizenId = 'CIT001',
  studentId = 'STU2026001'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    {
      id: 1,
      title: "1. Authenticating Citizen Consent",
      format: "Education Department",
      desc: "Verifying digital consent token for Citizen ID CIT001.",
      color: "border-blue-500 bg-blue-50"
    },
    {
      id: 2,
      title: "2. Connecting to State Revenue Database",
      format: "Revenue Department Gateway",
      desc: "Establishing secure electronic query connection with the Tehsildar revenue records.",
      color: "border-blue-500 bg-blue-50"
    },
    {
      id: 3,
      title: "3. Retrieving Assessed Annual Family Income",
      format: "Revenue Assessment Registry",
      desc: "Fetching certified income assessment for the current academic assessment year.",
      color: "border-purple-500 bg-purple-50"
    },
    {
      id: 4,
      title: "4. Validating Verification Certificate",
      format: "Department Verification Desk",
      desc: "Revenue Department certificate REV/INC/2026/09841 confirmed and validated.",
      color: "border-emerald-500 bg-emerald-50"
    },
    {
      id: 5,
      title: "5. Income Verification Complete",
      format: "Verified Status",
      desc: "Annual family income ₹2,50,000 verified. Ready for scholarship eligibility evaluation.",
      color: "border-emerald-600 bg-emerald-50"
    }
  ];

  useEffect(() => {
    let timer;
    if (isOpen && currentStepIndex < steps.length) {
      timer = setTimeout(() => {
        if (currentStepIndex === steps.length - 1) {
          setIsFinished(true);
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex]);

  const handleFinish = () => {
    onComplete && onComplete();
    handleClose();
  };

  const handleClose = () => {
    setCurrentStepIndex(0);
    setIsFinished(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Electronic Income Verification"
      subtitle="Direct Electronic Verification with Revenue Department Records"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Verification Progress</span>
            <span className="text-gov-primary font-bold">
              {isFinished ? '100% Completed' : `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%`}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gov-primary via-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
              style={{
                width: isFinished ? '100%' : `${((currentStepIndex + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex || isFinished;
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 ${
                  isCurrent
                    ? `${step.color} border-l-4 shadow-sm ring-1 ring-blue-300`
                    : isDone
                    ? 'border-slate-200 bg-slate-50/70 opacity-90'
                    : 'border-slate-100 bg-white opacity-40'
                }`}
              >
                {/* Icon indicator */}
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-gov-primary text-white flex items-center justify-center animate-spin">
                      <Loader2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-xs">
                      {step.id}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                      {step.title}
                    </h5>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-600">
                      {step.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finished State Summary */}
        {isFinished && (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Income Successfully Verified: ₹2,50,000
                </h4>
                <p className="text-xs text-emerald-800">
                  Source: Revenue Department • Certificate: REV/INC/2026/09841
                </p>
              </div>
            </div>
            <Button variant="success" size="sm" onClick={handleFinish}>
              Confirm & Continue
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
