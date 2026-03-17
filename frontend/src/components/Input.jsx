import React from 'react';

const Input = React.forwardRef(({ label, error, id, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-textMuted ml-1 tracking-wide uppercase text-[10px] flex items-center gap-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-secondary transition-colors pointer-events-none z-10">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`glass-card !bg-white/10 !p-4 ${Icon ? 'pl-12' : ''} rounded-xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 w-full`}
          style={{ 
            color: 'white', 
            WebkitTextFillColor: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }} 
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-[10px] font-black uppercase text-red-400 ml-1 tracking-widest animate-in fade-in duration-300" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
