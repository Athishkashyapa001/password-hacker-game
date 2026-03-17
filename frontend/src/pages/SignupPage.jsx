import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { UserPlus, Globe, CheckCircle2, ArrowRight, ArrowLeft, Target, Award } from 'lucide-react';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillsOffered: '',
    skillsWanted: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Split comma-separated skills into arrays
      const processedData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(s => s !== ''),
        skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      await register(processedData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
      {/* Progress Header */}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex bg-gradient-to-br from-primary to-secondary p-4 rounded-3xl mb-6 shadow-teal-glow">
          <Globe className="w-10 h-1h text-slate-900" />
        </div>
        <h1 className="text-4xl font-black mb-3">
          Step <span className="text-gradient">{step}</span> of 2
        </h1>
        <p className="text-textMuted max-w-sm">
          {step === 1 
            ? "Let's start with the basics to secure your account." 
            : "Now tell us what you bring to the table and what you're looking for."}
        </p>

        {/* Mini progress bar */}
        <div className="flex gap-2 justify-center mt-6">
          <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary shadow-teal-glow' : 'bg-slate-800'}`}></div>
          <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary shadow-teal-glow' : 'bg-slate-800'}`}></div>
        </div>
      </div>

      <Card className="w-full max-w-xl shadow-luxury">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="name"
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Secure password"
                required
                minLength={6}
              />
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4 group">
              Next Step
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute top-0 right-0 py-2">
                  <Award className="w-4 h-4 text-primary opacity-50" />
                </div>
                <Input
                  id="skillsOffered"
                  label="I can help with..."
                  type="text"
                  value={formData.skillsOffered}
                  onChange={handleChange}
                  placeholder="e.g. React, UI Design, Cooking (comma separated)"
                  required
                />
                <p className="mt-2 text-[10px] text-textMuted uppercase tracking-widest font-bold">Skills you offer to others</p>
              </div>

              <div className="relative">
                <div className="absolute top-0 right-0 py-2">
                  <Target className="w-4 h-4 text-secondary opacity-50" />
                </div>
                <Input
                  id="skillsWanted"
                  label="I want to learn..."
                  type="text"
                  value={formData.skillsWanted}
                  onChange={handleChange}
                  placeholder="e.g. Python, Photography, Piano (comma separated)"
                  required
                />
                <p className="mt-2 text-[10px] text-textMuted uppercase tracking-widest font-bold">Skills you seek to acquire</p>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" /> back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-[2]">
                {isSubmitting ? <Spinner size="sm" className="mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {isSubmitting ? 'Finalizing...' : 'Create My Account'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-textMuted text-sm font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-primary hover:text-teal-400 underline-offset-4 hover:underline transition-all">
              Sign in to your portal
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
