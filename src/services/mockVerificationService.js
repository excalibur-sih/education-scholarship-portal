import verificationData from '../data/verification.json';

const STORAGE_KEY = 'mahasetu_verification_requests';

export const mockVerificationService = {
  getRequests: () => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verificationData.activeRequests));
    return verificationData.activeRequests;
  },

  getSchemaMappings: () => {
    return verificationData.schemaMappings;
  },

  getDataMinimizationRules: () => {
    return verificationData.dataMinimizationRules;
  },

  getRequestById: (requestId) => {
    const list = mockVerificationService.getRequests();
    return list.find((r) => r.requestId === requestId) || null;
  },

  createVerificationRequest: ({ citizenId, studentId, purpose = 'Scholarship Eligibility Verification' }) => {
    const list = mockVerificationService.getRequests();
    const reqNum = 1000 + list.length + 1;
    const reqId = `REQ${reqNum}`;
    const newReq = {
      requestId: reqId,
      requester: 'Education Department',
      portal: 'Education Scholarship Portal',
      dataRequested: 'Annual Family Income',
      purpose: purpose,
      provider: 'Revenue Department',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: new Date().toISOString(),
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'SUCCESS',
      consentStatus: 'GRANTED',
      result: {
        amount: 250000,
        currency: 'INR',
        verified: true,
        certificateNo: `REV/INC/2026/0${reqNum + 8000}`,
        minimizationApplied: true
      }
    };
    const updated = [newReq, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newReq;
  }
};
