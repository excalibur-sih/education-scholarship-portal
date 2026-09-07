import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

export const ApplicationsPage = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Current logged-in student
  const studentId = user?.id || 'STU2026001';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          'http://localhost:5000/api/applications'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || 'Unable to load applications'
          );
        }

        // Show only applications belonging to the logged-in student
        const studentApplications = (data.applications || []).filter(
          (application) =>
            application.student_id === studentId
        );

        setApplications(studentApplications);

      } catch (err) {
        console.error('Applications fetch error:', err);
        setError(
          err.message || 'Unable to load applications'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [studentId]);

  // Convert backend status into UI badge style
  const getStatusVariant = (status) => {
    const normalizedStatus = String(status || '').toLowerCase();

    if (
      normalizedStatus === 'approved' ||
      normalizedStatus === 'sanctioned'
    ) {
      return 'success';
    }

    if (
      normalizedStatus === 'under_review' ||
      normalizedStatus === 'under review' ||
      normalizedStatus === 'in progress'
    ) {
      return 'warning';
    }

    if (
      normalizedStatus === 'rejected' ||
      normalizedStatus === 'failed'
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
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            My Scholarship Applications
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Track your submitted scholarship applications and their
            current status.
          </p>
        </div>

        <Link to="/student/apply">
          <Button variant="primary" icon={PlusCircle}>
            Apply for New Scholarship
          </Button>
        </Link>

      </div>

      {/* Loading */}
      {loading && (
        <Card>
          <div className="p-10 text-center">
            <Clock className="w-8 h-8 mx-auto text-slate-400 animate-spin mb-3" />

            <p className="text-sm font-semibold text-slate-600">
              Loading your applications...
            </p>
          </div>
        </Card>
      )}

      {/* Error */}
      {!loading && error && (
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />

            <h3 className="font-bold text-slate-900">
              Unable to load applications
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {error}
            </p>
          </div>
        </Card>
      )}

      {/* No Applications */}
      {!loading && !error && applications.length === 0 && (
        <Card>
          <div className="p-10 text-center">

            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />

            <h3 className="text-lg font-bold text-slate-900">
              No applications found
            </h3>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              You have not submitted any scholarship applications yet.
            </p>

            <Link to="/student/apply">
              <Button variant="primary" icon={PlusCircle}>
                Apply for Scholarship
              </Button>
            </Link>

          </div>
        </Card>
      )}

      {/* Applications */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">

          {applications.map((app) => (

            <Card
              key={app.id}
              hover
              className="overflow-hidden"
            >

              <div className="p-6">

                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">

                  <div>

                    <div className="flex items-center gap-2 mb-1.5">

                      <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {app.application_id}
                      </span>

                      <Badge
                        variant={getStatusVariant(app.status)}
                      >
                        {app.status || 'Submitted'}
                      </Badge>

                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {app.scholarship_name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Student: {app.full_name}
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Submitted: {formatDate(app.submitted_at)}
                    </p>

                  </div>

                  <div className="sm:text-right">

                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Application Status
                    </span>

                    <p className="text-sm font-black text-gov-primary mt-1">
                      {app.status || 'Submitted'}
                    </p>

                  </div>

                </div>

                {/* Verification / Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

                  {/* Application Submitted */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Application
                      </span>

                      <p className="text-xs font-bold text-slate-800">
                        Successfully Submitted
                      </p>
                    </div>

                    <CheckCircle2 className="w-5 h-5 text-green-600" />

                  </div>

                  {/* Student Record */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Student Record
                      </span>

                      <p className="text-xs font-bold text-slate-800">
                        {app.student_code}
                      </p>
                    </div>

                    <CheckCircle2 className="w-5 h-5 text-green-600" />

                  </div>

                  {/* Current Stage */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Current Stage
                      </span>

                      <p className="text-xs font-bold text-slate-800">
                        {app.status || 'Submitted'}
                      </p>
                    </div>

                    {String(app.status || '').toLowerCase() ===
                      'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}

                  </div>

                </div>

                {/* Application Information */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Application ID
                      </span>

                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {app.application_id}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Scholarship
                      </span>

                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {app.scholarship_code}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Last Updated
                      </span>

                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {formatDate(app.updated_at)}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">

                  <div className="flex items-center gap-2">

                    <Link
                      to={`/student/applications/${app.id}`}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                      >
                        View Application
                      </Button>
                    </Link>

                    <Link
                      to={`/student/tracking/${app.id}`}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        Track Timeline
                      </Button>
                    </Link>

                  </div>

                  <Link to="/student/income-verification">

                    <Button
                      variant="saffron"
                      size="sm"
                      icon={ShieldCheck}
                    >
                      Verify Income
                    </Button>

                  </Link>

                </div>

              </div>

            </Card>

          ))}

        </div>
      )}

    </div>
  );
};

