import React from 'react';
import { Check, Clock, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ApplicationTrackingTimeline = ({ timeline = [], currentStatus = 'UNDER_REVIEW' }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved & Sanctioned</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Application Rejected</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning">Under Officer Review</Badge>;
      case 'VERIFICATION_PENDING':
        return <Badge variant="saffron">Income Verification Pending</Badge>;
      case 'VERIFIED':
        return <Badge variant="success">All Criteria Verified</Badge>;
      case 'SUBMITTED':
        return <Badge variant="primary">Submitted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Application Progress & Verification Timeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking across automated department verification stages
          </p>
        </div>
        <div>{getStatusBadge(currentStatus)}</div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((item, index) => {
          const isCompleted = item.status === 'COMPLETED';
          const isCurrent = item.status === 'CURRENT';
          const isRejected = item.status === 'REJECTED';

          const cleanStepTitle = item.step.replace(/\(MahaSetu\)/gi, '(Revenue Records)');
          const cleanDesc = item.description.replace(/via MahaSetu/gi, 'via automated Revenue verification').replace(/MahaSetu/gi, 'automated verification');

          return (
            <div key={index} className="relative group">
              {/* Step Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : isRejected
                    ? 'bg-rose-600 text-white ring-4 ring-rose-50'
                    : isCurrent
                    ? 'bg-gov-primary text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isRejected ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200'
                    : isRejected
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {cleanStepTitle}
                    {cleanStepTitle.includes('Income') && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                        Automated Verification
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{item.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{cleanDesc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
