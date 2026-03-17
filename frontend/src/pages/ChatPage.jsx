import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import { Send, MessageSquare, ArrowLeft, MoreVertical, Smartphone } from 'lucide-react';

const ChatPage = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Connect to Socket.io
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socket.current = io(socketUrl, {
      withCredentials: true,
    });

    socket.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chat');
        setChats(res.data.chats);
      } catch (err) {
        console.error('Error fetching chats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      const fetchChatDetails = async () => {
        try {
          const res = await api.get(`/chat/${chatId}`);
          setCurrentChat(res.data.chat);
          setMessages(res.data.chat.messages);
          scrollToBottom();
          
          // Join socket room
          socket.current.emit('join_room', chatId);
        } catch (err) {
          console.error('Error fetching chat details', err);
        }
      };
      fetchChatDetails();
    } else {
      setCurrentChat(null);
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const messageData = {
      chatId,
      senderId: user._id,
      text: newMessage.trim(),
    };

    try {
      setSending(true);
      // Emit via socket for real-time
      socket.current.emit('send_message', messageData);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      {/* Sidebar: Chat List */}
      <Card className={`w-full md:w-80 flex flex-col p-0 overflow-hidden ${chatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Messages
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              const isActive = chat._id === chatId;
              return (
                <Link 
                  key={chat._id} 
                  to={`/chat/${chat._id}`}
                  className={`flex items-center gap-3 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                >
                  <Avatar src={otherUser.profilePicture} alt={otherUser.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-bold truncate text-sm">{otherUser.name}</p>
                      <span className="text-[10px] text-textMuted uppercase">
                        {chat.updatedAt && new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-textMuted truncate">
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-8 text-center text-textMuted italic text-sm">
              Your message list is empty.
            </div>
          )}
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className={`flex-1 flex flex-col p-0 overflow-hidden ${!chatId ? 'hidden md:flex justify-center items-center' : 'flex'}`}>
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Link to="/chat" className="md:hidden p-1 hover:bg-slate-800 rounded-full transition-colors mr-1">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <Avatar 
                  src={getOtherParticipant(currentChat).profilePicture} 
                  alt={getOtherParticipant(currentChat).name} 
                  size="sm" 
                />
                <div>
                  <h3 className="font-bold text-sm leading-none">{getOtherParticipant(currentChat).name}</h3>
                  <p className="text-[10px] text-primary mt-1 flex items-center gap-1 font-bold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user._id || msg.senderId?._id === user._id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe 
                          ? 'bg-primary text-slate-900 font-medium rounded-tr-none' 
                          : 'bg-surface border border-slate-800 text-textPrimary rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-slate-900/60' : 'text-textMuted text-right'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex gap-3 bg-slate-900/50">
              <input 
                className="flex-1 bg-surface border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder-textMuted"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" disabled={!newMessage.trim() || sending} className="px-5">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Welcome to your Inbox</h3>
            <p className="text-textMuted max-w-sm mb-8">
              Select an active conversation from the sidebar to start chatting with your exchange partners.
            </p>
            <div className="flex gap-4">
              <Link to="/marketplace">
                <Button variant="secondary" size="sm">Explore Marketplace</Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatPage;
