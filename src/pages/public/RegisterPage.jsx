import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Checkbox } from '../../components/forms/Checkbox';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    // Personal
    studentId: 'STU2026' + Math.floor(100 + Math.random() * 900),
    citizenId: 'CIT00' + Math.floor(1 + Math.random() * 9),
    fullName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    // Address
    state: 'Maharashtra',
    district: 'Pune',
    cityVillage: '',
    pincode: '',
    // Academic
    institute: 'Government College of Engineering, Pune',
    university: 'Savitribai Phule Pune University',
    course: 'B.Tech / B.E.',
    branch: 'Computer Engineering',
    year: '1st Year',
    semester: '1st Semester',
    enrollmentNumber: '',
    terms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.dob) errs.dob = 'Date of Birth is required';
    if (!formData.mobile || formData.mobile.length < 10) errs.mobile = 'Valid 10-digit mobile required';
    if (!formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.cityVillage.trim()) errs.cityVillage = 'City/Village is required';
    if (!formData.pincode || formData.pincode.length < 6) errs.pincode = 'Valid 6-digit PIN code required';
    if (!formData.enrollmentNumber.trim()) errs.enrollmentNumber = 'Enrollment number is required';
    if (!formData.terms) errs.terms = 'You must agree to the portal terms and declaration';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    loginAsStudent({ studentId: formData.studentId });
    addNotification({
      title: "Student Registration Complete!",
      message: `Account created for ${formData.fullName}. Assigned Student ID: ${formData.studentId}.`,
      type: "SUCCESS"
    });
    navigate('/student/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" />
          <span>New Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gov-primary">
          Student Portal Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Create your verified student profile to discover and apply for scholarship schemes.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-8">
        {/* SECTION 1: Personal Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              Section 1: Personal Information
            </h2>
            <p className="text-xs text-slate-500">Official identity records as per educational certificates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="Student ID (Auto-Assigned)"
              name="studentId"
              value={formData.studentId}
              readOnly
            />
            <Input
              label="Citizen ID / Aadhaar Reference"
              name="citizenId"
              value={formData.citizenId}
              readOnly
            />
            <Input
              label="Full Name (as per Marksheet)"
              name="fullName"
              required
              placeholder="e.g. Rahul Suresh Sharma"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              required
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
            />
            <Select
              label="Gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              options={['Male', 'Female', 'Other']}
            />
            <Input
              label="Mobile Number"
              name="mobile"
              required
              placeholder="10-digit mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="student@example.edu.in"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              className="sm:col-span-2 md:col-span-1"
            />
          </div>
        </div>

        {/* SECTION 2: Address Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              Section 2: Permanent Residential Address
            </h2>
            <p className="text-xs text-slate-500">Used for state domicile eligibility check.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              readOnly
            />
            <Input
              label="District"
              name="district"
              required
              value={formData.district}
              onChange={handleChange}
            />
            <Input
              label="City / Village / Taluka"
              name="cityVillage"
              required
              placeholder="e.g. Haveli, Pune"
              value={formData.cityVillage}
              onChange={handleChange}
              error={errors.cityVillage}
            />
            <Input
              label="PIN Code"
              name="pincode"
              required
              placeholder="6-digit PIN"
              value={formData.pincode}
              onChange={handleChange}
              error={errors.pincode}
            />
          </div>
        </div>

        {/* SECTION 3: Academic Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-gov-primary">
              Section 3: Academic Information
            </h2>
            <p className="text-xs text-slate-500">Current degree course and institutional enrollment details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="Institute Name"
              name="institute"
              required
              value={formData.institute}
              onChange={handleChange}
              className="sm:col-span-2"
            />
            <Input
              label="University / Board"
              name="university"
              required
              value={formData.university}
              onChange={handleChange}
            />
            <Select
              label="Degree / Diploma Course"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              options={[
                'B.Tech / B.E.',
                'B.Sc (Computer Science / General)',
                'MBBS / Medical',
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
              onChange={handleChange}
            />
            <Select
              label="Current Academic Year"
              name="year"
              required
              value={formData.year}
              onChange={handleChange}
              options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
            />
            <Select
              label="Current Semester"
              name="semester"
              required
              value={formData.semester}
              onChange={handleChange}
              options={['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']}
            />
            <Input
              label="College Enrollment / Roll No"
              name="enrollmentNumber"
              required
              placeholder="e.g. EN20261980"
              value={formData.enrollmentNumber}
              onChange={handleChange}
              error={errors.enrollmentNumber}
            />
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <Checkbox
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            label="Digital Verification & Declaration"
            description="I declare that the information provided is correct. I authorize the Education Department to verify my enrollment and family income records electronically upon applying for scholarship schemes."
            error={errors.terms}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <Link to="/login" className="text-xs font-bold text-slate-600 hover:underline">
            Already have an account? Sign In
          </Link>
          <Button variant="primary" size="lg" type="submit" icon={ArrowRight} iconPosition="right">
            Complete Registration & Go to Dashboard
          </Button>
        </div>
      </form>
    </div>
  );
};
