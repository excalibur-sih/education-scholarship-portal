import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Key,
  LogIn,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { Checkbox } from '../../components/forms/Checkbox';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const LoginPage = () => {
  const [role, setRole] = useState('student'); // 'student' or 'officer'
  const [identifier, setIdentifier] = useState('STU2026001');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const { loginAsStudent, loginAsOfficer } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'student') {
      const student = loginAsStudent({ studentId: identifier });
      addNotification({
        title: `Welcome, ${student.name}`,
        message: "Logged into National Education Scholarship Portal.",
        type: "SUCCESS"
      });
      navigate('/student/dashboard');
    } else {
      const officer = loginAsOfficer({ officerId: identifier });
      addNotification({
        title: `Welcome, ${officer.name}`,
        message: "Logged into Education Officer Review Portal.",
        type: "SUCCESS"
      });
      navigate('/officer/dashboard');
    }
  };

  const handleQuickStudentLogin = () => {
    setRole('student');
    setIdentifier('STU2026001');
    const student = loginAsStudent({ studentId: 'STU2026001' });
    addNotification({
      title: `Welcome, ${student.name}`,
      message: "Logged into National Education Scholarship Portal.",
      type: "SUCCESS"
    });
    navigate('/student/dashboard');
  };

  const handleQuickOfficerLogin = () => {
    setRole('officer');
    setIdentifier('OFF-EDU-2026-89');
    const officer = loginAsOfficer({ officerId: 'OFF-EDU-2026-89' });
    addNotification({
      title: `Welcome, ${officer.name}`,
      message: "Logged into Education Officer Review Portal.",
      type: "SUCCESS"
    });
    navigate('/officer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gov-primary to-blue-900 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-blue-50">
            <GraduationCap className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal Authentication
          </h2>
          <p className="text-xs text-slate-500">
            Secure single-window sign in for Students & Department Officers
          </p>
        </div>

        {/* Quick Login Helper Box */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Demonstration Account Shortcuts</span>
            <Badge variant="gov" size="sm">Quick Sign In</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickStudentLogin}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:border-blue-500 hover:bg-blue-50/50 transition shadow-2xs text-left"
            >
              <div className="flex items-center gap-1.5 text-gov-primary">
                <User className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">Rahul Sharma</span>
            </button>

            <button
              type="button"
              onClick={handleQuickOfficerLogin}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:border-amber-500 hover:bg-amber-50/50 transition shadow-2xs text-left"
            >
              <div className="flex items-center gap-1.5 text-amber-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Officer Login</span>
              </div>
              <span className="text-[10px] text-slate-500 font-normal block mt-0.5">Dr. V. K. Patil</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-5">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setIdentifier('STU2026001');
              }}
              className={`py-2 text-xs font-bold rounded-md transition ${
                role === 'student'
                  ? 'bg-white text-gov-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('officer');
                setIdentifier('OFF-EDU-2026-89');
              }}
              className={`py-2 text-xs font-bold rounded-md transition ${
                role === 'officer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Department Officer
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={role === 'student' ? 'Student ID / Registration ID' : 'Officer ID'}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={role === 'student' ? 'STU2026001' : 'OFF-EDU-2026-89'}
              prefix={<User className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              prefix={<Key className="w-4 h-4" />}
            />

            <div className="flex items-center justify-between text-xs">
              <Checkbox
                name="remember"
                label="Remember Me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                onClick={() => alert("Password reset link will be sent to registered mobile/email.")}
                className="text-gov-primary font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              icon={LogIn}
              className="w-full"
            >
              Sign In as {role === 'student' ? 'Student' : 'Department Officer'}
            </Button>
          </form>

          {role === 'student' && (
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
              New student applying for the first time?{' '}
              <Link to="/register" className="font-bold text-gov-primary hover:underline">
                Register New Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
