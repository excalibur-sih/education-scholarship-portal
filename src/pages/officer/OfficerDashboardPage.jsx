import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  Eye,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

export const OfficerDashboardPage = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [incomeStatuses, setIncomeStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/applications`);

      if (!response.ok) {
        throw new Error('Unable to fetch applications');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Unable to fetch applications');
      }

      const applicationList = Array.isArray(data.applications)
        ? data.applications
        : [];

      setApplications(applicationList);

      // Fetch income verification status for every application.
      const incomeResults = await Promise.all(
        applicationList.map(async (application) => {
          try {
            const incomeResponse = await fetch(
              `${API_BASE_URL}/api/income-verification/${application.id}`
            );

            if (!incomeResponse.ok) {
              return {
                applicationId: application.id,
                verification: null,
              };
            }

            const incomeData = await incomeResponse.json();

            return {
              applicationId: application.id,
              verification: incomeData.success
                ? incomeData.verification
                : null,
            };
          } catch (incomeError) {
            return {
              applicationId: application.id,
              verification: null,
            };
          }
        })
      );

      const incomeMap = {};

      incomeResults.forEach((item) => {
        incomeMap[item.applicationId] = item.verification;
      });

      setIncomeStatuses(incomeMap);
    } catch (err) {
      console.error('Officer dashboard error:', err);
      setError(
        err.message ||
        'Unable to load the officer dashboard. Please check the backend server.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  /*
   * Normalize status so the dashboard can work with
   * both the current database status ("Submitted")
   * and future officer workflow statuses.
   */
  const getStatus = (application) => {
    return String(application?.status || 'Submitted').toUpperCase();
  };

  const totalApps = applications.length;

  const submittedApps = applications.filter((application) => {
    const s = getStatus(application);
    return s === 'SUBMITTED';
  }).length;

  const underReviewApps = applications.filter((application) => {
    const s = getStatus(application);
    return s === 'UNDER_REVIEW' || s === 'UNDER REVIEW';
  }).length;

  const verificationPendingApps = applications.filter((application) => {
    const s = getStatus(application);
    return s === 'VERIFICATION_PENDING' || s === 'VERIFICATION PENDING';
  }).length;

  const approvedApps = applications.filter(
    (application) => getStatus(application) === 'APPROVED'
  ).length;

  const rejectedApps = applications.filter(
    (application) => getStatus(application) === 'REJECTED'
  ).length;

  /*
   * Show latest applications first.
   */
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(a.submitted_at || a.created_at || 0);
        const dateB = new Date(b.submitted_at || b.created_at || 0);

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [applications]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return 'Not available';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatIncome = (verification) => {
    if (!verification?.annual_income) {
      return null;
    }

    const amount = Number(verification.annual_income);

    if (Number.isNaN(amount)) {
      return null;
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-900/60 text-emerald-300 border border-emerald-700';

      case 'REJECTED':
        return 'bg-rose-900/60 text-rose-300 border border-rose-700';

      case 'UNDER_REVIEW':
      case 'VERIFICATION_PENDING':
      case 'PENDING':
      case 'SUBMITTED':
      default:
        return 'bg-amber-900/60 text-amber-300 border border-amber-700';
    }
  };

  const getIncomeVerification = (applicationId) => {
    return incomeStatuses[applicationId] || null;
  };

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <ShieldAlert className="w-3.5 h-3.5" />

              <span>Department Review Desk</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Education Scholarship Officer Portal
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Review scholarship applications, check submitted documents,
              review income verification records, and process application
              decisions through the Education Scholarship Portal.
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-left min-w-[220px]">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Logged Officer
            </span>

            <p className="text-sm font-bold text-white mt-0.5">
              {user?.name || 'Dr. V. K. Patil'}
            </p>

            <p className="text-xs text-amber-400 font-mono">
              Sr. Education Officer
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div className="flex-1">
            <p className="text-sm font-bold">Unable to load dashboard</p>

            <p className="text-xs text-rose-300/80 mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="text-xs font-bold text-rose-300 hover:text-white underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Total Applications
          </span>

          <p className="text-2xl font-black text-white mt-1">
            {loading ? '—' : totalApps}
          </p>
        </div>

        {/* Submitted */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-blue-600/50">
          <span className="text-[10px] font-bold text-blue-400 uppercase">
            Submitted
          </span>

          <p className="text-2xl font-black text-blue-400 mt-1">
            {loading ? '—' : submittedApps}
          </p>
        </div>

        {/* Under Review */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-amber-600/50">
          <span className="text-[10px] font-bold text-amber-400 uppercase">
            Under Review
          </span>

          <p className="text-2xl font-black text-amber-400 mt-1">
            {loading ? '—' : underReviewApps}
          </p>
        </div>

        {/* Verification Pending */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-purple-600/50">
          <span className="text-[10px] font-bold text-purple-400 uppercase">
            Verification Pending
          </span>

          <p className="text-2xl font-black text-purple-400 mt-1">
            {loading ? '—' : verificationPendingApps}
          </p>
        </div>

        {/* Approved */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-emerald-600/50">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">
            Approved
          </span>

          <p className="text-2xl font-black text-emerald-400 mt-1">
            {loading ? '—' : approvedApps}
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-rose-600/50">
          <span className="text-[10px] font-bold text-rose-400 uppercase">
            Rejected
          </span>

          <p className="text-2xl font-black text-rose-400 mt-1">
            {loading ? '—' : rejectedApps}
          </p>
        </div>
      </div>

      {/* Review Queue */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />

            <div>
              <h2 className="text-sm font-bold text-white">
                Application Review Queue
              </h2>

              <p className="text-[10px] text-slate-500 mt-0.5">
                Applications received by the portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''
                  }`}
              />

              Refresh
            </button>

            <Link
              to="/officer/applications"
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              View All ({loading ? '—' : applications.length}) →
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="px-6 py-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />

            <p className="text-sm text-slate-400 mt-3">
              Loading applications...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="px-6 py-12 text-center">
            <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />

            <p className="text-sm font-bold text-slate-300 mt-3">
              No applications found
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Applications submitted by students will appear here.
            </p>
          </div>
        )}

        {/* Applications Table */}
        {!loading && applications.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">
                    Application ID
                  </th>

                  <th className="px-5 py-3.5">
                    Student
                  </th>

                  <th className="px-5 py-3.5">
                    Scholarship Scheme
                  </th>

                  <th className="px-5 py-3.5">
                    Submitted Date
                  </th>

                  <th className="px-5 py-3.5">
                    Income Verification
                  </th>

                  <th className="px-5 py-3.5">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/80">
                {recentApplications.map((application) => {
                  const status = getStatus(application);

                  const verification = getIncomeVerification(
                    application.id
                  );

                  const verificationStatus = String(
                    verification?.verification_status || 'PENDING'
                  ).toUpperCase();

                  const incomeAmount = formatIncome(verification);

                  return (
                    <tr
                      key={application.id}
                      className="hover:bg-slate-900/60 transition"
                    >
                      {/* Application ID */}
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-amber-400">
                          {application.application_id || 'N/A'}
                        </span>
                      </td>

                      {/* Student */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-white">
                          {application.full_name || 'Unknown Student'}
                        </span>

                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                          {application.student_id || 'N/A'}
                        </span>
                      </td>

                      {/* Scholarship */}
                      <td className="px-5 py-4 max-w-xs">
                        <span className="text-slate-200">
                          {application.scholarship_name || 'Not specified'}
                        </span>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {formatDate(
                          application.submitted_at ||
                          application.created_at
                        )}
                      </td>

                      {/* Income Verification */}
                      <td className="px-5 py-4">
                        {verificationStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                            <ShieldCheck className="w-3.5 h-3.5" />

                            <span>
                              {incomeAmount
                                ? `${incomeAmount} · VERIFIED`
                                : 'VERIFIED'}
                            </span>
                          </span>
                        ) : verificationStatus === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-700">
                            <XCircle className="w-3.5 h-3.5" />

                            <span>Verification Rejected</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-700">
                            <Clock className="w-3.5 h-3.5" />

                            <span>Pending Verification</span>
                          </span>
                        )}
                      </td>

                      {/* Application Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getStatusClasses(
                            status
                          )}`}
                        >
                          {status.replaceAll('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/officer/review/${application.id}`}
                        >
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Eye}
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Review Dossier
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dashboard Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-400" />

            <h3 className="text-xs font-bold text-white">
              Application Review
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
            Review student applications and their submitted information
            before taking an administrative decision.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />

            <h3 className="text-xs font-bold text-white">
              Verification Records
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
            View the income verification status recorded by the scholarship
            portal. External verification integration can be connected later.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400" />

            <h3 className="text-xs font-bold text-white">
              Decision Processing
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
            Application approval, rejection, remarks, and status history
            will be handled in the officer review workflow.
          </p>
        </div>
      </div>
    </div>
  );
};