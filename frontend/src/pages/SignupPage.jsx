import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { UserPlus, Globe } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex bg-primary p-3 rounded-2xl mb-4 shadow-custom">
          <Globe className="w-8 h-8 text-slate-900" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-textMuted">Join the community and start swapping skills</p>
      </div>

      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          <Input
            id="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            autoComplete="name"
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="min. 6 characters"
            required
            autoComplete="new-password"
            minLength={6}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            required
            autoComplete="new-password"
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 mt-2"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm">
          <span className="text-textMuted">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Log in instead
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
