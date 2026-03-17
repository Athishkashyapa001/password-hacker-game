import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Globe, Cpu, Activity, Shield } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-6 z-50 px-6 mb-12">
      <div className="max-w-7xl mx-auto glass-card !p-4 rounded-sm flex items-center justify-between border-b-2 border-primary/20">
        <Link to="/" className="flex items-center gap-4 group ml-2">
          <div className="bg-primary p-2 rounded-sm group-hover:rotate-90 transition-transform duration-500 shadow-teal-glow">
            <Cpu className="w-5 h-5 text-slate-900" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.2em] text-white hidden sm:block">ROUTEMASTER</span>
            <span className="text-[8px] font-black text-primary tracking-[0.5em] hidden sm:block uppercase">Core Matrix v4.0</span>
          </div>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-12">
            <Link to="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary ${location.pathname === '/dashboard' ? 'text-primary' : 'text-textMuted'}`}>
              Command Center
            </Link>
            <Link to="/marketplace" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-secondary ${location.pathname === '/marketplace' ? 'text-secondary' : 'text-textMuted'}`}>
              Exchange Network
            </Link>
            <Link to="/chat" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary ${location.pathname === '/chat' ? 'text-primary' : 'text-textMuted'}`}>
              Uplinks
            </Link>
          </div>
        )}

        <div className="flex items-center gap-6 mr-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/profile">
                <div className="flex items-center gap-4 group/nav cursor-pointer">
                  <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover/nav:text-primary transition-colors">{user?.name}</p>
                    <p className="text-[8px] font-black text-primary uppercase tracking-tighter">OPERATOR_ID: {user?._id?.slice(-4)}</p>
                  </div>
                  <Avatar src={user?.profilePicture} alt={user?.name} size="sm" className="ring-2 ring-white/5 border-none group-hover/nav:ring-primary/50 transition-all" />
                </div>
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="!p-2 text-textMuted hover:text-red-500 hover:bg-red-500/5">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-[10px] tracking-widest">LOGIN</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" className="text-[10px] tracking-widest">ENROLL</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
