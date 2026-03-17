import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { LogIn, Globe, ShieldCheck, Mail, Lock, Database } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Network Error.';
      const dbStatus = err.code === 'ERR_NETWORK' ? ' (Database cluster offline)' : '';
      setError(msg + dbStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex bg-gradient-to-br from-primary to-secondary p-5 rounded-[2rem] mb-6 shadow-teal-glow">
          <Globe className="w-12 h-12 text-slate-900" />
        </div>
        <h1 className="text-5xl font-black mb-3 italic">ACCESS <span className="text-gradient leading-relaxed">PORTAL</span></h1>
        <p className="text-textMuted max-w-sm text-sm font-medium italic">Synchronize your profile to the global node network.</p>
      </div>

      <Card className="w-full max-w-md shadow-luxury relative overflow-hidden !p-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in zoom-in duration-300">
              <Database className="w-4 h-4" />
              {error}
            </div>
          )}

          <Input
            id="email"
            label="Node Identity"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Secure Key"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting}
            className="w-full mt-2 shadow-teal-glow"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-3" /> : <LogIn className="w-5 h-5 mr-3" />}
            {isSubmitting ? 'Authenticating...' : 'Establish Session'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
          <p className="text-textMuted text-sm font-medium">
            New specialist?{' '}
            <Link to="/signup" className="text-primary hover:text-teal-400 underline-offset-8 hover:underline transition-all">
              Initialize Enrollment
            </Link>
          </p>
        </div>
      </Card>
      
      <div className="mt-10 flex items-center gap-2 text-textMuted/40 text-[10px] font-black uppercase tracking-[0.3em]">
        <ShieldCheck className="w-4 h-4" />
        Multi-Factor Node Security Active
      </div>
    </div>
  );
};

export default LoginPage;
