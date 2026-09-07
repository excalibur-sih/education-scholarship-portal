import React from 'react';
import { UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GovTopBar = () => {
  const { user, isStudent, isOfficer, switchRole } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
      {/* Tricolor decorative ribbon */}
      <div className="gov-flag-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Gov text */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Department of Higher & Technical Education</span>
        </div>

        {/* Right: Quick Role Switcher for seamless testing */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Citizen Digital Service</span>
          </div>

          {/* Role switcher */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Portal View:</span>
            <button
              onClick={() => switchRole('student')}
              className={`px-2.5 py-0.5 rounded transition font-semibold ${
                isStudent ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => switchRole('officer')}
              className={`px-2.5 py-0.5 rounded transition font-semibold ${
                isOfficer ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Officer Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
