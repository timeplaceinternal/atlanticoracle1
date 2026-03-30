import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, LogOut, Plus, Trash2, Edit2, Newspaper, Upload, Image as ImageIcon, Loader2, X as CloseIcon, ChevronLeft, Play, Calendar, Star, BookOpen, Hash, HelpCircle, Table, Link as LinkIcon, FileText, Sparkles, Download } from 'lucide-react';
import { newsService } from '../services/newsService';
import { kbService } from '../services/kbService';
import { NewsPost, KnowledgeBasePost, KBCategory, ServiceType } from '../types';

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'kb' | 'promos' | 'dealers' | 'webhooks'>('news');
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [kbPosts, setKbPosts] = useState<KnowledgeBasePost[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null);
  const [editingKB, setEditingKB] = useState<Partial<KnowledgeBasePost> | null>(null);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);
  const [viewingPromo, setViewingPromo] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDeletePromo = async (code: string) => {
    if (!window.confirm(`Are you sure you want to delete promo code ${code}?`)) return;
    setPromoCodes(prev => prev.filter(p => p.code !== code));
  };

  const handleSavePromo = async () => {
    if (!editingPromo) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      // Logic to save promo code would go here
      setPromoCodes(prev => {
        const index = prev.findIndex(p => p.code === editingPromo.code);
        if (index >= 0) {
          const newPromos = [...prev];
          newPromos[index] = editingPromo;
          return newPromos;
        }
        return [...prev, editingPromo];
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setEditingPromo(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save promo');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAllData = async () => {
    try {
      console.log(">>> AdminPanel.fetchAllData - Fetching all data...");
      const [fetchedNews, fetchedKB] = await Promise.all([
        newsService.getPosts(),
        kbService.getPosts()
      ]);
      
      console.log(`>>> AdminPanel.fetchAllData - Fetched ${fetchedNews.length} news, ${fetchedKB.length} KB`);
      
      setPosts([...fetchedNews].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        const now = Date.now();
        const diffA = isNaN(dateA) ? Infinity : Math.abs(dateA - now);
        const diffB = isNaN(dateB) ? Infinity : Math.abs(dateB - now);
        if (diffA !== diffB) return diffA - diffB;
        return Number(b.id) - Number(a.id);
      }));
      setKbPosts([...fetchedKB].sort((a, b) => b.title.localeCompare(a.title)));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks');
      if (response.ok) {
        const data = await response.json();
        setWebhookLogs(data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch webhooks:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
      fetchWebhooks();
    }
  }, [isLoggedIn]);

  const handleTextImport = (e: React.ChangeEvent<HTMLInputElement>, isKB: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      // Smart parsing:
      // 1. Split by double newlines to find paragraphs
      // 2. First non-empty line is Title
      // 3. If KB: Next non-empty paragraph is Short Definition
      // 4. Everything else is Main Content
      
      const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
      if (paragraphs.length === 0) return;

      const title = paragraphs[0].split('\n')[0].replace(/^#+\s*/, ''); // Remove markdown heading if present
      
      if (isKB) {
        const shortDef = paragraphs.length > 1 ? paragraphs[1] : '';
        const mainContent = paragraphs.slice(2).join('\n\n');
        
        setEditingKB(prev => ({
          ...(prev || {}),
          title,
          shortDefinition: shortDef,
          mainContent: mainContent || shortDef
        }));
      } else {
        const mainContent = paragraphs.slice(1).join('\n\n');
        setEditingPost(prev => ({
          ...(prev || {}),
          title,
          text: mainContent
        }));
      }
      
      // Success feedback
      const msg = document.createElement('div');
      msg.className = 'fixed bottom-8 right-8 bg-cosmic-gold text-cosmic-900 px-6 py-3 rounded-xl shadow-2xl z-[300] animate-in slide-in-from-right-8 font-bold flex items-center gap-2';
      msg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Structure Imported!`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset
  };

  const smartFormat = (isKB: boolean) => {
    const currentText = isKB ? editingKB?.mainContent : editingPost?.text;
    if (!currentText) return;

    // Detect lines that look like headings (short, no punctuation at end)
    const lines = currentText.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.length > 0 && trimmed.length < 70 && !/[.!?]$/.test(trimmed) && !trimmed.startsWith('#')) {
        return `## ${trimmed}`;
      }
      return line;
    });

    if (isKB) {
      setEditingKB(prev => ({ ...prev, mainContent: formattedLines.join('\n') }));
    } else {
      setEditingPost(prev => ({ ...prev, text: formattedLines.join('\n') }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'images', isKB: boolean = false) => {
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

      if (isKB) {
        if (field === 'imageUrl') {
          setEditingKB(prev => ({ ...(prev || {}), imageUrl: uploadedUrls[0] }));
        }
      } else {
        if (field === 'imageUrl') {
          setEditingPost(prev => ({ ...(prev || {}), imageUrl: uploadedUrls[0] }));
        } else {
          setEditingPost(prev => {
            const currentImages = prev?.images || [];
            const newImages = [...currentImages, ...uploadedUrls];
            const imageUrl = prev?.imageUrl || uploadedUrls[0];
            return { ...(prev || {}), images: newImages, imageUrl };
          });
        }
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

  const setAsMainImage = (url: string) => {
    setEditingPost(prev => ({ ...(prev || {}), imageUrl: url }));
  };

  const clearMainImage = () => {
    setEditingPost(prev => ({ ...(prev || {}), imageUrl: '' }));
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

  const handleSaveKB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKB?.title || !editingKB?.mainContent) {
      alert("Title and content are required.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const title = editingKB.title.trim();
      const newPost: KnowledgeBasePost = {
        id: editingKB.id || Date.now().toString(),
        slug: editingKB.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: editingKB.category || 'astrological-entities',
        title: title,
        shortDefinition: editingKB.shortDefinition || '',
        mainContent: editingKB.mainContent || '',
        dataTable: editingKB.dataTable,
        synthesisNote: editingKB.synthesisNote,
        faq: editingKB.faq,
        imageUrl: editingKB.imageUrl,
        metaTitle: editingKB.metaTitle || title,
        metaDescription: editingKB.metaDescription || editingKB.shortDefinition || '',
        dateModified: new Date().toISOString(),
        relatedProductId: editingKB.relatedProductId
      };
      await kbService.savePost(newPost);
      await fetchAllData();
      setSaveSuccess(true);
      setTimeout(() => {
        setEditingKB(null);
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      alert(`Failed to save KB article: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKB = async (id: string) => {
    if (confirm('Are you sure you want to delete this KB article?')) {
      try {
        await kbService.deletePost(id);
        await fetchAllData();
      } catch (error) {
        alert(`Failed to delete KB article: ${error instanceof Error ? error.message : String(error)}`);
      }
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
      await fetchAllData();
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
        await fetchAllData();
      } catch (error) {
        console.error("Delete failed:", error);
        alert(`Failed to delete transmission: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const getDisplayImage = (post: NewsPost) => {
    if (post.imageUrl) return post.imageUrl;
    if (post.images && post.images.length > 0) return post.images[0];
    if (post.videoUrl) {
      const videoId = post.videoUrl.split('v=')[1]?.split('&')[0] || post.videoUrl.split('/').pop();
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
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

  if (editingKB) {
    return (
      <div className="min-h-screen bg-cosmic-900 pb-32">
        <div className="sticky top-0 z-[250] bg-cosmic-900/80 backdrop-blur-xl border-b border-cosmic-gold/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setEditingKB(null)}
                className="p-2 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-cinzel text-white uppercase tracking-widest">
                {editingKB.id ? 'Edit Article' : 'New KB Article'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-cosmic-gold/20 pr-4">
                <div className="flex flex-col">
                  <label className="text-[8px] uppercase tracking-widest text-cosmic-gold/60">Category</label>
                  <select 
                    value={editingKB.category || 'astrological-entities'} 
                    onChange={(e) => setEditingKB({...editingKB, category: e.target.value as KBCategory})}
                    className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="astrological-entities" className="bg-cosmic-900">Astrological Entities</option>
                    <option value="numerical-vibrations" className="bg-cosmic-900">Numerical Vibrations</option>
                    <option value="synthesis-methodology" className="bg-cosmic-900">Synthesis & Methodology</option>
                    <option value="human-design-basics" className="bg-cosmic-900">Human Design Basics</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSaveKB}
                disabled={isSaving || isUploading}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  saveSuccess ? 'bg-green-500 text-white' : 'bg-cosmic-gold text-cosmic-900'
                }`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <ShieldCheck className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isSaving ? 'Saving...' : saveSuccess ? 'Published!' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-20 space-y-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">H1 Title</label>
                <label className="cursor-pointer flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors text-[10px] uppercase tracking-widest">
                  <input type="file" className="hidden" accept=".txt,.md" onChange={(e) => handleTextImport(e, true)} />
                  <FileText className="w-3 h-3" /> Import from File
                </label>
              </div>
              <input 
                type="text"
                value={editingKB.title || ''} 
                onChange={(e) => setEditingKB({...editingKB, title: e.target.value})}
                placeholder="The [Term Name]"
                className="w-full bg-transparent text-4xl font-cinzel text-white uppercase tracking-widest outline-none border-b border-cosmic-gold/20 focus:border-cosmic-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Short Definition (Snippet)</label>
              <textarea 
                value={editingKB.shortDefinition || ''} 
                onChange={(e) => setEditingKB({...editingKB, shortDefinition: e.target.value})}
                placeholder="1-2 sentences for AI snippet..."
                className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold/40 h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Main Content (Markdown supported)</label>
                <button 
                  onClick={() => smartFormat(true)}
                  className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors text-[10px] uppercase tracking-widest"
                  title="Auto-detect headings and format structure"
                >
                  <Sparkles className="w-3 h-3" /> Smart Format
                </button>
              </div>
              <textarea 
                value={editingKB.mainContent || ''} 
                onChange={(e) => setEditingKB({...editingKB, mainContent: e.target.value})}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
                placeholder="Use H2, H3 for structure..."
                className="w-full bg-transparent text-cosmic-silver leading-relaxed text-xl font-serif italic outline-none min-h-[400px] resize-none border border-cosmic-gold/5 p-4 rounded-xl overflow-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60 flex items-center gap-2">
                  <Table className="w-3 h-3" /> Data Table (HTML)
                </label>
                <textarea 
                  value={editingKB.dataTable || ''} 
                  onChange={(e) => setEditingKB({...editingKB, dataTable: e.target.value})}
                  placeholder="<table>...</table>"
                  className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-4 text-white font-mono text-xs h-32 resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Synthesis Note
                </label>
                <textarea 
                  value={editingKB.synthesisNote || ''} 
                  onChange={(e) => setEditingKB({...editingKB, synthesisNote: e.target.value})}
                  placeholder="Connection between systems..."
                  className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-4 text-white italic h-32 resize-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60 flex items-center gap-2">
                <HelpCircle className="w-3 h-3" /> FAQ Block
              </label>
              {(editingKB.faq || []).map((item, idx) => (
                <div key={idx} className="p-4 bg-cosmic-800/20 border border-cosmic-gold/10 rounded-2xl space-y-3">
                  <input 
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newFaq = [...(editingKB.faq || [])];
                      newFaq[idx].question = e.target.value;
                      setEditingKB({...editingKB, faq: newFaq});
                    }}
                    placeholder="Question"
                    className="w-full bg-transparent border-b border-cosmic-gold/10 text-white text-sm outline-none py-1"
                  />
                  <textarea 
                    value={item.answer}
                    onChange={(e) => {
                      const newFaq = [...(editingKB.faq || [])];
                      newFaq[idx].answer = e.target.value;
                      setEditingKB({...editingKB, faq: newFaq});
                    }}
                    placeholder="Answer"
                    className="w-full bg-transparent text-cosmic-silver text-sm outline-none resize-none"
                  />
                  <button 
                    onClick={() => {
                      const newFaq = (editingKB.faq || []).filter((_, i) => i !== idx);
                      setEditingKB({...editingKB, faq: newFaq});
                    }}
                    className="text-red-400 text-[10px] uppercase tracking-widest"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setEditingKB({...editingKB, faq: [...(editingKB.faq || []), { question: '', answer: '' }]})}
                className="text-cosmic-gold text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add FAQ Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-cosmic-gold/10">
              <div className="space-y-4">
                <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest">SEO & AI</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Meta Title</label>
                    <input 
                      type="text" 
                      value={editingKB.metaTitle || ''} 
                      onChange={(e) => setEditingKB({...editingKB, metaTitle: e.target.value})}
                      className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-3 text-white text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Meta Description</label>
                    <textarea 
                      value={editingKB.metaDescription || ''} 
                      onChange={(e) => setEditingKB({...editingKB, metaDescription: e.target.value})}
                      className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-3 text-white text-sm outline-none h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest">Internal Linking</h4>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/40 flex items-center gap-2">
                    <LinkIcon className="w-3 h-3" /> Related Product
                  </label>
                  <select 
                    value={editingKB.relatedProductId || ''} 
                    onChange={(e) => setEditingKB({...editingKB, relatedProductId: e.target.value as ServiceType})}
                    className="w-full bg-cosmic-800/40 border border-cosmic-gold/10 rounded-xl p-3 text-white text-sm outline-none"
                  >
                    <option value="">None</option>
                    {Object.values(ServiceType).map(type => (
                      <option key={type} value={type}>{type.replace(/-/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-cosmic-gold/5 rounded-2xl border border-cosmic-gold/10">
                  <p className="text-[10px] text-cosmic-gold/60 leading-relaxed italic">
                    Linking to a relevant product increases conversion and helps AI understand the value proposition.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            
            <div className="flex items-center justify-center gap-6 mb-4">
              <label className="cursor-pointer flex items-center gap-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors text-[10px] uppercase tracking-widest">
                <input type="file" className="hidden" accept=".txt,.md" onChange={(e) => handleTextImport(e, false)} />
                <FileText className="w-3 h-3" /> Import Text File
              </label>
              <button 
                onClick={() => smartFormat(false)}
                className="flex items-center gap-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors text-[10px] uppercase tracking-widest"
              >
                <Sparkles className="w-3 h-3" /> Smart Format
              </button>
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
                <div className="relative rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl group">
                  <img src={editingPost.imageUrl} alt="Preview" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={clearMainImage}
                        className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                        title="Remove Main Image"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                      <div className="bg-cosmic-900/90 p-4 rounded-2xl border border-cosmic-gold/30 flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Display Size</label>
                        <select 
                          value={editingPost.imageSize || 'large'} 
                          onChange={(e) => setEditingPost({...editingPost, imageSize: e.target.value as any})}
                          className="bg-transparent text-white px-2 py-1 rounded outline-none font-bold"
                        >
                          <option value="large">Full Width</option>
                          <option value="small">Float Right</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-white text-xs font-bold uppercase tracking-widest bg-cosmic-gold/20 px-4 py-2 rounded-full border border-cosmic-gold/30">Main Image Active</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="cursor-pointer aspect-video bg-cosmic-800/40 border-2 border-dashed border-cosmic-gold/20 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-cosmic-gold/40 transition-all group">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'imageUrl')} />
                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-cosmic-gold" /> : <ImageIcon className="w-12 h-12 text-cosmic-gold/40 group-hover:text-cosmic-gold transition-colors" />}
                    <div className="text-center">
                      <span className="block text-xs font-bold uppercase tracking-[0.2em] text-cosmic-gold/60">Upload Main Image</span>
                      <span className="text-[10px] text-cosmic-silver/40 mt-1 block">This will be the primary visual</span>
                    </div>
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
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button 
                            onClick={() => setAsMainImage(img)}
                            className="px-3 py-1.5 bg-cosmic-gold text-cosmic-900 text-[8px] font-bold rounded-lg hover:scale-105 transition-transform uppercase tracking-widest"
                          >
                            Set as Main
                          </button>
                          <button 
                            onClick={() => removeSliderImage(idx)}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {editingPost.imageUrl === img && (
                          <div className="absolute top-2 left-2 bg-cosmic-gold text-cosmic-900 p-1 rounded-md">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        )}
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
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
                placeholder="Begin the cosmic transmission..."
                className="w-full bg-transparent text-cosmic-silver leading-relaxed text-xl font-serif italic outline-none min-h-[400px] resize-none placeholder:text-white/5 overflow-hidden"
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
                  onClick={handleSavePost}
                  disabled={isSaving || isUploading}
                  className={`w-full py-5 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    saveSuccess 
                      ? 'bg-green-500 text-white' 
                      : 'bg-cosmic-gold text-cosmic-900 hover:scale-[1.02] active:scale-95 shadow-cosmic-gold/20'
                  }`}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? <ShieldCheck className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isSaving ? 'Saving Transmission...' : saveSuccess ? 'Published Successfully!' : 'Publish Transmission'}
                </button>

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
        <div className="flex items-center gap-8">
          <div className="flex bg-cosmic-800/40 rounded-xl p-1 border border-cosmic-gold/20">
            <button 
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'news' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-gold/60 hover:text-cosmic-gold'}`}
            >
              News
            </button>
            <button 
              onClick={() => setActiveTab('kb')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'kb' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-gold/60 hover:text-cosmic-gold'}`}
            >
              Knowledge Base
            </button>
            <button 
              onClick={() => setActiveTab('promos')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'promos' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-gold/60 hover:text-cosmic-gold'}`}
            >
              Promo Codes
            </button>
            <button 
              onClick={() => setActiveTab('dealers')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'dealers' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-gold/60 hover:text-cosmic-gold'}`}
            >
              Dealers
            </button>
            <button 
              onClick={() => setActiveTab('webhooks')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'webhooks' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-gold/60 hover:text-cosmic-gold'}`}
            >
              Webhooks
            </button>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Exit Sanctuary
          </button>
        </div>
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
            {activeTab === 'news' ? (
              <><Newspaper className="w-6 h-6 text-cosmic-gold" /> Gazette Management</>
            ) : activeTab === 'kb' ? (
              <><BookOpen className="w-6 h-6 text-cosmic-gold" /> Knowledge Base</>
            ) : activeTab === 'promos' ? (
              <><Sparkles className="w-6 h-6 text-cosmic-gold" /> Promo Codes</>
            ) : (
              <><FileText className="w-6 h-6 text-cosmic-gold" /> Dealer Network</>
            )}
          </h2>
          <button 
            onClick={() => {
              if (activeTab === 'news') setEditingPost({});
              else if (activeTab === 'kb') setEditingKB({});
              else setEditingPromo({ 
                code: '', 
                discount: 50, 
                isActive: true, 
                dealerName: '', 
                dealerRequisites: '', 
                channels: [], 
                audienceSize: 0, 
                commissionRate: 0 
              });
            }} 
            className="flex items-center gap-2 px-6 py-3 bg-cosmic-gold text-cosmic-900 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> 
            {activeTab === 'news' ? 'New Transmission' : activeTab === 'kb' ? 'New Article' : activeTab === 'promos' ? 'New Promo Code' : 'New Dealer'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'news' ? (
            posts.map(post => (
              <div key={post.id} className="bg-cosmic-800/20 border border-cosmic-gold/10 p-8 rounded-3xl flex items-center justify-between group hover:border-cosmic-gold/30 transition-all">
                <div className="flex items-center gap-6">
                  {getDisplayImage(post) && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-cosmic-gold/20 flex-shrink-0">
                      <img src={getDisplayImage(post)!} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
                      <span>{post.topic}</span>
                    </div>
                    <h4 className="text-xl font-cinzel text-white">{post.title}</h4>
                    <p className="text-cosmic-silver/60 text-sm line-clamp-1 max-w-2xl">{post.text}</p>
                  </div>
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
            ))
          ) : activeTab === 'kb' ? (
            kbPosts.map(post => (
              <div key={post.id} className="bg-cosmic-800/20 border border-cosmic-gold/10 p-8 rounded-3xl flex items-center justify-between group hover:border-cosmic-gold/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-gold/10 flex items-center justify-center border border-cosmic-gold/20">
                    <Hash className="w-6 h-6 text-cosmic-gold" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                      <span>{post.category.replace(/-/g, ' ')}</span>
                      <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
                      <span>{new Date(post.dateModified).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xl font-cinzel text-white">{post.title}</h4>
                    <p className="text-cosmic-silver/60 text-sm line-clamp-1 max-w-2xl">{post.shortDefinition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setEditingKB(post)}
                    className="p-3 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteKB(post.id)}
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : activeTab === 'promos' ? (
            promoCodes.map(promo => (
              <div key={promo.id} className="bg-cosmic-800/20 border border-cosmic-gold/10 p-8 rounded-3xl flex items-center justify-between group hover:border-cosmic-gold/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-cosmic-gold/10 flex items-center justify-center border border-cosmic-gold/20">
                    <Sparkles className="w-6 h-6 text-cosmic-gold" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                      <span>Created: {new Date(promo.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
                      <span className={promo.isActive ? 'text-green-400' : 'text-red-400'}>
                        {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <h4 className="text-xl font-cinzel text-white">{promo.code}</h4>
                    <p className="text-cosmic-silver/60 text-sm">
                      {promo.dealerName ? `Dealer: ${promo.dealerName} • ` : ''}
                      Discount: {promo.discount}% • Used: {promo.usageCount} times
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setViewingPromo(promo)}
                    className="p-3 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-xl transition-colors"
                    title="View Report"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setEditingPromo(promo)}
                    className="p-3 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeletePromo(promo.id)}
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : activeTab === 'dealers' ? (
            <div className="bg-cosmic-800/20 border border-cosmic-gold/10 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-cosmic-gold/5 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                  <tr>
                    <th className="px-8 py-6">Dealer Name</th>
                    <th className="px-8 py-6">Promo Code</th>
                    <th className="px-8 py-6">Channels</th>
                    <th className="px-8 py-6">Audience</th>
                    <th className="px-8 py-6">Sales</th>
                    <th className="px-8 py-6">Revenue</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cosmic-gold/10">
                  {promoCodes.filter(p => 
                    p.dealerName?.trim() || 
                    p.dealerRequisites?.trim() || 
                    (p.channels && p.channels.length > 0) || 
                    (p.audienceSize && p.audienceSize > 0) || 
                    (p.commissionRate && p.commissionRate > 0)
                  ).map(promo => (
                    <tr key={promo.id} className="text-cosmic-silver hover:bg-cosmic-gold/5 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-white font-medium">{promo.dealerName || 'Unnamed Dealer'}</p>
                        <p className="text-[10px] text-cosmic-gold/40 uppercase tracking-widest">Added {new Date(promo.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-lg text-xs text-cosmic-gold font-bold">{promo.code}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1">
                          {promo.channels?.map((c: any) => (
                            <span key={c} className="px-2 py-0.5 bg-cosmic-silver/10 rounded-md text-[9px] uppercase tracking-tighter">{c}</span>
                          )) || <span className="text-cosmic-silver/20 italic">None</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6">{(promo.audienceSize || 0).toLocaleString()}</td>
                      <td className="px-8 py-6 font-cinzel text-white">{promo.usageCount}</td>
                      <td className="px-8 py-6 font-cinzel text-cosmic-gold">
                        ${(promo.usageHistory?.reduce((acc: any, u: any) => acc + (u.amount || 0), 0) || 0).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setViewingPromo(promo)}
                          className="p-2 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-lg transition-colors"
                          title="View Dealer Report"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {promoCodes.filter(p => 
                    p.dealerName?.trim() || 
                    p.dealerRequisites?.trim() || 
                    (p.channels && p.channels.length > 0) || 
                    (p.audienceSize && p.audienceSize > 0) || 
                    (p.commissionRate && p.commissionRate > 0)
                  ).length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-8 py-12 text-center text-cosmic-silver/40 italic">
                        No dealers found. Add dealer information to a promo code to see it here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'webhooks' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-cinzel text-cosmic-gold uppercase tracking-widest">Webhook Logs</h3>
                <button 
                  onClick={fetchWebhooks}
                  className="p-2 bg-cosmic-gold/10 text-cosmic-gold rounded-lg hover:bg-cosmic-gold/20 transition-all"
                  title="Refresh Logs"
                >
                  <Loader2 className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="bg-cosmic-900/60 rounded-3xl border border-cosmic-gold/20 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-cosmic-gold/10 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                    <tr>
                      <th className="px-8 py-4">Timestamp</th>
                      <th className="px-8 py-4">Event Type</th>
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Session ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cosmic-gold/10">
                    {webhookLogs.length > 0 ? (
                      webhookLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-cosmic-gold/5 transition-colors">
                          <td className="px-8 py-6 text-cosmic-silver/80 font-mono text-[10px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-md text-[10px] font-bold uppercase tracking-tighter border border-green-500/20">
                              {log.type}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-white font-medium">{log.customerEmail || 'N/A'}</td>
                          <td className="px-8 py-6 text-cosmic-gold font-cinzel">
                            {log.amount ? (log.amount / 100).toFixed(2) : '0.00'} {log.currency?.toUpperCase()}
                          </td>
                          <td className="px-8 py-6 text-cosmic-silver/40 font-mono text-[9px] truncate max-w-[150px]" title={log.sessionId}>
                            {log.sessionId}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-cosmic-silver/40 italic">
                          No webhook events recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Promo Code Editor Modal */}
      {editingPromo && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-cosmic-950/90 backdrop-blur-sm" onClick={() => setEditingPromo(null)}></div>
          <div className="bg-cosmic-800 border border-cosmic-gold/20 p-8 rounded-[2rem] shadow-2xl relative w-full max-w-md space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">
                {editingPromo.id 
                  ? (activeTab === 'dealers' ? 'Edit Dealer' : 'Edit Promo Code') 
                  : (activeTab === 'dealers' ? 'New Dealer' : 'New Promo Code')}
              </h3>
              <button onClick={() => { setEditingPromo(null); setSaveError(null); }} className="text-cosmic-gold/40 hover:text-cosmic-gold transition-colors">
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {saveError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center animate-in fade-in zoom-in-95">
                  {saveError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Code</label>
                  <input 
                    type="text"
                    value={editingPromo.code || ''}
                    onChange={(e) => setEditingPromo({...editingPromo, code: e.target.value.toUpperCase()})}
                    placeholder="COSMIC50"
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Discount (%)</label>
                  <input 
                    type="number"
                    value={editingPromo.discount || ''}
                    onChange={(e) => setEditingPromo({...editingPromo, discount: Number(e.target.value)})}
                    placeholder="50"
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-cosmic-gold/10">
                <h4 className="text-xs font-cinzel text-cosmic-gold uppercase tracking-widest">Dealer Information</h4>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Dealer Name (FIO)</label>
                  <input 
                    type="text"
                    value={editingPromo.dealerName || ''}
                    onChange={(e) => setEditingPromo({...editingPromo, dealerName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Requisites / Bank Details</label>
                  <textarea 
                    value={editingPromo.dealerRequisites || ''}
                    onChange={(e) => setEditingPromo({...editingPromo, dealerRequisites: e.target.value})}
                    placeholder="IBAN, Bank, etc."
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Channels (comma separated)</label>
                    <input 
                      type="text"
                      value={editingPromo.channels?.join(', ') || ''}
                      onChange={(e) => setEditingPromo({...editingPromo, channels: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      placeholder="FB, Instagram, TikTok"
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Audience Size</label>
                    <input 
                      type="number"
                      value={editingPromo.audienceSize || ''}
                      onChange={(e) => setEditingPromo({...editingPromo, audienceSize: Number(e.target.value)})}
                      placeholder="10000"
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Commission Rate (%)</label>
                    <input 
                      type="number"
                      value={editingPromo.commissionRate || ''}
                      onChange={(e) => setEditingPromo({...editingPromo, commissionRate: Number(e.target.value)})}
                      placeholder="20"
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Expiration Date</label>
                    <input 
                      type="date"
                      value={editingPromo.expiresAt || ''}
                      onChange={(e) => setEditingPromo({...editingPromo, expiresAt: e.target.value})}
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white outline-none focus:border-cosmic-gold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="promo-active"
                  checked={editingPromo.isActive !== false}
                  onChange={(e) => setEditingPromo({...editingPromo, isActive: e.target.checked})}
                  className="w-5 h-5 rounded border-cosmic-gold/20 bg-cosmic-900 text-cosmic-gold focus:ring-cosmic-gold"
                />
                <label htmlFor="promo-active" className="text-sm text-cosmic-silver uppercase tracking-widest">Active</label>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  saveSuccess ? 'bg-green-500 text-white' : 'bg-cosmic-gold text-cosmic-900'
                }`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <ShieldCheck className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Promo Code'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Promo Code Report Modal (Dealer Page) */}
      {viewingPromo && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-cosmic-950/90 backdrop-blur-sm" onClick={() => setViewingPromo(null)}></div>
          <div className="bg-cosmic-800 border border-cosmic-gold/20 p-10 rounded-[2.5rem] shadow-2xl relative w-full max-w-4xl space-y-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none print:max-h-none">
            <div className="flex items-center justify-between print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cosmic-gold/10 flex items-center justify-center border border-cosmic-gold/20">
                  <FileText className="w-6 h-6 text-cosmic-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Dealer Performance Report</h3>
                  <p className="text-cosmic-gold/60 text-[10px] uppercase tracking-widest">Code: {viewingPromo.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 bg-cosmic-gold/10 text-cosmic-gold border border-cosmic-gold/20 rounded-xl font-bold hover:bg-cosmic-gold/20 transition-all"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>
                <button onClick={() => setViewingPromo(null)} className="text-cosmic-gold/40 hover:text-cosmic-gold transition-colors">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="bg-cosmic-900/40 p-8 rounded-3xl border border-cosmic-gold/10 space-y-6">
                  <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest border-b border-cosmic-gold/10 pb-4">Dealer Details</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Full Name</p>
                      <p className="text-white font-medium">{viewingPromo.dealerName || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Created At</p>
                      <p className="text-white font-medium">{new Date(viewingPromo.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Expires At</p>
                      <p className="text-white font-medium">{viewingPromo.expiresAt ? new Date(viewingPromo.expiresAt).toLocaleDateString() : 'Never'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Commission Rate</p>
                      <p className="text-white font-medium">{viewingPromo.commissionRate || 0}%</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Requisites</p>
                      <p className="text-cosmic-silver text-sm whitespace-pre-wrap">{viewingPromo.dealerRequisites || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-4 border-t border-cosmic-gold/10">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Tracking Link</p>
                      <div className="flex items-center gap-2">
                        <input 
                          readOnly
                          value={`${window.location.origin}/?promo=${viewingPromo.code}`}
                          className="flex-1 bg-cosmic-900/50 border border-cosmic-gold/20 rounded-lg p-2 text-xs text-cosmic-gold outline-none"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/?promo=${viewingPromo.code}`);
                            alert('Link copied to clipboard!');
                          }}
                          className="p-2 bg-cosmic-gold/10 text-cosmic-gold rounded-lg border border-cosmic-gold/20 hover:bg-cosmic-gold/20"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cosmic-900/40 p-8 rounded-3xl border border-cosmic-gold/10 space-y-6">
                  <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest border-b border-cosmic-gold/10 pb-4">Channel Analysis</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Active Channels</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {viewingPromo.channels?.map((c: any) => (
                          <span key={c} className="px-3 py-1 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full text-[10px] text-cosmic-gold font-bold uppercase tracking-widest">{c}</span>
                        )) || <span className="text-cosmic-silver/40 italic">None</span>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/40">Total Audience</p>
                      <p className="text-white font-medium">{(viewingPromo.audienceSize || 0).toLocaleString()} people</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-cosmic-gold/5 p-8 rounded-3xl border border-cosmic-gold/20 space-y-6">
                  <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest border-b border-cosmic-gold/10 pb-4">Sales Statistics</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/60">Total Uses</p>
                      <p className="text-2xl font-cinzel text-white">{viewingPromo.usageCount}</p>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-cosmic-gold/10">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-widest text-cosmic-silver/60">Last 7 Days</p>
                        <p className="text-lg font-cinzel text-white">
                          {viewingPromo.usageHistory?.filter((u: any) => u.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length || 0}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-widest text-cosmic-silver/60">Last 30 Days</p>
                        <p className="text-lg font-cinzel text-white">
                          {viewingPromo.usageHistory?.filter((u: any) => u.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000).length || 0}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-cosmic-gold/20">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/60 mb-2">Total Revenue Generated</p>
                      <p className="text-3xl font-cinzel text-cosmic-gold">
                        ${(viewingPromo.usageHistory?.reduce((acc: any, u: any) => acc + (u.amount || 0), 0) || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-cosmic-gold/10">
                      <p className="text-[10px] uppercase tracking-widest text-cosmic-gold/60 mb-2">Estimated Commission</p>
                      <p className="text-2xl font-cinzel text-green-400">
                        ${((viewingPromo.usageHistory?.reduce((acc: any, u: any) => acc + (u.amount || 0), 0) || 0) * (viewingPromo.commissionRate || 0) / 100).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-cosmic-900/40 p-6 rounded-3xl border border-cosmic-gold/10">
                  <p className="text-[10px] text-cosmic-gold/60 leading-relaxed italic text-center">
                    "Success is written in the stars, but measured in numbers."
                  </p>
                </div>
              </div>
            </div>

            {viewingPromo.usageHistory && viewingPromo.usageHistory.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-sm font-cinzel text-cosmic-gold uppercase tracking-widest">Recent Activity</h4>
                <div className="bg-cosmic-900/40 rounded-3xl border border-cosmic-gold/10 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-cosmic-gold/5 text-[10px] uppercase tracking-widest text-cosmic-gold/60">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cosmic-gold/10">
                      {viewingPromo.usageHistory.slice(-10).reverse().map((u: any, i: number) => (
                        <tr key={i} className="text-cosmic-silver">
                          <td className="px-6 py-4">{new Date(u.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4 uppercase tracking-tighter text-xs">{u.serviceId.replace(/-/g, ' ')}</td>
                          <td className="px-6 py-4 text-white font-medium">${u.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
