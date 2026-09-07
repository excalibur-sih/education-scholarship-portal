import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/common/Card';

export const FAQPage = () => {
  const [activeIdx, setActiveIdx] = useState(null);
  const [filter, setFilter] = useState('');

  const faqItems = [
    {
      q: "How does the portal verify my annual family income?",
      a: "When you apply for a scholarship, you authorize electronic verification. The portal queries the state Revenue Department database directly using your Citizen ID/Aadhaar reference and retrieves your certified annual family income without requiring physical certificate uploads."
    },
    {
      q: "Do I need to visit the Tehsildar or Revenue office for an Income Certificate?",
      a: "No! The National Education Scholarship Portal automatically verifies your annual family income electronically from the Revenue Department database upon your digital consent."
    },
    {
      q: "Is my personal data secure during electronic verification?",
      a: "Yes. Strict data protection rules are enforced. Only the verified annual income figure needed for scholarship eligibility is retrieved; other tax, land, or banking records remain completely confidential."
    },
    {
      q: "How can I track the progress of my scholarship application?",
      a: "Once you submit your application, you can navigate to 'My Applications' or 'Application Tracking' in your student dashboard to see real-time updates through each verification stage."
    },
    {
      q: "What should I do if my Revenue Department income record needs updating?",
      a: "If your family income has changed, you can update your income certificate with your local Tehsil/Sub-Divisional Revenue office. Once updated in the state revenue records, you can re-verify your income record on this portal."
    },
    {
      q: "How will I receive the scholarship funds once approved?",
      a: "Approved scholarship amounts are credited directly to your Aadhaar-seeded bank account via Direct Benefit Transfer (DBT) under the Public Financial Management System (PFMS)."
    }
  ];

  const filtered = faqItems.filter(
    (item) =>
      item.q.toLowerCase().includes(filter.toLowerCase()) ||
      item.a.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gov-primary">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Common queries about scholarship eligibility, automated income verification, and Direct Benefit Transfer (DBT).
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search questions or keywords (e.g., 'income verification', 'documents', 'DBT transfer')..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Accordions */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = activeIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              <button
                onClick={() => setActiveIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gov-primary shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
