import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, LogOut, Plus, Trash2, Edit2, Newspaper } from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsPost } from '../types';

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchPosts = async () => {
        const fetchedPosts = await newsService.getPosts();
        setPosts(fetchedPosts);
      };
      fetchPosts();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cosmic123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid cosmic frequency.');
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost && editingPost.title && editingPost.text) {
      const newPost: NewsPost = {
        id: editingPost.id || Date.now().toString(),
        slug: editingPost.slug || editingPost.title.toLowerCase().replace(/ /g, '-'),
        title: editingPost.title,
        text: editingPost.text,
        date: editingPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        imageUrl: editingPost.imageUrl || 'https://picsum.photos/seed/cosmic/800/600',
        format: editingPost.format || 'fact',
        topic: editingPost.topic || 'astrology'
      };
      await newsService.savePost(newPost);
      const updatedPosts = await newsService.getPosts();
      setPosts(updatedPosts);
      setEditingPost(null);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this transmission?')) {
      await newsService.deletePost(id);
      const updatedPosts = await newsService.getPosts();
      setPosts(updatedPosts);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-12">
          <div className="text-center space-y-4">
            <ShieldCheck className="w-16 h-16 text-cosmic-gold mx-auto mb-6" />
            <h1 className="text-3xl font-cinzel text-white uppercase tracking-widest">Admin Sanctuary</h1>
            <p className="text-cosmic-silver italic font-playfair">Enter the sacred frequency.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">Sacred Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmic-gold/40 hover:text-cosmic-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform">Unlock Portal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-cinzel text-white uppercase tracking-widest">Admin Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Exit Sanctuary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Total Consultations</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">1,234</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Active Users</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">567</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
          <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Revenue (MTD)</h4>
          <p className="text-4xl font-cinzel text-cosmic-gold">€5,670</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-cosmic-gold" /> Gazette Management
          </h2>
          <button 
            onClick={() => setEditingPost({})} 
            className="flex items-center gap-2 px-6 py-3 bg-cosmic-gold text-cosmic-900 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> New Transmission
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-cosmic-800/20 border border-cosmic-gold/10 p-8 rounded-3xl flex items-center justify-between group hover:border-cosmic-gold/30 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
                  <span>{post.topic}</span>
                </div>
                <h4 className="text-xl font-cinzel text-white">{post.title}</h4>
                <p className="text-cosmic-silver/60 text-sm line-clamp-1 max-w-2xl">{post.text}</p>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingPost(post)}
                  className="p-3 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-xl transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-cosmic-900/80 backdrop-blur-xl">
          <div className="bg-cosmic-800 border border-cosmic-gold/30 p-10 rounded-[3rem] max-w-2xl w-full space-y-8 shadow-2xl">
            <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">
              {editingPost.id ? 'Edit Transmission' : 'New Transmission'}
            </h3>
            <form onSubmit={handleSavePost} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-cosmic-silver text-xs uppercase tracking-widest">Title</label>
                <input 
                  type="text" 
                  value={editingPost.title || ''} 
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-cosmic-silver text-xs uppercase tracking-widest">Content</label>
                <textarea 
                  value={editingPost.text || ''} 
                  onChange={(e) => setEditingPost({...editingPost, text: e.target.value})}
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none min-h-[200px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-cosmic-silver text-xs uppercase tracking-widest">Topic</label>
                  <select 
                    value={editingPost.topic || 'astrology'} 
                    onChange={(e) => setEditingPost({...editingPost, topic: e.target.value as any})}
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none"
                  >
                    <option value="astrology">Astrology</option>
                    <option value="numerology">Numerology</option>
                    <option value="astronomy">Astronomy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-cosmic-silver text-xs uppercase tracking-widest">Format</label>
                  <select 
                    value={editingPost.format || 'fact'} 
                    onChange={(e) => setEditingPost({...editingPost, format: e.target.value as any})}
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none"
                  >
                    <option value="fact">Fact</option>
                    <option value="forecast">Forecast</option>
                    <option value="series">Series</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform">Save Transmission</button>
                <button type="button" onClick={() => setEditingPost(null)} className="flex-1 py-4 bg-cosmic-800 text-white font-bold rounded-xl border border-cosmic-gold/20 hover:bg-cosmic-700 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
