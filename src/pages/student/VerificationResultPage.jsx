import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  Printer,
  ArrowLeft,
  Lock,
  FileText
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export const VerificationResultPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [application, setApplication] = useState(null);
  const [verification, setVerification] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = user?.id || 'STU2026001';

  useEffect(() => {
    const fetchVerificationRecord = async () => {
      try {
        setLoading(true);
        setError('');

        // --------------------------------------------------
        // STEP 1: Get student's applications
        // --------------------------------------------------
        const applicationsResponse = await fetch(
          'http://localhost:5000/api/applications'
        );

        const applicationsData = await applicationsResponse.json();

        if (!applicationsResponse.ok || !applicationsData.success) {
          throw new Error(
            applicationsData.message || 'Unable to fetch applications'
          );
        }

        const applications = applicationsData.applications || [];

        // Find the current student's application
        const studentApplications = applications.filter(
          (app) => app.student_id === studentId
        );

        if (studentApplications.length === 0) {
          setApplication(null);
          setVerification(null);
          return;
        }

        // Use the most recent application
        const currentApplication = studentApplications[0];

        setApplication(currentApplication);

        // --------------------------------------------------
        // STEP 2: Get income verification for application
        // --------------------------------------------------
        const verificationResponse = await fetch(
          `http://localhost:5000/api/income-verification/${currentApplication.id}`
        );

        const verificationData = await verificationResponse.json();

        if (!verificationResponse.ok || !verificationData.success) {
          throw new Error(
            verificationData.message ||
            'Unable to fetch income verification'
          );
        }

        setVerification(verificationData.verification || null);
      } catch (err) {
        console.error('Verification record error:', err);

        setError(
          err.message || 'Unable to load verification details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationRecord();
  }, [studentId]);

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------
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
      month: 'long',
      year: 'numeric'
    });
  };

  // --------------------------------------------------
  // FORMAT DATE + TIME
  // --------------------------------------------------
  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return 'Not available';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --------------------------------------------------
  // FORMAT INCOME
  // --------------------------------------------------
  const formatIncome = (income) => {
    if (income === null || income === undefined || income === '') {
      return 'Not submitted';
    }

    const numericIncome = Number(income);

    if (Number.isNaN(numericIncome)) {
      return 'Not available';
    }

    return `₹${numericIncome.toLocaleString('en-IN')}`;
  };

  // --------------------------------------------------
  // VERIFICATION STATUS
  // --------------------------------------------------
  const normalizedStatus =
    verification?.verification_status?.toLowerCase() || '';

  const isVerified = normalizedStatus === 'verified';
  const isPending = normalizedStatus === 'pending';
  const isRejected =
    normalizedStatus === 'rejected' ||
    normalizedStatus === 'failed';

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-gov-primary rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Verification Record
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Please wait while your application and verification
            details are retrieved.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>

        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">

          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-red-700">
            Unable to Load Verification
          </h2>

          <p className="text-sm text-slate-600 mt-2">
            {error}
          </p>

          <Button
            variant="primary"
            size="sm"
            className="mt-5"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO APPLICATION
  // --------------------------------------------------
  if (!application) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            No Scholarship Application Found
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            You need to submit a scholarship application before
            an income verification record can be displayed.
          </p>

          <Link to="/student/applications">
            <Button
              variant="primary"
              size="sm"
              className="mt-5"
            >
              View My Applications
            </Button>
          </Link>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // NO VERIFICATION RECORD
  // --------------------------------------------------
  if (!verification) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            No Verification Record Found
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            An income verification request has not yet been
            created for this scholarship application.
          </p>

          <Link to="/student/income-verification">
            <Button
              variant="primary"
              size="sm"
              className="mt-5"
            >
              Go to Income Verification
            </Button>
          </Link>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN VERIFICATION RESULT
  // --------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </button>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">

        {/* GOVERNMENT STYLE STRIPE */}
        <div className="gov-flag-stripe" />

        {/* HEADER */}
        <div className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200 text-center space-y-2">

          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs ${isVerified
              ? 'bg-emerald-100 text-emerald-600'
              : isRejected
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600'
              }`}
          >
            {isVerified ? (
              <ShieldCheck className="w-10 h-10" />
            ) : isRejected ? (
              <ShieldCheck className="w-10 h-10" />
            ) : (
              <Clock className="w-10 h-10" />
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-0.5 rounded border border-slate-200">
              National Education Scholarship Portal
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Income Verification Record
          </h1>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Digital record of the income verification request
            associated with your scholarship application.
          </p>

        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* STATUS */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isVerified
              ? 'bg-emerald-50 border-emerald-300'
              : isRejected
                ? 'bg-red-50 border-red-300'
                : 'bg-amber-50 border-amber-300'
              }`}
          >

            <div className="flex items-center gap-3">

              {isVerified ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              ) : isRejected ? (
                <ShieldCheck className="w-7 h-7 text-red-600 shrink-0" />
              ) : (
                <Clock className="w-7 h-7 text-amber-600 shrink-0" />
              )}

              <div>

                <span
                  className={`text-xs font-bold uppercase tracking-wider ${isVerified
                    ? 'text-emerald-800'
                    : isRejected
                      ? 'text-red-800'
                      : 'text-amber-800'
                    }`}
                >
                  Verification Status
                </span>

                <h3
                  className={`text-lg font-extrabold ${isVerified
                    ? 'text-emerald-950'
                    : isRejected
                      ? 'text-red-950'
                      : 'text-amber-950'
                    }`}
                >
                  {isVerified
                    ? 'VERIFIED'
                    : isRejected
                      ? 'REJECTED'
                      : 'PENDING'}
                </h3>

              </div>
            </div>

            <Badge
              variant={
                isVerified
                  ? 'success'
                  : isRejected
                    ? 'danger'
                    : 'warning'
              }
              size="lg"
            >
              {verification.verification_status || 'Pending'}
            </Badge>

          </div>

          {/* APPLICATION INFORMATION */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">

            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-gov-primary" />

              <h2 className="text-sm font-bold text-slate-900">
                Scholarship Application
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">
                  Application ID
                </span>

                <p className="font-mono font-bold text-gov-primary mt-1">
                  {application.application_id || 'Not available'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">
                  Scholarship
                </span>

                <p className="font-bold text-slate-900 mt-1">
                  {application.scholarship_name || 'Not available'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">
                  Application Status
                </span>

                <p className="mt-1">
                  <Badge
                    variant={
                      application.status === 'Approved'
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {application.status || 'Submitted'}
                  </Badge>
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">
                  Student ID
                </span>

                <p className="font-mono font-bold text-slate-900 mt-1">
                  {application.student_id || studentId}
                </p>
              </div>

            </div>
          </div>

          {/* KEY DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs">

            {/* STUDENT NAME */}
            <div className="space-y-1">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Student Name
              </span>

              <p className="font-bold text-slate-900 text-sm">
                {application.full_name || user?.name || 'Student'}
              </p>
            </div>

            {/* STUDENT ID */}
            <div className="space-y-1">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Student ID
              </span>

              <p className="font-mono font-bold text-slate-900 text-sm">
                {application.student_id || studentId}
              </p>
            </div>

            {/* INCOME */}
            <div className="space-y-1 pt-2 border-t border-slate-200 sm:border-t-0">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Annual Family Income
              </span>

              <p
                className={`font-black text-xl ${isVerified
                  ? 'text-emerald-800'
                  : 'text-slate-900'
                  }`}
              >
                {formatIncome(verification.annual_income)}
              </p>
            </div>

            {/* CURRENCY */}
            <div className="space-y-1 pt-2 border-t border-slate-200 sm:border-t-0">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Currency
              </span>

              <p className="font-bold text-slate-900 text-sm">
                {verification.currency || 'INR'}
              </p>
            </div>

            {/* VERIFICATION SERVICE */}
            <div className="space-y-1 pt-2 border-t border-slate-200">

              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Verification Service
              </span>

              <p className="font-bold text-slate-900 flex items-center gap-1 text-xs">
                <Building className="w-3.5 h-3.5 text-amber-600" />

                {verification.source_department ||
                  'Education Scholarship Portal'}
              </p>

            </div>

            {/* REQUEST ID */}
            <div className="space-y-1 pt-2 border-t border-slate-200">

              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Request ID
              </span>

              <p className="font-mono font-bold text-slate-900">
                {verification.request_id || 'Not available'}
              </p>

            </div>

            {/* REQUEST DATE */}
            <div className="space-y-1 pt-2 border-t border-slate-200">

              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Request Date
              </span>

              <p className="font-bold text-slate-900 flex items-center gap-1.5">

                <Calendar className="w-3.5 h-3.5 text-slate-500" />

                {formatDateTime(verification.created_at)}

              </p>

            </div>

            {/* VERIFIED DATE */}
            <div className="space-y-1 pt-2 border-t border-slate-200">

              <span className="text-slate-500 font-semibold uppercase text-[10px]">
                Verified Date
              </span>

              <p className="font-bold text-slate-900">

                {verification.verified_at
                  ? formatDate(verification.verified_at)
                  : 'Pending'}

              </p>

            </div>

          </div>

          {/* PURPOSE */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">

            <span className="text-slate-500 font-semibold uppercase text-[10px]">
              Verification Purpose
            </span>

            <p className="text-sm font-semibold text-slate-800 mt-1">
              Scholarship eligibility verification
            </p>

            <p className="text-[11px] text-slate-500 mt-1">
              The verification record is maintained to support
              processing of the associated scholarship application.
            </p>

          </div>

          {/* PRIVACY */}
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 flex items-start gap-3 text-xs text-blue-950">

            <Lock className="w-5 h-5 text-gov-primary shrink-0 mt-0.5" />

            <div className="space-y-0.5">

              <p className="font-bold">
                Data Privacy Statement
              </p>

              <p className="text-slate-600 text-[11px] leading-relaxed">
                Only information required for scholarship eligibility
                verification is maintained in this portal. External
                verification services can be integrated later through
                the portal backend without changing this student-facing
                workflow.
              </p>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">

            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Record
            </Button>

            <div className="flex items-center gap-2">

              <Link to="/student/data-history">
                <Button
                  variant="secondary"
                  size="sm"
                >
                  View History
                </Button>
              </Link>

              <Link to="/student/applications">
                <Button
                  variant="primary"
                  size="sm"
                >
                  My Applications
                </Button>
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};