import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/forms/Input';
import { useNotifications } from '../../context/NotificationContext';

export const HelpPage = () => {
  const { addNotification } = useNotifications();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Income Verification Query',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addNotification({
      title: "Support Ticket Registered",
      message: "Your inquiry has been logged with the Scholarship Helpdesk. Reference: TKT-2026-981.",
      type: "SUCCESS"
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Support & Helpdesk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gov-primary">
          Help, Support & Citizen Grievance Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Assistance with scholarship application submission, automated income verification, and technical inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submit Inquiry Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Submit a Helpdesk Ticket
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Ticket Registered Successfully</h3>
              <p className="text-xs text-emerald-800">
                Ticket Reference: <strong>TKT-2026-981</strong>. Our scholarship support desk responds within 24 business hours.
              </p>
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="student@example.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Inquiry Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Income Verification Query">Automated Income Verification Query</option>
                  <option value="Application Status">Scholarship Application Status</option>
                  <option value="Document Upload">Document Locker & Uploads</option>
                  <option value="Technical Issue">Portal Login & Technical Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message / Grievance Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your query in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <Button variant="primary" type="submit" icon={Send}>
                  Submit Ticket
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Col: Contact Information */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Direct Contact
            </h3>

            <div className="flex items-start gap-3 text-xs">
              <Phone className="w-4 h-4 text-gov-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Toll-Free Helpline:</span>
                <p className="text-slate-600 font-mono mt-0.5">1800-233-4567 / 020-25698412</p>
                <p className="text-[10px] text-slate-400">Mon - Sat (9:30 AM to 6:00 PM)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <Mail className="w-4 h-4 text-gov-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Official Email:</span>
                <p className="text-slate-600 font-mono mt-0.5">helpdesk.scholarship@gov.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4 h-4 text-gov-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Directorate Office:</span>
                <p className="text-slate-600 leading-snug mt-0.5">
                  Directorate of Higher Education, Central Building, Shivaji Nagar, Pune - 411001
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-gov-primary" />
              <span>Grievance Redressal Officer</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              For escalation of unaddressed scholarship applications or income verification discrepancies, contact the Nodal Grievance Officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
