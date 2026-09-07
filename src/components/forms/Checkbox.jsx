import React from 'react';

export const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error,
  className = ''
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id || name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded border-slate-300 text-gov-primary focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      <div className="ml-3 text-xs">
        {label && (
          <label htmlFor={id || name} className="font-semibold text-slate-800 cursor-pointer">
            {label}
          </label>
        )}
        {description && <p className="text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
        {error && <p className="text-rose-600 font-medium mt-1">{error}</p>}
      </div>
    </div>
  );
};
