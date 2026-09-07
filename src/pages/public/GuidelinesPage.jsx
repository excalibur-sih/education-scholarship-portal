import React from 'react';
import { BookOpen, ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const GuidelinesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Official Guidelines</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gov-primary">
          Scholarship Application Guidelines & Verification Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Standard operating procedures, eligibility rules, and automated verification policies for Academic Year 2026-2027.
        </p>
      </div>

      {/* Guidelines Content */}
      <div className="space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-gov-primary flex items-center justify-center text-xs">1</span>
            General Application Eligibility
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs">
            <li>The applicant must be a citizen of India residing permanently in the state.</li>
            <li>The applicant must be pursuing recognized regular undergraduate, postgraduate, or diploma programs in accredited institutions.</li>
            <li>Applicants must have secured minimum qualifying percentages in previous examinations as prescribed in scheme specifications.</li>
          </ul>
        </div>

        {/* Section 2: Automated Electronic Income Verification */}
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-xs space-y-3">
          <h2 className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">2</span>
            Automated Electronic Income Verification Policy
          </h2>
          <p className="text-xs text-slate-600">
            Physical income certificates from the Tehsildar office are no longer required to be uploaded manually. The Education Portal coordinates directly with the state Revenue Department records.
          </p>
          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 space-y-1.5 text-xs text-amber-950">
            <p className="font-bold">Citizen Consent Authorization:</p>
            <p>
              Before any income verification occurs, students review and authorize a digital consent request on Step 7 of the online application form.
            </p>
            <p className="text-[11px] text-amber-900/80">
              Only the assessed annual family income is retrieved for scholarship qualification, ensuring strict privacy protection.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-gov-primary flex items-center justify-center text-xs">3</span>
            Document Upload Specifications
          </h2>
          <p className="text-xs text-slate-600">
            Ensure that required marksheet and college bonafide scans meet the following technical criteria:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
            <li>Accepted Formats: PDF, JPG, PNG</li>
            <li>Maximum file size per document: 5.0 MB</li>
            <li>Scans must be clear with institutional seal and enrollment numbers fully legible.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-gov-primary flex items-center justify-center text-xs">4</span>
            Direct Benefit Transfer (DBT) Disbursement
          </h2>
          <p className="text-xs text-slate-600">
            Approved scholarship allowances are transferred directly to the student bank account linked with Aadhaar via Public Financial Management System (PFMS) within 15 working days of Education Officer sanction.
          </p>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Link to="/scholarships">
          <Button variant="primary" icon={ArrowRight} iconPosition="right">
            Explore Available Scholarships
          </Button>
        </Link>
        <Link to="/faq" className="text-xs font-bold text-gov-primary hover:underline">
          Read FAQs →
        </Link>
      </div>
    </div>
  );
};
