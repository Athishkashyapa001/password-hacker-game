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
  Trash2,
  Globe,
  Award,
  Target,
  ShieldCheck
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
      setSuccess('Profile synchronized successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update secure profile');
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
      setSuccess('Exchange proposal transmitted!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transmit proposal');
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
      <div className="text-center py-20 flex flex-col items-center">
        <div className="bg-red-500/10 p-6 rounded-full mb-6">
           <X className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-red-400 font-black uppercase tracking-widest mb-6">{error}</p>
        <Button onClick={fetchProfile}>Initialize Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {success && (
        <div className="fixed bottom-10 right-10 z-[100] bg-primary text-slate-900 font-black px-8 py-4 rounded-2xl shadow-teal-glow flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
           <ShieldCheck className="w-6 h-6" />
           {success}
           <button onClick={() => setSuccess('')} className="ml-4 opacity-50 hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Hero Profile Header */}
      <section className="relative group">
        <div className="h-64 bg-gradient-to-br from-surface to-background rounded-[3rem] border border-white/5 shadow-luxury relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-all duration-1000"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-10 px-12 -mt-20 relative z-10">
          <div className="relative group/avatar">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary to-secondary rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition-opacity"></div>
            <Avatar src={profile.profilePicture} alt={profile.name} size="xl" className="w-44 h-44 ring-8 ring-background relative border-4 border-surface" />
            {isOwnProfile && isEditing && (
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-full cursor-pointer opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-primary">
                <Edit3 className="w-6 h-6 mb-2" />
                Update Media
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              </label>
            )}
            {!isEditing && isOwnProfile && (
               <div className="absolute -bottom-2 -right-2 bg-primary p-2.5 rounded-2xl shadow-teal-glow border-4 border-background">
                  <Star className="w-5 h-5 text-slate-900 fill-current" />
               </div>
            )}
          </div>
          
          <div className="flex-1 pb-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-5xl font-black tracking-tighter">{profile.name}</h1>
              {profile.avgRating > 0 && (
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-black ring-1 ring-accent/20 mx-auto md:mx-0 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <Star className="w-4 h-4 fill-current" />
                  {profile.avgRating.toFixed(1)} Specialist Score
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 mt-6 text-textMuted font-bold text-[10px] uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2 ring-1 ring-white/5 bg-white/5 px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4 text-primary" /> {profile.location || 'Distributed Node'}</span>
              <span className="flex items-center gap-2 ring-1 ring-white/5 bg-white/5 px-3 py-1.5 rounded-lg"><Mail className="w-4 h-4 text-secondary" /> {isOwnProfile ? profile.email : 'Identity Encrypted'}</span>
              <span className="flex items-center gap-2 ring-1 ring-white/5 bg-white/5 px-3 py-1.5 rounded-lg"><Calendar className="w-4 h-4 text-textMuted" /> Est. {new Date(profile.createdAt).getFullYear()}</span>
            </div>
          </div>

          <div className="pb-8 w-full md:w-auto">
            {isOwnProfile ? (
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'primary'} className="w-full px-10">
                {isEditing ? <><X className="w-5 h-5 mr-3" /> Abort</> : <><Edit3 className="w-5 h-5 mr-3" /> Optimize Profile</>}
              </Button>
            ) : (
              <Button onClick={() => setIsRequesting(true)} disabled={isRequesting} className="w-full px-10 shadow-teal-glow">
                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Initiate Exchange
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-2">
        {/* Identity & Bio */}
        <div className="lg:col-span-1 space-y-8">
          <Card title="Identification Data" className="!p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Core Biography
            </h3>
            {isEditing ? (
              <textarea 
                className="w-full glass-card !bg-white/5 !p-4 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none min-h-[180px] border-none text-textPrimary placeholder:text-slate-700"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Synchronize your professional history..."
              />
            ) : (
              <p className="text-sm leading-loose text-textMuted font-medium">
                {profile.bio || "Initial identification required. Please update biography."}
              </p>
            )}
            
            {isEditing && (
              <div className="mt-8">
                <Input 
                  label="Local Node (Location)" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. London, UK"
                />
              </div>
            )}
          </Card>
        </div>

        {/* Skill Inventory */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="!p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-[50px] rounded-full"></div>
            
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-4">
                <ShieldCheck className="w-7 h-7 text-primary" />
                Expertise Inventory
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {/* Output: What I Teach */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <Award className="w-4 h-4" /> Active Outputs
                  </span>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">{profile.skillsOffered?.length || 0}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {isEditing ? (
                    formData.skillsOffered.map((skill, i) => (
                      <Badge key={i} variant="primary" className="pl-4 pr-1 py-1.5 flex items-center gap-2 ring-1 ring-primary/20">
                        {skill}
                        <button onClick={() => removeSkill('offered', i)} className="p-1 hover:bg-black/20 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    profile.skillsOffered?.map(skill => <Badge key={skill} variant="primary" className="px-5 py-2.5 text-xs font-black ring-1 ring-primary/30">{skill}</Badge>)
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                    <Input 
                      placeholder="Add Output Node" 
                      value={newOffered} 
                      onChange={(e) => setNewOffered(e.target.value)} 
                    />
                    <Button onClick={() => addSkill('offered')} className="px-4"><Plus className="w-5 h-5" /></Button>
                  </div>
                )}
              </div>

              {/* Input: What I Need */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted flex items-center gap-2">
                    <Target className="w-4 h-4" /> Required Inputs
                  </span>
                   <div className="bg-white/5 text-textMuted px-3 py-1 rounded-full text-[10px] font-black">{profile.skillsWanted?.length || 0}</div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  {isEditing ? (
                    formData.skillsWanted.map((skill, i) => (
                      <Badge key={i} variant="neutral" className="pl-4 pr-1 py-1.5 flex items-center gap-2 ring-1 ring-white/10">
                        {skill}
                        <button onClick={() => removeSkill('wanted', i)} className="p-1 hover:bg-black/20 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    profile.skillsWanted?.map(skill => <Badge key={skill} variant="neutral" className="px-5 py-2.5 text-xs font-black ring-1 ring-white/10">{skill}</Badge>)
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                    <Input 
                      placeholder="Add Requirement" 
                      value={newWanted} 
                      onChange={(e) => setNewWanted(e.target.value)} 
                    />
                    <Button variant="secondary" onClick={() => addSkill('wanted')} className="px-4"><Plus className="w-5 h-5 text-primary" /></Button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="px-8">Discard optimization</Button>
                <Button onClick={handleUpdate} className="px-10 shadow-teal-glow"><Save className="w-5 h-5 mr-3" /> Commit Changes</Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Luxury Modal for Request */}
      {isRequesting && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl animate-in fade-in duration-500">
          <Card className="w-full max-w-xl !p-10 shadow-2xl relative overflow-hidden border-white/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h2 className="text-3xl font-black italic">Initiate <span className="text-gradient">Protocol</span></h2>
              <button 
                onClick={() => setIsRequesting(false)}
                className="p-3 hover:bg-white/5 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-8 relative z-10">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
                <Avatar src={profile.profilePicture} alt={profile.name} size="lg" className="ring-2 ring-primary/20" />
                <div>
                  <p className="text-lg font-black">{profile.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Target Specialist</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] ml-1">Transfer Logic: You Teach</label>
                  <select 
                    className="w-full glass-card !bg-white/5 !p-4 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none border-none appearance-none cursor-pointer"
                    value={requestSkillOffered}
                    onChange={(e) => setRequestSkillOffered(e.target.value)}
                    required
                  >
                    <option value="" className="bg-surface">Select expertise node...</option>
                    {currentUser.skillsOffered.map(s => <option key={s} value={s} className="bg-surface text-textPrimary">{s}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-textMuted uppercase tracking-[0.2em] ml-1">Acquisition Logic: You Learn</label>
                  <select 
                    className="w-full glass-card !bg-white/5 !p-4 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none border-none appearance-none cursor-pointer"
                    value={requestSkillWanted}
                    onChange={(e) => setRequestSkillWanted(e.target.value)}
                    required
                  >
                    <option value="" className="bg-surface">Select requirement node...</option>
                    {profile.skillsOffered.map(s => <option key={s} value={s} className="bg-surface text-textPrimary">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setIsRequesting(false)}>Terminate</Button>
                <Button type="submit" className="flex-[2] shadow-teal-glow"><Send className="w-5 h-5 mr-3" /> Transmit Proposal</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
