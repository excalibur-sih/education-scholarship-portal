import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const AlertBanner = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
  action
}) => {
  const types = {
    info: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    error: {
      bg: 'bg-rose-50/80 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
    },
    sih: {
      bg: 'bg-indigo-50/90 border-indigo-200 text-indigo-950',
      icon: Info,
      iconColor: 'text-indigo-600',
    }
  };

  const current = types[type] || types.info;
  const IconComponent = current.icon;

  return (
    <div className={`rounded-lg border p-4 ${current.bg} ${className}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 mt-0.5 shrink-0 ${current.iconColor}`} />
        <div className="flex-1">
          {title && <h4 className="text-sm font-bold tracking-tight">{title}</h4>}
          <div className="text-xs leading-relaxed mt-0.5">{children}</div>
          {action && <div className="mt-2.5">{action}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
