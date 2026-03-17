import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { Users, ArrowRight, MessageSquare, Clock, Globe, Zap, Star, LayoutGrid, Terminal, Shield } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesRes, requestsRes] = await Promise.all([
          api.get('/users/matches'),
          api.get('/requests')
        ]);
        setMatches(matchesRes.data.matches);
        setRequests(requestsRes.data.incoming.slice(0, 3)); 
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-background">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-24">
      {/* Elite Tactical Hero Section */}
      <section className="relative overflow-hidden rounded-sm p-12 glass-card group border-l-4 border-l-primary/30">
        {/* Background Mesh/Grid */}
        <div className="absolute inset-0 bg-[#020617] opacity-60"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h1v1H1z' fill='%2314b8a6' fill-opacity='0.1'/%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/20 blur-[160px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group/avatar">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary via-secondary to-primary rounded-full blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
              <Avatar src={user.profilePicture} alt={user.name} size="xl" className="relative ring-4 ring-white/5 grayscale-[0.2] group-hover/avatar:grayscale-0 transition-all duration-500" />
              <div className="absolute -bottom-3 -right-3 bg-primary p-3 rounded-sm shadow-teal-glow shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                <Shield className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                <div className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-primary">Elite Operator</div>
                <div className="flex items-center gap-2 text-primary font-mono text-[10px] font-black">
                   <Activity className="w-3 h-3" />
                   SYNCED: 99.8%
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter text-white">
                OPERATIONS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic">{user.name.split(' ')[0]}</span>
              </h1>
              
              <p className="text-textMuted max-w-lg text-sm font-medium leading-relaxed uppercase tracking-wide opacity-80">
                Network status nominal. <span className="text-white font-black">{matches.length} recommended nodes</span> identified for resource synchronization.
              </p>
            </div>
          </div>
          
          <Link to="/marketplace" className="w-full lg:w-auto">
            <Button size="lg" className="w-full group shadow-teal-glow !rounded-sm">
              <Terminal className="w-5 h-5 mr-4 opacity-50 transition-transform group-hover:translate-x-1" />
              INITIALIZE MARKETPLACE
              <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Operational Feed */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-4 border-l-2 border-primary/20">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white">
                <LayoutGrid className="w-6 h-6 text-primary" />
                Synchronization Targets
              </h2>
              <p className="text-[10px] font-black text-textMuted uppercase tracking-[0.4em] mt-2">Active Multi-Parameter Matching</p>
            </div>
            <Link to="/marketplace" className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-sm border border-white/5">DISCOVER MORE</Link>
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {matches.map((match) => (
                <Card key={match.user._id} className="!p-0 glass-card group overflow-hidden border-b-2 border-transparent hover:border-primary/50 transition-all duration-500">
                  <div className="relative h-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                    <div className="absolute top-4 right-6 bg-background/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/5 text-[9px] font-black text-primary tracking-widest shadow-teal-glow">
                      {match.matchScore}% NODE SYNC
                    </div>
                  </div>
                  
                  <div className="px-8 pb-8 -mt-10 relative z-10">
                    <div className="flex items-end gap-6 mb-8">
                      <Avatar src={match.user.profilePicture} alt={match.user.name} size="lg" className="ring-4 ring-background shadow-2xl" />
                      <div className="flex-1 pb-1">
                        <Link to={`/profile/${match.user._id}`} className="text-xl font-black text-white hover:text-primary transition-all block tracking-tight">
                          {match.user.name}
                        </Link>
                        <p className="text-[10px] text-textMuted flex items-center gap-2 mt-2 font-black uppercase tracking-widest italic">
                          <Globe className="w-3 h-3 text-secondary" />
                          {match.user.location || 'LATENCY: MINIMAL'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 mb-10">
                      <div className="bg-white/[0.02] p-6 rounded-sm border border-white/5 relative overflow-hidden group/item">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover/item:bg-primary transition-colors"></div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-textMuted font-black mb-4 flex items-center gap-3">
                          <Award className="w-3 h-3 text-primary animate-pulse" /> PROFERRED ASSETS
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkillsForMe.map((skill) => (
                            <div key={skill} className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter">
                                {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white/[0.02] p-6 rounded-sm border border-white/5 relative overflow-hidden group/item">
                        <div className="absolute top-0 left-0 w-1 h-full bg-secondary/20 group-hover/item:bg-secondary transition-colors"></div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-textMuted font-black mb-4 flex items-center gap-3">
                          <Target className="w-3 h-3 text-secondary" /> REQUESTED ASSETS
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {match.matchedSkillsForThem.map((skill) => (
                            <div key={skill} className="px-3 py-1.5 bg-secondary/5 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-tighter">
                                {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link to={`/profile/${match.user._id}`}>
                      <Button variant="secondary" className="w-full !rounded-sm tracking-[0.3em] text-[10px]">
                        ANALYZE PROFILE
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="NO TARGETS DETECTED" 
              message="System scanning found no nodes matching your current parameters. Recalibrate expertise vectors to synchronize." 
              actionText="RECALIBRATE PROFILE"
              onAction={() => window.location.href = `/profile/`}
              className="glass-card !bg-[#020617] border-dashed border-2 border-white/5"
            />
          )}
        </div>

        {/* Tactical Intel Sidebar */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-white border-l-2 border-secondary/20 px-4">
              <Clock className="w-6 h-6 text-secondary" />
              Incoming Uplinks
            </h2>
            
            <div className="space-y-6">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <Card key={request._id} className="!p-6 glass-card border-none border-l-2 border-l-primary hover:bg-white/5 transition-all group/request overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl group-hover/request:bg-primary/20 transition-all"></div>
                    <div className="flex items-center gap-5 mb-6 relative z-10">
                      <Avatar src={request.senderId.profilePicture} alt={request.senderId.name} size="sm" className="ring-2 ring-white/5" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-xs text-white uppercase tracking-wider truncate">{request.senderId.name}</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">Status: Active</p>
                      </div>
                    </div>
                    <Link to="/requests" className="relative z-10">
                      <Button variant="secondary" size="sm" className="w-full font-black !rounded-sm text-[9px] tracking-widest border-white/5">
                        REVIEW UPLINK
                      </Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-white/5 rounded-sm opacity-30 grayscale saturate-0">
                  <MessageSquare className="w-12 h-12 text-white mb-6 animate-pulse" />
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Zero Active Uplinks</p>
                </div>
              )}
            </div>
          </div>

          {/* Tactical Stat Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 !p-10 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-primary animate-pulse opacity-50"></div>
            <h3 className="text-2xl font-black mb-6 text-white italic tracking-tighter">PROTOCOL <span className="text-primary font-mono NOT-italic">008</span></h3>
            <p className="text-[11px] text-textMuted leading-relaxed mb-10 font-black uppercase tracking-widest">
              Synchronization rates increase by <span className="text-white">400%</span> when responding within <span className="text-primary">120m</span>.
            </p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-primary w-4/5 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Efficiency: Peak</span>
                <span className="text-[10px] font-black text-primary font-mono">82.4%</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
