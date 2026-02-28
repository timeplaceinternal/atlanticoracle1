import React, { useState, useEffect } from 'react';
import { ReportLanguage, NewsPost } from '../types';
import { translations } from '../../translations';
import { ChevronLeft, Calendar, Share2, ArrowRight, Play, Star } from 'lucide-react';
import { newsService } from '../services/newsService';

interface NewsPageProps {
  onBack: () => void;
  language: ReportLanguage;
  initialSlug: string | null;
  onSlugChange: (slug: string | null) => void;
}

const MediaRenderer: React.FC<{ post: NewsPost }> = ({ post }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Handle YouTube Video
  if (post.videoUrl) {
    const videoId = post.videoUrl.split('v=')[1]?.split('&')[0] || post.videoUrl.split('/').pop();
    return (
      <div className="aspect-video w-full rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl mb-8">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={post.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Handle Slider
  if (post.images && post.images.length > 1) {
    return (
      <div className="space-y-4 mb-8">
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl">
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${post.title} slide ${idx}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              referrerPolicy="no-referrer"
            />
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {post.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === activeSlide ? 'bg-cosmic-gold w-6' : 'bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle Single Image (Small or Large)
  if (post.imageUrl) {
    const isSmall = post.imageSize === 'small';
    return (
      <div className={`${isSmall ? 'md:float-right md:ml-8 md:mb-8 md:w-1/2' : 'w-full mb-8'} rounded-3xl overflow-hidden border border-cosmic-gold/20 shadow-2xl`}>
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return null;
};

const NewsPage: React.FC<NewsPageProps> = ({ onBack, language, initialSlug, onSlugChange }) => {
  const t = translations[language];
  const [selectedPost, setSelectedPost] = useState<string | null>(initialSlug);
  const [posts, setPosts] = useState<NewsPost[]>([]);

  useEffect(() => {
    setSelectedPost(initialSlug);
  }, [initialSlug]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await newsService.getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const currentPost = posts.find(p => p.slug === selectedPost);
  
  const horoscopePosts = posts.filter(p => p.topic === 'horoscope' || p.format === 'horoscope');
  const regularPosts = posts.filter(p => p.topic !== 'horoscope' && p.format !== 'horoscope');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            if (selectedPost) {
              setSelectedPost(null);
              onSlugChange(null);
            } else {
              onBack();
            }
          }} 
          className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          {selectedPost ? 'Back to Gazette' : 'Back to Sanctuary'}
        </button>
      </div>

      {/* Newspaper Masthead - Smaller when article is open */}
      <div className={`text-center space-y-6 transition-all duration-700 ${selectedPost ? 'opacity-40 scale-95' : 'opacity-100'}`}>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-cosmic-gold/20 flex-1"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-cosmic-gold/60 font-cinzel">The Atlantic Oracle Gazette</span>
          <div className="h-px bg-cosmic-gold/20 flex-1"></div>
        </div>
        
        <h1 className={`font-cinzel text-white uppercase tracking-tighter leading-none transition-all duration-700 ${selectedPost ? 'text-4xl md:text-6xl' : 'text-7xl md:text-9xl'}`}>
          <span className="text-cosmic-gold">Cosmic</span> News
        </h1>

        <div className="border-y border-cosmic-gold/30 py-3 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-[0.2em] text-cosmic-gold/80 font-bold px-4 gap-4">
          <span>Vol. I — No. 42</span>
          <span className="text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>Price: One Soul</span>
        </div>

        {!selectedPost && (
          <p className="text-cosmic-silver/60 italic font-playfair text-lg max-w-2xl mx-auto">
            "As above, so below. The celestial rhythms captured in ink and light."
          </p>
        )}
      </div>

      {!selectedPost ? (
        <div className="space-y-24">
          {/* Daily Horoscope Section */}
          {horoscopePosts.length > 0 && (
            <section className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-cosmic-gold"></div>
                <h2 className="text-3xl font-cinzel text-white uppercase tracking-widest flex items-center gap-3">
                  <Star className="w-6 h-6 text-cosmic-gold" /> Daily Horoscope
                </h2>
                <div className="flex-1 h-px bg-cosmic-gold/20"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {horoscopePosts.map((post) => (
                  <div 
                    key={post.slug} 
                    onClick={() => { setSelectedPost(post.slug); onSlugChange(post.slug); }} 
                    className="group cursor-pointer bg-cosmic-gold/5 border border-cosmic-gold/10 p-8 rounded-[2rem] hover:border-cosmic-gold/40 transition-all space-y-6"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden border border-cosmic-gold/20">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-cinzel text-white group-hover:text-cosmic-gold transition-colors">{post.title}</h3>
                      <p className="text-cosmic-silver/70 font-serif italic line-clamp-3">{post.text}</p>
                      <div className="flex items-center gap-2 text-cosmic-gold text-[10px] font-bold uppercase tracking-widest">
                        Read Decree <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Regular News Section */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-cosmic-gold"></div>
              <h2 className="text-3xl font-cinzel text-white uppercase tracking-widest">Latest Transmissions</h2>
              <div className="flex-1 h-px bg-cosmic-gold/20"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {regularPosts.map((post) => (
                <div 
                  key={post.slug} 
                  onClick={() => { setSelectedPost(post.slug); onSlugChange(post.slug); }} 
                  className="group cursor-pointer space-y-6 flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 text-cosmic-gold/40 text-[9px] uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  
                  <h4 className="text-2xl md:text-3xl font-cinzel text-white group-hover:text-cosmic-gold transition-colors leading-tight decoration-cosmic-gold/20 decoration-1 underline-offset-8 group-hover:underline">
                    {post.title}
                  </h4>
                  
                  <div className="w-16 h-px bg-cosmic-gold/30"></div>
                  
                  <p className="text-cosmic-silver/70 font-light text-sm leading-relaxed line-clamp-6 font-serif italic flex-grow">
                    {post.text}
                  </p>
                  
                  <div className="pt-4 flex items-center gap-2 text-cosmic-gold text-[10px] font-bold uppercase tracking-widest border-t border-cosmic-gold/10">
                    Full Transmission <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {posts.length === 0 && (
            <div className="col-span-full p-20 text-center text-cosmic-silver/40 italic">
              The cosmic ink is currently dry. Check back when the stars align.
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-32">
          <div className="space-y-8 text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em]">
              <Calendar className="w-3 h-3" />
              <span>{currentPost?.date}</span>
              <span className="w-1 h-1 bg-cosmic-gold/30 rounded-full"></span>
              <span>{currentPost?.topic}</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-cinzel text-white uppercase tracking-widest leading-tight">
              {currentPost?.title}
            </h2>
            <div className="flex justify-center">
              <div className="w-32 h-px bg-cosmic-gold/30"></div>
            </div>
          </div>
          
          <div className="relative">
            {currentPost && <MediaRenderer post={currentPost} />}
            
            <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-p:text-xl prose-p:font-serif prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold first-letter:text-7xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:mr-4 first-letter:float-left first-letter:mt-2">
              <p className="whitespace-pre-wrap">{currentPost?.text}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-20 border-t border-cosmic-gold/10">
            <button className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
              <Share2 className="w-4 h-4" /> Share this Wisdom
            </button>
            
            <button 
              onClick={() => { setSelectedPost(null); onSlugChange(null); }}
              className="text-cosmic-silver/40 hover:text-cosmic-gold transition-colors text-[10px] uppercase tracking-[0.3em]"
            >
              Return to the Archives
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
