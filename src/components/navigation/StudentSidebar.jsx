import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  PlusCircle,
  FolderOpen,
  ShieldCheck,
  CheckCircle,
  History,
  Bell,
  Compass
} from 'lucide-react';

import { Badge } from '../common/Badge';

export const StudentSidebar = ({ className = '' }) => {
  // =====================================================
  // INCOME VERIFICATION STATUS
  // =====================================================

  const [incomeStatus, setIncomeStatus] = useState('Pending');

  // =====================================================
  // LOAD CURRENT INCOME VERIFICATION STATUS
  // =====================================================

  useEffect(() => {
    const loadIncomeStatus = async () => {
      try {
        // Get student's applications
        const applicationsResponse = await fetch(
          'http://localhost:5000/api/applications'
        );

        const applicationsData =
          await applicationsResponse.json();

        if (
          !applicationsResponse.ok ||
          !applicationsData.success
        ) {
          return;
        }

        const applications =
          applicationsData.applications || [];

        // If there are no applications,
        // there is no verification request yet.
        if (applications.length === 0) {
          setIncomeStatus('Not Requested');
          return;
        }

        // Use the first/current application
        const applicationId =
          applications[0].id;

        // Get income verification status
        const verificationResponse =
          await fetch(
            `http://localhost:5000/api/income-verification/${applicationId}`
          );

        const verificationData =
          await verificationResponse.json();

        if (
          !verificationResponse.ok ||
          !verificationData.success
        ) {
          return;
        }

        const verification =
          verificationData.verification;

        if (!verification) {
          setIncomeStatus('Not Requested');
          return;
        }

        setIncomeStatus(
          verification.verification_status ||
          'Pending'
        );

      } catch (error) {
        console.error(
          'Sidebar income verification status error:',
          error
        );
      }
    };

    loadIncomeStatus();
  }, []);

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const normalizedIncomeStatus =
    incomeStatus.toLowerCase();

  const isVerified =
    normalizedIncomeStatus === 'verified';

  const isPending =
    normalizedIncomeStatus === 'pending';

  const incomeBadgeColor = isVerified
    ? 'success'
    : isPending
      ? 'warning'
      : 'secondary';

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

  const navItems = [
    {
      label: 'Dashboard',
      path: '/student/dashboard',
      icon: LayoutDashboard
    },

    {
      label: 'My Profile',
      path: '/student/profile',
      icon: User
    },

    {
      label: 'My Applications',
      path: '/student/applications',
      icon: FileText
    },

    {
      label: 'Apply for Scholarship',
      path: '/student/apply',
      icon: PlusCircle,
      badge: 'Active',
      badgeColor: 'primary'
    },

    {
      label: 'Document Locker',
      path: '/student/documents',
      icon: FolderOpen
    },

    {
      label: 'Income Verification',
      path: '/student/income-verification',
      icon: ShieldCheck,
      badge: isVerified
        ? 'Verified'
        : isPending
          ? 'Pending'
          : 'Not Requested',
      badgeColor: incomeBadgeColor
    },

    {
      label: 'Consent Authorizations',
      path: '/student/consent',
      icon: CheckCircle
    },

    {
      label: 'Verification History',
      path: '/student/data-history',
      icon: History
    },

    {
      label: 'Notifications',
      path: '/student/notifications',
      icon: Bell
    },

    {
      label: 'Scholarship Schemes',
      path: '/scholarships',
      icon: Compass
    }
  ];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 ${className}`}
    >

      {/* ================================================= */}
      {/* STUDENT QUICK PILL */}
      {/* ================================================= */}

      <div className="p-4 border-b border-slate-100 bg-slate-50/70">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-gov-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
            RS
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-xs font-bold text-slate-800 truncate">
              Rahul S. Sharma
            </p>

            <p className="text-[10px] text-slate-500 font-mono">
              ID: STU2026001
            </p>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">

        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Student Portal
        </div>

        {navItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${isActive
                  ? 'bg-gov-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >

              <div className="flex items-center gap-2.5">

                <Icon className="w-4 h-4 shrink-0" />

                <span>
                  {item.label}
                </span>

              </div>

              {item.badge && (
                <Badge
                  variant={
                    item.badgeColor || 'primary'
                  }
                  size="sm"
                  className="text-[10px] px-1.5 py-0"
                >
                  {item.badge}
                </Badge>
              )}

            </NavLink>
          );

        })}

      </nav>

      {/* ================================================= */}
      {/* VERIFICATION SERVICE INFO BOX */}
      {/* ================================================= */}

      <div className="p-3.5 m-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-950">

        <div className="flex items-center gap-1.5 font-bold mb-1">

          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />

          <span>
            Verification Service
          </span>

        </div>

        <p className="text-slate-600 text-[10px] leading-snug">
          Your income verification request is securely
          recorded in the Education Scholarship Portal.
          External verification services can be connected
          through the backend in a future integration phase.
        </p>

      </div>

    </aside>
  );
};