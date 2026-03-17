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
import { Users, ArrowRight, MessageSquare, Clock, Globe } from 'lucide-react';

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
        setRequests(requestsRes.data.incoming.slice(0, 3)); // Only show top 3 pending
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-surface to-slate-900 border border-slate-800 rounded-2xl p-8 shadow-custom">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <Avatar src={user.profilePicture} alt={user.name} size="xl" />
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}!</h1>
              <p className="text-textMuted max-w-lg">
                Ready to trade some skills? You have {matches.length} potential matches available today.
              </p>
            </div>
          </div>
          <Link to="/marketplace">
            <Button className="font-semibold px-6 py-3">
              Browse Marketplace
              <Globe className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recommended Matches
            </h2>
          </div>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matches.map((match) => (
                <Card key={match.user._id} hoverable className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar src={match.user.profilePicture} alt={match.user.name} size="md" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <Link to={`/profile/${match.user._id}`} className="font-bold hover:text-primary transition-colors">
                          {match.user.name}
                        </Link>
                        <Badge variant="success">{match.matchScore} score</Badge>
                      </div>
                      <p className="text-xs text-textMuted line-clamp-1">{match.user.location || 'Local'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-textMuted font-bold mb-1.5">You'll Learn</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedSkillsForMe.map((skill) => (
                          <Badge key={skill} variant="primary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-textMuted font-bold mb-1.5">You'll Teach</p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedSkillsForThem.map((skill) => (
                          <Badge key={skill} variant="neutral">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link to={`/profile/${match.user._id}`} className="mt-auto">
                    <Button variant="secondary" className="w-full text-xs py-2">
                      View Profile
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No matches yet" 
              message="Add more skills to your profile to find more matches!" 
              actionText="Update Profile"
              onAction={() => window.location.href = `/profile/${user._id}`}
            />
          )}
        </div>

        {/* Sidebar: Recent Requests */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Pending Proposals
          </h2>
          
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <Card key={request._id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={request.senderId.profilePicture} alt={request.senderId.name} size="sm" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold truncate">{request.senderId.name}</p>
                      <p className="text-xs text-textMuted truncate">wants to learn {request.skillRequested}</p>
                    </div>
                  </div>
                  <Link to="/requests">
                    <Button variant="secondary" size="sm" className="w-full py-1.5 text-xs">
                      View Request
                    </Button>
                  </Link>
                </Card>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border-dashed">
                <MessageSquare className="w-8 h-8 text-slate-700 mb-3" />
                <p className="text-sm text-textMuted">No new requests</p>
              </Card>
            )}
            
            <Link to="/requests" className="block text-center text-sm font-medium text-primary hover:underline py-2">
              See all requests
            </Link>
          </div>

          <Card className="bg-primary/5 border border-primary/10">
            <h3 className="font-bold text-sm mb-2 text-primary">Pro Tip</h3>
            <p className="text-xs text-textMuted">
              Complete more exchanges to boost your rating. Users with higher ratings get suggested more often!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
