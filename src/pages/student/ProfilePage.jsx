import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  GraduationCap,
  Users,
  CheckCircle2,
  Save
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Badge } from '../../components/common/Badge';
import studentData from '../../data/student.json';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getStudents, updateStudent } from '../../services/studentService';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState(studentData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getStudents();
        if (data.success && data.students && data.students.length > 0) {
          const current = data.students.find(s => s.student_id === (user?.id || 'STU2026001')) || data.students[data.students.length - 1];
          if (current) {
            setProfile({
              studentId: current.student_id,
              citizenId: current.citizen_id,
              fullName: current.full_name,
              dob: current.date_of_birth ? current.date_of_birth.split('T')[0] : '2004-05-14',
              gender: current.gender || 'Male',
              mobile: current.mobile || '+91 98765 43210',
              email: current.email || 'rahul.sharma@example.edu.in',
              address: {
                state: current.state || 'Maharashtra',
                district: current.district || 'Pune',
                cityVillage: current.city_village || 'Haveli, Pune',
                pincode: current.pin_code || '411041'
              },
              academic: {
                institute: current.institute || '',
                university: current.university || '',
                course: current.course || '',
                branch: current.branch || '',
                year: current.year || '',
                semester: current.semester || '',
                enrollmentNumber: current.enrollment_number || '',
                percentage: current.percentage || '',
                cgpa: current.cgpa || ''
              },
              family: {
                guardianName: current.guardian_name || '',
                familySize: current.family_size || 4,
                guardianOccupation: current.guardian_occupation || ''
              }
            });
          }
        }
      } catch (err) {
        console.error('Failed to load profile from database:', err);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const student = {
        student_id: profile.studentId,
        citizen_id: profile.citizenId,
        full_name: profile.fullName,
        date_of_birth: profile.dob,
        gender: profile.gender,
        mobile: profile.mobile,
        email: profile.email,

        state: profile.address.state,
        district: profile.address.district,
        city_village: profile.address.cityVillage,
        pin_code: profile.address.pincode,

        institute: profile.academic.institute,
        university: profile.academic.university,
        course: profile.academic.course,
        branch: profile.academic.branch,
        year: profile.academic.year,
        semester: profile.academic.semester,
        enrollment_number: profile.academic.enrollmentNumber,
        percentage: profile.academic.percentage,
        cgpa: profile.academic.cgpa,

        guardian_name: profile.family.guardianName,
        family_size: profile.family.familySize,
        guardian_occupation: profile.family.guardianOccupation
      };

      await updateStudent(profile.studentId, student);

      setSaved(true);

      addNotification({
        title: 'Profile Updated',
        message: 'Your profile has been saved successfully.',
        type: 'SUCCESS'
      });

      setTimeout(() => setSaved(false), 3000);

    } catch (error) {
      console.error('Profile save error:', error);

      // Show the actual backend validation message
      const errorMessage =
        error?.message ||
        'Unable to save your profile. Please try again.';

      addNotification({
        title: 'Save Failed',
        message: errorMessage,
        type: 'ERROR'
      });
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-gov-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
            {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-xl font-bold text-slate-900">
                {profile.fullName}
              </h1>

              <Badge variant="success" size="sm">
                Verified Student
              </Badge>

            </div>

            <p className="text-xs text-slate-500 mt-0.5">

              Student ID:{' '}

              <span className="font-mono font-semibold text-slate-700">
                {profile.studentId}
              </span>

              {' • '}

              Citizen ID:{' '}

              <span className="font-mono text-slate-700">
                {profile.citizenId}
              </span>

            </p>
          </div>

        </div>

        <div className="text-right">

          <div className="text-xs font-bold text-slate-500 uppercase">
            Profile Strength
          </div>

          <p className="text-lg font-black text-gov-primary">
            85% Complete
          </p>

        </div>

      </div>


      {/* ================= TABS BAR ================= */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto bg-white px-4 pt-2 rounded-t-xl border-t border-x">

        {/* Personal Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'personal'
              ? 'border-gov-primary text-gov-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>


        {/* Address Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('address')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'address'
              ? 'border-gov-primary text-gov-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Address Details</span>
        </button>


        {/* Academic Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'academic'
              ? 'border-gov-primary text-gov-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Information</span>
        </button>


        {/* Family Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${activeTab === 'family'
              ? 'border-gov-primary text-gov-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Family Information</span>
        </button>

      </div>


      {/* ================= TAB CONTENT ================= */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-b-xl border-x border-b border-slate-200 shadow-xs space-y-6"
      >

        {/* ================= PERSONAL DETAILS ================= */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            {/* Student ID - Cannot be changed */}
            <Input
              label="Student ID"
              value={profile.studentId}
              readOnly
            />

            {/* Citizen ID - Editable */}
            <Input
              label="Citizen ID / Aadhaar Ref"
              value={profile.citizenId}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  citizenId: e.target.value
                })
              }
            />

            {/* Full Name */}
            <Input
              label="Full Name"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  fullName: e.target.value
                })
              }
            />

            {/* Date of Birth */}
            <Input
              label="Date of Birth"
              value={profile.dob}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  dob: e.target.value
                })
              }
            />

            {/* Gender */}
            <Input
              label="Gender"
              value={profile.gender}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  gender: e.target.value
                })
              }
            />

            {/* Mobile */}
            <Input
              label="Mobile Number"
              value={profile.mobile}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  mobile: e.target.value
                })
              }
            />

            {/* Email */}
            <Input
              label="Email Address"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value
                })
              }
              className="sm:col-span-2 md:col-span-1"
            />

          </div>
        )}


        {/* ================= ADDRESS DETAILS ================= */}
        {activeTab === 'address' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            {/* State */}
            <Input
              label="State"
              value={profile.address.state}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    state: e.target.value
                  }
                })
              }
            />

            {/* District */}
            <Input
              label="District"
              value={profile.address.district}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    district: e.target.value
                  }
                })
              }
            />

            {/* City / Village */}
            <Input
              label="City / Village"
              value={profile.address.cityVillage}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    cityVillage: e.target.value
                  }
                })
              }
            />

            {/* PIN Code */}
            <Input
              label="PIN Code"
              value={profile.address.pincode}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    pincode: e.target.value
                  }
                })
              }
            />

            {/* Full Address */}
            <Input
              label="Full Registered Address"
              value={profile.address.fullAddress}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    fullAddress: e.target.value
                  }
                })
              }
              className="sm:col-span-2 md:col-span-4"
            />

          </div>
        )}


        {/* ================= ACADEMIC INFORMATION ================= */}
        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <Input
              label="Institute Name"
              value={profile.academic.institute}
              readOnly
              className="sm:col-span-2"
            />

            <Input
              label="University"
              value={profile.academic.university}
              readOnly
            />

            <Input
              label="Course"
              value={profile.academic.course}
              readOnly
            />

            <Input
              label="Branch"
              value={profile.academic.branch}
              readOnly
            />

            <Input
              label="Academic Year"
              value={profile.academic.year}
              readOnly
            />

            <Input
              label="Semester"
              value={profile.academic.semester}
              readOnly
            />

            <Input
              label="Enrollment Number"
              value={profile.academic.enrollmentNumber}
              readOnly
            />

            <Input
              label="Qualifying Percentage"
              value={`${profile.academic.percentage}%`}
              readOnly
            />

            <Input
              label="CGPA"
              value={profile.academic.cgpa}
              readOnly
            />

          </div>
        )}


        {/* ================= FAMILY INFORMATION ================= */}
        {activeTab === 'family' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Input
              label="Guardian Name"
              value={profile.family.guardianName}
              readOnly
            />

            <Input
              label="Family Size"
              value={profile.family.familySize}
              readOnly
            />

            <Input
              label="Guardian Occupation"
              value={profile.family.guardianOccupation}
              readOnly
            />

          </div>
        )}


        {/* ================= SAVE AREA ================= */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">

          <div className="flex items-center gap-1.5 text-xs text-emerald-700">

            <CheckCircle2 className="w-4 h-4" />

            <span>
              Profile linked with National Student ID Registry
            </span>

          </div>

          <Button
            variant="primary"
            size="md"
            type="submit"
            icon={Save}
          >
            {saved ? 'Saved!' : 'Save Profile Changes'}
          </Button>

        </div>

      </form>

    </div>
  );
};