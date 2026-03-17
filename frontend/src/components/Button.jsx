import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  
  const variants = {
    primary: 'bg-gradient-to-br from-primary via-primary to-secondary text-slate-900 font-black tracking-widest uppercase text-xs shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 active:scale-95',
    ghost: 'bg-transparent text-textMuted hover:text-primary hover:bg-primary/5 active:scale-95',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-4 text-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-sm font-medium transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
