import React, { useState, useEffect } from 'react';
import { NewsPost, PostFormat } from '../types';
import { Plus, Trash2, Layout, Image as ImageIcon, Type, Tag, Calendar, Save, AlertCircle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    format: 'fact',
    topic: 'astrology',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('atlantic_oracle_news');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        setPosts([]);
      }
    }
  }, []);

  const saveToStorage = (newPosts: NewsPost[]) => {
    localStorage.setItem('atlantic_oracle_news', JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.text || !formData.imageUrl) {
      setError('Please fill in all required fields (Title, Text, Image URL)');
      return;
    }

    const newPost: NewsPost = {
      id: Math.random().toString(36).substring(7),
      title: formData.title!,
      text: formData.text!,
      imageUrl: formData.imageUrl!,
      format: formData.format as PostFormat,
      topic: formData.topic as any,
      date: formData.date || new Date().toISOString().split('T')[0],
      images: formData.format === 'series' ? [formData.imageUrl!] : undefined
    };

    const updatedPosts = [newPost, ...posts];
    saveToStorage(updatedPosts);
    setSuccess('Post published to the cosmos!');
    setFormData({
      format: 'fact',
      topic: 'astrology',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const deletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-cinzel font-bold text-cosmic-gold mb-2">Oracle Admin Panel</h1>
        <p className="text-cosmic-silver">Manage the Cosmic News & Forecasts stream.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-2xl p-8 sticky top-24">
            <h2 className="text-xl font-cinzel font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cosmic-gold" /> New Transmission
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex items-center gap-2">
                <Save className="w-4 h-4" /> {success}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Title</label>
                <input 
                  type="text"
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all"
                  value={formData.title || ''}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="The Saturn Shift..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Content</label>
                <textarea 
                  rows={4}
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all resize-none"
                  value={formData.text || ''}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  placeholder="Describe the celestial event..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Format</label>
                  <select 
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all"
                    value={formData.format}
                    onChange={e => setFormData({...formData, format: e.target.value as PostFormat})}
                  >
                    <option value="fact">Fact (Small)</option>
                    <option value="forecast">Forecast (Large)</option>
                    <option value="series">Series (Slider)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Topic</label>
                  <select 
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all"
                    value={formData.topic}
                    onChange={e => setFormData({...formData, topic: e.target.value as any})}
                  >
                    <option value="astrology">Astrology</option>
                    <option value="numerology">Numerology</option>
                    <option value="astronomy">Astronomy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Main Image URL</label>
                <input 
                  type="text"
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://picsum.photos/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-cosmic-silver mb-2">Date</label>
                <input 
                  type="date"
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-3 text-white focus:outline-none focus:border-cosmic-gold transition-all"
                  value={formData.date || ''}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-cosmic-gold text-cosmic-900 font-cinzel font-bold rounded-xl hover:bg-white transition-all active:scale-95 shadow-lg shadow-cosmic-gold/20"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="lg:col-span-2">
          <div className="bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-cosmic-gold/10 bg-white/5">
              <h2 className="text-xl font-cinzel font-bold text-white">Active Transmissions ({posts.length})</h2>
            </div>
            <div className="divide-y divide-cosmic-gold/10">
              {posts.length === 0 ? (
                <div className="p-20 text-center text-cosmic-silver italic">
                  No custom posts found. Only initial news are visible on the page.
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="p-6 flex items-center justify-between gap-6 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-cosmic-gold/20 shrink-0">
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">{post.title}</h4>
                        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-cosmic-silver">
                          <span className="flex items-center gap-1"><Layout className="w-3 h-3" /> {post.format}</span>
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {post.topic}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-3 text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
