import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-slate-900 font-bold shadow-teal-glow hover:opacity-90 active:scale-95',
    secondary: 'bg-surface/50 backdrop-blur-md border border-slate-700 text-textPrimary hover:bg-slate-800 active:scale-95',
    ghost: 'bg-transparent text-textMuted hover:text-textPrimary hover:bg-white/5 active:scale-95',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
