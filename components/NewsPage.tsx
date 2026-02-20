import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { NewsPost, PostFormat } from '../types';
import { INITIAL_NEWS } from '../constants';
import { Calendar, Tag, ChevronLeft, ChevronRight, Search, Filter, Youtube } from 'lucide-react';

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'astrology' | 'numerology' | 'astronomy'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    const savedPosts = localStorage.getItem('atlantic_oracle_news');
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        setPosts([...INITIAL_NEWS, ...parsed].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e) {
        setPosts(INITIAL_NEWS);
      }
    } else {
      setPosts(INITIAL_NEWS);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-cosmic-gold mb-4 tracking-tighter">
            Cosmic News <span className="text-white block md:inline">& Forecasts</span>
          </h1>
          <p className="text-cosmic-silver font-inter text-lg max-w-2xl">
            Stay aligned with the celestial rhythms. Weekly forecasts, astronomical events, and the numerical vibrations of the Atlantic Oracle.
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

      <div className="grid grid-cols-1 gap-12">
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
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

const PostCard: React.FC<{ post: NewsPost }> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const videoId = post.videoUrl ? getYouTubeId(post.videoUrl) : null;

  const firstSentence = post.text.split(/[.!?]/)[0] + '.';

  if (post.format === 'fact') {
    return (
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex flex-col md:flex-row gap-8 bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-2xl p-6 hover:border-cosmic-gold/30 transition-all cursor-pointer"
      >
        <div className="w-full md:w-[150px] h-[150px] shrink-0 rounded-xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-800 flex items-center justify-center">
          {videoId ? (
            <div className="relative w-full h-full">
              <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-50" />
              <Youtube className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-red-500" />
            </div>
          ) : (
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          )}
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-gold px-2 py-0.5 bg-cosmic-gold/10 rounded border border-cosmic-gold/20">
              {post.topic}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-silver flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
          </div>
          <h3 className="text-xl font-cinzel font-bold text-white mb-2 group-hover:text-cosmic-gold transition-colors">{post.title}</h3>
          <div className="text-cosmic-silver font-inter text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
            <Markdown>{isExpanded ? post.text : firstSentence}</Markdown>
          </div>
          {!isExpanded && post.text.length > firstSentence.length && (
            <span className="text-cosmic-gold text-[10px] font-bold uppercase tracking-widest mt-2">Read More...</span>
          )}
        </div>
      </div>
    );
  }

  if (post.format === 'forecast') {
    return (
      <div 
        onClick={() => !videoId && setIsExpanded(!isExpanded)}
        className={`group bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-3xl overflow-hidden hover:border-cosmic-gold/30 transition-all ${!videoId ? 'cursor-pointer' : ''}`}
      >
        <div className="w-full h-[400px] overflow-hidden relative bg-cosmic-800">
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
        <div className="p-10">
          <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-cosmic-silver">
            <Calendar className="w-3 h-3" /> {post.date}
          </div>
          <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-6 group-hover:text-cosmic-gold transition-colors">{post.title}</h3>
          <div className="text-cosmic-silver font-inter text-lg leading-relaxed max-w-4xl prose prose-invert prose-lg max-w-none">
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
    return <SliderPost post={post} />;
  }

  return null;
};

const SliderPost: React.FC<{ post: NewsPost }> = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoId = post.videoUrl ? getYouTubeId(post.videoUrl) : null;
  const images = post.images || [post.imageUrl];

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
      onClick={() => setIsExpanded(!isExpanded)}
      className="group bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-3xl overflow-hidden hover:border-cosmic-gold/30 transition-all cursor-pointer"
    >
      <div className="relative w-full h-[400px] overflow-hidden bg-cosmic-800">
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
        <div className="text-cosmic-silver font-inter text-base leading-relaxed prose prose-invert max-w-none">
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
