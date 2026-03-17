import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-slate-900 hover:bg-teal-400 active:bg-teal-600",
    secondary: "bg-surface text-textPrimary hover:bg-slate-700 active:bg-slate-600 border border-slate-700",
    ghost: "text-textMuted hover:text-textPrimary hover:bg-surface/50 active:bg-surface",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 active:bg-red-500/30"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
