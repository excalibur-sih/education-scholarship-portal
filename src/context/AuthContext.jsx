import React, { createContext, useContext, useState, useEffect } from 'react';
import studentData from '../data/student.json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('portal_user') || localStorage.getItem('mahasetu_user');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.role === 'student' || parsed.role === 'officer')) {
          return parsed;
        }
      } catch (e) {
        console.error('Invalid saved user session:', e);
      }
      localStorage.removeItem('portal_user');
      localStorage.removeItem('mahasetu_user');
    }

    // Explicitly null - no automatic default login
    return null;
  });

  useEffect(() => {
    if (user && (user.role === 'student' || user.role === 'officer')) {
      localStorage.setItem('portal_user', JSON.stringify(user));
      localStorage.setItem('mahasetu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('portal_user');
      localStorage.removeItem('mahasetu_user');
    }
  }, [user]);

  const loginAsStudent = (credentials = {}) => {
    const studentUser = {
      role: 'student',
      id: credentials.studentId || 'STU2026001',
      name: credentials.name || 'pratik patil',
      email: credentials.email || 'rahul.sharma@example.edu.in',
      citizenId: credentials.citizenId || 'CIT005',
      profile: studentData
    };

    setUser(studentUser);
    localStorage.setItem('portal_user', JSON.stringify(studentUser));
    localStorage.setItem('mahasetu_user', JSON.stringify(studentUser));
    return studentUser;
  };

  const loginAsOfficer = (credentials = {}) => {
    const officerUser = {
      role: 'officer',
      id: credentials.officerId || 'OFF-EDU-2026-89',
      name: 'Dr. V. K. Patil',
      designation: 'Senior Education Officer & Scholarship Verifier',
      department: 'Higher & Technical Education Department',
      email: 'vk.patil@mahaedu.gov.in',
      badge: 'Official Verifier #MH-04'
    };

    setUser(officerUser);
    localStorage.setItem('portal_user', JSON.stringify(officerUser));
    localStorage.setItem('mahasetu_user', JSON.stringify(officerUser));
    return officerUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portal_user');
    localStorage.removeItem('mahasetu_user');
  };

  const switchRole = (newRole) => {
    if (newRole === 'officer') {
      return loginAsOfficer();
    }

    if (newRole === 'student') {
      return loginAsStudent();
    }

    logout();
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && (user.role === 'student' || user.role === 'officer'),
        isStudent: user?.role === 'student',
        isOfficer: user?.role === 'officer',
        loginAsStudent,
        loginAsOfficer,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};