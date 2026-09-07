import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
  Building,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card, CardContent } from '../../components/common/Card';
import scholarshipsData from '../../data/scholarships.json';

export const ScholarshipDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scholarship = scholarshipsData.find((s) => s.id === id) || scholarshipsData[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scholarships</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded border border-slate-200">
              {scholarship.id}
            </span>
            <Badge variant="gov">{scholarship.category}</Badge>
          </div>
          <Badge variant={scholarship.status === 'OPEN' ? 'success' : 'warning'}>
            {scholarship.status}
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {scholarship.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Academic Year {scholarship.academicYear} • Administered by Department of Higher & Technical Education
          </p>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
          {scholarship.description}
        </p>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-200/80">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Annual Benefit</span>
            <p className="text-lg font-black text-gov-primary">₹{scholarship.amount.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Family Income</span>
            <p className="text-base font-bold text-emerald-800">≤ ₹{scholarship.incomeLimit.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min Percentage</span>
            <p className="text-base font-bold text-slate-800">{scholarship.minPercentage}% marks</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deadline</span>
            <p className="text-base font-bold text-rose-600">{scholarship.deadline}</p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link to={`/student/apply?scholarshipId=${scholarship.id}`}>
            <Button variant="primary" size="lg" icon={GraduationCap}>
              Apply for this Scholarship
            </Button>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Electronic Income Verification Enabled</span>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Comprehensive Details (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Scheme Objective */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              1. Objective & Scope
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {scholarship.objective}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              2. Detailed Eligibility Criteria
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Academic Requisite:</strong> {scholarship.eligibility}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Annual Income Ceiling:</strong> Total combined parental income must be less than or equal to ₹{scholarship.incomeLimit.toLocaleString('en-IN')} (verified electronically from Revenue records).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Eligible Academic Years:</strong> {scholarship.eligibleYears.join(', ')}.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Domicile:</strong> Must be an Indian citizen with registered permanent residence in the state.</span>
              </li>
            </ul>
          </div>

          {/* Scheme Benefits */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              3. Benefits & Financial Support
            </h3>
            <p className="text-xs text-slate-700 font-medium">
              {scholarship.benefits}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              * Funds are disbursed directly to the verified Aadhaar-seeded student bank account via Direct Benefit Transfer (DBT) upon final departmental sanction.
            </p>
          </div>

          {/* Required Documents */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              4. Documents & Electronic Verifications
            </h3>
            <div className="space-y-2">
              {scholarship.requiredDocuments.map((doc, idx) => {
                const isAuto = doc.includes('Income') || doc.includes('MahaSetu');
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 text-xs text-slate-700">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>{doc.replace(/\(via MahaSetu\)/gi, '(via Revenue Records)')}</span>
                    </span>
                    {isAuto ? (
                      <Badge variant="success" size="sm">Automated Electronic Verification</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Document Upload</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Application Summary Box */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-28">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Application Summary
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Scheme Code:</span>
                <p className="font-mono font-bold text-slate-800">{scholarship.id}</p>
              </div>
              <div>
                <span className="text-slate-500">Academic Year:</span>
                <p className="font-semibold text-slate-800">{scholarship.academicYear}</p>
              </div>
              <div>
                <span className="text-slate-500">Eligible Degree Courses:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scholarship.eligibleCourses.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Application Window:</span>
                <p className="font-semibold text-slate-800">1 Aug 2026 – {scholarship.deadline}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link to={`/student/apply?scholarshipId=${scholarship.id}`}>
                <Button variant="primary" size="md" className="w-full">
                  Apply for Scholarship
                </Button>
              </Link>
              <p className="text-[11px] text-center text-slate-400">
                Estimated completion time: 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
