import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Search,
  Users,
  Building,
  BellRing,
  HelpCircle,
  BookOpen,
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  CreditCard
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card, CardContent } from '../../components/common/Card';
import scholarshipsData from '../../data/scholarships.json';

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { label: 'Active Scholarship Schemes', value: '10+', desc: 'State & Central Programs' },
    { label: 'Applications Processed', value: '2,500+', desc: 'Submitted 100% Digitally' },
    { label: 'Students Benefited', value: '1,800+', desc: 'Direct Benefit Transfer (DBT)' },
    { label: 'Verification Time', value: 'Instant', desc: 'Direct Revenue Database Link' }
  ];

  const steps = [
    {
      num: '01',
      title: 'Find Scholarship',
      desc: 'Browse state and national scholarship schemes tailored to your course and qualifications.'
    },
    {
      num: '02',
      title: 'Check Eligibility',
      desc: 'Verify minimum marks, courses, and annual family income criteria upfront.'
    },
    {
      num: '03',
      title: 'Submit Application',
      desc: 'Complete the digital application with basic profile and college enrollment details.'
    },
    {
      num: '04',
      title: 'Automated Verification',
      desc: 'Grant one-click consent for instant Revenue Department income verification without physical documents.'
    },
    {
      num: '05',
      title: 'Track & Receive DBT',
      desc: 'Monitor review stages and receive sanctioned scholarship amounts directly into your bank account.'
    }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Paperless Income Verification',
      desc: 'No need to visit government offices for income certificates. Income records are verified electronically with your consent.'
    },
    {
      icon: CreditCard,
      title: 'Direct Benefit Transfer (DBT)',
      desc: 'Sanctioned scholarship grants are disbursed straight to the student’s Aadhaar-seeded bank account through PFMS.'
    },
    {
      icon: Lock,
      title: 'Privacy & Data Protection',
      desc: 'Strict purpose-bound consent ensures only your required annual income is queried, keeping all other records confidential.'
    },
    {
      icon: FileCheck,
      title: 'Real-Time Status Tracking',
      desc: 'Transparent multi-stage progress tracking from application submission to final departmental sanction.'
    }
  ];

  const faqs = [
    {
      q: 'Do I need to visit the Revenue/Tehsildar office to upload an Income Certificate?',
      a: 'No! The National Education Scholarship Portal verifies your annual family income electronically from the Revenue Department database upon your digital consent.'
    },
    {
      q: 'How does the electronic income verification process work?',
      a: 'When you reach Step 7 of the scholarship application, you review and grant digital consent. The portal securely checks your assessed family income from state revenue records and attaches the verified status to your application instantly.'
    },
    {
      q: 'How are scholarship funds disbursed?',
      a: 'Once your application is reviewed and approved by the Education Department Officer, the sanctioned funds are transferred directly to your Aadhaar-linked bank account via Direct Benefit Transfer (DBT).'
    },
    {
      q: 'How can I track the progress of my application?',
      a: 'You can log into your Student Dashboard and visit "My Applications" or "Track Status" to view real-time updates through each verification stage.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-gov-primary to-blue-900 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Year 2026-2027 • Unified Scholarship Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              National Education Scholarship Portal
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl font-normal">
              Discover eligible scholarships, submit applications digitally, complete automated income verification from government records, and receive DBT benefits securely.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/scholarships">
                <Button variant="saffron" size="lg" icon={Search}>
                  Explore Scholarships
                </Button>
              </Link>
              <Link to="/student/applications">
                <Button variant="secondary" size="lg" icon={FileCheck} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Track Application
                </Button>
              </Link>
            </div>

            {/* Feature Highlight */}
            <div className="pt-4 flex items-center gap-2 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Physical Documents Needed for Income: Automated Revenue Records Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Announcements Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-xl border border-amber-200 shadow-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Latest Notice
                </span>
                <span className="text-xs text-slate-500">Academic Year 2026-2027</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                Applications are now open for Post-Matric and STEM Excellence scholarships. Direct Revenue income verification enabled.
              </p>
            </div>
          </div>
          <Link to="/scholarships" className="shrink-0">
            <Button variant="secondary" size="sm" icon={ArrowRight} iconPosition="right">
              Apply Before 15 Oct 2026
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Featured Scholarships Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
              Opportunities for Students
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Featured Scholarships</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an open scholarship program to view eligibility criteria and apply online.
            </p>
          </div>
          <Link to="/scholarships" className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1">
            <span>View All Scholarships ({scholarshipsData.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarshipsData.slice(0, 3).map((scholarship) => (
            <Card key={scholarship.id} hover className="flex flex-col justify-between">
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="gov" size="sm">{scholarship.category}</Badge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {scholarship.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {scholarship.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Annual Benefit:</span>
                    <span className="font-bold text-slate-900">₹{scholarship.amount.toLocaleString('en-IN')} / yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Income Limit:</span>
                    <span className="font-semibold text-slate-800">Below ₹{scholarship.incomeLimit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min. Percentage:</span>
                    <span className="font-semibold text-slate-800">{scholarship.minPercentage}% marks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deadline:</span>
                    <span className="font-bold text-rose-600">{scholarship.deadline}</span>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to={`/scholarships/${scholarship.id}`} className="w-1/2">
                  <Button variant="secondary" size="sm" className="w-full">
                    Details
                  </Button>
                </Link>
                <Link to={`/student/apply?scholarshipId=${scholarship.id}`} className="w-1/2">
                  <Button variant="primary" size="sm" className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Portal Statistics */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Platform Reach & Efficiency</h3>
              <p className="text-xs text-slate-400 mt-1">
                Delivering scholarship benefits directly to eligible students across the country.
              </p>
            </div>
            <div className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700 font-medium">
              National Scholarship Service
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-amber-400">{item.value}</p>
                <p className="text-sm font-bold text-slate-100">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works (5 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            Simple 5-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How to Apply
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Transparent online workflow with instant electronic income verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-primary flex items-center justify-center font-black text-sm mb-3 border border-blue-100">
                  {s.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Key Digital Service Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gov-primary via-blue-900 to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Citizen-Centric Digital Service
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Apply Through the National Scholarship Portal?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Designed to eliminate paperwork, reduce verification delays, and ensure every eligible student receives educational assistance without hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-xs rounded-xl p-5 border border-white/15 space-y-2.5">
                  <div className="w-10 h-10 rounded-lg bg-white/20 text-amber-300 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
            Helpful Answers
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <span className="text-sm font-bold text-slate-800">{faq.q}</span>
                <span className="text-xs font-bold text-gov-primary shrink-0">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
