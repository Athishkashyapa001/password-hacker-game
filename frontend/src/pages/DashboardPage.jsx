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
import { Users, ArrowRight, MessageSquare, Clock, Globe, Zap, Star } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-10 shadow-luxury group">
        {/* Abstract background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background opacity-90 transition-all duration-700 group-hover:opacity-100"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-40 animate-spin-slow"></div>
              <Avatar src={user.profilePicture} alt={user.name} size="xl" className="relative border-4 border-surface" />
              <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl shadow-teal-glow">
                <Zap className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <Badge variant="primary" className="font-black tracking-widest uppercase text-[10px]">Elite Member</Badge>
                <div className="flex items-center gap-1 text-accent">
                   <Star className="w-3 h-3 fill-current" />
                   <span className="text-xs font-bold">{user.avgRating || '5.0'}</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">
                Welcome back, <span className="text-gradient leading-relaxed">{user.name.split(' ')[0]}!</span>
              </h1>
              <p className="text-textMuted max-w-lg text-lg">
                Ready to trade your expertise? You have <span className="text-textPrimary font-bold">{matches.length} matches</span> waiting for your proposals.
              </p>
            </div>
          </div>
          <Link to="/marketplace" className="w-full lg:w-auto">
            <Button size="lg" className="w-full group shadow-teal-glow">
              Explore Marketplace
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Matches */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Top Recommended Matches
            </h2>
            <Link to="/marketplace" className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all uppercase tracking-widest text-[10px]">View All</Link>
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match) => (
                <Card key={match.user._id} hoverable className="flex flex-col h-full !p-8">
                  <div className="flex items-center gap-5 mb-8">
                    <Avatar src={match.user.profilePicture} alt={match.user.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={`/profile/${match.user._id}`} className="text-lg font-black hover:text-gradient transition-all truncate block">
                          {match.user.name}
                        </Link>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-teal-glow">
                          {match.matchScore}% MATCH
                        </div>
                      </div>
                      <p className="text-xs text-textMuted flex items-center gap-1 mt-1">
                        <Globe className="w-3 h-3" />
                        {match.user.location || 'Global Remote'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1 mb-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-textMuted font-black mb-3 flex items-center gap-2">
                        <Award className="w-3 h-3 text-primary" /> Expertise they offer
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchedSkillsForMe.map((skill) => (
                          <Badge key={skill} variant="primary" className="px-3 py-1">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-textMuted font-black mb-3 flex items-center gap-2">
                        <Target className="w-3 h-3 text-secondary" /> What they want
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matchedSkillsForThem.map((skill) => (
                          <Badge key={skill} variant="neutral" className="px-3 py-1">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link to={`/profile/${match.user._id}`} className="mt-auto">
                    <Button variant="secondary" className="w-full">
                      View Exclusive Profile
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No matches detected" 
              message="Your skill set is unique. Try expanding your 'Skills Wanted' in your profile to trigger more matching opportunities." 
              actionText="Refine My Profile"
              onAction={() => window.location.href = `/profile/`}
            />
          )}
        </div>

        {/* Sidebar: Requests & Stats */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3 px-2">
              <Clock className="w-6 h-6 text-primary" />
              Incoming Proposals
            </h2>
            
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <Card key={request._id} className="!p-5 border-l-4 border-l-primary hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar src={request.senderId.profilePicture} alt={request.senderId.name} size="sm" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-black text-sm truncate">{request.senderId.name}</p>
                        <p className="text-[10px] font-bold text-textMuted uppercase tracking-tight">Active Proposal</p>
                      </div>
                    </div>
                    <Link to="/requests">
                      <Button variant="secondary" size="sm" className="w-full font-bold">
                        Review Proposal
                      </Button>
                    </Link>
                  </Card>
                ))
              ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-white/10 opacity-50">
                  <MessageSquare className="w-10 h-10 text-slate-700 mb-4" />
                  <p className="text-sm font-bold text-textMuted">No pending proposals</p>
                </Card>
              )}
            </div>
          </div>

          {/* Luxury Ad/Promo Card */}
          <Card className="bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/20 p-8">
            <h3 className="text-xl font-black mb-4 text-primary italic">PRO MATCH</h3>
            <p className="text-sm text-textMuted leading-relaxed mb-6 font-medium">
              Users who respond to requests within <span className="text-textPrimary font-black">2 hours</span> see a <span className="text-textPrimary font-black">3x match rate</span> boost.
            </p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3 shadow-teal-glow"></div>
            </div>
            <p className="mt-3 text-[10px] font-black text-primary uppercase tracking-widest text-right">Activity: High</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
