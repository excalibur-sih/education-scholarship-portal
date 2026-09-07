import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  ShieldCheck,
  Loader2
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ApplicationTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =====================================================
  // FETCH APPLICATION TRACKING
  // =====================================================

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `http://localhost:5000/api/applications/${id}/tracking`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to load application tracking'
          );
        }

        setApplication(data.application);
        setTracking(data.tracking || []);

      } catch (err) {
        console.error('Tracking error:', err);
        setError(err.message || 'Unable to load application tracking');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTracking();
    }
  }, [id]);

  // =====================================================
  // FETCH ALL APPLICATIONS FOR SELECTOR
  // =====================================================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/applications'
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error('Applications selector error:', err);
      }
    };

    fetchApplications();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gov-primary mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            Loading application tracking...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="space-y-6">

        <Link
          to="/student/applications"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-gov-primary"
        >
          <ArrowLeft size={16} />
          Back to My Applications
        </Link>

        <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-red-500" size={24} />
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            Unable to Load Tracking
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="mt-5"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Application Not Found
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          The requested scholarship application could not be found.
        </p>

        <Link
          to="/student/applications"
          className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gov-primary"
        >
          <ArrowLeft size={16} />
          Back to My Applications
        </Link>
      </div>
    );
  }

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';

    return status
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getStatusBadgeVariant = (status) => {
    const normalized = status?.toLowerCase();

    if (
      normalized === 'approved' ||
      normalized === 'disbursed'
    ) {
      return 'success';
    }

    if (
      normalized === 'under review' ||
      normalized === 'submitted'
    ) {
      return 'warning';
    }

    if (
      normalized === 'rejected'
    ) {
      return 'danger';
    }

    return 'saffron';
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div>

            <Link
              to="/student/applications"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-gov-primary mb-4"
            >
              <ArrowLeft size={15} />
              Back to My Applications
            </Link>

            <div className="flex items-center gap-2 mb-2">

              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200">
                {application.application_id}
              </span>

              <Badge
                variant={getStatusBadgeVariant(application.status)}
              >
                {getStatusLabel(application.status)}
              </Badge>

            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Application Status & Verification Timeline
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {application.scholarship_name}
            </p>

          </div>

          {/* Application Selector */}

          {applications.length > 0 && (
            <div className="flex flex-col gap-1">

              <span className="text-xs font-semibold text-slate-500">
                Switch Application
              </span>

              <select
                value={String(application.id)}
                onChange={(e) => {
                  navigate(
                    `/student/tracking/${e.target.value}`
                  );
                }}
                className="text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 font-mono font-bold"
              >

                {applications.map((app) => (
                  <option
                    key={app.id}
                    value={app.id}
                  >
                    {app.application_id} - {app.scholarship_name}
                  </option>
                ))}

              </select>

            </div>
          )}

        </div>
      </div>


      {/* =================================================
          APPLICATION SUMMARY
      ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <FileText
                size={17}
                className="text-gov-primary"
              />

              <span className="text-[10px] font-bold uppercase text-slate-400">
                Application
              </span>
            </div>

            <p className="text-sm font-bold text-slate-900">
              {application.application_id}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Submitted application
            </p>

          </div>


          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck
                size={17}
                className="text-emerald-600"
              />

              <span className="text-[10px] font-bold uppercase text-slate-400">
                Student Record
              </span>
            </div>

            <p className="text-sm font-bold text-slate-900">
              {application.full_name}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Student ID: {application.student_id}
            </p>

          </div>


          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

            <div className="flex items-center gap-2 mb-2">
              <Clock
                size={17}
                className="text-amber-600"
              />

              <span className="text-[10px] font-bold uppercase text-slate-400">
                Current Status
              </span>
            </div>

            <p className="text-sm font-bold text-slate-900">
              {getStatusLabel(application.status)}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              Latest application stage
            </p>

          </div>

        </div>
      </div>


      {/* =================================================
          TIMELINE
      ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <div className="mb-6">

          <h2 className="text-lg font-bold text-slate-900">
            Application Timeline
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Track the progress of your scholarship application.
          </p>

        </div>


        {tracking.length === 0 ? (

          <div className="text-center py-10">

            <Clock
              size={32}
              className="text-slate-300 mx-auto mb-3"
            />

            <h3 className="text-sm font-bold text-slate-700">
              No Timeline Updates Yet
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Status updates will appear here as your application progresses.
            </p>

          </div>

        ) : (

          <div className="relative">

            {tracking.map((item, index) => {

              const isLast = index === tracking.length - 1;

              const isCurrent =
                index === tracking.length - 1;

              return (
                <div
                  key={item.id}
                  className="relative flex gap-4 pb-8"
                >

                  {/* Vertical Line */}

                  {!isLast && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200" />
                  )}


                  {/* Status Icon */}

                  <div className="relative z-10 flex-shrink-0">

                    {isCurrent ? (

                      <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center">

                        <CheckCircle2
                          size={17}
                          className="text-emerald-600"
                        />

                      </div>

                    ) : (

                      <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-300 flex items-center justify-center">

                        <Circle
                          size={13}
                          className="text-slate-400"
                        />

                      </div>

                    )}

                  </div>


                  {/* Timeline Content */}

                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                      <div>

                        <h3 className="text-sm font-bold text-slate-900">
                          {getStatusLabel(item.status)}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatDateTime(item.changed_at)}
                        </p>

                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                          Current Stage
                        </span>
                      )}

                    </div>


                    {item.remarks && (
                      <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3">

                        <p className="text-xs text-slate-600">
                          {item.remarks}
                        </p>

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>


      {/* =================================================
          APPLICATION INFORMATION
      ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Application Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Application ID
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {application.application_id}
            </p>
          </div>


          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Scholarship
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {application.scholarship_name}
            </p>
          </div>


          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Student ID
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {application.student_id}
            </p>
          </div>


          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Submitted On
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {formatDate(
                tracking.length > 0
                  ? tracking[0].changed_at
                  : null
              )}
            </p>
          </div>


          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Current Status
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {getStatusLabel(application.status)}
            </p>
          </div>


          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Last Updated
            </span>

            <p className="font-semibold text-slate-800 mt-1">
              {formatDate(
                tracking.length > 0
                  ? tracking[tracking.length - 1].changed_at
                  : null
              )}
            </p>
          </div>

        </div>

      </div>


      {/* =================================================
          FOOTER ACTIONS
      ================================================= */}

      <div className="flex flex-col sm:flex-row justify-between gap-3">

        <Link
          to="/student/applications"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>

        <Link
          to={`/student/applications/${application.id}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gov-primary text-white rounded-lg text-sm font-semibold hover:opacity-90"
        >
          View Application
        </Link>

      </div>

    </div>
  );
};