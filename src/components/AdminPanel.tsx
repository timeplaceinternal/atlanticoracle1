import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, LogOut, Plus, Trash2, Edit2, Newspaper, Upload, Image as ImageIcon, Loader2, X as CloseIcon, ChevronLeft, Play, Calendar } from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsPost } from '../types';

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchAndSortPosts = async () => {
    const fetchedPosts = await newsService.getPosts();
    // Sort by ID (timestamp) descending to show latest first
    const sortedPosts = [...fetchedPosts].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);
      if (!isNaN(idA) && !isNaN(idB)) return idB - idA;
      return b.id.localeCompare(a.id);
    });
    setPosts(sortedPosts);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAndSortPosts();
    }
  }, [isLoggedIn]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'images') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > MAX_SIZE) {
          throw new Error(`File ${files[i].name} is too large. Max size is 5MB.`);
        }
        const formData = new FormData();
        formData.append('file', files[i]);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}`);
        }

        if (response.ok) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.error || `Upload failed with status ${response.status}`);
        }
      }

      if (field === 'imageUrl') {
        setEditingPost(prev => ({ ...(prev || {}), imageUrl: uploadedUrls[0] }));
      } else {
        setEditingPost(prev => ({ 
          ...(prev || {}), 
          images: [...(prev?.images || []), ...uploadedUrls] 
        }));
      }
      
      // Success feedback for upload
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-[300] animate-in slide-in-from-right-8';
      successMsg.textContent = 'Image uploaded successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      const message = error instanceof Error ? error.message : "Failed to upload image. Please check your connection.";
      alert(message);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeSliderImage = (index: number) => {
    if (!editingPost?.images) return;
    const newImages = [...editingPost.images];
    newImages.splice(index, 1);
    setEditingPost({ ...editingPost, images: newImages });
  };

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
    
    const title = editingPost?.title?.trim();
    const text = editingPost?.text?.trim();

    if (!title || !text) {
      alert("Please provide both a title and content for the transmission.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      if (!editingPost) return;
      
      // Auto-fill meta tags if empty
      const metaTitle = editingPost.metaTitle?.trim() || title;
      const metaDescription = editingPost.metaDescription?.trim() || 
        (text.length > 160 ? text.substring(0, 157) + "..." : text);

      const newPost: NewsPost = {
        id: editingPost.id || Date.now().toString(),
        slug: editingPost.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: title,
        text: text,
        date: editingPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        imageUrl: editingPost.imageUrl || '',
        imageSize: editingPost.imageSize || 'large',
        format: editingPost.format || 'fact',
        topic: editingPost.topic || 'astrology',
        videoUrl: editingPost.videoUrl,
        images: editingPost.images,
        metaTitle: metaTitle,
        metaDescription: metaDescription
      };
      await newsService.savePost(newPost);
      await fetchAndSortPosts();
      setSaveSuccess(true);
      // Let the user see the "Published!" state for 2 seconds before closing
      setTimeout(() => {
        setEditingPost(null);
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Save failed:", error);
      alert(`Failed to save transmission: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this transmission?')) {
      try {
        await newsService.deletePost(id);
        await fetchAndSortPosts();
      } catch (error) {
        console.error("Delete failed:", error);
        alert(`Failed to delete transmission: ${error instanceof Error ? error.message : String(error)}`);
      }
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

  if (editingPost) {
    return (
      <div className="min-h-screen bg-cosmic-900 pb-32">
        {/* Editor Header / Toolbar */}
        <div className="sticky top-0 z-[250] bg-cosmic-900/80 backdrop-blur-xl border-b border-cosmic-gold/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setEditingPost(null)}
                className="p-2 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full transition-colors"
                title="Back to Dashboard"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-cinzel text-white uppercase tracking-widest hidden md:block">
                {editingPost.id ? 'Edit Transmission' : 'New Transmission'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-cosmic-gold/20 pr-4">
                <div className="flex flex-col">
                  <label className="text-[8px] uppercase tracking-widest text-cosmic-gold/60">Topic</label>
                  <select 
                    value={editingPost.topic || 'astrology'} 
                    onChange={(e) => setEditingPost({...editingPost, topic: e.target.value as any})}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="astrology" className="bg-cosmic-900">Astrology</option>
                    <option value="numerology" className="bg-cosmic-900">Numerology</option>
                    <option value="astronomy" className="bg-cosmic-900">Astronomy</option>
                    <option value="horoscope" className="bg-cosmic-900">Daily Horoscope</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[8px] uppercase tracking-widest text-cosmic-gold/60">Format</label>
                  <select 
                    value={editingPost.format || 'fact'} 
                    onChange={(e) => setEditingPost({...editingPost, format: e.target.value as any})}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="fact" className="bg-cosmic-900">Fact</option>
                    <option value="forecast" className="bg-cosmic-900">Forecast</option>
                    <option value="series" className="bg-cosmic-900">Series</option>
                    <option value="horoscope" className="bg-cosmic-900">Horoscope</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSavePost}
                disabled={isSaving || isUploading}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  saveSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-cosmic-gold text-cosmic-900 hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                }`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <ShieldCheck className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isSaving ? 'Saving...' : saveSuccess ? 'Published!' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Editor Content */}
        <div className="max-w-4xl mx-auto px-6 pt-20 space-y-12 animate-in fade-in duration-700">
          <header className="space-y-8 text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em]">
              <Calendar className="w-3 h-3" />
              <time>{editingPost.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
              <span className="text-cosmic-gold">{editingPost.topic || 'astrology'}</span>
            </div>
            
            <textarea 
              value={editingPost.title || ''} 
              onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
              placeholder="ENTER SACRED TITLE..."
              rows={2}
              className="w-full bg-transparent text-4xl md:text-7xl font-cinzel text-white uppercase tracking-widest leading-tight text-center outline-none border-b border-transparent focus:border-cosmic-gold/20 resize-none placeholder:text-white/10"
            />
            
            <div className="flex justify-center">
              <div className="w-32 h-px bg-cosmic-gold/30"></div>
            </div>
          </header>

          <div className="space-y-12">
            {/* Media Section */}
            <div className="space-y-6">
              {/* Main Image / Video Preview */}
              {editingPost.videoUrl ? (
                <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl group">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${editingPost.videoUrl.split('v=')[1]?.split('&')[0] || editingPost.videoUrl.split('/').pop()}`}
                    title="Preview"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <button 
                    onClick={() => setEditingPost({...editingPost, videoUrl: ''})}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : editingPost.imageUrl ? (
                <div className={`relative rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl group ${editingPost.imageSize === 'small' ? 'md:w-1/2 md:float-right md:ml-8 md:mb-8' : 'w-full'}`}>
                  <img src={editingPost.imageUrl} alt="Preview" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => setEditingPost({...editingPost, imageUrl: ''})}
                      className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <select 
                      value={editingPost.imageSize || 'large'} 
                      onChange={(e) => setEditingPost({...editingPost, imageSize: e.target.value as any})}
                      className="bg-cosmic-900 border border-cosmic-gold/30 text-white px-4 py-2 rounded-xl outline-none"
                    >
                      <option value="large">Large</option>
                      <option value="small">Small</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="cursor-pointer aspect-video bg-cosmic-800/40 border-2 border-dashed border-cosmic-gold/20 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-cosmic-gold/40 transition-all group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-cosmic-gold" /> : <ImageIcon className="w-12 h-12 text-cosmic-gold/40 group-hover:text-cosmic-gold transition-colors" />}
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-cosmic-gold/60">Add Main Image</span>
                  </label>
                  <div className="aspect-video bg-cosmic-800/40 border-2 border-dashed border-cosmic-gold/20 rounded-3xl flex flex-col items-center justify-center gap-4 p-6">
                    <div className="flex items-center gap-2 w-full">
                      <Play className="w-5 h-5 text-cosmic-gold/40" />
                      <input 
                        type="text" 
                        placeholder="YouTube URL..."
                        value={editingPost.videoUrl || ''}
                        onChange={(e) => setEditingPost({...editingPost, videoUrl: e.target.value})}
                        className="flex-1 bg-transparent border-b border-cosmic-gold/20 text-white text-sm outline-none focus:border-cosmic-gold transition-colors py-2"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-gold/40">Or embed a video</span>
                  </div>
                </div>
              )}

              {/* Slider Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cosmic-gold/40">Image Gallery / Slider</h5>
                  <label className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-gold hover:text-white transition-colors flex items-center gap-2">
                    <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'images')} />
                    <Plus className="w-3 h-3" /> Add Gallery Images
                  </label>
                </div>
                
                {editingPost.images && editingPost.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingPost.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-cosmic-gold/10 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeSliderImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Text Content Editor */}
            <div className="relative">
              <textarea 
                value={editingPost.text || ''} 
                onChange={(e) => setEditingPost({...editingPost, text: e.target.value})}
                placeholder="Begin the cosmic transmission..."
                className="w-full bg-transparent text-cosmic-silver leading-relaxed text-xl font-serif italic outline-none min-h-[400px] resize-none placeholder:text-white/5"
              />
              {/* Drop Cap Preview (Visual only) */}
              {editingPost.text && (
                <div className="absolute top-0 left-0 pointer-events-none opacity-10">
                  <span className="text-7xl font-cinzel text-cosmic-gold mr-4 float-left mt-2">
                    {editingPost.text.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SEO Sidebar / Footer */}
          <div className="pt-20 border-t border-cosmic-gold/10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest">SEO Metadata</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Meta Title</label>
                  <input 
                    type="text" 
                    value={editingPost.metaTitle || ''} 
                    onChange={(e) => setEditingPost({...editingPost, metaTitle: e.target.value})}
                    placeholder={editingPost.title || "SEO Title"}
                    className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-3 text-white text-sm outline-none focus:border-cosmic-gold/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Meta Description</label>
                  <textarea 
                    value={editingPost.metaDescription || ''} 
                    onChange={(e) => setEditingPost({...editingPost, metaDescription: e.target.value})}
                    placeholder="Brief summary for search engines..."
                    className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-3 text-white text-sm outline-none focus:border-cosmic-gold/40 h-24 resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest">Publishing Info</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-cosmic-800/20 rounded-2xl border border-cosmic-gold/5">
                  <span className="text-xs text-cosmic-silver/60 uppercase tracking-widest">Slug</span>
                  <span className="text-xs text-cosmic-gold font-mono">{editingPost.slug || 'auto-generated'}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-cosmic-800/20 rounded-2xl border border-cosmic-gold/5">
                  <span className="text-xs text-cosmic-silver/60 uppercase tracking-widest">Date</span>
                  <span className="text-xs text-white">{editingPost.date || 'Today'}</span>
                </div>
                <button 
                  onClick={() => setEditingPost(null)}
                  className="w-full py-4 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default AdminPanel;
