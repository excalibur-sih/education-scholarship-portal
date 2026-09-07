import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className = ''
}) => {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      border: 'border-l-blue-600',
    },
    green: {
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      border: 'border-l-emerald-600',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      border: 'border-l-amber-500',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      border: 'border-l-purple-600',
    },
    navy: {
      iconBg: 'bg-gov-primary/10 text-gov-primary border-gov-primary/20',
      border: 'border-l-gov-primary',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-5 shadow-xs border-l-4 ${scheme.border} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-lg border flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>{subtitle}</span>
          {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
        </div>
      )}
    </div>
  );
};
