import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, MessageCircle, LayoutDashboard, Globe } from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto glass-card !p-3 rounded-2xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group ml-2">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-teal-glow">
            <Globe className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-xl font-black tracking-tight text-gradient hidden sm:block">ROUTEMASTER</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-4 py-2 text-sm font-bold text-textMuted hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/marketplace" className="px-4 py-2 text-sm font-bold text-textMuted hover:text-primary transition-colors">Marketplace</Link>
              <Link to="/requests" className="px-4 py-2 text-sm font-bold text-textMuted hover:text-primary transition-colors">Requests</Link>
              <Link to="/chat" className="px-4 py-2 text-sm font-bold text-textMuted hover:text-primary transition-colors">Messages</Link>
            </>
          ) : (
            <>
              <Link to="/marketplace" className="px-4 py-2 text-sm font-bold text-textMuted hover:text-primary transition-colors">Browse</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mr-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 p-1 pl-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800">
                <span className="text-sm font-bold hidden lg:block">{user.name}</span>
                <Avatar src={user.profilePicture} alt={user.name} size="xs" />
              </Link>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
