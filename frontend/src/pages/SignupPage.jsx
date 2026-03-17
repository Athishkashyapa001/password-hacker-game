import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import PasswordStrength from '../components/PasswordStrength';
import { UserPlus, Globe, CheckCircle2, ArrowRight, ArrowLeft, Target, Award, User, Mail, Lock, Database } from 'lucide-react';

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
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
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
      const msg = err.response?.data?.message || 'Registration failed. Network Error.';
      const dbStatus = err.code === 'ERR_NETWORK' ? ' (Database cluster offline)' : '';
      setError(msg + dbStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[95vh] flex flex-col items-center justify-center p-4">
      {/* Progress Header */}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="inline-flex bg-gradient-to-br from-primary to-secondary p-5 rounded-[2rem] mb-6 shadow-teal-glow">
          <Globe className="w-12 h-12 text-slate-900" />
        </div>
        <h1 className="text-5xl font-black mb-3 italic">
          NODE <span className="text-gradient leading-relaxed">ENROLLMENT</span>
        </h1>
        <p className="text-textMuted max-w-sm text-sm font-medium">
          {step === 1 
            ? "Establish your identity on the global skill network." 
            : "Configure your expertise and requirement nodes."}
        </p>

        {/* Mini progress bar */}
        <div className="flex gap-3 justify-center mt-8">
          <div className={`h-1.5 w-16 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-primary shadow-teal-glow' : 'bg-white/5'}`}></div>
          <div className={`h-1.5 w-16 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-primary shadow-teal-glow' : 'bg-white/5'}`}></div>
        </div>
      </div>

      <Card className="w-full max-w-xl shadow-luxury !p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-[1.25rem] text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3 animate-in zoom-in duration-300">
            <Database className="w-4 h-4" />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep} className="flex flex-col gap-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                id="name"
                label="Identity Name"
                type="text"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: John Doe"
                required
              />
              <Input
                id="email"
                label="Network Address"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="email@provider.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <Input
                  id="password"
                  label="Secure Key"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <PasswordStrength password={formData.password} />
              </div>
              <Input
                id="confirmPassword"
                label="Verify Key"
                type="password"
                icon={ShieldCheck}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Key"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full mt-4 group shadow-teal-glow">
              Initialize Step 2
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
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
