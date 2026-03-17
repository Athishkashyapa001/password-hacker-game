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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-slate-800 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Globe className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
            SkillSwap
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-textMuted">
              <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/marketplace" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Globe className="w-4 h-4" /> Marketplace
              </Link>
              <Link to="/chat" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" /> Messages
              </Link>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-800">
              <Link to={`/profile/${user._id}`}>
                <Avatar src={user.profilePicture} alt={user.name} size="sm" />
              </Link>
              <button 
                onClick={handleLogout}
                className="text-textMuted hover:text-red-400 p-1 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
