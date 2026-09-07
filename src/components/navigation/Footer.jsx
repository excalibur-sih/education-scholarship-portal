import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ExternalLink, Building2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
      {/* Tricolor decorative ribbon */}
      <div className="gov-flag-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gov-primary text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  National Education Scholarship Portal
                </h4>
                <p className="text-[10px] text-amber-400 font-medium">Ministry of Education</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering students across India with digital scholarship applications, automated government verification, and direct benefit disbursement.
            </p>
            <div className="pt-1 flex items-center gap-2 text-slate-400 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Department of Higher & Technical Education</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Scholarship Portal
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link to="/scholarships" className="hover:text-white transition">
                  Explore Active Scholarships
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition">
                  Application Guidelines & Eligibility
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Helpdesk & Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Features */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Digital Service Highlights
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>100% Online Paperless Applications</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Electronic Revenue Income Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Direct Benefit Transfer (DBT)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Privacy & Consent Protection</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Important Government Information */}
          <div className="space-y-2.5 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Digital Service</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Designed to ensure transparent scholarship administration. Verified income records are accessed with citizen consent directly from state revenue records.
            </p>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 National Education Scholarship Portal • Ministry of Education, Government of India.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
