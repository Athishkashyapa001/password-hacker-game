import React from 'react';

const Card = ({ children, className = '', hoverable = false, title, ...props }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-500 ${hoverable ? 'hover:translate-y-[-4px] hover:shadow-luxury hover:border-slate-600' : ''} ${className}`}
      {...props}
    >
      {title && <h3 className="text-xl font-bold mb-6 text-gradient">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
