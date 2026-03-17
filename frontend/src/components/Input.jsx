import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, id, className = '', ...props }, ref) => {
  

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-textMuted ml-1 tracking-wide uppercase text-[10px]">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className="glass-card !bg-white/5 !p-4 rounded-xl text-textPrimary placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
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
