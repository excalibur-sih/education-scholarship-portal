import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  LogIn,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  BookOpen,
  HelpCircle,
  FileCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { Button } from '../common/Button';

export const GovHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isStudent, isOfficer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Portal Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gov-primary to-gov-secondary text-white flex items-center justify-center shadow-md ring-2 ring-blue-100 group-hover:scale-105 transition">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gov-saffron">
                  Ministry of Education
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-100">
                  Government Portal
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-gov-primary tracking-tight leading-tight">
                National Education Scholarship Portal
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Direct Benefit Transfer (DBT) & Automated Verification System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <NavLink
              to="/scholarships"
              className={({ isActive }) =>
                `hover:text-gov-primary transition ${isActive ? 'text-gov-primary border-b-2 border-gov-primary pb-1' : ''}`
              }
            >
              Scholarships
            </NavLink>
            <NavLink
              to="/guidelines"
              className={({ isActive }) =>
                `hover:text-gov-primary transition ${isActive ? 'text-gov-primary border-b-2 border-gov-primary pb-1' : ''}`
              }
            >
              Guidelines
            </NavLink>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `hover:text-gov-primary transition ${isActive ? 'text-gov-primary border-b-2 border-gov-primary pb-1' : ''}`
              }
            >
              FAQ
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `hover:text-gov-primary transition ${isActive ? 'text-gov-primary border-b-2 border-gov-primary pb-1' : ''}`
              }
            >
              Help & Support
            </NavLink>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-md bg-gov-primary text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">
                      {isOfficer ? 'Education Officer' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    {isStudent && (
                      <>
                        <Link
                          to="/student/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-gov-primary"
                        >
                          <User className="w-4 h-4" />
                          <span>Student Dashboard</span>
                        </Link>
                        <Link
                          to="/student/applications"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-gov-primary"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/student/income-verification"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-gov-primary"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Income Verification</span>
                        </Link>
                      </>
                    )}

                    {isOfficer && (
                      <>
                        <Link
                          to="/officer/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-gov-primary"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Officer Review Desk</span>
                        </Link>
                        <Link
                          to="/officer/verifications"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-gov-primary"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Verification Logs</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm" icon={LogIn}>
                    Login
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline-block">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold">
            <Link
              to="/scholarships"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Scholarships
            </Link>
            <Link
              to="/guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Guidelines
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              FAQ
            </Link>
            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Help & Support
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isOfficer ? '/officer/dashboard' : '/student/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="sm" className="w-full">
                    Go to Portal Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 text-center py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
