import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { LogIn, Globe } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (default to dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex bg-primary p-3 rounded-2xl mb-4 shadow-custom">
          <Globe className="w-8 h-8 text-slate-900" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-textMuted">Log in to continue swapping skills</p>
      </div>

      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
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
            className="w-full py-3"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm">
          <span className="text-textMuted text-body">Don't have an account? </span>
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
