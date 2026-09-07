import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { OfficerLayout } from '../layouts/OfficerLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { ScholarshipsPage } from '../pages/public/ScholarshipsPage';
import { ScholarshipDetailsPage } from '../pages/public/ScholarshipDetailsPage';
import { GuidelinesPage } from '../pages/public/GuidelinesPage';
import { FAQPage } from '../pages/public/FAQPage';
import { HelpPage } from '../pages/public/HelpPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Student Pages
import { DashboardPage as StudentDashboard } from '../pages/student/DashboardPage';
import { ProfilePage as StudentProfile } from '../pages/student/ProfilePage';
import { ApplicationsPage as StudentApplications } from '../pages/student/ApplicationsPage';
import { ApplicationDetailsPage as StudentAppDetails } from '../pages/student/ApplicationDetailsPage';
import { ApplicationFormPage as StudentAppForm } from '../pages/student/ApplicationFormPage';
import { DocumentsPage as StudentDocuments } from '../pages/student/DocumentsPage';
import { ConsentPage as StudentConsent } from '../pages/student/ConsentPage';
import { IncomeVerificationPage as StudentIncomeVerification } from '../pages/student/IncomeVerificationPage';
import { VerificationResultPage as StudentVerificationResult } from '../pages/student/VerificationResultPage';
import { ApplicationTrackingPage as StudentAppTracking } from '../pages/student/ApplicationTrackingPage';
import { DataAccessHistoryPage as StudentDataHistory } from '../pages/student/DataAccessHistoryPage';
import { NotificationsPage as StudentNotifications } from '../pages/student/NotificationsPage';

// Officer Pages
import { OfficerDashboardPage } from '../pages/officer/OfficerDashboardPage';
import { ApplicationsPage as OfficerApplications } from '../pages/officer/ApplicationsPage';
import { ApplicationReviewPage } from '../pages/officer/ApplicationReviewPage';
import { VerificationRequestsPage } from '../pages/officer/VerificationRequestsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Student Portal Pages */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="applications/:id" element={<StudentAppDetails />} />
        <Route path="apply" element={<StudentAppForm />} />
        <Route path="documents" element={<StudentDocuments />} />
        <Route path="consent" element={<StudentConsent />} />
        <Route path="income-verification" element={<StudentIncomeVerification />} />
        <Route path="verification-result" element={<StudentVerificationResult />} />
        <Route path="tracking" element={<StudentAppTracking />} />
        <Route path="tracking/:id" element={<StudentAppTracking />} />
        <Route path="data-history" element={<StudentDataHistory />} />
        <Route path="notifications" element={<StudentNotifications />} />
      </Route>

      {/* Officer Portal Pages */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="/officer/dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboardPage />} />
        <Route path="applications" element={<OfficerApplications />} />
        <Route path="review/:id" element={<ApplicationReviewPage />} />
        <Route path="verifications" element={<VerificationRequestsPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
