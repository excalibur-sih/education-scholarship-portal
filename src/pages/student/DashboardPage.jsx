import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  History,
  Sparkles
} from 'lucide-react';

import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { AlertBanner } from '../../components/common/AlertBanner';

import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const [applications, setApplications] = useState([]);
  const [incomeVerification, setIncomeVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = user?.id || 'STU2026001';

  // =====================================================
  // LOAD APPLICATIONS AND INCOME VERIFICATION
  // =====================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Get applications from backend
        const applicationsResponse = await fetch(
          'http://localhost:5000/api/applications'
        );

        const applicationsData = await applicationsResponse.json();

        if (applicationsData.success) {
          const studentApplications =
            applicationsData.applications.filter(
              (application) =>
                application.student_id === studentId
            );

          setApplications(studentApplications);

          // Get income verification for the latest application
          if (studentApplications.length > 0) {
            const latestApplication =
              studentApplications[0];

            const incomeResponse = await fetch(
              `http://localhost:5000/api/income-verification/${latestApplication.id}`
            );

            const incomeData =
              await incomeResponse.json();

            if (incomeData.success) {
              setIncomeVerification(
                incomeData.verification || null
              );
            }
          }
        }
      } catch (error) {
        console.error(
          'Dashboard data loading error:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [studentId]);


  // =====================================================
  // DASHBOARD CALCULATIONS
  // =====================================================

  const recentApp =
    applications.length > 0
      ? applications[0]
      : null;

  const totalCount =
    applications.length;

  const pendingCount =
    applications.filter(
      (application) =>
        application.status === 'Submitted' ||
        application.status === 'UNDER_REVIEW' ||
        application.status === 'VERIFICATION_PENDING'
    ).length;

  const approvedCount =
    applications.filter(
      (application) =>
        application.status === 'APPROVED' ||
        application.status === 'Approved'
    ).length;

  const isIncomeVerified =
    incomeVerification?.verification_status ===
    'Verified';


  // =====================================================
  // FORMAT STATUS
  // =====================================================

  const formatStatus = (status) => {
    if (!status) return 'Submitted';

    if (status === 'UNDER_REVIEW') {
      return 'Under Review';
    }

    if (status === 'VERIFICATION_PENDING') {
      return 'Verification Pending';
    }

    if (status === 'APPROVED') {
      return 'Approved';
    }

    return status;
  };


  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* WELCOME BANNER */}
      {/* ================================================= */}

      <div className="bg-gradient-to-r from-gov-primary via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="space-y-2">

            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />

              <span>
                Academic Year 2026-2027
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {user?.name || 'Student'}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">

              Student ID:{' '}

              <span className="font-mono font-bold text-amber-300">
                {studentId}
              </span>

              {' • '}

              Citizen ID:{' '}

              <span className="font-mono text-blue-200">
                {user?.citizenId || 'Not provided'}
              </span>

            </p>

          </div>


          {/* PROFILE COMPLETION */}

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[220px]">

            <div className="flex items-center justify-between text-xs font-bold mb-1.5">

              <span>
                Profile Completion
              </span>

              <span className="text-amber-300">
                85%
              </span>

            </div>

            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">

              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[85%]" />

            </div>

            <p className="text-[11px] text-blue-200 mt-2 flex items-center justify-between">

              <span>
                Academic & Documents
              </span>

              <Link
                to="/student/profile"
                className="text-amber-300 hover:underline font-semibold"
              >
                View Profile
              </Link>

            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* INCOME VERIFICATION ALERT */}
      {/* ================================================= */}

      {isIncomeVerified ? (

        <AlertBanner
          type="success"
          title="Income Verification Completed"
          action={
            <Link
              to="/student/income-verification"
              className="text-xs font-bold text-emerald-900 underline hover:text-emerald-950"
            >
              View Details →
            </Link>
          }
        >
          Your annual family income verification request
          has been successfully processed by the scholarship
          portal.
        </AlertBanner>

      ) : (

        <AlertBanner
          type="warning"
          title="Income Verification Pending"
          action={
            <Link to="/student/income-verification">
              <Button
                variant="saffron"
                size="sm"
                icon={ShieldCheck}
              >
                Verify Income
              </Button>
            </Link>
          }
        >
          Annual family income is required for scholarship
          eligibility. Submit your income verification request
          through the portal.
        </AlertBanner>

      )}


      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Applications"
          value={loading ? '...' : totalCount}
          subtitle="Submitted in 2026"
          icon={FileText}
          color="blue"
        />

        <StatCard
          title="Under Review"
          value={loading ? '...' : pendingCount}
          subtitle="Application processing"
          icon={Clock}
          color="amber"
        />

        <StatCard
          title="Approved Schemes"
          value={loading ? '...' : approvedCount}
          subtitle="Approved applications"
          icon={CheckCircle}
          color="green"
        />

        <StatCard
          title="Income Verification"
          value={
            loading
              ? '...'
              : isIncomeVerified
                ? 'Verified'
                : 'Pending'
          }
          subtitle="Verification status"
          icon={ShieldCheck}
          color={
            isIncomeVerified
              ? 'green'
              : 'amber'
          }
        />

      </div>


      {/* ================================================= */}
      {/* MAIN SECTION */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================================================= */}
        {/* RECENT APPLICATION */}
        {/* ================================================= */}

        <div className="lg:col-span-2 space-y-6">

          {recentApp ? (

            <Card>

              <CardHeader
                title="Recent Application Status"
                subtitle={`Application ID: ${recentApp.application_id}`}
                action={
                  <Badge
                    variant={
                      recentApp.status === 'APPROVED' ||
                        recentApp.status === 'Approved'
                        ? 'success'
                        : recentApp.status === 'Submitted'
                          ? 'saffron'
                          : 'warning'
                    }
                  >
                    {formatStatus(
                      recentApp.status
                    )}
                  </Badge>
                }
              />

              <CardContent className="space-y-4">

                <div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">

                    {recentApp.scholarship_name ||
                      'Scholarship Application'}

                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">

                    Student ID:{' '}
                    {recentApp.student_id}

                    {' • '}

                    Application:{' '}
                    {recentApp.application_id}

                  </p>

                </div>


                {/* VERIFICATION MILESTONES */}

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Application Milestones
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                    {/* APPLICATION */}

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">

                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-slate-800">
                          Application
                        </p>

                        <span className="text-[10px] text-emerald-700 font-semibold">
                          Submitted
                        </span>

                      </div>

                    </div>


                    {/* DOCUMENTS */}

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">

                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                        2
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-slate-800">
                          Documents
                        </p>

                        <span className="text-[10px] text-slate-500 font-semibold">
                          Submitted
                        </span>

                      </div>

                    </div>


                    {/* INCOME */}

                    <div
                      className={`bg-white p-2.5 rounded-lg border flex items-center gap-2 ${isIncomeVerified
                        ? 'border-emerald-200'
                        : 'border-amber-200 bg-amber-50/50'
                        }`}
                    >

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${isIncomeVerified
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                          }`}
                      >
                        {isIncomeVerified
                          ? '✓'
                          : '3'}
                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-slate-800">
                          Income
                        </p>

                        <span
                          className={`text-[10px] font-semibold ${isIncomeVerified
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                            }`}
                        >
                          {isIncomeVerified
                            ? 'Verified'
                            : 'Pending'}
                        </span>

                      </div>

                    </div>


                    {/* OFFICER */}

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2">

                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">

                        {recentApp.status === 'APPROVED'
                          ? '✓'
                          : '4'}

                      </div>

                      <div>

                        <p className="text-[11px] font-bold text-slate-800">
                          Officer Review
                        </p>

                        <span className="text-[10px] text-slate-500">
                          {recentApp.status ===
                            'APPROVED'
                            ? 'Approved'
                            : 'Pending'}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/student/applications/${recentApp.id}`}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                      >
                        View Application
                      </Button>
                    </Link>

                    <Link
                      to={`/student/tracking/${recentApp.id}`}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        Track Timeline
                      </Button>
                    </Link>

                  </div>

                  <Link
                    to="/student/income-verification"
                    className="text-xs font-semibold text-gov-primary hover:underline flex items-center gap-1"
                  >

                    <span>
                      Income Verification Details
                    </span>

                    <ChevronRight className="w-4 h-4" />

                  </Link>

                </div>

              </CardContent>

            </Card>

          ) : (

            <Card>

              <CardContent className="py-10 text-center">

                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                <h3 className="font-bold text-slate-800">
                  No Applications Yet
                </h3>

                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Apply for a scholarship scheme to get
                  started.
                </p>

                <Link to="/student/apply">

                  <Button
                    variant="primary"
                    size="sm"
                    icon={PlusCircle}
                  >
                    Apply for Scholarship
                  </Button>

                </Link>

              </CardContent>

            </Card>

          )}


          {/* ================================================= */}
          {/* QUICK ACTIONS */}
          {/* ================================================= */}

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">

            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">


              {/* APPLY */}

              <Link
                to="/student/apply"
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-center group"
              >

                <div className="w-10 h-10 rounded-lg bg-blue-100 text-gov-primary flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">

                  <PlusCircle className="w-5 h-5" />

                </div>

                <span className="text-xs font-bold text-slate-800 block">
                  Apply Scheme
                </span>

                <span className="text-[10px] text-slate-400">
                  New Application
                </span>

              </Link>


              {/* TRACK */}

              <Link
                to={`/student/tracking/${recentApp?.id || '1'}`}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-center group"
              >

                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">

                  <Clock className="w-5 h-5" />

                </div>

                <span className="text-xs font-bold text-slate-800 block">
                  Track Status
                </span>

                <span className="text-[10px] text-slate-400">
                  Review Timeline
                </span>

              </Link>


              {/* INCOME */}

              <Link
                to="/student/income-verification"
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-center group"
              >

                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">

                  <ShieldCheck className="w-5 h-5" />

                </div>

                <span className="text-xs font-bold text-slate-800 block">
                  Income Verification
                </span>

                <span className="text-[10px] text-slate-400">
                  Check Status
                </span>

              </Link>


              {/* HISTORY */}

              <Link
                to="/student/data-history"
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition text-center group"
              >

                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">

                  <History className="w-5 h-5" />

                </div>

                <span className="text-xs font-bold text-slate-800 block">
                  Verification Log
                </span>

                <span className="text-[10px] text-slate-400">
                  Consent History
                </span>

              </Link>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT COLUMN */}
        {/* ================================================= */}

        <div className="space-y-6">


          {/* NOTIFICATIONS */}

          <Card>

            <CardHeader
              title="Recent Notifications"
              action={
                <Link
                  to="/student/notifications"
                  className="text-xs text-blue-700 hover:underline font-semibold"
                >
                  View All
                </Link>
              }
            />

            <CardContent className="p-0 divide-y divide-slate-100">

              {notifications.length > 0 ? (

                notifications
                  .slice(0, 4)
                  .map((notification) => (

                    <div
                      key={notification.id}
                      className="p-4 hover:bg-slate-50 transition space-y-1"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-bold text-slate-800">
                          {notification.title}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {notification.timestamp}
                        </span>

                      </div>

                      <p className="text-xs text-slate-600 leading-snug">
                        {notification.message}
                      </p>

                      {notification.link && (

                        <Link
                          to={notification.link}
                          className="text-[11px] text-gov-primary font-bold hover:underline inline-flex items-center gap-1 mt-1"
                        >

                          <span>
                            Action Link
                          </span>

                          <ExternalLink className="w-3 h-3" />

                        </Link>

                      )}

                    </div>

                  ))

              ) : (

                <div className="p-6 text-center">

                  <p className="text-xs text-slate-500">
                    No notifications available.
                  </p>

                </div>

              )}

            </CardContent>

          </Card>


          {/* VERIFICATION SERVICE CARD */}

          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3">

            <div className="flex items-center justify-between">

              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                Verification Service

              </span>

              <Badge
                variant="success"
                size="sm"
                className="bg-emerald-400 text-emerald-950 font-bold"
              >
                Available
              </Badge>

            </div>

            <p className="text-xs text-slate-300 leading-relaxed">

              Submit and track your income verification
              request securely through the Education
              Scholarship Portal.

            </p>

            <div className="pt-2 border-t border-slate-800">

              <Link
                to="/student/income-verification"
                className="w-full block"
              >

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                >
                  Check Verification Status
                </Button>

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};