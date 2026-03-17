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
import { Search, MapPin, ArrowRight, Filter, Globe, Sparkles, Award, Target } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Search & Header Section */}
      <section className="relative p-10 rounded-[2.5rem] overflow-hidden shadow-luxury">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background opacity-95"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted">Professional Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Discover Your Next <span className="text-gradient">Skill Exchange</span>
          </h1>
          <p className="text-textMuted text-lg mb-10 font-medium">
            Search through our global community of experts ready to swap knowledge.
          </p>
          
          <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                className="!bg-transparent border-none !p-4 pl-12 focus:ring-0 shadow-none"
                placeholder="Search: 'React', 'Photography', 'San Francisco'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching} size="lg" className="rounded-[1.25rem] px-10">
              {isSearching ? <Spinner size="sm" /> : 'Find Experts'}
            </Button>
          </form>
        </div>
      </section>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
          <Spinner size="lg" className="mb-6" />
          <p className="text-sm font-black uppercase tracking-widest text-textMuted animate-pulse">Syncing Network Database...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black">{users.length} Specialists Found</h2>
              <div className="h-1 w-12 bg-primary rounded-full mt-2"></div>
            </div>
            <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px] border border-white/5">
              <Filter className="w-4 h-4 mr-2" />
              Sort & Filter
            </Button>
          </div>

          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {users.map((item) => (
                <Card key={item._id} hoverable className="flex flex-col !p-8 group relative overflow-hidden">
                  {/* Subtle hover accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/20 transition-all"></div>
                  
                  <div className="flex flex-col items-center text-center mb-8 relative z-10">
                    <div className="relative mb-6">
                       <Avatar src={item.profilePicture} alt={item.name} size="xl" className="ring-4 ring-white/5" />
                       <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-background shadow-teal-glow"></div>
                    </div>
                    
                    <h3 className="font-black text-xl mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1.5 text-textMuted text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-primary" />
                      {item.location || 'Global Remote'}
                    </div>
                    
                    <div className="w-full h-px bg-white/5 my-8" />
                    
                    <div className="w-full space-y-8 text-left">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-textMuted font-black mb-4 flex items-center gap-2">
                           <Award className="w-3 h-3 text-primary" /> Expertise
                        </p>
                        <div className="flex flex-wrap gap-2 min-h-[50px]">
                          {item.skillsOffered.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="primary" className="px-3 py-1">{skill}</Badge>
                          ))}
                          {item.skillsOffered.length > 3 && (
                            <div className="bg-white/5 text-textMuted px-2 py-1 rounded-lg text-[10px] font-bold">+{item.skillsOffered.length - 3}</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-textMuted font-black mb-4 flex items-center gap-2">
                           <Target className="w-3 h-3 text-secondary" /> Learning
                        </p>
                        <div className="flex flex-wrap gap-2 min-h-[50px]">
                          {item.skillsWanted.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="neutral" className="px-3 py-1">{skill}</Badge>
                          ))}
                          {item.skillsWanted.length > 3 && (
                            <div className="bg-white/5 text-textMuted px-2 py-1 rounded-lg text-[10px] font-bold">+{item.skillsWanted.length - 3}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to={`/profile/${item._id}`} className="mt-auto relative z-10">
                    <Button variant="secondary" className="w-full">
                      View Engagement
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="End of the Network" 
              message="No experts found matching your current query. Try broadening your terms."
              actionText="Reset Search"
              onAction={() => { setQuery(''); fetchUsers(); }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
