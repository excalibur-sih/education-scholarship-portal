import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Building, Calendar, Lock, XCircle, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

export const ConsentPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [existingConsent, setExistingConsent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rejected, setRejected] = useState(false);

  const studentId = user?.id || 'STU2026001';

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const appRes = await fetch(`${API_BASE_URL}/api/applications`);
      if (!appRes.ok) throw new Error('Failed to fetch applications');
      const appData = await appRes.json();

      if (appData.success && Array.isArray(appData.applications)) {
        const studentApps = appData.applications.filter(
          (a) => a.student_id === studentId || String(a.student_id) === String(user?.id)
        );
        setApplications(studentApps);

        const currentApp = studentApps[0] || appData.applications[0];
        if (currentApp) {
          setSelectedAppId(String(currentApp.id));
          await loadConsent(currentApp.id);
        }
      }
    } catch (err) {
      console.error('Consent load error:', err);
      setError(err.message || 'Unable to load consent details');
    } finally {
      setLoading(false);
    }
  };

  const loadConsent = async (appId) => {
    try {
      const consentRes = await fetch(`${API_BASE_URL}/api/consents/${appId}`);
      if (consentRes.ok) {
        const consentData = await consentRes.json();
        if (consentData.success && consentData.consents && consentData.consents.length > 0) {
          setExistingConsent(consentData.consents[0]);
        } else {
          setExistingConsent(null);
        }
      }
    } catch (err) {
      console.error('Load consent error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handleAppChange = (e) => {
    const newId = e.target.value;
    setSelectedAppId(newId);
    loadConsent(newId);
  };

  const handleAllow = async () => {
    if (!selectedAppId) {
      alert('Please select an active scholarship application first.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setRejected(false);

      const response = await fetch(`${API_BASE_URL}/api/consents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: Number(selectedAppId),
          dataRequested: 'Annual Family Income',
          purpose: 'Scholarship Eligibility Verification',
          providerDepartment: 'Current Verification Service'
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to record consent');
      }

      setExistingConsent(data.consent);

      addNotification({
        title: 'Consent Authorized',
        message: 'Digital consent recorded in the portal for scholarship eligibility verification.',
        type: 'SUCCESS'
      });
    } catch (err) {
      console.error('Record consent error:', err);
      setError(err.message || 'Failed to record consent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (!existingConsent?.id) return;

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/consents/${existingConsent.id}/revoke`, {
        method: 'PUT'
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to revoke consent');
      }

      setExistingConsent((prev) => prev ? { ...prev, status: 'Revoked' } : null);
      setRejected(true);

      addNotification({
        title: 'Consent Revoked',
        message: 'Your authorization for data verification has been revoked.',
        type: 'ALERT'
      });
    } catch (err) {
      console.error('Revoke consent error:', err);
      alert(err.message || 'Failed to revoke consent');
    } finally {
      setSubmitting(false);
    }
  };

  const isConsentGranted = existingConsent && existingConsent.status === 'Granted';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="gov" size="sm">Digital Consent Manager</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Citizen Consent for Income Verification
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explicit digital authorization recorded for the Education Scholarship Portal.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Application Selector if multiple */}
      {applications.length > 1 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <label className="font-bold text-slate-700">Select Application:</label>
          <select
            value={selectedAppId}
            onChange={handleAppChange}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-bold"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.application_id || `APP#${a.id}`} - {a.scholarship_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-gov-primary mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading consent status...</p>
        </div>
      ) : isConsentGranted ? (
        <div className="bg-emerald-50 rounded-xl border border-emerald-300 p-8 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-950">✓ Consent Granted Successfully</h2>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto leading-relaxed">
              Your digital authorization has been recorded in the scholarship database. The Education Scholarship Portal is authorized to verify your annual family income for scholarship eligibility.
            </p>
          </div>

          <div className="p-4 bg-white/90 rounded-lg border border-emerald-200 text-xs text-emerald-900 inline-block space-y-1">
            <div className="font-mono font-bold">
              Consent ID: {existingConsent.consent_id || 'CON-RECORDED'}
            </div>
            <div className="text-[11px] text-slate-500">
              Purpose: {existingConsent.purpose} • Provider: {existingConsent.provider_department || 'Current Verification Service'}
            </div>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link to="/student/income-verification">
              <Button variant="primary" size="md">
                Income Verification Status
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="md"
              disabled={submitting}
              onClick={handleRevoke}
              className="text-rose-700 hover:bg-rose-50"
            >
              Revoke Consent
            </Button>
          </div>
        </div>
      ) : rejected ? (
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-rose-950">Consent Declined or Revoked</h2>
          <p className="text-xs text-rose-800 max-w-md mx-auto">
            Without automated verification consent, income verification cannot be processed by the scholarship reviewing officer.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setRejected(false)}>
            Review Consent Request
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Top Banner */}
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-lg flex items-start gap-3 text-xs text-blue-950">
            <ShieldCheck className="w-5 h-5 text-gov-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Purpose-Specific Data Verification Request</p>
              <p className="text-slate-600 mt-0.5">
                The Education Scholarship Portal requests explicit digital authorization to verify your declared family income for scheme eligibility assessment.
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 divide-y divide-slate-200 text-xs">
            <div className="grid grid-cols-2 gap-2 pb-2.5">
              <span className="text-slate-500 font-semibold">Requester:</span>
              <span className="font-bold text-slate-800 text-right">Department of Higher Education</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5">
              <span className="text-slate-500 font-semibold">Data Item:</span>
              <span className="font-bold text-emerald-800 text-right">Annual Family Income</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5">
              <span className="text-slate-500 font-semibold">Purpose:</span>
              <span className="font-medium text-slate-800 text-right">Scholarship Eligibility Verification</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5">
              <span className="text-slate-500 font-semibold">Verification Provider:</span>
              <span className="font-bold text-slate-800 text-right">Current Verification Service</span>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2.5">
              <span className="text-slate-500 font-semibold">Portal Reference:</span>
              <span className="font-mono font-bold text-slate-800 text-right">
                {selectedAppId ? `APP#${selectedAppId}` : 'STU-PORTAL-REQ'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2.5">
              <span className="text-slate-500 font-semibold">Legal Standard:</span>
              <span className="text-slate-700 text-right">Digital Personal Data Protection</span>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Only your family income amount will be verified for scholarship eligibility determination.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setRejected(true)}
              disabled={submitting}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              onClick={handleAllow}
              disabled={submitting}
              icon={ShieldCheck}
            >
              {submitting ? 'Recording Consent...' : 'Authorize Consent'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
