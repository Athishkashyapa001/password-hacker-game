import { LogIn, Globe, ShieldCheck, Mail, Lock, Database, Cpu, Activity } from 'lucide-react';

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
      console.log("Attempting Session Establishment for:", email);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || 'AUTHENTICATION_FAILED: Credential mismatch.';
      const dbStatus = err.code === 'ERR_NETWORK' || err.message.includes('Network') 
        ? ' [UPLINK_OFFLINE]' 
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
        <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-primary/10 blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/2 bg-secondary/10 blur-[160px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mb-12 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Activity className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted">Session Protocol Active</span>
        </div>
        
        <h1 className="text-6xl font-black mb-4 tracking-tighter text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">SECURE</span>
          <br />
          <span className="text-secondary italic neon-glow">GATEWAY</span>
        </h1>
        <p className="text-textMuted text-sm font-medium italic">Synchronize your node identity with the centralized matrix.</p>
      </div>

      <Card className="w-full max-w-md !p-12 glass-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-sm transition-all group-hover:border-primary"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary/30 rounded-bl-sm transition-all group-hover:border-secondary"></div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 relative z-10">
          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-6 rounded-xs text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-4 animate-in zoom-in duration-300">
              <Database className="w-4 h-4 text-red-500" />
              {error}
            </div>
          )}

          <Input
            id="email"
            label="Node Identifier"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="operator@secure.net"
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Authorization Key"
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
            className="w-full mt-4 shadow-teal-glow"
          >
            {isSubmitting ? <Spinner size="sm" className="mr-3" /> : <LogIn className="w-5 h-5 mr-3" />}
            {isSubmitting ? 'SYNCHRONIZING...' : 'ESTABLISH SESSION'}
          </Button>
        </form>

        <div className="mt-12 pt-10 border-t border-white/5 text-center relative z-10">
          <p className="text-textMuted text-[10px] font-black uppercase tracking-[0.2em]">
            New Specialist?{' '}
            <Link to="/signup" className="text-secondary hover:text-white transition-all underline decoration-secondary/30 underline-offset-8">
              Initialize Enrollment
            </Link>
          </p>
        </div>
      </Card>
      
      <div className="mt-12 flex items-center gap-3 text-textMuted/30 text-[9px] font-black uppercase tracking-[0.4em]">
        <ShieldCheck className="w-4 h-4 text-primary" />
        End-to-End Encrypted Node Communication
      </div>
    </div>
  );
};

export default LoginPage;
