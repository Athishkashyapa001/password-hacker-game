import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const baseStyle = "bg-surface rounded-xl border border-slate-800 p-6";
  const hoverStyle = hoverable ? "transition-transform hover:-translate-y-1 hover:shadow-custom cursor-pointer" : "";

  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
