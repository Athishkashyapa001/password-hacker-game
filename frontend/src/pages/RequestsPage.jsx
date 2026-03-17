import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { 
  Inbox, 
  Send as SendIcon, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Clock
} from 'lucide-react';

const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests');
      setIncoming(res.data.incoming);
      setSent(res.data.sent);
    } catch (err) {
      console.error('Error fetching requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      if (action === 'accept') {
        const res = await api.post(`/requests/${requestId}/accept`);
        // If accepted, we can redirect to the new chat or just refresh
        fetchRequests();
      } else {
        await api.post(`/requests/${requestId}/reject`);
        fetchRequests();
      }
    } catch (err) {
      console.error(`Error ${action}ing request`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const activeData = activeTab === 'incoming' ? incoming : sent;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-textPrimary">Exchange Proposals</h1>
          <p className="text-textMuted">Manage your skill exchange requests and start collaborating.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface p-1 rounded-xl border border-slate-800 w-fit">
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'incoming' ? 'bg-background text-primary shadow-sm' : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Received ({incoming.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'sent' ? 'bg-background text-primary shadow-sm' : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          <SendIcon className="w-4 h-4" />
          Sent ({sent.length})
        </button>
      </div>

      <div className="space-y-4">
        {activeData.length > 0 ? (
          activeData.map((request) => (
            <Card key={request._id} className="relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Avatar 
                    src={activeTab === 'incoming' ? request.senderId.profilePicture : request.receiverId.profilePicture} 
                    alt={activeTab === 'incoming' ? request.senderId.name : request.receiverId.name} 
                    size="md" 
                  />
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {activeTab === 'incoming' ? request.senderId.name : request.receiverId.name}
                      {getStatusBadge(request.status)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-textMuted">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(request.createdAt).toLocaleDateString()}</span>
                      <span>Offered: <span className="text-primary font-bold">{request.skillOffered}</span></span>
                      <span>Requested: <span className="text-teal-400 font-bold">{request.skillRequested}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === 'incoming' && request.status === 'pending' ? (
                    <>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        onClick={() => handleAction(request._id, 'reject')}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id ? <Spinner size="sm" /> : <XCircle className="w-4 h-4 mr-2" />}
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAction(request._id, 'accept')}
                        disabled={actionLoading === request._id}
                      >
                        {actionLoading === request._id ? <Spinner size="sm" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Accept & Chat
                      </Button>
                    </>
                  ) : request.status === 'accepted' ? (
                    <Link to="/chat">
                      <Button size="sm" variant="secondary">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </Link>
                  ) : activeTab === 'sent' && request.status === 'pending' ? (
                    <span className="text-xs italic text-textMuted">Waiting for response...</span>
                  ) : null}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState 
            icon={activeTab === 'incoming' ? Inbox : SendIcon}
            title={activeTab === 'incoming' ? "No incoming requests" : "No sent requests"}
            message={activeTab === 'incoming' ? "When users want to trade skills with you, they'll show up here." : "Start browsing the marketplace to send proposals!"}
            actionText={activeTab === 'sent' ? "Go to Marketplace" : null}
            onAction={activeTab === 'sent' ? () => navigate('/marketplace') : null}
          />
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
