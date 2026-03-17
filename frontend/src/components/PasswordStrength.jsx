import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Not Entered', color: 'bg-slate-800', text: 'text-textMuted', icon: Shield };
    if (pass.length > 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500', icon: ShieldAlert };
    if (score === 2) return { score, label: 'Moderate', color: 'bg-yellow-500', text: 'text-yellow-500', icon: ShieldAlert };
    if (score === 3) return { score, label: 'Strong', color: 'bg-primary', text: 'text-primary', icon: ShieldCheck };
    return { score, label: 'Elite', color: 'bg-secondary shadow-teal-glow', text: 'text-secondary font-black', icon: Zap };
  };

  const strength = getStrength(password);

  return (
    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
            <strength.icon className={`w-3 h-3 ${strength.text}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${strength.text}`}>
                Security: {strength.label}
            </span>
        </div>
        <span className="text-[10px] font-bold text-textMuted">{strength.score * 25}%</span>
      </div>
      
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className={`h-full flex-1 transition-all duration-700 ${
              step <= strength.score ? strength.color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
      
      {password && strength.score < 3 && (
        <p className="mt-2 text-[9px] text-textMuted italic font-medium">
            Pro Tip: Use uppercase, numbers, and symbols for an Elite rating.
        </p>
      )}
    </div>
  );
};

export default PasswordStrength;
