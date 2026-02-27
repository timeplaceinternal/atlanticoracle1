import React, { useState, useEffect } from 'react';
import { NewsPost } from '../types';
import { INITIAL_NEWS } from '../constants';
import { Calendar, ChevronRight, Newspaper, Sparkles } from 'lucide-react';
import { translations } from '../translations';
import { ReportLanguage } from '../types';

const LatestNewsPreview: React.FC<{ onViewNews: () => void, onViewPost: (slug: string) => void, language: ReportLanguage }> = ({ onViewNews, onViewPost, language }) => {
  const t = translations[language];
  const [latestPost, setLatestPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/news');
        let posts: NewsPost[] = [];
        if (response.ok) {
          const parsed = await response.json();
          posts = [...INITIAL_NEWS, ...parsed];
        } else {
          posts = INITIAL_NEWS;
        }
        
        if (posts.length > 0) {
          // Sort by date descending
          const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setLatestPost(sorted[0]);
        }
      } catch (e) {
        console.error("Failed to fetch latest news", e);
        if (INITIAL_NEWS.length > 0) {
          setLatestPost(INITIAL_NEWS[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading || !latestPost) return null;

  const snippet = latestPost.text.split(/[.!?]/)[0] + '...';

  return (
    <section className="px-6 max-w-7xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-cosmic-900/40 backdrop-blur-3xl border border-cosmic-gold/20 rounded-[3rem] overflow-hidden shadow-2xl shadow-cosmic-gold/5 flex flex-col lg:flex-row">
        {/* Visual Side */}
        <div className="lg:w-1/2 h-[250px] lg:h-auto relative overflow-hidden group cursor-pointer" onClick={() => onViewPost(latestPost.slug)}>
          <img 
            src={latestPost.imageUrl} 
            alt={latestPost.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-900/80 via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-900/80 via-transparent to-transparent lg:hidden" />
          
          <div className="absolute top-6 left-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic-gold text-cosmic-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
              <Newspaper className="w-3 h-3" />
              {t.latestTransmission}
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-cosmic-gold font-cinzel text-xs font-bold uppercase tracking-[0.4em] opacity-60">Cosmic News Gazette</span>
              <div className="flex items-center gap-3 text-cosmic-silver/60 text-[9px] font-bold uppercase tracking-[0.3em]">
                <Calendar className="w-3 h-3" />
                {latestPost.date}
                <span className="w-1 h-1 bg-cosmic-gold rounded-full" />
                {latestPost.topic}
              </div>
            </div>
            <h3 className="text-2xl lg:text-4xl font-cinzel text-white leading-tight cursor-pointer hover:text-cosmic-gold transition-colors" onClick={() => onViewPost(latestPost.slug)}>
              {latestPost.title}
            </h3>
            <p className="text-cosmic-silver font-light text-base leading-relaxed italic opacity-80">
              "{snippet}"
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => onViewPost(latestPost.slug)}
              className="group inline-flex items-center gap-4 px-8 py-3 bg-transparent border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all active:scale-95"
            >
              <span className="uppercase tracking-[0.2em] text-[10px]">{t.readFullGazette}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-cosmic-gold/10">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-cosmic-900 bg-cosmic-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Reader" className="w-full h-full object-cover opacity-60" />
                </div>
              ))}
            </div>
            <span className="text-[10px] text-cosmic-silver/40 uppercase tracking-widest font-medium">
              {t.joinedBySeekers}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsPreview;
