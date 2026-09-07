import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  FileText,
  User,
  GraduationCap,
  Users,
  Award,
  Calendar,
  AlertCircle,
  RefreshCw,
  Send,
  History,
  Check,
  Building
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const API_BASE_URL = 'http://localhost:5000';

export const ApplicationReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status transition form state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Processing specific document or income verification
  const [processingDocId, setProcessingDocId] = useState(null);
  const [processingIncome, setProcessingIncome] = useState(false);

  const fetchDossier = async () => {
    try {
      setLoading(true);
      setError('');
      setActionSuccess('');

      const response = await fetch(`${API_BASE_URL}/api/applications/${id}`);
      if (!response.ok) {
        throw new Error('Application dossier not found or failed to load');
      }

      const data = await response.json();
      if (!data.success || !data.application) {
        throw new Error(data.message || 'Unable to load application dossier');
      }

      setDossier(data.application);
      setSelectedStatus(data.application.status || 'Under Review');
    } catch (err) {
      console.error('Fetch dossier error:', err);
      setError(err.message || 'Error fetching application dossier');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDossier();
    }
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedStatus) return;

    try {
      setUpdatingStatus(true);
      setActionSuccess('');

      const response = await fetch(`${API_BASE_URL}/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          remarks: remarks.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update application status');
      }

      setActionSuccess(`Application status successfully updated to "${selectedStatus}". Status history and student notification have been recorded.`);
      setRemarks('');
      await fetchDossier();
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDocumentVerify = async (docId, newStatus) => {
    try {
      setProcessingDocId(docId);
      const response = await fetch(`${API_BASE_URL}/api/documents/${docId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update document status');
      }

      await fetchDossier();
    } catch (err) {
      console.error('Doc verify error:', err);
      alert(err.message || 'Failed to update document');
    } finally {
      setProcessingDocId(null);
    }
  };

  const handleIncomeVerify = async (incomeId, newStatus) => {
    try {
      setProcessingIncome(true);
      const response = await fetch(`${API_BASE_URL}/api/income-verification/${incomeId}/process`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newStatus })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to process income verification');
      }

      await fetchDossier();
    } catch (err) {
      console.error('Income verify error:', err);
      alert(err.message || 'Failed to process income verification');
    } finally {
      setProcessingIncome(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not available';
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return 'Not available';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const s = String(status || '').trim().toLowerCase();
    if (s === 'approved') return 'bg-emerald-950 text-emerald-300 border border-emerald-700';
    if (s === 'rejected') return 'bg-rose-950 text-rose-300 border border-rose-700';
    if (s === 'under review' || s === 'under_review') return 'bg-amber-950 text-amber-300 border border-amber-700';
    if (s === 'verification pending' || s === 'verification_pending') return 'bg-purple-950 text-purple-300 border border-purple-700';
    return 'bg-blue-950 text-blue-300 border border-blue-700';
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        <p className="text-sm text-slate-400 mt-3">Loading application dossier from database...</p>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/officer/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications Queue</span>
        </button>
        <div className="p-6 bg-slate-950 rounded-xl border border-rose-800 text-rose-300 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>Unable to load application dossier</span>
          </div>
          <p className="mt-1 text-rose-300/80">{error || 'Application not found'}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDossier}
            className="mt-4 bg-slate-900 border-slate-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const latestIncome = dossier.latestIncomeVerification;
  const consents = dossier.consents || [];
  const documents = dossier.documents || [];
  const statusHistory = dossier.statusHistory || [];

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/officer/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications Queue</span>
        </button>

        <button
          onClick={fetchDossier}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Dossier</span>
        </button>
      </div>

      {/* Header Summary Banner */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded border border-slate-700">
              {dossier.application_id || `APP#${dossier.id}`}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${getStatusBadgeClass(dossier.status)}`}>
              {dossier.status}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">{dossier.scholarship_name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Applicant: <span className="text-white font-semibold">{dossier.full_name}</span> ({dossier.student_code || dossier.student_id}) • Submitted: {formatDate(dossier.submitted_at || dossier.created_at)}
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 text-left min-w-[200px]">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Dossier Status</span>
          <p className="text-sm font-bold text-amber-400 mt-0.5">{dossier.status}</p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Last Updated: {formatDate(dossier.updated_at)}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl border border-emerald-700 bg-emerald-950/80 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Grid of Dossier Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-300">
        {/* 1. STUDENT DETAILS */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Student Details
            </h2>
          </div>
          <div className="space-y-2 divide-y divide-slate-900">
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Student ID / Code:</span>
              <span className="font-mono font-bold text-white">{dossier.student_code || dossier.student_id}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Citizen ID:</span>
              <span className="font-mono font-bold text-white">{dossier.citizen_id || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Full Name:</span>
              <span className="font-bold text-white">{dossier.full_name}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Date of Birth:</span>
              <span className="text-slate-200">{dossier.date_of_birth ? new Date(dossier.date_of_birth).toLocaleDateString('en-IN') : '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Gender:</span>
              <span className="text-slate-200">{dossier.gender || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Mobile:</span>
              <span className="font-mono text-slate-200">{dossier.mobile || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200">{dossier.email || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Address / City:</span>
              <span className="text-slate-200">{dossier.city_village || '—'}, {dossier.district || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">State / PIN Code:</span>
              <span className="text-slate-200">{dossier.state || '—'} - {dossier.pin_code || '—'}</span>
            </div>
          </div>
        </div>

        {/* 2. ACADEMIC DETAILS */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Academic Details
            </h2>
          </div>
          <div className="space-y-2 divide-y divide-slate-900">
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Institute / College:</span>
              <span className="font-medium text-white text-right max-w-[240px]">{dossier.institute || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">University:</span>
              <span className="text-slate-200 text-right max-w-[240px]">{dossier.university || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Enrolled Course:</span>
              <span className="font-medium text-white">{dossier.course || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Branch / Specialization:</span>
              <span className="text-slate-200">{dossier.branch || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Year / Semester:</span>
              <span className="text-slate-200">{dossier.year || '—'} / Sem {dossier.semester || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Enrollment / Roll No:</span>
              <span className="font-mono text-slate-200">{dossier.enrollment_number || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Qualifying Percentage:</span>
              <span className="font-bold text-emerald-400">{dossier.percentage ? `${dossier.percentage}%` : '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Cumulative CGPA:</span>
              <span className="font-bold text-emerald-400">{dossier.cgpa || '—'}</span>
            </div>
          </div>
        </div>

        {/* 3. FAMILY DETAILS */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Users className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Family Details
            </h2>
          </div>
          <div className="space-y-2 divide-y divide-slate-900">
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Guardian / Parent Name:</span>
              <span className="font-bold text-white">{dossier.guardian_name || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Family Size:</span>
              <span className="text-slate-200">{dossier.family_size ? `${dossier.family_size} Members` : '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Guardian Occupation:</span>
              <span className="text-slate-200">{dossier.guardian_occupation || '—'}</span>
            </div>
          </div>
        </div>

        {/* 4. SCHOLARSHIP SCHEME CRITERIA */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Scholarship Scheme Details
            </h2>
          </div>
          <div className="space-y-2 divide-y divide-slate-900">
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Scheme Code:</span>
              <span className="font-mono text-amber-400 font-bold">{dossier.scholarship_code || '—'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Minimum Academic %:</span>
              <span className="text-slate-200">{dossier.minimum_percentage ? `${dossier.minimum_percentage}%` : 'Not specified'}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Family Income Limit:</span>
              <span className="text-slate-200">
                {dossier.family_income_limit ? `₹${Number(dossier.family_income_limit).toLocaleString('en-IN')}` : 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-slate-400">Benefits:</span>
              <span className="text-emerald-400 text-right max-w-[240px]">{dossier.benefits || 'Standard scholarship benefit'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INCOME VERIFICATION SECTION */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Current Verification Service
              </span>
              <h2 className="text-base font-bold text-white">Income Verification Status</h2>
            </div>
          </div>

          {latestIncome && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">
                Request ID: {latestIncome.request_id}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                latestIncome.verification_status === 'Verified'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : latestIncome.verification_status === 'Rejected'
                  ? 'bg-rose-950 text-rose-300 border border-rose-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}>
                {latestIncome.verification_status || 'Pending'}
              </span>
            </div>
          )}
        </div>

        {latestIncome ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Declared Annual Family Income</span>
              <p className="text-lg font-black text-emerald-400 mt-1">
                ₹{Number(latestIncome.annual_income || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Verification Provider</span>
              <p className="text-xs font-semibold text-slate-200 mt-1">
                {latestIncome.source_department || 'Education Scholarship Portal'}
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Created Date</span>
              <p className="text-xs font-mono text-slate-300 mt-1">
                {formatDate(latestIncome.created_at)}
              </p>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Verification Action</span>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="success"
                  size="sm"
                  disabled={processingIncome || latestIncome.verification_status === 'Verified'}
                  onClick={() => handleIncomeVerify(latestIncome.id, 'Verified')}
                  className="text-[11px] py-1 px-2.5"
                >
                  Verify
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={processingIncome || latestIncome.verification_status === 'Rejected'}
                  onClick={() => handleIncomeVerify(latestIncome.id, 'Rejected')}
                  className="text-[11px] py-1 px-2.5"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            No income verification record requested yet for this application.
          </p>
        )}
      </div>

      {/* 6. UPLOADED DOCUMENTS SECTION */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              5. Uploaded Documents ({documents.length})
            </h2>
          </div>
        </div>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 italic">
            No documents uploaded yet for this application.
          </p>
        ) : (
          <div className="space-y-2.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{doc.document_type}</span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      File: {doc.file_name || 'Uploaded File'} • Uploaded: {formatDate(doc.uploaded_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.verification_status === 'Verified'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : doc.verification_status === 'Rejected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {doc.verification_status || 'Pending'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={processingDocId === doc.id || doc.verification_status === 'Verified'}
                      onClick={() => handleDocumentVerify(doc.id, 'Verified')}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 disabled:opacity-40 transition"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      disabled={processingDocId === doc.id || doc.verification_status === 'Rejected'}
                      onClick={() => handleDocumentVerify(doc.id, 'Rejected')}
                      className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 disabled:opacity-40 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. CITIZEN CONSENT */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            6. Citizen Consent Record
          </h2>
        </div>

        {consents.length === 0 ? (
          <p className="text-xs text-slate-500 py-2 italic">
            No specific consent authorization record filed yet.
          </p>
        ) : (
          <div className="space-y-2">
            {consents.map((con) => (
              <div
                key={con.id}
                className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{con.data_requested || 'Eligibility Verification'}</span>
                    <span className="font-mono text-[10px] text-amber-400">({con.consent_id})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Purpose: {con.purpose} • Provider: {con.provider_department || 'Education Scholarship Portal'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    {con.status || 'Granted'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(con.granted_at || con.requested_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. APPLICATION STATUS WORKFLOW & OFFICER DECISION */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Action Console
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Application Status Workflow & Decision
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Update application status. Every status change updates the database, creates an audit row in application status history, and generates a notification for the student.
          </p>
        </div>

        <form onSubmit={handleStatusUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Application Status <span className="text-amber-400">*</span>
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg focus:border-amber-500 font-bold"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Verification Pending">Verification Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Officer Remarks (Saved to history & sent to student)
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Academic and income verification checked. Approved for DBT benefit."
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={updatingStatus}
              icon={Send}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {updatingStatus ? 'Updating Status...' : 'Apply Status Update & Notify Student'}
            </Button>
          </div>
        </form>
      </div>

      {/* 9. APPLICATION STATUS HISTORY TIMELINE */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <History className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            7. Application Status History ({statusHistory.length})
          </h2>
        </div>

        {statusHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-2 italic">
            No status history recorded yet.
          </p>
        ) : (
          <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {statusHistory.map((item, idx) => (
              <div key={item.id || idx} className="flex items-start gap-4 relative pl-8">
                <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                <div className="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-white">{item.status}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(item.changed_at)}
                    </span>
                  </div>
                  {item.remarks && (
                    <p className="text-slate-400 text-[11px] mt-1 italic">
                      "{item.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
