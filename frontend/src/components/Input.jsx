import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, id, className = '', ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-textPrimary">
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        ref={ref}
        className={`bg-slate-900 border ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-primary'
        } rounded-lg px-4 py-2.5 text-textPrimary placeholder-textMuted focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-red-500' : 'focus:ring-primary'
        } transition-colors`}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${helperText ? helperId : ''}`}
        {...props}
      />
      
      {error && (
        <span id={errorId} className="text-sm text-red-400" role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={helperId} className="text-sm text-textMuted">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
