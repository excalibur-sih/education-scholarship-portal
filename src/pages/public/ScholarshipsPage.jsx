import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card, CardContent } from '../../components/common/Card';

const API_BASE_URL = 'http://localhost:5000';

const formatDate = (date) => {
  if (!date) return 'Not specified';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not specified';
  }

  return `₹${Number(value).toLocaleString('en-IN')}`;
};

const parseList = (value) => {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getStatus = (deadline) => {
  if (!deadline) return 'OPEN';

  const today = new Date();
  const deadlineDate = new Date(deadline);

  const difference =
    deadlineDate.getTime() - today.getTime();

  const daysRemaining =
    difference / (1000 * 60 * 60 * 24);

  if (daysRemaining < 0) {
    return 'CLOSED';
  }

  if (daysRemaining <= 30) {
    return 'CLOSING_SOON';
  }

  return 'OPEN';
};

export const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('deadline');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch scholarships from backend
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_BASE_URL}/api/scholarships`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to fetch scholarships'
          );
        }

        setScholarships(data.scholarships || []);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError(
          err.message ||
          'Unable to load scholarship schemes.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const filteredScholarships = useMemo(() => {
    return scholarships
      .map((s) => ({
        ...s,

        courses: parseList(s.eligible_courses),
        years: parseList(s.eligible_years),

        status: getStatus(s.application_deadline),

        minPercentage: Number(s.minimum_percentage || 0),
        incomeLimit: Number(s.family_income_limit || 0),

        deadline: formatDate(s.application_deadline),
      }))
      .filter((s) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
          !search ||
          s.name?.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search) ||
          s.scholarship_id?.toLowerCase().includes(search) ||
          s.eligible_courses?.toLowerCase().includes(search) ||
          s.eligible_years?.toLowerCase().includes(search);

        const matchesCourse =
          selectedCourse === 'ALL' ||
          s.courses.some((course) =>
            course
              .toLowerCase()
              .includes(selectedCourse.toLowerCase())
          );

        const matchesStatus =
          selectedStatus === 'ALL' ||
          s.status === selectedStatus;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (sortBy === 'income') {
          return a.incomeLimit - b.incomeLimit;
        }

        if (sortBy === 'percentage') {
          return a.minPercentage - b.minPercentage;
        }

        if (sortBy === 'amount') {
          return 0;
        }

        return (
          new Date(a.application_deadline) -
          new Date(b.application_deadline)
        );
      });
  }, [
    scholarships,
    searchTerm,
    selectedCourse,
    selectedStatus,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-primary to-blue-900 text-white rounded-xl p-6 shadow-sm">
        <div className="max-w-2xl">
          <Badge
            variant="saffron"
            size="sm"
            className="bg-amber-400 text-slate-950 font-bold mb-2"
          >
            Scholarship Schemes Directory
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Available Scholarships & Financial Grants
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Discover active government scholarship schemes and
            apply for financial assistance through the National
            Education Scholarship Portal.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search by scholarship name, scheme code, or eligibility keywords..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">

          {/* Course */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Eligible Course
            </label>

            <select
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">
                All Courses
              </option>

              <option value="B.Tech">
                Engineering (B.Tech / B.E.)
              </option>

              <option value="B.Sc">
                Science (B.Sc)
              </option>

              <option value="B.Com">
                Commerce (B.Com)
              </option>

              <option value="B.A">
                Arts (B.A)
              </option>

              <option value="Diploma">
                Polytechnic Diploma
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Application Status
            </label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value)
              }
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="OPEN">
                Open for Applications
              </option>

              <option value="CLOSING_SOON">
                Closing Soon
              </option>

              <option value="CLOSED">
                Closed
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600"
            >
              <option value="deadline">
                Application Deadline
              </option>

              <option value="income">
                Income Limit (Low to High)
              </option>

              <option value="percentage">
                Minimum Marks Required
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />

          <p className="text-sm">
            Loading scholarship schemes...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          <strong>Unable to load scholarships.</strong>

          <p className="mt-1">
            {error}
          </p>

          <p className="mt-2 text-xs">
            Make sure the backend server is running on
            port 5000.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Showing{' '}
              <strong className="text-slate-900">
                {filteredScholarships.length}
              </strong>{' '}
              scholarship schemes
            </span>

            <span className="text-[11px] text-slate-400">
              Academic Year 2026-2027
            </span>
          </div>

          {/* Scholarship Cards */}
          {filteredScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {filteredScholarships.map((s) => (
                <Card
                  key={s.scholarship_id}
                  hover
                  className="flex flex-col justify-between"
                >
                  <CardContent className="space-y-4">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <div className="flex items-center gap-2 mb-1">

                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {s.scholarship_id}
                          </span>

                          <Badge
                            variant="gov"
                            size="sm"
                          >
                            Government Scheme
                          </Badge>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {s.name}
                        </h3>
                      </div>

                      <Badge
                        variant={
                          s.status === 'OPEN'
                            ? 'success'
                            : s.status === 'CLOSING_SOON'
                              ? 'warning'
                              : 'secondary'
                        }
                        size="sm"
                      >
                        {s.status === 'CLOSING_SOON'
                          ? 'CLOSING SOON'
                          : s.status}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.description}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Benefits
                        </span>

                        <p className="font-extrabold text-slate-900 text-sm">
                          {s.benefits || 'As per scheme'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Max Family Income
                        </span>

                        <p className="font-bold text-emerald-800">
                          ≤ {formatCurrency(s.family_income_limit)}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Min. Percentage
                        </span>

                        <p className="font-semibold text-slate-800">
                          {s.minimum_percentage}% marks
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          Deadline
                        </span>

                        <p className="font-bold text-rose-600">
                          {s.deadline}
                        </p>
                      </div>
                    </div>

                    {/* Eligible Courses */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Eligible Courses:
                      </span>

                      <div className="flex flex-wrap gap-1 mt-1">

                        {s.courses.map((course, index) => (
                          <span
                            key={index}
                            className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100 font-medium"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Eligible Years */}
                    {s.years.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Eligible Years:
                        </span>

                        <span className="text-[11px] text-slate-700 ml-1">
                          {s.years.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Required Documents */}
                    {s.required_documents && (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Required Documents:
                        </span>

                        <p className="text-[11px] text-slate-600 mt-1">
                          {s.required_documents}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  {/* Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">

                    <Link
                      to={`/scholarships/${s.scholarship_id}`}
                      className="w-1/2"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </Link>

                    <Link
                      to={`/student/apply?scholarshipId=${s.scholarship_id}`}
                      className="w-1/2"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">
                No scholarship schemes found.
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
