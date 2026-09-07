import React, { useEffect, useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  Check,
  Building
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const API_BASE_URL = 'http://localhost:5000';

export const VerificationRequestsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/officer/verifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch verification records');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch verifications');
      }
      setVerifications(data.verifications || []);
    } catch (err) {
      console.error('Fetch verifications error:', err);
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleProcessVerification = async (id, action) => {
    try {
      setProcessingId(id);
      setSuccessMessage('');
      const response = await fetch(`${API_BASE_URL}/api/income-verification/${id}/process`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${action.toLowerCase()} verification`);
      }

      setSuccessMessage(`Verification record #${id} marked as ${action}. Student notified.`);
      await fetchVerifications();
    } catch (err) {
      console.error('Process verification error:', err);
      alert(err.message || 'Error processing verification');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (v.request_id && v.request_id.toLowerCase().includes(q)) ||
        (v.application_number && v.application_number.toLowerCase().includes(q)) ||
        (v.student_code && v.student_code.toLowerCase().includes(q)) ||
        (v.student_name && v.student_name.toLowerCase().includes(q));

      const vStatus = String(v.verification_status || 'Pending').toLowerCase();
      const matchesStatus =
        filterStatus === 'ALL' ||
        vStatus === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [verifications, search, filterStatus]);

  const formatDate = (dateValue) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-950 text-white rounded-xl border border-slate-800 p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Portal Verification Desk
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">Income Verification Requests</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process student family income verification records using the Education Scholarship Portal Verification Service.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchVerifications}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl border border-emerald-700 bg-emerald-950/80 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error loading verifications</p>
            <p className="mt-0.5 text-rose-300/80">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchVerifications}
            className="underline font-bold text-rose-300 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Request ID, Application ID, Student ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-md focus:border-amber-500 font-bold"
          >
            <option value="ALL">All ({verifications.length})</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading verification records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300 mt-3">No verification records found</p>
            <p className="text-xs text-slate-500 mt-1">
              {search || filterStatus !== 'ALL'
                ? 'Try adjusting your search criteria or filter.'
                : 'No income verification records recorded yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Request ID</th>
                  <th className="px-5 py-3.5">Application ID</th>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Annual Income</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5">Verified Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((v) => {
                  const isPending = (v.verification_status || '').toLowerCase() === 'pending';
                  const isVerified = (v.verification_status || '').toLowerCase() === 'verified';
                  const isRejected = (v.verification_status || '').toLowerCase() === 'rejected';

                  return (
                    <tr key={v.id} className="hover:bg-slate-900/60 transition">
                      <td className="px-5 py-4 font-mono font-bold text-amber-400">
                        {v.request_id}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {v.application_number || `APP#${v.application_id}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-white block">
                          {v.student_name || 'Unknown Student'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {v.student_code}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-400">
                        ₹{Number(v.annual_income || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            isVerified
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : isRejected
                              ? 'bg-rose-950 text-rose-300 border border-rose-700'
                              : 'bg-amber-950 text-amber-300 border border-amber-700'
                          }`}
                        >
                          {v.verification_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {formatDate(v.created_at)}
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {formatDate(v.verified_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={processingId === v.id || isVerified}
                            onClick={() => handleProcessVerification(v.id, 'Verified')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 disabled:opacity-40 transition"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            disabled={processingId === v.id || isRejected}
                            onClick={() => handleProcessVerification(v.id, 'Rejected')}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 disabled:opacity-40 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
