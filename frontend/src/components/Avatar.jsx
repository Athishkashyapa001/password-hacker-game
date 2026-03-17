import React from 'react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const fallbackChar = alt ? alt.charAt(0).toUpperCase() : '?';

  return (
    <div className={`relative inline-block ${sizes[size]} rounded-full overflow-hidden bg-slate-700 border-2 border-slate-800 shrink-0 ${className}`}>
      {src ? (
        <img 
          src={src.startsWith('http') ? src : `http://localhost:5000${src}`} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
        />
      ) : null}
      <div className="absolute inset-0 flex items-center justify-center text-textPrimary font-bold">
        {!src && fallbackChar}
      </div>
    </div>
  );
};

export default Avatar;
