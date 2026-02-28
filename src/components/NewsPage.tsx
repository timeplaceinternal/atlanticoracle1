import React, { useState, useEffect } from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../../translations';
import { ChevronLeft, Calendar, Share2, ArrowRight } from 'lucide-react';

interface NewsPageProps {
  onBack: () => void;
  language: ReportLanguage;
  initialSlug: string | null;
  onSlugChange: (slug: string | null) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onBack, language, initialSlug, onSlugChange }) => {
  const t = translations[language];
  const [selectedPost, setSelectedPost] = useState<string | null>(initialSlug);

  useEffect(() => {
    setSelectedPost(initialSlug);
  }, [initialSlug]);

  const posts = [
    {
      slug: 'cosmic-shift-2024',
      title: 'The Great Cosmic Shift',
      date: 'Feb 24, 2024',
      excerpt: 'Discover how the current planetary alignments are reshaping our collective consciousness and what it means for your personal journey.',
      content: 'The stars are moving in ways we haven\'t seen in centuries. This cosmic shift is not just a celestial event; it\'s a call to awakening for all souls on Earth. As the planets align, we are invited to release old patterns and embrace a new frequency of existence.'
    },
    {
      slug: 'numerology-of-union',
      title: 'Numerology of Union',
      date: 'Feb 20, 2024',
      excerpt: 'Explore the vibrational frequencies of relationships and how numbers can reveal the hidden harmony between two souls.',
      content: 'Numbers are the language of the universe. In the realm of relationships, numerology can provide profound insights into the compatibility and destiny of two individuals. By understanding the vibrational frequencies of your names and birth dates, you can unlock the secrets of your union.'
    }
  ];

  const currentPost = posts.find(p => p.slug === selectedPost);

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-12">
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
          {selectedPost ? 'Back to News' : 'Back to Sanctuary'}
        </button>
      </div>

      {!selectedPost ? (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-cinzel text-white uppercase tracking-widest">{t.navNews}</h1>
            <p className="text-cosmic-silver italic font-playfair">{t.newsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map(post => (
              <div key={post.slug} onClick={() => { setSelectedPost(post.slug); onSlugChange(post.slug); }} className="group bg-cosmic-800/10 border border-cosmic-gold/10 p-10 rounded-[3rem] hover:border-cosmic-gold transition-all cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em] mb-6">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <h4 className="text-2xl font-cinzel text-white mb-4 group-hover:text-cosmic-gold transition-colors">{post.title}</h4>
                <p className="text-cosmic-silver/70 font-light text-sm leading-relaxed mb-8">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-widest">Read More <ArrowRight className="w-4 h-4" /></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em]">
              <Calendar className="w-3 h-3" />
              <span>{currentPost?.date}</span>
            </div>
            <h1 className="text-5xl font-cinzel text-white uppercase tracking-widest">{currentPost?.title}</h1>
            <div className="w-24 h-px bg-cosmic-gold/30"></div>
          </div>
          <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold">
            <p>{currentPost?.content}</p>
          </div>
          <div className="flex justify-center pt-12 border-t border-cosmic-gold/10">
            <button className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
              <Share2 className="w-4 h-4" /> Share this Wisdom
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
