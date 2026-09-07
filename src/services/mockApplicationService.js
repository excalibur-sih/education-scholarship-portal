import applicationsData from '../data/applications.json';

const STORAGE_KEY = 'mahasetu_applications';

export const mockApplicationService = {
  getAll: () => {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Error reading applications:', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applicationsData));
    return applicationsData;
  },

  getById: (id) => {
    const list = mockApplicationService.getAll();
    return list.find((app) => app.id === id) || null;
  },

  getByStudentId: (studentId) => {
    const list = mockApplicationService.getAll();
    return list.filter((app) => app.studentId === studentId);
  },

  create: (newApp) => {
    const list = mockApplicationService.getAll();
    const appId = `APP${1000 + list.length + 1}`;
    const application = {
      id: appId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'UNDER_REVIEW',
      documentsStatus: 'VERIFIED',
      academicStatus: 'VERIFIED',
      officerReviewStatus: 'PENDING',
      timeline: [
        {
          step: 'Application Submitted',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'COMPLETED',
          description: 'Application submitted successfully with student digital verification.'
        },
        {
          step: 'Documents Verified',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'COMPLETED',
          description: 'Uploaded certificates and marksheet validated.'
        },
        {
          step: 'Income Verification',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'COMPLETED',
          description: `Verified with Revenue Department records. Income: ₹${(newApp.incomeVerification?.amount || 250000).toLocaleString('en-IN')}.`
        },
        {
          step: 'Academic Verification',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'COMPLETED',
          description: 'Institution enrollment & score verified.'
        },
        {
          step: 'Officer Review',
          date: 'In Progress',
          status: 'CURRENT',
          description: 'Queued for Education Officer approval.'
        },
        {
          step: 'Final Decision & Disbursement',
          date: 'Pending Review',
          status: 'PENDING',
          description: 'Scholarship grant sanction.'
        }
      ],
      ...newApp
    };
    const updated = [application, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return application;
  },

  updateStatus: (appId, newStatus, officerComments = '') => {
    const list = mockApplicationService.getAll();
    const index = list.findIndex((a) => a.id === appId);
    if (index === -1) return null;

    const current = list[index];
    const updatedTimeline = current.timeline.map((item) => {
      if (item.step === 'Officer Review') {
        return {
          ...item,
          status: 'COMPLETED',
          description: `Reviewed by Education Officer: ${newStatus === 'APPROVED' ? 'Application meets all criteria.' : officerComments || 'Decision recorded.'}`
        };
      }
      if (item.step === 'Final Decision & Disbursement') {
        return {
          ...item,
          status: newStatus === 'APPROVED' ? 'COMPLETED' : newStatus === 'REJECTED' ? 'REJECTED' : 'PENDING',
          description: newStatus === 'APPROVED' ? 'Sanction order approved for DBT transfer.' : newStatus === 'REJECTED' ? 'Application rejected during review.' : item.description
        };
      }
      return item;
    });

    current.status = newStatus;
    current.officerReviewStatus = newStatus;
    current.officerComments = officerComments;
    current.timeline = updatedTimeline;

    list[index] = current;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return current;
  },

  saveDraft: (draftData) => {
    localStorage.setItem('mahasetu_application_draft', JSON.stringify(draftData));
  },

  getDraft: () => {
    const local = localStorage.getItem('mahasetu_application_draft');
    return local ? JSON.parse(local) : null;
  },

  clearDraft: () => {
    localStorage.removeItem('mahasetu_application_draft');
  }
};
