import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card, CardHeader, CardContent } from '../../components/common/Card';

export const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          'http://localhost:5000/api/applications'
        );

        if (!response.ok) {
          throw new Error('Unable to fetch applications');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Unable to fetch application');
        }

        const foundApplication = (data.applications || []).find(
          (item) => String(item.id) === String(id)
        );

        if (!foundApplication) {
          setError('Application not found.');
          return;
        }

        setApplication(foundApplication);
      } catch (err) {
        console.error('Application details error:', err);
        setError(err.message || 'Unable to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';

      case 'under review':
        return 'warning';

      case 'rejected':
        return 'danger';

      default:
        return 'saffron';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">
          Loading application details...
        </p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>

        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              Application Not Found
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              {error || 'The requested application could not be found.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const submittedDate = application.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    : 'Not available';

  const updatedDate = application.updated_at
    ? new Date(application.updated_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    : 'Not available';

  return (
    <div className="space-y-6">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-gov-primary transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Applications</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200">
              {application.application_id}
            </span>

            <Badge variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>

          </div>

          <h1 className="text-xl font-bold text-slate-900">
            {application.scholarship_name}
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Submitted by {application.full_name} on {submittedDate}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            icon={Printer}
          >
            Print Application
          </Button>

          <Link to={`/student/tracking/${application.id}`}>
            <Button
              variant="primary"
              size="sm"
              icon={Clock}
            >
              Track Progress
            </Button>
          </Link>

        </div>
      </div>

      {/* Application Information */}
      <Card>
        <CardHeader title="Application Information" />

        <CardContent className="space-y-4 text-xs">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <span className="text-slate-500 block">
                Application ID
              </span>

              <p className="font-mono font-bold text-slate-800 mt-1">
                {application.application_id}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Application Status
              </span>

              <div className="mt-1">
                <Badge variant={getStatusVariant(application.status)}>
                  {application.status}
                </Badge>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block">
                Student ID
              </span>

              <p className="font-mono font-bold text-slate-800 mt-1">
                {application.student_id}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Student Name
              </span>

              <p className="font-bold text-slate-800 mt-1">
                {application.full_name}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Scholarship ID
              </span>

              <p className="font-mono font-bold text-slate-800 mt-1">
                {application.scholarship_id}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Scholarship Name
              </span>

              <p className="font-bold text-slate-800 mt-1">
                {application.scholarship_name}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Submitted Date
              </span>

              <p className="font-medium text-slate-800 mt-1">
                {submittedDate}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block">
                Last Updated
              </span>

              <p className="font-medium text-slate-800 mt-1">
                {updatedDate}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* Verification Section */}
      <div className="bg-emerald-50/80 rounded-xl border border-emerald-300 p-6 shadow-xs">

        <div className="flex items-center gap-3 border-b border-emerald-200 pb-4">

          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Portal Verification Status
            </h3>

            <p className="text-xs text-emerald-800 mt-0.5">
              Application records are being processed through the scholarship portal.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />

            <div>
              <p className="font-bold text-slate-800 text-xs">
                Application Submitted
              </p>

              <p className="text-[11px] text-slate-500">
                Record created successfully
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />

            <div>
              <p className="font-bold text-slate-800 text-xs">
                Student Record
              </p>

              <p className="text-[11px] text-slate-500">
                Student linked successfully
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />

            <div>
              <p className="font-bold text-slate-800 text-xs">
                Officer Review
              </p>

              <p className="text-[11px] text-slate-500">
                Pending portal processing
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Current Status */}
      <Card>

        <CardHeader title="Current Application Status" />

        <CardContent>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  {application.status}
                </p>

                <p className="text-xs text-slate-500">
                  Last updated on {updatedDate}
                </p>
              </div>

            </div>

            <Badge variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>

          </div>

        </CardContent>

      </Card>

    </div>
  );
};
