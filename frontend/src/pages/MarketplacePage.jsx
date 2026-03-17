import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { Search, MapPin, ArrowRight, Filter, Globe, Sparkles, Award, Target, Cpu, Activity, ShieldSearch } from 'lucide-react';

const MarketplacePage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = async (searchQuery = '') => {
    setIsSearching(true);
    try {
      const res = await api.get(`/users/search${searchQuery ? `?query=${searchQuery}` : ''}`);
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(query);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#020617]">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-24">
      {/* Global Interface Section */}
      <section className="relative p-12 rounded-sm overflow-hidden glass-card border-b-4 border-b-secondary/30">
        <div className="absolute inset-0 bg-[#020617] opacity-60"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-secondary/10 blur-[160px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-sm border border-white/10 mb-8 backdrop-blur-md">
            <ShieldSearch className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted">Global Exchange Network v4.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white tracking-tighter">
            DISCOVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary italic">RESOURCE NODES</span>
          </h1>
          
          <p className="text-textMuted text-sm font-medium mb-12 max-w-2xl leading-relaxed uppercase tracking-widest opacity-80">
            Scanning multi-sector databases for compatible expertise vectors. <span className="text-secondary">Authorization level: Verified.</span>
          </p>
          
          <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-6 p-3 bg-white/[0.03] backdrop-blur-3xl rounded-sm border border-white/10 shadow-luxury">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary opacity-50" />
              <Input
                className="!bg-transparent border-none !p-5 pl-14 focus:ring-0 shadow-none text-white font-black tracking-widest uppercase text-xs"
                placeholder="INPUT SEARCH PARAMETERS: 'REACT', 'PYTHON', 'UI DESIGN'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching} size="lg" className="!rounded-sm px-12 !bg-secondary hover:!bg-secondary/80 text-slate-900 border-none">
              {isSearching ? <Spinner size="sm" /> : 'INITIALIZE SEARCH'}
            </Button>
          </form>
        </div>
      </section>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 blur-2xl animate-pulse"></div>
            <Spinner size="lg" className="text-secondary relative z-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary animate-bounce">Synchronizing Matrix Database...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-4 border-l-2 border-secondary/20">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">{users.length} COMPATIBLE NODES ONLINE</h2>
              <div className="h-[2px] w-24 bg-secondary mt-3"></div>
            </div>
            <Button variant="ghost" size="sm" className="font-black uppercase tracking-[0.3em] text-[9px] border border-white/5 !rounded-sm px-6">
              <Filter className="w-4 h-4 mr-3 text-secondary" />
              RECALIBRATE FILTERS
            </Button>
          </div>

          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {users.map((item) => (
                <Card key={item._id} className="!p-0 glass-card group overflow-hidden border-b-2 border-transparent hover:border-secondary/50 transition-all duration-500">
                  <div className="relative h-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/5 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                    <div className="absolute top-4 right-6 bg-background/80 backdrop-blur-md px-3 py-1 rounded-sm border border-white/5 text-[9px] font-black text-secondary tracking-widest shadow-teal-glow">
                      VERIFIED NODE
                    </div>
                  </div>

                  <div className="px-8 pb-8 -mt-12 relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-6 group/avatar">
                       <div className="absolute -inset-1 bg-gradient-to-tr from-secondary to-primary rounded-full blur opacity-20 group-hover/avatar:opacity-50 transition-opacity"></div>
                       <Avatar src={item.profilePicture} alt={item.name} size="xl" className="ring-4 ring-background shadow-2xl" />
                       <div className="absolute -bottom-1 -right-1 bg-secondary w-5 h-5 rounded-full border-4 border-background shadow-teal-glow animate-pulse"></div>
                    </div>
                    
                    <h3 className="font-black text-xl mb-2 text-white group-hover:text-secondary transition-colors tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 text-textMuted text-[9px] font-black uppercase tracking-[0.2em] italic">
                      <MapPin className="w-3 h-3 text-secondary" />
                      {item.location || 'LATENCY: MINIMAL'}
                    </div>
                    
                    <div className="w-full h-px bg-white/5 my-8" />
                    
                    <div className="w-full space-y-10 text-left mb-10">
                      <div className="bg-white/[0.02] p-5 rounded-sm border border-white/5 relative overflow-hidden group/item">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover/item:bg-primary transition-colors"></div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-textMuted font-black mb-4 flex items-center gap-3">
                           <Award className="w-3 h-3 text-primary animate-pulse" /> PROFERRED
                        </p>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                          {item.skillsOffered.slice(0, 3).map((skill) => (
                            <div key={skill} className="px-2 py-1 bg-primary/5 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-tighter">
                                {skill}
                            </div>
                          ))}
                          {item.skillsOffered.length > 3 && (
                            <div className="bg-white/5 text-textMuted px-2 py-1 rounded-sm text-[8px] font-black">+{item.skillsOffered.length - 3}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white/[0.02] p-5 rounded-sm border border-white/5 relative overflow-hidden group/item">
                        <div className="absolute top-0 left-0 w-1 h-full bg-secondary/20 group-hover/item:bg-secondary transition-colors"></div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-textMuted font-black mb-4 flex items-center gap-3">
                           <Target className="w-3 h-3 text-secondary animate-pulse" /> ACQUISITION
                        </p>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                          {item.skillsWanted.slice(0, 3).map((skill) => (
                            <div key={skill} className="px-2 py-1 bg-secondary/5 border border-secondary/20 text-secondary text-[9px] font-black uppercase tracking-tighter">
                                {skill}
                            </div>
                          ))}
                          {item.skillsWanted.length > 3 && (
                            <div className="bg-white/5 text-textMuted px-2 py-1 rounded-sm text-[8px] font-black">+{item.skillsWanted.length - 3}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link to={`/profile/${item._id}`} className="w-full mt-auto">
                      <Button variant="secondary" className="w-full !rounded-sm tracking-[0.3em] text-[10px]">
                        ANALYZE NODE
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="ZERO NODES DETECTED" 
              message="No expertise nodes matching your current search parameters were found within the global matrix."
              actionText="RESET SCAN"
              onAction={() => { setQuery(''); fetchUsers(); }}
              className="glass-card !bg-[#020617] border-dashed border-2 border-white/5"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
