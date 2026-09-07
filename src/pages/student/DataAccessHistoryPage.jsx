import React, { useEffect, useMemo, useState } from 'react';
import {
  History,
  ShieldCheck,
  Eye,
  Lock,
  Building,
  Calendar,
  CheckCircle2,
  Clock3,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

const API_BASE_URL = 'http://localhost:5000';

export const DataAccessHistoryPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [historyData, setHistoryData] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [loadingApplications, setLoadingApplications] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [error, setError] = useState('');

  // ---------------------------------------------------------
  // STEP 1: Get student's applications
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoadingApplications(true);
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/applications`);

        if (!response.ok) {
          throw new Error('Unable to fetch applications');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Unable to fetch applications');
        }

        const applicationList = data.applications || [];

        setApplications(applicationList);

        if (applicationList.length > 0) {
          // Use the latest application
          const latestApplication = [...applicationList].sort(
            (a, b) => Number(b.id) - Number(a.id)
          )[0];

          setSelectedApplication(latestApplication);
        }
      } catch (err) {
        console.error('Applications fetch error:', err);
        setError('Unable to load your application information.');
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, []);

  // ---------------------------------------------------------
  // STEP 2: Get verification history for selected application
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchVerificationHistory = async () => {
      if (!selectedApplication?.id) {
        return;
      }

      try {
        setLoadingHistory(true);
        setError('');

        const response = await fetch(
          `${API_BASE_URL}/api/verification-history/${selectedApplication.id}`
        );

        if (!response.ok) {
          throw new Error('Unable to fetch verification history');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || 'Unable to fetch verification history'
          );
        }

        setHistoryData(data);
      } catch (err) {
        console.error('Verification history fetch error:', err);
        setHistoryData(null);
        setError('Unable to load verification history.');
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchVerificationHistory();
  }, [selectedApplication]);

  // ---------------------------------------------------------
  // STEP 3: Create a unified history list
  // ---------------------------------------------------------
  const historyRecords = useMemo(() => {
    if (!historyData) {
      return [];
    }

    const records = [];

    // Application status history
    if (Array.isArray(historyData.statusHistory)) {
      historyData.statusHistory.forEach((item) => {
        records.push({
          id: `status-${item.id}`,
          requestId: historyData.application?.application_id || 'N/A',
          requester: 'Education Scholarship Portal',
          dataRequested: 'Application Status',
          purpose: 'Scholarship Application Processing',
          provider: 'Education Scholarship Portal',
          date: item.changed_at,
          status: item.status,
          type: 'status',
          details: item.remarks || 'Application status updated.',
          raw: item
        });
      });
    }

    // Income verification
    if (historyData.incomeVerification) {
      const income = historyData.incomeVerification;

      records.push({
        id: `income-${income.id}`,
        requestId: income.request_id || 'N/A',
        requester: 'Education Scholarship Portal',
        dataRequested: 'Annual Family Income',
        purpose: 'Scholarship Eligibility Verification',
        provider:
          income.source_department || 'Education Scholarship Portal',
        date: income.verified_at || income.created_at,
        status: income.verification_status || 'Pending',
        type: 'income',
        details:
          income.verification_status === 'Verified'
            ? 'Income verification completed.'
            : 'Income verification request is pending.',
        raw: income
      });
    }

    // Consent history
    if (Array.isArray(historyData.consents)) {
      historyData.consents.forEach((consent) => {
        records.push({
          id: `consent-${consent.id}`,
          requestId: consent.consent_id || 'N/A',
          requester: consent.provider_department || 'Education Scholarship Portal',
          dataRequested: consent.data_requested || 'Annual Family Income',
          purpose:
            consent.purpose || 'Scholarship Eligibility Verification',
          provider:
            consent.provider_department || 'Education Scholarship Portal',
          date: consent.granted_at || consent.requested_at,
          status: consent.status || 'Pending',
          type: 'consent',
          details:
            consent.status === 'Granted'
              ? 'Consent has been granted.'
              : consent.status === 'Revoked'
                ? 'Consent has been revoked.'
                : 'Consent request is pending.',
          raw: consent
        });
      });
    }

    // Sort newest first
    return records.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      return dateB - dateA;
    });
  }, [historyData]);

  // ---------------------------------------------------------
  // STEP 4: Formatting helpers
  // ---------------------------------------------------------
  const formatDate = (dateValue) => {
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

  const getStatusVariant = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (
      normalized === 'verified' ||
      normalized === 'granted' ||
      normalized === 'approved' ||
      normalized === 'success' ||
      normalized === 'completed'
    ) {
      return 'success';
    }

    if (
      normalized === 'pending' ||
      normalized === 'submitted' ||
      normalized === 'under review'
    ) {
      return 'warning';
    }

    if (
      normalized === 'rejected' ||
      normalized === 'revoked' ||
      normalized === 'failed'
    ) {
      return 'danger';
    }

    return 'primary';
  };

  const getDisplayStatus = (status) => {
    if (!status) {
      return 'Pending';
    }

    const normalized = String(status).toLowerCase();

    if (normalized === 'success') {
      return 'VERIFIED';
    }

    return String(status).toUpperCase();
  };

  // ---------------------------------------------------------
  // STEP 5: Loading state
  // ---------------------------------------------------------
  if (loadingApplications) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <Clock3 className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-semibold">
              Loading verification history...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // STEP 6: Main page
  // ---------------------------------------------------------
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gov" size="sm">
              Audit Log
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Income Verification & Consent History
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            View the verification, consent, and application activity recorded
            for your scholarship application.
          </p>
        </div>

        {selectedApplication && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Application
            </p>

            <p className="text-sm font-bold text-gov-primary font-mono">
              {selectedApplication.application_id}
            </p>
          </div>
        )}
      </div>

      {/* Application selector */}
      {applications.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Application
          </label>

          <select
            value={selectedApplication?.id || ''}
            onChange={(e) => {
              const application = applications.find(
                (item) => String(item.id) === String(e.target.value)
              );

              setSelectedApplication(application || null);
            }}
            className="w-full sm:max-w-md border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          >
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.application_id} - {application.scholarship_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

          <div>
            <p className="text-sm font-bold text-red-900">
              Unable to load information
            </p>

            <p className="text-xs text-red-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50/80 rounded-xl border border-blue-200 p-4 text-xs text-blue-950 flex items-start gap-3">
        <Lock className="w-5 h-5 text-gov-primary shrink-0 mt-0.5" />

        <div className="space-y-0.5">
          <p className="font-bold">
            Verification Activity Transparency
          </p>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            Verification and consent activities associated with your
            scholarship application are recorded with their status, purpose,
            and timestamps for transparency.
          </p>
        </div>
      </div>

      {/* Application summary */}
      {selectedApplication && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck2 className="w-5 h-5 text-gov-primary" />

            <h2 className="text-sm font-black text-slate-900">
              Application Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Application ID
              </p>

              <p className="text-sm font-bold font-mono text-gov-primary mt-1">
                {selectedApplication.application_id}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Scholarship
              </p>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {selectedApplication.scholarship_name || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Student
              </p>

              <p className="text-sm font-semibold text-slate-800 mt-1">
                {selectedApplication.full_name || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Current Status
              </p>

              <div className="mt-1">
                <Badge
                  variant={getStatusVariant(selectedApplication.status)}
                  size="sm"
                >
                  {getDisplayStatus(selectedApplication.status)}
                </Badge>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Loading history */}
      {loadingHistory && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <Clock3 className="w-5 h-5 animate-pulse" />

            <span className="text-xs font-semibold">
              Fetching records from the scholarship portal...
            </span>
          </div>
        </div>
      )}

      {/* No application */}
      {!selectedApplication && !loadingHistory && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs text-center">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <h2 className="text-sm font-bold text-slate-800">
            No application found
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Verification history will appear here after you submit a
            scholarship application.
          </p>
        </div>
      )}

      {/* History table */}
      {selectedApplication && !loadingHistory && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Activity History
              </h2>

              <p className="text-[11px] text-slate-500 mt-0.5">
                Recorded activities for {selectedApplication.application_id}
              </p>
            </div>

            <History className="w-5 h-5 text-slate-400" />
          </div>

          {historyRecords.length === 0 ? (
            <div className="p-8 text-center">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="text-sm font-bold text-slate-700">
                No history records available
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Activity will appear here as your application progresses.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">
                      Reference ID
                    </th>

                    <th className="px-5 py-3.5">
                      Requester
                    </th>

                    <th className="px-5 py-3.5">
                      Data / Activity
                    </th>

                    <th className="px-5 py-3.5">
                      Purpose
                    </th>

                    <th className="px-5 py-3.5">
                      Provider
                    </th>

                    <th className="px-5 py-3.5">
                      Date
                    </th>

                    <th className="px-5 py-3.5">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">

                  {historyRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 transition"
                    >

                      {/* Reference */}
                      <td className="px-5 py-4 font-mono font-bold text-gov-primary whitespace-nowrap">
                        {record.requestId}
                      </td>

                      {/* Requester */}
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-600" />

                          <span>
                            {record.requester}
                          </span>
                        </div>
                      </td>

                      {/* Data */}
                      <td className="px-5 py-4 font-bold text-emerald-800">
                        {record.dataRequested}
                      </td>

                      {/* Purpose */}
                      <td className="px-5 py-4 text-slate-600 max-w-xs">
                        <span className="line-clamp-2">
                          {record.purpose}
                        </span>
                      </td>

                      {/* Provider */}
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

                          <span>
                            {record.provider}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />

                          <span>
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <Badge
                          variant={getStatusVariant(record.status)}
                          size="sm"
                        >
                          {getDisplayStatus(record.status)}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                          icon={Eye}
                        >
                          View Record
                        </Button>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Verification Record Summary"
          subtitle={`Reference Number: ${selectedRecord.requestId}`}
          maxWidth="max-w-md"
        >

          <div className="space-y-4 text-xs">

            {/* Status box */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">

              <div className="flex items-center justify-between">

                <span className="font-bold text-slate-900">
                  Record Status
                </span>

                <Badge
                  variant={getStatusVariant(selectedRecord.status)}
                  size="sm"
                >
                  {getDisplayStatus(selectedRecord.status)}
                </Badge>

              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                <span>
                  {selectedRecord.details}
                </span>
              </div>

            </div>

            {/* Record details */}
            <div className="space-y-2 divide-y divide-slate-100">

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Reference ID:
                </span>

                <span className="font-bold text-slate-800 font-mono text-right">
                  {selectedRecord.requestId}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Activity:
                </span>

                <span className="font-bold text-slate-800 text-right">
                  {selectedRecord.dataRequested}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Requester:
                </span>

                <span className="font-bold text-slate-800 text-right">
                  {selectedRecord.requester}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Purpose:
                </span>

                <span className="text-slate-800 text-right">
                  {selectedRecord.purpose}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Provider:
                </span>

                <span className="font-bold text-slate-800 text-right">
                  {selectedRecord.provider}
                </span>
              </div>

              <div className="flex justify-between gap-4 py-1.5">
                <span className="text-slate-500">
                  Date:
                </span>

                <span className="text-slate-800 text-right">
                  {formatDate(selectedRecord.date)}
                </span>
              </div>

            </div>

            {/* Income details */}
            {selectedRecord.type === 'income' &&
              selectedRecord.raw?.annual_income !== null &&
              selectedRecord.raw?.annual_income !== undefined && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">

                  <p className="text-[10px] uppercase tracking-wider font-bold text-blue-700">
                    Recorded Annual Income
                  </p>

                  <p className="text-xl font-black text-blue-950 mt-1">
                    {selectedRecord.raw.currency || 'INR'}{' '}
                    {Number(
                      selectedRecord.raw.annual_income
                    ).toLocaleString('en-IN')}
                  </p>

                </div>
              )}

            {/* Consent details */}
            {selectedRecord.type === 'consent' && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">

                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">
                  Consent Information
                </p>

                <p className="text-xs text-emerald-900 mt-1">
                  Data requested:{' '}
                  <strong>
                    {selectedRecord.raw?.data_requested ||
                      selectedRecord.dataRequested}
                  </strong>
                </p>

                <p className="text-xs text-emerald-900 mt-1">
                  Consent status:{' '}
                  <strong>
                    {selectedRecord.raw?.status ||
                      selectedRecord.status}
                  </strong>
                </p>

              </div>
            )}

            {/* Close */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </Button>
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
};