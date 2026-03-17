import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { LogIn, Globe, ShieldCheck } from 'lucide-react';

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
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex bg-gradient-to-br from-primary to-secondary p-4 rounded-3xl mb-6 shadow-teal-glow">
          <Globe className="w-10 h-10 text-slate-900" />
        </div>
        <h1 className="text-4xl font-black mb-3">Welcome <span className="text-gradient">Back</span></h1>
        <p className="text-textMuted max-w-sm">Log in to your portal and resume your skill exchanges.</p>
      </div>

      <Card className="w-full max-w-md shadow-luxury relative overflow-hidden">
        {/* Subtle accent light */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full"></div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-in fade-in zoom-in duration-300 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <Input
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Verifying...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
          <p className="text-textMuted text-sm font-medium">
            New to the community?{' '}
            <Link to="/signup" className="text-primary hover:text-teal-400 underline-offset-4 hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </Card>
      
      <div className="mt-8 flex items-center gap-2 text-textMuted/40 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3" />
        Secure Enterprise Authentication
      </div>
    </div>
  );
};

export default LoginPage;
