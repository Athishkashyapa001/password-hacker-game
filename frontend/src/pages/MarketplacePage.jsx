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
import { Search, MapPin, ArrowRight, Filter } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Skill Marketplace</h1>
          <p className="text-textMuted mb-6">
            Discover thousands of people ready to trade skills. Search by name, skill, or location.
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
              <Input
                className="pl-10"
                placeholder="Search: 'Guitar', 'Python', 'New York'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? <Spinner size="sm" /> : 'Search'}
            </Button>
          </form>
        </div>
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 grayscale">
          <Spinner size="lg" className="mb-4" />
          <p className="text-textMuted animate-pulse">Searching the community...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{users.length} people found</h2>
            <Button variant="ghost" size="sm" className="text-textMuted">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((item) => (
                <Card key={item._id} hoverable className="flex flex-col">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar src={item.profilePicture} alt={item.name} size="lg" className="mb-3" />
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-1 text-textMuted text-xs mb-4">
                      <MapPin className="w-3 h-3" />
                      {item.location || 'Remote'}
                    </div>
                    
                    <div className="w-full h-px bg-slate-800 mb-4" />
                    
                    <div className="w-full space-y-4 text-left">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-textMuted font-bold mb-2">Can Teach</p>
                        <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                          {item.skillsOffered.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="primary">{skill}</Badge>
                          ))}
                          {item.skillsOffered.length > 3 && (
                            <span className="text-[10px] text-textMuted pl-1">+{item.skillsOffered.length - 3} more</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-textMuted font-bold mb-2">Wants to Learn</p>
                        <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                          {item.skillsWanted.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="neutral">{skill}</Badge>
                          ))}
                          {item.skillsWanted.length > 3 && (
                            <span className="text-[10px] text-textMuted pl-1">+{item.skillsWanted.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to={`/profile/${item._id}`} className="mt-auto">
                    <Button variant="secondary" className="w-full py-2.5 text-xs">
                      View Profile
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No one matches your search" 
              message="Try searching for something broader or different skills."
              actionText="Clear Search"
              onAction={() => { setQuery(''); fetchUsers(); }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
