import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`block w-full rounded-lg border text-sm transition-colors duration-150 py-2.5 px-3.5
            bg-white dark:bg-slate-900 text-slate-900 dark:text-white
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${
              error
                ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
            }
            disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
