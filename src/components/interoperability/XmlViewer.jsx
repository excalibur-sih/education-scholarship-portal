import React, { useState } from 'react';
import { Copy, Check, Code2, ShieldAlert } from 'lucide-react';

export const XmlViewer = ({
  data,
  title = 'Sample Revenue Department XML Response',
  subtitle = 'Demonstration Data - Legacy XML Schema',
  maxHeight = 'max-h-80',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const formatted = String(data || '').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg border border-slate-800 bg-[#0d1117] text-slate-200 overflow-hidden shadow-lg ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">{title}</span>
          {subtitle && <span className="text-[11px] text-slate-400 hidden sm:inline">({subtitle})</span>}
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-mono">
            XML
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy XML</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-amber-950/30 border-b border-amber-900/40 px-4 py-1.5 flex items-center gap-2 text-[11px] text-amber-300">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <span>Demonstration Data: Real-world legacy departmental systems often respond in XML.</span>
      </div>

      <div className={`p-4 overflow-x-auto ${maxHeight} text-xs font-mono leading-relaxed`}>
        <pre className="text-emerald-200/90">
          <code>{formatted}</code>
        </pre>
      </div>
    </div>
  );
};
