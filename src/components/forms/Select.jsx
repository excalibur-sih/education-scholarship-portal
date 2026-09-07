import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`block w-full rounded-md border text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-150 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-rose-500'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
        }`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

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
