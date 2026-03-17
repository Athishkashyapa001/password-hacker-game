import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import PasswordStrength from '../components/PasswordStrength';
import { 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Award, 
  User, 
  Mail, 
  Lock, 
  Database,
  Cpu,
  Layers
} from 'lucide-react';

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

  // Debugging log to track state changes
  useEffect(() => {
    console.log("Current Step Data:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('CONFLICT: Security keys do not match.');
    }
    if (formData.password.length < 6) {
      return setError('REJECTED: Security key provides insufficient entropy (min 6 chars).');
    }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const processedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(s => s !== ''),
        skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      console.log("Attempting Registration with:", processedData);
      const result = await register(processedData);
      console.log("Registration Success:", result);
      navigate('/dashboard');
    } catch (err) {
      console.error("Registration Error:", err);
      const msg = err.response?.data?.message || 'UPLINK FAILURE: Registration node rejected request.';
      const dbStatus = err.code === 'ERR_NETWORK' || err.message.includes('Network') 
        ? ' [DATABASE_UNREACHABLE]' 
        : '';
      setError(msg + dbStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary/20 blur-[160px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 w-full max-w-xl mb-12 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
          <Cpu className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted">System Initialization v2.4</span>
        </div>
        
        <h1 className="text-6xl font-black mb-4 tracking-tighter text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">MASTER</span>
          <br />
          <span className="text-primary italic neon-glow">PROTOCOL</span>
        </h1>
        
        <p className="text-textMuted text-sm font-medium max-w-sm mx-auto leading-relaxed">
          {step === 1 
            ? "Secure your node on the localized skill-exchange infrastructure." 
            : "Define your resource offering and acquisition requirements."}
        </p>

        {/* Tactical Progress Bar */}
        <div className="flex gap-2 justify-center mt-12 items-center">
            <div className="text-[10px] font-black text-primary font-mono">01</div>
            <div className="h-[2px] w-24 bg-white/5 relative overflow-hidden">
                <div className={`absolute inset-0 bg-primary transition-transform duration-1000 origin-left ${step === 2 ? 'scale-x-100' : 'scale-x-0'}`}></div>
            </div>
            <div className={`text-[10px] font-black font-mono transition-colors ${step === 2 ? 'text-primary' : 'text-white/10'}`}>02</div>
        </div>
      </div>

      <Card className="w-full max-w-xl !p-12 glass-card relative overflow-hidden group">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-sm transition-all group-hover:border-primary"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/30 rounded-br-sm transition-all group-hover:border-secondary"></div>
        
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-6 rounded-xs text-[11px] font-black uppercase tracking-widest mb-10 flex items-center gap-4 animate-in zoom-in duration-300 backdrop-blur-xl">
            <div className="bg-red-500/20 p-2 rounded-full">
                <Database className="w-4 h-4" />
            </div>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep} className="flex flex-col gap-10 relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Input
                id="name"
                label="Node Name"
                type="text"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                placeholder="Operator-X"
                required
                className="group/input"
              />
              <Input
                id="email"
                label="Uplink Email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="auth@secure.net"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-1">
                <Input
                  id="password"
                  label="Primary Key"
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
                placeholder="Match Key"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-6 group">
              PROCEED TO STAGE 2
              <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-3 transition-transform" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="space-y-10">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xs space-y-6">
                    <div className="flex items-center gap-3 font-mono text-[9px] font-black text-primary tracking-[0.4em] uppercase">
                        <Layers className="w-3 h-3" />
                        Resource Allocation
                    </div>
                    <Input
                      id="skillsOffered"
                      label="Available Skills"
                      type="text"
                      icon={Award}
                      value={formData.skillsOffered}
                      onChange={handleChange}
                      placeholder="React, Architecture, Design..."
                      required
                    />
                    <p className="text-[9px] text-textMuted/60 uppercase font-black tracking-widest pl-2">Separate nodes with commas</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xs space-y-6">
                    <div className="flex items-center gap-3 font-mono text-[9px] font-black text-secondary tracking-[0.4em] uppercase">
                        <Target className="w-3 h-3" />
                        Target Acquisition
                    </div>
                    <Input
                      id="skillsWanted"
                      label="Desired Skills"
                      type="text"
                      icon={Cpu}
                      value={formData.skillsWanted}
                      onChange={handleChange}
                      placeholder="Python, AI, DevOps..."
                      required
                    />
                    <p className="text-[9px] text-textMuted/60 uppercase font-black tracking-widest pl-2">Separate nodes with commas</p>
                </div>
            </div>

            <div className="flex gap-6 mt-6">
              <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-3" /> BACK
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-[2] relative">
                {isSubmitting ? (
                    <Spinner size="sm" className="mr-3" />
                ) : (
                    <CheckCircle2 className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                )}
                {isSubmitting ? 'INITIALIZING...' : 'AUTHORIZE ACCOUNT'}
                {isSubmitting && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-12 pt-10 border-t border-white/5 text-center relative z-10">
          <p className="text-textMuted text-[10px] font-black uppercase tracking-[0.2em]">
            Existing Node Operator?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-all underline decoration-primary/30 underline-offset-8">
              Authenticate Here
            </Link>
          </p>
        </div>
      </Card>

      <div className="mt-12 text-textMuted/20 text-[8px] font-mono font-black uppercase tracking-[0.8em] animate-pulse">
        Secure Link Established // 256-bit AES Protection
      </div>
    </div>
  );
};

export default SignupPage;
