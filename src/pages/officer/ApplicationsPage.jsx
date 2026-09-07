import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ClipboardList,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const API_BASE_URL = 'http://localhost:5000';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/applications`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch applications');
      }
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const normalizeStatus = (status) => {
    if (!status) return 'Submitted';
    const s = String(status).trim().toLowerCase();
    if (s === 'under_review' || s === 'under review') return 'Under Review';
    if (s === 'verification_pending' || s === 'verification pending') return 'Verification Pending';
    if (s === 'approved') return 'Approved';
    if (s === 'rejected') return 'Rejected';
    if (s === 'submitted') return 'Submitted';
    return status;
  };

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (app.application_id && app.application_id.toLowerCase().includes(q)) ||
        (app.student_id && String(app.student_id).toLowerCase().includes(q)) ||
        (app.full_name && app.full_name.toLowerCase().includes(q)) ||
        (app.scholarship_name && app.scholarship_name.toLowerCase().includes(q));

      const appStatus = normalizeStatus(app.status);
      const matchesStatus =
        filterStatus === 'ALL' ||
        appStatus.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, filterStatus]);

  const getStatusBadge = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'Approved':
        return 'bg-emerald-900/60 text-emerald-300 border border-emerald-700';
      case 'Rejected':
        return 'bg-rose-900/60 text-rose-300 border border-rose-700';
      case 'Under Review':
        return 'bg-amber-900/60 text-amber-300 border border-amber-700';
      case 'Verification Pending':
        return 'bg-purple-900/60 text-purple-300 border border-purple-700';
      case 'Submitted':
      default:
        return 'bg-blue-900/60 text-blue-300 border border-blue-700';
    }
  };

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
              Department Operations
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">Application Review Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review, evaluate, and manage scholarship applications submitted through the National Education Scholarship Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-800 bg-rose-950/40 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Error loading applications</p>
            <p className="mt-0.5 text-rose-300/80">{error}</p>
          </div>
          <button
            type="button"
            onClick={fetchApplications}
            className="underline font-bold text-rose-300 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Application ID, Student ID, or Student Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-md focus:border-amber-500 font-bold"
          >
            <option value="ALL">All ({applications.length})</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Verification Pending">Verification Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading applications from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300 mt-3">No applications found</p>
            <p className="text-xs text-slate-500 mt-1">
              {search || filterStatus !== 'ALL'
                ? 'Try adjusting your search criteria or status filter.'
                : 'No student applications have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Application ID</th>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Scholarship Scheme</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitted Date</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/60 transition">
                    <td className="px-5 py-4 font-mono font-bold text-amber-400">
                      {app.application_id || `APP#${app.id}`}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-white block">
                        {app.full_name || 'Unknown Student'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {app.student_id}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs text-slate-300">
                      {app.scholarship_name || 'Scholarship'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {normalizeStatus(app.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(app.submitted_at || app.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/officer/review/${app.id}`}>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
