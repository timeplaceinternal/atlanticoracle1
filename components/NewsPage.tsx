import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { NewsPost, PostFormat } from '../types';
import { INITIAL_NEWS } from '../constants';
import { Calendar, Tag, ChevronLeft, ChevronRight, Search, Filter, Youtube, Share2, Check, Send, MessageCircle, Facebook, Twitter, Link as LinkIcon, X, ArrowLeft, Sparkles } from 'lucide-react';
import { generateNewsSchema } from '../utils/seo';
import { ReportLanguage } from '../types';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface NewsPageProps {
  onBack?: () => void;
  language?: ReportLanguage;
  initialSlug?: string | null;
  onSlugChange?: (slug: string | null) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onBack, language = 'English', initialSlug, onSlugChange }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'astrology' | 'numerology' | 'astronomy'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const postsPerPage = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/news');
        if (response.ok) {
          const parsed = await response.json();
          setPosts([...INITIAL_NEWS, ...parsed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setPosts(INITIAL_NEWS);
        }
      } catch (e) {
        console.error("Failed to fetch news from API", e);
        setPosts(INITIAL_NEWS);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.topic === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId && posts.length > 0) {
      const postIndex = filteredPosts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const page = Math.ceil((postIndex + 1) / postsPerPage);
        setCurrentPage(page);
        setTimeout(() => {
          const element = document.getElementById(`post-${postId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-cosmic-gold', 'ring-offset-4', 'ring-offset-cosmic-950');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-cosmic-gold', 'ring-offset-4', 'ring-offset-cosmic-950');
            }, 3000);
          }
        }, 500);
      }
    }
  }, [posts, filteredPosts]);

  useEffect(() => {
    if (initialSlug && posts.length > 0) {
      const post = posts.find(p => p.slug === initialSlug);
      if (post) {
        setSelectedPost(post);
        // Update SEO Meta
        document.title = `${post.title} | Atlantic Oracle Gazette`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', post.text.substring(0, 160));
      }
    } else if (!initialSlug) {
      setSelectedPost(null);
      document.title = `Cosmic News | Atlantic Oracle Gazette`;
    }
  }, [initialSlug, posts]);

  const handlePostClick = (post: NewsPost) => {
    if (onSlugChange) {
      onSlugChange(post.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedPost(post);
    }
  };

  const handleBackToList = () => {
    if (onSlugChange) {
      onSlugChange(null);
    } else {
      setSelectedPost(null);
    }
  };

  if (selectedPost) {
    const schema = generateNewsSchema({
      title: selectedPost.title,
      description: selectedPost.text.substring(0, 160),
      imageUrl: selectedPost.imageUrl,
      datePublished: selectedPost.date,
      authorName: "The Atlantic Sages",
      url: `${window.location.origin}/news/${selectedPost.slug}`
    });

    return (
      <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700">
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
        
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">Back to Gazette</span>
        </button>

        <article className="space-y-12">
          <header className="space-y-6">
            <div className="flex items-center gap-4 text-cosmic-silver/60 text-xs font-bold uppercase tracking-[0.3em]">
              <Calendar className="w-4 h-4" />
              {selectedPost.date}
              <span className="w-1 h-1 bg-cosmic-gold rounded-full" />
              {selectedPost.topic}
            </div>
            <h1 className="text-4xl md:text-7xl font-cinzel text-white leading-tight">
              {selectedPost.title}
            </h1>
            <div className="h-px bg-gradient-to-r from-cosmic-gold via-transparent to-transparent w-full"></div>
          </header>

          <div className="aspect-video rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl">
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert prose-xl max-w-none font-inter text-cosmic-silver leading-relaxed markdown-body">
            <Markdown>{selectedPost.text}</Markdown>
          </div>

          <footer className="pt-12 border-t border-cosmic-gold/10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cosmic-gold/20 flex items-center justify-center border border-cosmic-gold/30">
                <Sparkles className="w-6 h-6 text-cosmic-gold" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">The Atlantic Sages</p>
                <p className="text-cosmic-silver/60 text-[10px] uppercase tracking-widest">Celestial Correspondents</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard');
                }}
                className="p-4 bg-white/5 border border-white/10 rounded-full text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-900 transition-all"
               >
                 <Share2 className="w-5 h-5" />
               </button>
            </div>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-bold">Return to Sanctuary</span>
        </button>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-cosmic-gold/30 flex-1"></div>
            <span className="text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.4em]">The Atlantic Oracle Gazette</span>
            <div className="h-px bg-cosmic-gold/30 flex-1"></div>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-cinzel font-bold text-cosmic-gold mb-4 tracking-tighter text-center md:text-left">
            Cosmic <span className="text-white">News</span>
          </h1>
          <div className="flex justify-between items-center border-y border-cosmic-gold/20 py-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-silver">Vol. I — No. 42</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-gold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-silver">Price: One Soul</span>
          </div>
          <p className="text-cosmic-silver font-inter text-lg max-w-2xl italic opacity-80">
            "As above, so below. The celestial rhythms captured in ink and light."
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cosmic-gold/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search the cosmos..."
              className="bg-cosmic-900/50 border border-cosmic-gold/20 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-cosmic-gold transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'astrology', 'numerology', 'astronomy'].map((t) => (
              <button
                key={t}
                onClick={() => { setFilter(t as any); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === t ? 'bg-cosmic-gold text-cosmic-900 border-cosmic-gold' : 'border-cosmic-gold/20 text-cosmic-silver hover:border-cosmic-gold/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
        {currentPosts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-cosmic-silver italic opacity-50">
            No cosmic transmissions found in this sector.
          </div>
        ) : (
          currentPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} onClick={() => handlePostClick(post)} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-20">
          <button 
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-full border border-cosmic-gold/20 text-cosmic-gold disabled:opacity-30 hover:bg-cosmic-gold/10 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => paginate(n)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${
                  currentPage === n ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-silver hover:bg-cosmic-gold/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button 
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-3 rounded-full border border-cosmic-gold/20 text-cosmic-gold disabled:opacity-30 hover:bg-cosmic-gold/10 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

const ShareMenu: React.FC<{ 
  post: NewsPost; 
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}> = ({ post, onClose, onCopy, copied }) => {
  const shareUrl = `${window.location.origin}/news/${post.slug}`;
  const shareText = `Check out this cosmic transmission from Atlantic Oracle: ${post.title}`;
  
  const socialLinks = [
    { 
      name: 'Telegram', 
      icon: <Send className="w-4 h-4" />, 
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#229ED9]'
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle className="w-4 h-4" />, 
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'bg-[#25D366]'
    },
    { 
      name: 'Facebook', 
      icon: <Facebook className="w-4 h-4" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877F2]'
    },
    { 
      name: 'X', 
      icon: <X className="w-4 h-4" />, 
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black'
    }
  ];

  return (
    <div 
      className="absolute inset-0 z-[100] bg-cosmic-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300 rounded-3xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-cosmic-silver hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="w-full max-w-xs space-y-8 text-center">
        <div className="space-y-2">
          <h4 className="font-cinzel text-cosmic-gold text-xl font-bold uppercase tracking-[0.2em]">Share Transmission</h4>
          <p className="text-cosmic-silver/60 text-[10px] uppercase tracking-widest">Spread the celestial knowledge</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cosmic-gold/30 transition-all group"
            >
              <div className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-silver">{link.name}</span>
            </a>
          ))}
        </div>
        
        <button
          onClick={onCopy}
          className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-cosmic-gold text-cosmic-900 font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cosmic-gold/10"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copied to Clipboard
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" /> Copy Direct Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: NewsPost; index: number; onClick: () => void }> = ({ post, index, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoId = post.videoUrl ? getYouTubeId(post.videoUrl) : null;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(true);
  };

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/news/${post.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const firstSentence = post.text.split(/[.!?]/)[0] + '.';

  // Newspaper grid logic
  let gridClasses = "col-span-1 row-span-1";
  if (post.format === 'forecast') gridClasses = "col-span-1 md:col-span-2 md:row-span-2";
  if (post.format === 'series') gridClasses = "col-span-1 md:col-span-2 md:row-span-1";
  // Alternate sizing for facts to keep it interesting
  if (post.format === 'fact' && index % 5 === 0) gridClasses = "col-span-1 md:col-span-1 md:row-span-2";

  if (post.format === 'fact') {
    return (
      <div 
        id={`post-${post.id}`}
        onClick={onClick}
        className={`group flex flex-col gap-6 bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-2xl p-6 hover:border-cosmic-gold/30 transition-all cursor-pointer ${gridClasses} h-full relative overflow-hidden`}
      >
        {showShareMenu && (
          <ShareMenu 
            post={post} 
            onClose={() => setShowShareMenu(false)} 
            onCopy={handleCopy}
            copied={copied}
          />
        )}
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 p-2 bg-cosmic-900/80 border border-cosmic-gold/20 rounded-full text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-900 transition-all z-10"
          title="Share Transmission"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        </button>
        <div className="w-full aspect-square shrink-0 rounded-xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-800 flex items-center justify-center">
          {videoId ? (
            <div className="relative w-full h-full">
              <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-50" />
              <Youtube className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-red-500" />
            </div>
          ) : (
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-gold px-2 py-0.5 bg-cosmic-gold/10 rounded border border-cosmic-gold/20">
              {post.topic}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-silver flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
          </div>
          <h3 className="text-xl font-cinzel font-bold text-white mb-2 group-hover:text-cosmic-gold transition-colors">{post.title}</h3>
          <div className="text-cosmic-silver font-inter text-sm leading-relaxed prose prose-invert prose-sm max-w-none markdown-body">
            <Markdown>{isExpanded ? post.text : firstSentence}</Markdown>
          </div>
          {!isExpanded && post.text.length > firstSentence.length && (
            <span className="text-cosmic-gold text-[10px] font-bold uppercase tracking-widest mt-auto pt-4">Read More...</span>
          )}
        </div>
      </div>
    );
  }

  if (post.format === 'forecast') {
    return (
      <div 
        id={`post-${post.id}`}
        onClick={onClick}
        className={`group bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-3xl overflow-hidden hover:border-cosmic-gold/30 transition-all cursor-pointer ${gridClasses} flex flex-col relative`}
      >
        {showShareMenu && (
          <ShareMenu 
            post={post} 
            onClose={() => setShowShareMenu(false)} 
            onCopy={handleCopy}
            copied={copied}
          />
        )}
        <button 
          onClick={handleShare}
          className="absolute top-6 right-6 p-3 bg-cosmic-900/80 border border-cosmic-gold/20 rounded-full text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-900 transition-all z-10"
          title="Share Transmission"
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden relative bg-cosmic-800 shrink-0">
          {videoId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <>
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-900 via-transparent to-transparent opacity-60" />
            </>
          )}
          <div className="absolute top-6 left-6 flex gap-3">
            <span className="px-4 py-1 bg-cosmic-gold text-cosmic-900 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {post.topic}
            </span>
          </div>
        </div>
        <div className="p-8 md:p-10 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-silver">
            <Calendar className="w-3 h-3" /> {post.date}
          </div>
          <h3 className="text-2xl md:text-4xl font-cinzel font-bold text-white mb-6 group-hover:text-cosmic-gold transition-colors">{post.title}</h3>
          <div className="text-cosmic-silver font-inter text-base md:text-lg leading-relaxed prose prose-invert prose-lg max-w-none flex-1 markdown-body">
            <Markdown>{isExpanded || videoId ? post.text : firstSentence}</Markdown>
          </div>
          {!isExpanded && !videoId && post.text.length > firstSentence.length && (
            <button className="mt-8 flex items-center gap-2 text-cosmic-gold font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all">
              Read Full Forecast <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (post.format === 'series') {
    return <SliderPost post={post} index={index} onClick={onClick} />;
  }

  return null;
};

const SliderPost: React.FC<{ post: NewsPost; index: number; onClick: () => void }> = ({ post, index, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoId = post.videoUrl ? getYouTubeId(post.videoUrl) : null;
  const images = post.images || [post.imageUrl];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareMenu(true);
  };

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/news/${post.slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  // Newspaper grid logic
  const gridClasses = "md:col-span-2 md:row-span-1";

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const firstSentence = post.text.split(/[.!?]/)[0] + '.';

  return (
    <div 
      id={`post-${post.id}`}
      onClick={onClick}
      className={`group bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-3xl overflow-hidden hover:border-cosmic-gold/30 transition-all cursor-pointer ${gridClasses} flex flex-col relative`}
    >
      {showShareMenu && (
        <ShareMenu 
          post={post} 
          onClose={() => setShowShareMenu(false)} 
          onCopy={handleCopy}
          copied={copied}
        />
      )}
      <button 
        onClick={handleShare}
        className="absolute top-6 right-6 p-3 bg-cosmic-900/80 border border-cosmic-gold/20 rounded-full text-cosmic-gold hover:bg-cosmic-gold hover:text-cosmic-900 transition-all z-10"
        title="Share Transmission"
      >
        {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      </button>
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-cosmic-800 shrink-0">
        {videoId && currentIndex === 0 ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          images.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={img} alt={`${post.title} ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-900/80 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <span className="px-3 py-1 bg-cosmic-purple text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
              Series: {post.topic}
            </span>
            <h3 className="text-2xl font-cinzel font-bold text-white">{post.title}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={next} className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute top-6 right-6 flex gap-1">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-cosmic-gold' : 'w-2 bg-white/30'}`} 
            />
          ))}
        </div>
      </div>
      <div className="p-8">
        <div className="text-cosmic-silver font-inter text-base leading-relaxed prose prose-invert max-w-none markdown-body">
          <Markdown>{isExpanded ? post.text : firstSentence}</Markdown>
        </div>
        {!isExpanded && post.text.length > firstSentence.length && (
          <span className="text-cosmic-gold text-[10px] font-bold uppercase tracking-widest mt-4 block">Read More...</span>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
