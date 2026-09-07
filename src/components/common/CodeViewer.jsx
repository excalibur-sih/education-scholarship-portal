import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

export const CodeViewer = ({
  code,
  language = 'json',
  title,
  subtitle,
  badge,
  maxHeight = 'max-h-96',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const formattedCode =
    typeof code === 'object' ? JSON.stringify(code, null, 2) : String(code || '').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-md overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {language === 'xml' ? (
            <Terminal className="w-4 h-4 text-emerald-400" />
          ) : (
            <FileCode className="w-4 h-4 text-amber-400" />
          )}
          <div>
            <span className="text-xs font-semibold text-slate-200">
              {title || (language === 'xml' ? 'XML Payload' : 'JSON Payload')}
            </span>
            {subtitle && <span className="text-xs text-slate-400 ml-2">({subtitle})</span>}
          </div>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          title="Copy payload to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy {language.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className={`p-4 overflow-x-auto ${maxHeight} text-xs leading-relaxed font-mono selection:bg-blue-600 selection:text-white`}>
        <pre className="text-slate-200">
          <code>{formattedCode}</code>
        </pre>
      </div>
    </div>
  );
};
