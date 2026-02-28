import React from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../../translations';
import { ChevronRight, Calendar } from 'lucide-react';

interface LatestNewsPreviewProps {
  onViewNews: () => void;
  onViewPost: (slug: string) => void;
  language: ReportLanguage;
}

const LatestNewsPreview: React.FC<LatestNewsPreviewProps> = ({ onViewNews, onViewPost, language }) => {
  const t = translations[language];
  return (
    <section id="news-preview" className="px-6 max-w-7xl mx-auto py-20 scroll-mt-32">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="space-y-4 text-left">
          <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">{t.navNews}</h3>
          <p className="text-cosmic-silver italic font-playfair">{t.newsSubtitle}</p>
        </div>
        <button onClick={onViewNews} className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
          {t.viewAllNews} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div onClick={() => onViewPost('cosmic-shift-2024')} className="group bg-cosmic-800/10 border border-cosmic-gold/10 p-10 rounded-[3rem] hover:border-cosmic-gold transition-all cursor-pointer relative overflow-hidden">
          <div className="flex items-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em] mb-6">
            <Calendar className="w-3 h-3" />
            <span>Feb 24, 2024</span>
          </div>
          <h4 className="text-2xl font-cinzel text-white mb-4 group-hover:text-cosmic-gold transition-colors">The Great Cosmic Shift</h4>
          <p className="text-cosmic-silver/70 font-light text-sm leading-relaxed mb-8">Discover how the current planetary alignments are reshaping our collective consciousness and what it means for your personal journey.</p>
          <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-widest">Read More <ChevronRight className="w-4 h-4" /></div>
        </div>
        <div onClick={() => onViewPost('numerology-of-union')} className="group bg-cosmic-800/10 border border-cosmic-gold/10 p-10 rounded-[3rem] hover:border-cosmic-gold transition-all cursor-pointer relative overflow-hidden">
          <div className="flex items-center gap-3 text-cosmic-gold/60 text-[10px] uppercase tracking-[0.3em] mb-6">
            <Calendar className="w-3 h-3" />
            <span>Feb 20, 2024</span>
          </div>
          <h4 className="text-2xl font-cinzel text-white mb-4 group-hover:text-cosmic-gold transition-colors">Numerology of Union</h4>
          <p className="text-cosmic-silver/70 font-light text-sm leading-relaxed mb-8">Explore the vibrational frequencies of relationships and how numbers can reveal the hidden harmony between two souls.</p>
          <div className="flex items-center gap-2 text-cosmic-gold text-xs font-bold uppercase tracking-widest">Read More <ChevronRight className="w-4 h-4" /></div>
        </div>
      </div>
    </section>
  );
};

export default LatestNewsPreview;
