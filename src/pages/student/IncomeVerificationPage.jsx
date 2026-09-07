import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const IncomeVerificationPage = () => {

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');

  const [verification, setVerification] = useState(null);

  const [annualIncome, setAnnualIncome] = useState('');

  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  useEffect(() => {

    const loadApplications = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/applications'
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || 'Unable to load applications'
          );
        }

        setApplications(data.applications || []);

        if (data.applications?.length > 0) {

          setSelectedApplication(
            String(data.applications[0].id)
          );

        }

      } catch (err) {

        console.error(
          'Application loading error:',
          err
        );

        setError(
          'Unable to load scholarship applications'
        );

      } finally {

        setLoading(false);

      }

    };

    loadApplications();

  }, []);

  // =====================================================
  // LOAD EXISTING VERIFICATION
  // =====================================================

  useEffect(() => {

    if (!selectedApplication) {

      setVerification(null);

      return;

    }

    const loadVerification = async () => {

      try {

        setError('');
        setMessage('');

        const response = await fetch(
          `http://localhost:5000/api/income-verification/${selectedApplication}`
        );

        const data = await response.json();

        if (!data.success) {

          throw new Error(
            data.message ||
            'Unable to load verification'
          );

        }

        setVerification(
          data.verification
        );

        if (
          data.verification?.annual_income !== null &&
          data.verification?.annual_income !== undefined
        ) {

          setAnnualIncome(
            String(
              data.verification.annual_income
            )
          );

        }

      } catch (err) {

        console.error(
          'Verification loading error:',
          err
        );

        setError(
          'Unable to load income verification status'
        );

      }

    };

    loadVerification();

  }, [selectedApplication]);

  // =====================================================
  // REQUEST VERIFICATION
  // =====================================================

  const handleRequestVerification = async () => {

    setMessage('');
    setError('');

    if (!selectedApplication) {

      setError(
        'Please select an application.'
      );

      return;

    }

    if (!annualIncome) {

      setError(
        'Please enter your annual family income.'
      );

      return;

    }

    try {

      setRequesting(true);

      const response = await fetch(
        'http://localhost:5000/api/income-verification',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            applicationId:
              Number(selectedApplication),

            annualIncome:
              Number(annualIncome)
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Unable to create verification request'
        );

      }

      setVerification(
        data.verification
      );

      setMessage(
        data.message ||
        'Income verification request created successfully.'
      );

    } catch (err) {

      console.error(
        'Income verification request error:',
        err
      );

      setError(
        err.message ||
        'Unable to create verification request'
      );

    } finally {

      setRequesting(false);

    }

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex items-center justify-center py-20">

        <div className="flex items-center gap-2 text-slate-600">

          <Loader2 className="w-5 h-5 animate-spin" />

          Loading income verification...

        </div>

      </div>

    );

  }

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const status =
    verification?.verification_status ||
    'Not Requested';

  const isVerified =
    status.toLowerCase() === 'verified';

  const isPending =
    status.toLowerCase() === 'pending';

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">

            <ShieldCheck className="w-6 h-6" />

          </div>

          <div>

            <h1 className="text-xl font-bold text-slate-900">

              Income Verification

            </h1>

            <p className="text-xs text-slate-500 mt-1">

              Submit an income verification request for your
              scholarship application.

            </p>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* APPLICATION */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <label className="block text-xs font-bold text-slate-700 mb-2">

          Select Scholarship Application

        </label>

        <select
          value={selectedApplication}
          onChange={(event) => {

            setSelectedApplication(
              event.target.value
            );

            setVerification(null);
            setMessage('');
            setError('');

          }}
          className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >

          {applications.length === 0 ? (

            <option value="">
              No applications available
            </option>

          ) : (

            applications.map((application) => (

              <option
                key={application.id}
                value={application.id}
              >

                {application.application_id}
                {' — '}
                {application.scholarship_name}

              </option>

            ))

          )}

        </select>

      </div>

      {/* ================================================= */}
      {/* INFORMATION */}
      {/* ================================================= */}

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">

        <div className="flex gap-3">

          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />

          <div>

            <h3 className="text-sm font-bold text-blue-900">

              Secure Income Verification

            </h3>

            <p className="text-xs text-blue-800 mt-1 leading-relaxed">

              Your income verification request is recorded
              against your scholarship application. External
              department integration can be connected to this
              verification workflow in the future.

            </p>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================= */}

      {message && (

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800 flex items-center gap-2">

          <CheckCircle2 className="w-5 h-5" />

          {message}

        </div>

      )}

      {/* ================================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================================= */}

      {error && (

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 flex items-center gap-2">

          <AlertCircle className="w-5 h-5" />

          {error}

        </div>

      )}

      {/* ================================================= */}
      {/* VERIFICATION STATUS */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100">

          <h3 className="text-sm font-bold text-slate-800">

            Verification Status

          </h3>

        </div>

        <div className="p-6">

          {verification ? (

            <div className="space-y-5">

              {/* Request ID */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase">

                    Verification Request ID

                  </p>

                  <p className="text-sm font-mono font-bold text-slate-900 mt-1">

                    {verification.request_id}

                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase">

                    Status

                  </p>

                  <div className="mt-1">

                    <Badge
                      variant={
                        isVerified
                          ? 'success'
                          : 'warning'
                      }
                      size="sm"
                    >

                      {isVerified ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}

                      {status}

                    </Badge>

                  </div>

                </div>

              </div>

              {/* Income */}

              <div>

                <p className="text-[10px] font-bold text-slate-400 uppercase">

                  Annual Family Income

                </p>

                <p className="text-lg font-black text-slate-900 mt-1">

                  ₹
                  {Number(
                    verification.annual_income || 0
                  ).toLocaleString('en-IN')}

                </p>

              </div>

              {/* Currency */}

              <div>

                <p className="text-[10px] font-bold text-slate-400 uppercase">

                  Currency

                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">

                  {verification.currency || 'INR'}

                </p>

              </div>

              {/* Source */}

              <div>

                <p className="text-[10px] font-bold text-slate-400 uppercase">

                  Current Verification Source

                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">

                  {verification.source_department ||
                    'Education Scholarship Portal'}

                </p>

              </div>

              {isPending && (

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900">

                  Your verification request has been created
                  and is currently pending.

                </div>

              )}

              {isVerified && (

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900">

                  Your income has been successfully verified.

                </div>

              )}

            </div>

          ) : (

            <div className="text-center py-8">

              <Clock className="w-10 h-10 mx-auto text-slate-300" />

              <p className="text-sm font-semibold text-slate-600 mt-3">

                Income verification not requested

              </p>

              <p className="text-xs text-slate-400 mt-1">

                Enter your annual family income below to
                create a verification request.

              </p>

            </div>

          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* REQUEST FORM */}
      {/* ================================================= */}

      {!isVerified && (

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-gov-primary">

            Create Verification Request

          </h3>

          <p className="text-xs text-slate-500 mt-1 mb-5">

            Provide the annual family income associated with
            this scholarship application.

          </p>

          <div>

            <label className="block text-xs font-semibold text-slate-700 mb-2">

              Annual Family Income (₹)

            </label>

            <input
              type="number"
              min="0"
              value={annualIncome}
              onChange={(event) =>
                setAnnualIncome(
                  event.target.value
                )
              }
              placeholder="Example: 250000"
              className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <div className="mt-5">

            <Button
              onClick={
                handleRequestVerification
              }
              disabled={
                requesting ||
                !selectedApplication
              }
            >

              {requesting ? (

                <>
                  <Loader2 className="w-4 h-4 animate-spin" />

                  Creating Request...

                </>

              ) : (

                <>
                  <ShieldCheck className="w-4 h-4" />

                  Request Income Verification

                </>

              )}

            </Button>

          </div>

        </div>

      )}

    </div>

  );

};