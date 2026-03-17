import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import { 
  User as UserIcon, 
  MapPin, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Send, 
  Star, 
  Plus,
  Trash2
} from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states for editing
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skillsOffered: [],
    skillsWanted: []
  });
  const [newOffered, setNewOffered] = useState('');
  const [newWanted, setNewWanted] = useState('');
  const [file, setFile] = useState(null);

  // Form states for sending request
  const [requestSkillOffered, setRequestSkillOffered] = useState('');
  const [requestSkillWanted, setRequestSkillWanted] = useState('');

  const isOwnProfile = !id || id === currentUser?._id;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetId = id || currentUser?._id;
      const res = await api.get(`/users/profile/${targetId}`);
      setProfile(res.data.user);
      
      if (isOwnProfile) {
        setFormData({
          name: res.data.user.name,
          bio: res.data.user.bio || '',
          location: res.data.user.location || '',
          skillsOffered: res.data.user.skillsOffered || [],
          skillsWanted: res.data.user.skillsWanted || []
        });
      }
    } catch (err) {
      console.error('Error fetching profile', err);
      setError('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser?._id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('location', formData.location);
      data.append('skillsOffered', JSON.stringify(formData.skillsOffered));
      data.append('skillsWanted', JSON.stringify(formData.skillsWanted));
      if (file) data.append('profilePicture', file);

      await updateProfile(data);
      setSuccess('Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/requests/send', {
        receiverId: profile._id,
        skillOffered: requestSkillOffered,
        skillRequested: requestSkillWanted
      });
      setIsRequesting(false);
      setSuccess('Request sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  const addSkill = (type) => {
    if (type === 'offered' && newOffered) {
      setFormData({ ...formData, skillsOffered: [...formData.skillsOffered, newOffered] });
      setNewOffered('');
    } else if (type === 'wanted' && newWanted) {
      setFormData({ ...formData, skillsWanted: [...formData.skillsWanted, newWanted] });
      setNewWanted('');
    }
  };

  const removeSkill = (type, index) => {
    if (type === 'offered') {
      const newList = [...formData.skillsOffered];
      newList.splice(index, 1);
      setFormData({ ...formData, skillsOffered: newList });
    } else {
      const newList = [...formData.skillsWanted];
      newList.splice(index, 1);
      setFormData({ ...formData, skillsWanted: newList });
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={fetchProfile}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header Profile Section */}
      <section className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 via-surface to-slate-900 rounded-3xl border border-slate-800" />
        
        <div className="flex flex-col md:flex-row items-end gap-6 px-8 -mt-16">
          <div className="relative group">
            <Avatar src={profile.profilePicture} alt={profile.name} size="xl" className="w-32 h-32 ring-8 ring-background" />
            {isOwnProfile && isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-6 h-6" />
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            )}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              {profile.rating?.count > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-yellow-500/20">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  {(profile.rating.total / profile.rating.count).toFixed(1)}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-textMuted text-sm">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location || 'Remote'}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {isOwnProfile ? profile.email : 'Contact after matching'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pb-4">
            {isOwnProfile ? (
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'primary'}>
                {isEditing ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Edit3 className="w-4 h-4 mr-2" /> Edit Profile</>}
              </Button>
            ) : (
              <Button onClick={() => setIsRequesting(true)} disabled={isRequesting}>
                <Send className="w-4 h-4 mr-2" /> Propose Exchange
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Bio & Info */}
        <div className="md:col-span-1 space-y-6">
          <Card title="About">
            <h3 className="text-sm font-bold uppercase tracking-wider text-textMuted mb-4">Biography</h3>
            {isEditing ? (
              <textarea 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none min-h-[150px]"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell the community about yourself and your expertise..."
              />
            ) : (
              <p className="text-sm leading-relaxed text-textPrimary/80">
                {profile.bio || "No biography provided yet."}
              </p>
            )}
            
            {isEditing && (
              <div className="mt-4">
                <Input 
                  label="Location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Skills */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Skill Inventory
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Offers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">I Can Teach</span>
                  <Badge variant="primary">{profile.skillsOffered?.length || 0}</Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    formData.skillsOffered.map((skill, i) => (
                      <Badge key={i} className="pl-3 pr-1 py-1 flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill('offered', i)} className="p-0.5 hover:bg-black/20 rounded-full">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    profile.skillsOffered?.map(skill => <Badge key={skill} variant="primary" className="px-4 py-2 text-sm">{skill}</Badge>)
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add high-demand skill" 
                      value={newOffered} 
                      onChange={(e) => setNewOffered(e.target.value)} 
                    />
                    <Button size="sm" onClick={() => addSkill('offered')}><Plus className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>

              {/* Wants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-textMuted">I Want To Learn</span>
                  <Badge variant="neutral">{profile.skillsWanted?.length || 0}</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    formData.skillsWanted.map((skill, i) => (
                      <Badge key={i} variant="neutral" className="pl-3 pr-1 py-1 flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill('wanted', i)} className="p-0.5 hover:bg-black/20 rounded-full">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    profile.skillsWanted?.map(skill => <Badge key={skill} variant="neutral" className="px-4 py-2 text-sm">{skill}</Badge>)
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="What are you curious about?" 
                      value={newWanted} 
                      onChange={(e) => setNewWanted(e.target.value)} 
                    />
                    <Button size="sm" onClick={() => addSkill('wanted')}><Plus className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Discard</Button>
                <Button onClick={handleUpdate}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Exchange Request Modal logic */}
      {isRequesting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-lg shadow-2xl ring-1 ring-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Propose an Exchange</h2>
              <button 
                onClick={() => setIsRequesting(false)}
                className="p-2 hover:bg-surface rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-6">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center gap-4 mb-4">
                <Avatar src={profile.profilePicture} alt={profile.name} size="md" />
                <div>
                  <p className="text-sm font-bold">{profile.name}</p>
                  <p className="text-xs text-textMuted">Matches your profile {id ? 'at a high level' : 'perfectly'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-textMuted uppercase tracking-wider mb-2 block">What you want to teach {profile.name}?</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    value={requestSkillOffered}
                    onChange={(e) => setRequestSkillOffered(e.target.value)}
                    required
                  >
                    <option value="">Select a skill...</option>
                    {currentUser.skillsOffered.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-textMuted uppercase tracking-wider mb-2 block">What you want to learn from {profile.name}?</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    value={requestSkillWanted}
                    onChange={(e) => setRequestSkillWanted(e.target.value)}
                    required
                  >
                    <option value="">Select a skill...</option>
                    {profile.skillsOffered.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setIsRequesting(false)}>Cancel</Button>
                <Button type="submit" className="flex-1"><Send className="w-4 h-4 mr-2" /> Send Proposal</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
