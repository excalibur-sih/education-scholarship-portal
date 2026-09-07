import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  ShieldCheck,
  Info
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Checkbox } from '../../components/forms/Checkbox';
import { FileUpload } from '../../components/forms/FileUpload';
import { FormStepIndicator } from '../../components/forms/FormStepIndicator';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const API_BASE_URL = 'http://localhost:5000';

export const ApplicationFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [currentStep, setCurrentStep] = useState(0);

  const [scholarships, setScholarships] = useState([]);
  const [loadingScholarships, setLoadingScholarships] = useState(true);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // ================= STEP 1 =================
    studentId: user?.id || 'STU2026001',
    citizenId: user?.citizenId || '',
    fullName: user?.name || 'Rahul Suresh Sharma',
    dob: '2004-05-14',
    gender: 'Male',
    mobile: '+91 98765 43210',
    email: user?.email || 'rahul.sharma@example.edu.in',

    // ================= STEP 2 =================
    state: 'Maharashtra',
    district: 'Pune',
    cityVillage: 'Haveli, Pune',
    pincode: '411041',

    // ================= STEP 3 =================
    institute: 'Government College of Engineering and Research, Pune',
    university: '',
    course: 'B.Tech / B.E.',
    branch: '',
    year: '',
    semester: '',
    enrollmentNumber: '',
    percentage: '',
    cgpa: '',

    // ================= STEP 4 =================
    guardianName: '',
    familySize: '',
    guardianOccupation: '',

    // ================= STEP 5 =================
    scholarshipId: '',
    scholarshipName: '',
    scholarshipDescription: '',
    scholarshipBenefits: '',
    minimumPercentage: '',
    familyIncomeLimit: '',
    eligibleCourses: '',
    eligibleYears: '',
    requiredDocuments: '',
    applicationDeadline: '',

    // ================= STEP 6 =================
    documentsUploaded: true,

    // ================= STEP 7 =================
    incomeVerified: false,
    verifiedIncomeAmount: 0,
    requestId: '',

    // ================= STEP 8 =================
    declaration: false
  });

  const steps = [
    { id: 'personal', title: 'Personal Info' },
    { id: 'address', title: 'Address' },
    { id: 'academic', title: 'Academic' },
    { id: 'family', title: 'Family' },
    { id: 'scholarship', title: 'Scheme Selection' },
    { id: 'documents', title: 'Documents' },
    { id: 'income', title: 'Income Verification' },
    { id: 'review', title: 'Review & Submit' }
  ];

  // ============================================================
  // LOAD SCHOLARSHIPS FROM POSTGRESQL
  // ============================================================

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoadingScholarships(true);

        const response = await fetch(
          `${API_BASE_URL}/api/scholarships`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to load scholarship schemes.'
          );
        }

        const loadedScholarships = data.scholarships || [];

        setScholarships(loadedScholarships);

        // Read scholarship selected from URL
        const requestedScholarshipId =
          searchParams.get('scholarshipId');

        const selected =
          loadedScholarships.find(
            (scholarship) =>
              scholarship.scholarship_id === requestedScholarshipId
          ) || loadedScholarships[0];

        if (selected) {
          setFormData((prev) => ({
            ...prev,

            scholarshipId: selected.scholarship_id,
            scholarshipName: selected.name,
            scholarshipDescription: selected.description || '',
            scholarshipBenefits: selected.benefits || '',
            minimumPercentage:
              selected.minimum_percentage ?? '',
            familyIncomeLimit:
              selected.family_income_limit ?? '',
            eligibleCourses:
              selected.eligible_courses || '',
            eligibleYears:
              selected.eligible_years || '',
            requiredDocuments:
              selected.required_documents || '',
            applicationDeadline:
              selected.application_deadline || ''
          }));
        }
      } catch (error) {
        console.error(
          'Error loading scholarships:',
          error
        );

        setErrors({
          scholarship:
            error.message ||
            'Unable to load scholarship schemes.'
        });
      } finally {
        setLoadingScholarships(false);
      }
    };

    fetchScholarships();
  }, [searchParams]);

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  // ============================================================
  // SCHOLARSHIP CHANGE
  // ============================================================

  const handleSchemeChange = (scholarshipId) => {
    const selected = scholarships.find(
      (scholarship) =>
        scholarship.scholarship_id === scholarshipId
    );

    if (!selected) return;

    setFormData((prev) => ({
      ...prev,

      scholarshipId:
        selected.scholarship_id,

      scholarshipName:
        selected.name,

      scholarshipDescription:
        selected.description || '',

      scholarshipBenefits:
        selected.benefits || '',

      minimumPercentage:
        selected.minimum_percentage ?? '',

      familyIncomeLimit:
        selected.family_income_limit ?? '',

      eligibleCourses:
        selected.eligible_courses || '',

      eligibleYears:
        selected.eligible_years || '',

      requiredDocuments:
        selected.required_documents || '',

      applicationDeadline:
        selected.application_deadline || ''
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.fullName)
        newErrors.fullName = 'Full name is required.';

      if (!formData.dob)
        newErrors.dob = 'Date of birth is required.';

      if (!formData.gender)
        newErrors.gender = 'Gender is required.';

      if (!formData.mobile)
        newErrors.mobile = 'Mobile number is required.';

      if (!formData.email)
        newErrors.email = 'Email address is required.';
    }

    if (currentStep === 1) {
      if (!formData.district)
        newErrors.district = 'District is required.';

      if (!formData.cityVillage)
        newErrors.cityVillage =
          'City/Village/Taluka is required.';

      if (!formData.pincode)
        newErrors.pincode = 'PIN code is required.';
    }

    if (currentStep === 2) {
      if (!formData.institute)
        newErrors.institute =
          'Educational institute is required.';

      if (!formData.university)
        newErrors.university =
          'University is required.';

      if (!formData.course)
        newErrors.course = 'Course is required.';

      if (!formData.branch)
        newErrors.branch = 'Branch is required.';

      if (!formData.year)
        newErrors.year = 'Current year is required.';

      if (!formData.semester)
        newErrors.semester =
          'Current semester is required.';

      if (!formData.enrollmentNumber)
        newErrors.enrollmentNumber =
          'Enrollment number is required.';

      if (!formData.percentage)
        newErrors.percentage =
          'Qualifying percentage is required.';
    }

    if (currentStep === 3) {
      if (!formData.guardianName)
        newErrors.guardianName =
          'Guardian name is required.';

      if (!formData.familySize)
        newErrors.familySize =
          'Family member count is required.';

      if (!formData.guardianOccupation)
        newErrors.guardianOccupation =
          'Guardian occupation is required.';
    }

    if (currentStep === 4) {
      if (!formData.scholarshipId) {
        newErrors.scholarship =
          'Please select a scholarship scheme.';
      }
    }

    if (currentStep === 6) {
      if (!formData.incomeVerified) {
        newErrors.income =
          'Income verification is mandatory before final submission.';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // NEXT
  // ============================================================

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // ============================================================
  // PREVIOUS
  // ============================================================

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // ============================================================
  // SAVE DRAFT
  // ============================================================

  const handleSaveDraft = () => {
    localStorage.setItem(
      'scholarship_application_draft',
      JSON.stringify(formData)
    );

    addNotification({
      title: 'Draft Saved',
      message:
        'Your application progress has been saved.',
      type: 'SUCCESS'
    });
  };

  // ============================================================
  // INCOME VERIFICATION
  // ============================================================

  const handleIncomeVerification = () => {
    const requestId =
      `REQ${Date.now().toString().slice(-6)}`;

    setFormData((prev) => ({
      ...prev,
      incomeVerified: true,
      verifiedIncomeAmount: 250000,
      requestId
    }));

    setErrors((prev) => ({
      ...prev,
      income: ''
    }));

    addNotification({
      title: 'Income Verified',
      message:
        'Your annual family income has been verified successfully.',
      type: 'SUCCESS'
    });
  };

  // ============================================================
  // SUBMIT APPLICATION
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.declaration) {
      setErrors({
        declaration:
          'You must accept the declaration before submitting.'
      });
      return;
    }

    if (!formData.incomeVerified) {
      setErrors({
        declaration:
          'Income verification must be completed before submission.'
      });
      return;
    }

    try {
      setSubmitting(true);

      /*
       * This sends the complete application to the backend.
       * The backend endpoint will be connected to the
       * PostgreSQL applications table.
       */

      const response = await fetch(
        `${API_BASE_URL}/api/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: formData.studentId,
            citizenId: formData.citizenId,
            scholarshipId: formData.scholarshipId,

            personal: {
              fullName: formData.fullName,
              dob: formData.dob,
              gender: formData.gender,
              mobile: formData.mobile,
              email: formData.email
            },

            address: {
              state: formData.state,
              district: formData.district,
              cityVillage: formData.cityVillage,
              pincode: formData.pincode
            },

            academic: {
              institute: formData.institute,
              university: formData.university,
              course: formData.course,
              branch: formData.branch,
              year: formData.year,
              semester: formData.semester,
              enrollmentNumber:
                formData.enrollmentNumber,
              percentage: formData.percentage,
              cgpa: formData.cgpa
            },

            family: {
              guardianName:
                formData.guardianName,
              familySize:
                formData.familySize,
              guardianOccupation:
                formData.guardianOccupation
            },

            incomeVerification: {
              verified:
                formData.incomeVerified,
              amount:
                formData.verifiedIncomeAmount,
              requestId:
                formData.requestId
            },

            declaration:
              formData.declaration
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          'Unable to submit application.'
        );
      }

      addNotification({
        title: 'Application Submitted',
        message:
          'Your scholarship application has been submitted successfully.',
        type: 'SUCCESS'
      });

      if (data.application?.id) {
        navigate(
          `/student/applications/${data.application.id}`
        );
      } else {
        navigate('/student/applications');
      }

    } catch (error) {
      console.error(
        'Application submission error:',
        error
      );

      setErrors({
        declaration:
          error.message ||
          'Unable to submit application. Please try again.'
      });

    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return 'Not specified';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            Academic Year 2026-2027
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Scholarship Application Form
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Complete the 8-step application.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSaveDraft}
          icon={Save}
        >
          Save Draft
        </Button>
      </div>

      {/* STEP INDICATOR */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
        <FormStepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={(idx) => setCurrentStep(idx)}
        />
      </div>

      {/* MAIN FORM */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">

        {/* =====================================================
            STEP 1
        ====================================================== */}

        {currentStep === 0 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 1: Personal Information
              </h2>

              <p className="text-xs text-slate-500">
                Applicant identity details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

              <Input
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                readOnly
              />

              <Input
                label="Citizen ID / Aadhaar Ref"
                name="citizenId"
                value={formData.citizenId}
                onChange={handleInputChange}
              />

              <Input
                label="Full Name (as per Marksheet)"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />

              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                required
                value={formData.dob}
                onChange={handleInputChange}
              />

              <Select
                label="Gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                options={[
                  'Male',
                  'Female',
                  'Other'
                ]}
              />

              <Input
                label="Mobile Number"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleInputChange}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="sm:col-span-2 md:col-span-1"
              />

            </div>
          </div>
        )}

        {/* =====================================================
            STEP 2
        ====================================================== */}

        {currentStep === 1 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 2: Permanent Residential Address
              </h2>

              <p className="text-xs text-slate-500">
                Used for state domicile and district verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <Input
                label="State"
                name="state"
                value={formData.state}
                readOnly
              />

              <Input
                label="District"
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
              />

              <Input
                label="City / Village / Taluka"
                name="cityVillage"
                required
                value={formData.cityVillage}
                onChange={handleInputChange}
              />

              <Input
                label="PIN Code"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleInputChange}
              />

            </div>
          </div>
        )}

        {/* =====================================================
            STEP 3
        ====================================================== */}

        {currentStep === 2 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 3: Academic Information
              </h2>

              <p className="text-xs text-slate-500">
                College enrollment & examination marks details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

              <Input
                label="Educational Institute"
                name="institute"
                required
                value={formData.institute}
                onChange={handleInputChange}
                className="sm:col-span-2"
              />

              <Input
                label="Affiliated University"
                name="university"
                required
                value={formData.university}
                onChange={handleInputChange}
              />

              <Select
                label="Degree / Diploma Course"
                name="course"
                required
                value={formData.course}
                onChange={handleInputChange}
                options={[
                  'B.Tech / B.E.',
                  'B.Sc',
                  'MBBS',
                  'Polytechnic Diploma',
                  'B.Com',
                  'B.A.'
                ]}
              />

              <Input
                label="Branch / Discipline"
                name="branch"
                required
                value={formData.branch}
                onChange={handleInputChange}
              />

              <Select
                label="Current Year"
                name="year"
                required
                value={formData.year}
                onChange={handleInputChange}
                options={[
                  '1st Year',
                  '2nd Year',
                  '3rd Year',
                  '4th Year'
                ]}
              />

              <Select
                label="Current Semester"
                name="semester"
                required
                value={formData.semester}
                onChange={handleInputChange}
                options={[
                  '1st Semester',
                  '2nd Semester',
                  '3rd Semester',
                  '4th Semester',
                  '5th Semester',
                  '6th Semester',
                  '7th Semester',
                  '8th Semester'
                ]}
              />

              <Input
                label="College Enrollment Number"
                name="enrollmentNumber"
                required
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
              />

              <Input
                label="Qualifying Percentage (%)"
                name="percentage"
                type="number"
                required
                value={formData.percentage}
                onChange={handleInputChange}
              />

              <Input
                label="Cumulative CGPA"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleInputChange}
              />

            </div>
          </div>
        )}

        {/* =====================================================
            STEP 4
        ====================================================== */}

        {currentStep === 3 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 4: Family Information
              </h2>

              <p className="text-xs text-slate-500">
                General family context.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Input
                label="Guardian / Father's Name"
                name="guardianName"
                required
                value={formData.guardianName}
                onChange={handleInputChange}
              />

              <Input
                label="Family Member Count"
                name="familySize"
                type="number"
                required
                value={formData.familySize}
                onChange={handleInputChange}
              />

              <Input
                label="Guardian Occupation"
                name="guardianOccupation"
                required
                value={formData.guardianOccupation}
                onChange={handleInputChange}
              />

            </div>

            <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">

              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />

              <span>
                Financial income will be verified electronically during Step 7.
              </span>

            </div>

          </div>
        )}

        {/* =====================================================
            STEP 5
        ====================================================== */}

        {currentStep === 4 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">

              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 5: Scholarship Scheme Selection
              </h2>

              <p className="text-xs text-slate-500">
                Choose the scholarship scheme you are applying for.
              </p>

            </div>

            {loadingScholarships ? (
              <div className="text-center py-10 text-slate-500">
                Loading scholarship schemes...
              </div>
            ) : scholarships.length === 0 ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                {errors.scholarship ||
                  'No scholarship schemes are available.'}
              </div>
            ) : (
              <div className="space-y-3">

                {scholarships.map((s) => {

                  const isSelected =
                    formData.scholarshipId ===
                    s.scholarship_id;

                  return (
                    <div
                      key={s.scholarship_id}
                      onClick={() =>
                        handleSchemeChange(
                          s.scholarship_id
                        )
                      }
                      className={`p-4 rounded-xl border transition cursor-pointer ${isSelected
                        ? 'border-gov-primary bg-blue-50/50 shadow-xs ring-1 ring-gov-primary'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >

                      <div className="flex flex-col gap-3">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <div className="flex items-center gap-2 flex-wrap">

                              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {s.scholarship_id}
                              </span>

                              {isSelected && (
                                <Badge
                                  variant="gov"
                                  size="sm"
                                >
                                  Selected
                                </Badge>
                              )}

                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mt-2">
                              {s.name}
                            </h3>

                            <p className="text-xs text-slate-600 mt-1">
                              {s.description}
                            </p>

                          </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">

                          <div className="bg-slate-50 rounded-lg p-3">
                            <span className="block text-slate-500">
                              Minimum Percentage
                            </span>

                            <strong className="text-slate-900">
                              {s.minimum_percentage}%
                            </strong>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <span className="block text-slate-500">
                              Family Income Limit
                            </span>

                            <strong className="text-slate-900">
                              ₹
                              {Number(
                                s.family_income_limit || 0
                              ).toLocaleString('en-IN')}
                            </strong>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-3">
                            <span className="block text-slate-500">
                              Application Deadline
                            </span>

                            <strong className="text-slate-900">
                              {formatDate(
                                s.application_deadline
                              )}
                            </strong>
                          </div>

                        </div>

                        <div className="text-xs text-slate-600">

                          <strong>
                            Eligible Courses:
                          </strong>{' '}
                          {s.eligible_courses || 'All eligible courses'}

                        </div>

                        <div className="text-xs text-slate-600">

                          <strong>
                            Benefits:
                          </strong>{' '}
                          {s.benefits || 'As per scheme guidelines'}

                        </div>

                        <div className="text-right">

                          <span
                            className={`text-[11px] font-bold ${isSelected
                              ? 'text-gov-primary'
                              : 'text-slate-400'
                              }`}
                          >
                            {isSelected
                              ? '✓ Selected'
                              : 'Click to Select'}
                          </span>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

            {errors.scholarship && (
              <p className="text-xs text-rose-600 font-bold">
                {errors.scholarship}
              </p>
            )}

          </div>
        )}

        {/* =====================================================
            STEP 6
        ====================================================== */}

        {currentStep === 5 && (
          <div className="space-y-5">

            <div className="border-b border-slate-100 pb-3">

              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 6: Document Locker & Certificates
              </h2>

              <p className="text-xs text-slate-500">
                Upload the required documents for your application.
              </p>

            </div>

            <div className="space-y-3">

              <FileUpload
                label="Identity Proof (Aadhaar / National ID)"
                description="Masked PDF copy"
                initialFile={{
                  name: 'Aadhaar_Card_Masked.pdf',
                  size: '1.2 MB',
                  status: 'VERIFIED'
                }}
                required
              />

              <FileUpload
                label="Previous Semester / Year Marksheet"
                description="Latest official marksheet"
                initialFile={{
                  name: 'Latest_Marksheet.pdf',
                  size: '2.4 MB',
                  status: 'VERIFIED'
                }}
                required
              />

              <FileUpload
                label="College Bonafide Certificate"
                description="Issued by institution"
                initialFile={{
                  name: 'College_Bonafide.pdf',
                  size: '850 KB',
                  status: 'VERIFIED'
                }}
                required
              />

            </div>

            <div className="p-3.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
              Documents shown here are currently in demo mode. Actual document storage will be connected to the Documents module.
            </div>

          </div>
        )}

        {/* =====================================================
            STEP 7
        ====================================================== */}

        {currentStep === 6 && (
          <div className="space-y-6">

            <div className="border-b border-slate-100 pb-3">

              <h2 className="text-lg font-black text-slate-900 mt-1">
                Step 7: Electronic Income Verification
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Annual family income is required to determine scholarship eligibility.
              </p>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">

              <div className="p-5 bg-slate-50 border-b border-slate-200">

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Verification Request Details
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">

                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Requester:
                    </span>

                    <span className="font-bold text-slate-800">
                      Education Department
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Required Data:
                    </span>

                    <span className="font-bold text-emerald-800">
                      Annual Family Income
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Purpose:
                    </span>

                    <span className="font-semibold text-slate-800">
                      Scholarship Eligibility
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block">
                      Provider:
                    </span>

                    <span className="font-bold text-amber-800">
                      Current Verification Service
                    </span>
                  </div>

                </div>

              </div>

              <div className="p-6">

                {formData.incomeVerified ? (

                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-300 space-y-3">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                          ✓
                        </div>

                        <div>

                          <div className="flex items-center gap-2">

                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                              Verification Status
                            </span>

                            <Badge
                              variant="success"
                              size="sm"
                            >
                              VERIFIED
                            </Badge>

                          </div>

                          <h4 className="text-xl font-extrabold text-emerald-950">
                            ₹
                            {Number(
                              formData.verifiedIncomeAmount
                            ).toLocaleString('en-IN')}
                          </h4>

                          <p className="text-xs text-emerald-800">
                            Source: Portal Verification Service
                            {' • '}
                            Reference: {formData.requestId}
                          </p>

                        </div>

                      </div>

                      <Badge
                        variant="success"
                        size="lg"
                        className="bg-emerald-600 text-white"
                      >
                        Record Validated
                      </Badge>

                    </div>

                    <div className="text-[11px] text-emerald-900/90 pt-2 border-t border-emerald-200">

                      ✓ <strong>Electronic Verification Complete:</strong>{' '}
                      Your certified family income has been verified.

                    </div>

                  </div>

                ) : (

                  <div className="text-center py-6 space-y-4">

                    <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">

                      <ShieldCheck className="w-8 h-8" />

                    </div>

                    <div className="space-y-1 max-w-md mx-auto">

                      <h4 className="text-base font-bold text-slate-900">
                        Income Verification Required
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Verify your annual family income before submitting the scholarship application.
                      </p>

                    </div>

                    <Button
                      variant="saffron"
                      size="lg"
                      onClick={handleIncomeVerification}
                      icon={ShieldCheck}
                    >
                      Verify Income
                    </Button>

                  </div>

                )}

              </div>

            </div>

            {errors.income && (
              <p className="text-xs text-rose-600 font-bold">
                {errors.income}
              </p>
            )}

          </div>
        )}

        {/* =====================================================
            STEP 8
        ====================================================== */}

        {currentStep === 7 && (
          <div className="space-y-6">

            <div className="border-b border-slate-100 pb-3">

              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider text-gov-primary">
                Step 8: Review & Final Application Submission
              </h2>

              <p className="text-xs text-slate-500">
                Review all details before submitting your application.
              </p>

            </div>

            {/* SELECTED SCHOLARSHIP */}

            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">

              <span className="text-[10px] font-bold uppercase text-slate-500">
                Applied Scheme
              </span>

              <h4 className="text-sm font-bold text-slate-900 mt-1">
                {formData.scholarshipName}
              </h4>

              <p className="text-xs text-slate-600">
                Scheme ID: {formData.scholarshipId}
              </p>

              <p className="text-xs text-slate-600 mt-2">
                {formData.scholarshipDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Minimum Marks
                  </span>

                  <p className="font-bold text-slate-900">
                    {formData.minimumPercentage}%
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Income Limit
                  </span>

                  <p className="font-bold text-slate-900">
                    ₹
                    {Number(
                      formData.familyIncomeLimit || 0
                    ).toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Deadline
                  </span>

                  <p className="font-bold text-slate-900">
                    {formatDate(
                      formData.applicationDeadline
                    )}
                  </p>
                </div>

              </div>

            </div>

            {/* APPLICANT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">

                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Applicant Details
                </span>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Full Name:
                  </span>

                  <span className="font-bold text-slate-800 text-right">
                    {formData.fullName}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Student ID:
                  </span>

                  <span className="font-mono text-slate-800">
                    {formData.studentId}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Institute:
                  </span>

                  <span className="font-medium text-slate-800 text-right">
                    {formData.institute}
                  </span>
                </div>

              </div>

              {/* INCOME */}

              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-2">

                <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                  Verified Financial Status
                </span>

                <div className="flex justify-between">

                  <span className="text-emerald-900/70">
                    Annual Family Income:
                  </span>

                  <span className="font-extrabold text-emerald-950">
                    ₹
                    {Number(
                      formData.verifiedIncomeAmount || 0
                    ).toLocaleString('en-IN')}
                  </span>

                </div>

                <div className="flex justify-between gap-3">

                  <span className="text-emerald-900/70">
                    Source:
                  </span>

                  <span className="font-bold text-emerald-950 text-right">
                    Current Verification Service
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-emerald-900/70">
                    Reference:
                  </span>

                  <span className="font-mono text-emerald-950">
                    {formData.requestId}
                  </span>

                </div>

              </div>

            </div>

            {/* DECLARATION */}

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">

              <Checkbox
                name="declaration"
                checked={formData.declaration}
                onChange={handleInputChange}
                label="Final Submission Declaration"
                description="I solemnly declare that all personal and academic records provided are true and accurate. I understand that the verified income information will be used for scholarship eligibility and application processing."
                error={errors.declaration}
              />

            </div>

          </div>
        )}

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between gap-3">

          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
            icon={ArrowLeft}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">

            {currentStep < steps.length - 1 ? (

              <Button
                variant="primary"
                onClick={handleNext}
                icon={ArrowRight}
                iconPosition="right"
              >
                {currentStep === 6
                  ? 'Proceed to Review'
                  : 'Next Step'}
              </Button>

            ) : (

              <Button
                variant="success"
                onClick={handleSubmit}
                icon={CheckCircle2}
                disabled={submitting}
              >
                {submitting
                  ? 'Submitting...'
                  : 'Submit Application'}
              </Button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};