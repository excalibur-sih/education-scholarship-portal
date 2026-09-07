import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApplicationService } from '../services/mockApplicationService';
import { mockVerificationService } from '../services/mockVerificationService';
import { mockMahasetuService } from '../services/mockMahasetuService';
import { useNotifications } from './NotificationContext';

const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [simulationStep, setSimulationStep] = useState(null);
  const [studentVerifiedIncome, setStudentVerifiedIncome] = useState(() => {
    const saved = localStorage.getItem('mahasetu_student_income');
    return saved ? JSON.parse(saved) : {
      isVerified: true,
      amount: 250000,
      currency: "INR",
      source: "Revenue Department",
      requestId: "REQ1001",
      verifiedAt: "30 August 2026",
      certificateNo: "REV/INC/2026/09841"
    };
  });

  const loadData = () => {
    const apps = mockApplicationService.getAll();
    const reqs = mockVerificationService.getRequests();
    setApplications(apps);
    setVerificationRequests(reqs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitApplication = (formData) => {
    const newApp = mockApplicationService.create({
      scholarshipId: formData.scholarshipId,
      scholarshipName: formData.scholarshipName,
      studentId: formData.studentId,
      studentName: formData.fullName,
      citizenId: formData.citizenId,
      course: `${formData.course} (${formData.branch})`,
      institute: formData.institute,
      amount: formData.scholarshipAmount || 50000,
      incomeVerification: studentVerifiedIncome?.isVerified
        ? {
            status: "VERIFIED",
            amount: studentVerifiedIncome.amount,
            currency: "INR",
            source: "Revenue Department",
            requestId: studentVerifiedIncome.requestId || "REQ1001",
            verifiedAt: studentVerifiedIncome.verifiedAt || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            isCompliant: true
          }
        : {
            status: "NOT_VERIFIED",
            amount: null,
            currency: "INR",
            source: "Pending Verification",
            requestId: null,
            isCompliant: false
          }
    });

    loadData();
    addNotification({
      title: "Application Submitted Successfully",
      message: `Scholarship Application ${newApp.id} has been registered and forwarded for Education Officer review.`,
      type: "SUCCESS",
      link: `/student/applications/${newApp.id}`
    });
    return newApp;
  };

  const updateApplicationDecision = (appId, decision, comments = '') => {
    const updated = mockApplicationService.updateStatus(appId, decision, comments);
    loadData();
    if (decision === 'APPROVED') {
      addNotification({
        title: `Application ${appId} Approved!`,
        message: `Education Officer approved scholarship application ${appId}. Sanction order generated.`,
        type: "SUCCESS",
        link: `/student/applications/${appId}`
      });
    } else if (decision === 'REJECTED') {
      addNotification({
        title: `Application ${appId} Status Updated`,
        message: `Officer recorded decision: Rejected. Reason: ${comments || 'Eligibility non-compliance'}.`,
        type: "ALERT",
        link: `/student/applications/${appId}`
      });
    }
    return updated;
  };

  const runMahaSetuIncomeVerification = async (citizenId = 'CIT001', studentId = 'STU2026001') => {
    setIsVerifying(true);
    setSimulationStep({
      stepIndex: 1,
      title: "Verifying Citizen Consent",
      details: "Connecting to Revenue Department records..."
    });

    try {
      const result = await mockMahasetuService.executePipelineSimulation((step) => {
        setSimulationStep(step);
      });

      const newReq = mockVerificationService.createVerificationRequest({
        citizenId,
        studentId,
        purpose: "Scholarship Eligibility Verification"
      });

      const verifiedState = {
        isVerified: true,
        amount: result.income,
        currency: result.currency,
        source: "Revenue Department",
        requestId: newReq.requestId,
        verifiedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        certificateNo: newReq.result.certificateNo
      };

      setStudentVerifiedIncome(verifiedState);
      localStorage.setItem('mahasetu_student_income', JSON.stringify(verifiedState));
      loadData();

      addNotification({
        title: "Income Verified from Revenue Records",
        message: `Revenue Department verified annual family income as ₹${result.income.toLocaleString('en-IN')} (Ref: ${newReq.requestId}).`,
        type: "SUCCESS",
        link: "/student/verification-result"
      });

      return { success: true, data: verifiedState };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setIsVerifying(false);
      setSimulationStep(null);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        verificationRequests,
        studentVerifiedIncome,
        isVerifying,
        simulationStep,
        submitApplication,
        updateApplicationDecision,
        runMahaSetuIncomeVerification,
        refreshData: loadData
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
