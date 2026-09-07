import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  ClipboardList,
  CheckCheck,
  GraduationCap,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OfficerSidebar = ({ className = '' }) => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications');
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.applications)) {
            const count = data.applications.filter((a) => {
              const s = String(a.status || '').toLowerCase();
              return s === 'under review' || s === 'under_review' || s === 'verification pending' || s === 'submitted';
            }).length;
            setPendingCount(count);
          }
        }
      } catch (e) {
        console.error('Sidebar count error:', e);
      }
    };

    fetchCounts();
  }, []);

  const navItems = [
    { label: 'Officer Dashboard', path: '/officer/dashboard', icon: ShieldAlert },
    {
      label: 'Application Review Queue',
      path: '/officer/applications',
      icon: ClipboardList,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'warning'
    },
    {
      label: 'Income Verification Log',
      path: '/officer/verifications',
      icon: CheckCheck
    },
    { label: 'Scholarship Directory', path: '/scholarships', icon: GraduationCap }
  ];

  return (
    <aside className={`w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 ${className}`}>
      {/* Officer Header Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'VP'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Dr. V. K. Patil'}</p>
            <p className="text-[10px] text-amber-400 font-mono">Sr. Education Officer</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Department Review Desk
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.badgeColor === 'warning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Verification Desk Badge */}
      <div className="p-3.5 m-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
          <Building className="w-3.5 h-3.5" />
          <span>Department Review Desk</span>
        </div>
        <p className="text-slate-400 text-[10px] leading-snug">
          Authorized to review student records, income verifications, and sanction scholarship benefits.
        </p>
      </div>
    </aside>
  );
};
