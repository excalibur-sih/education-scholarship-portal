import React, { useState } from 'react';
import { Copy, Check, FileJson } from 'lucide-react';

export const JsonViewer = ({
  data,
  title = 'Education JSON Request',
  subtitle = 'Standard REST/JSON Schema',
  maxHeight = 'max-h-80',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const formatted = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg border border-slate-800 bg-[#0d1117] text-slate-200 overflow-hidden shadow-lg ${className}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">{title}</span>
          {subtitle && <span className="text-[11px] text-slate-400 hidden sm:inline">({subtitle})</span>}
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-mono">
            JSON
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
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className={`p-4 overflow-x-auto ${maxHeight} text-xs font-mono leading-relaxed`}>
        <pre className="text-amber-200/90">
          <code>{formatted}</code>
        </pre>
      </div>
    </div>
  );
};
