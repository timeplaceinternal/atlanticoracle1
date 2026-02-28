import React from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../../translations';
import { Sparkles, Star, ShieldCheck } from 'lucide-react';

interface HowItWorksSectionProps {
  language: ReportLanguage;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language }) => {
  const t = translations[language];
  return (
    <section id="how-it-works" className="px-6 max-w-7xl mx-auto py-20 scroll-mt-32">
      <div className="text-center mb-20 space-y-4">
        <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">{t.howItWorksTitle}</h3>
        <p className="text-cosmic-silver italic font-playfair">{t.howItWorksSubtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="relative group">
          <div className="absolute -top-6 -left-6 text-8xl font-cinzel text-cosmic-gold/5 group-hover:text-cosmic-gold/10 transition-colors">01</div>
          <div className="space-y-4 relative">
            <Sparkles className="w-10 h-10 text-cosmic-gold mb-6" />
            <h4 className="text-xl font-cinzel text-white uppercase tracking-widest">{t.step1Title}</h4>
            <p className="text-cosmic-silver/70 font-light leading-relaxed">{t.step1Desc}</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -top-6 -left-6 text-8xl font-cinzel text-cosmic-gold/5 group-hover:text-cosmic-gold/10 transition-colors">02</div>
          <div className="space-y-4 relative">
            <Star className="w-10 h-10 text-cosmic-gold mb-6" />
            <h4 className="text-xl font-cinzel text-white uppercase tracking-widest">{t.step2Title}</h4>
            <p className="text-cosmic-silver/70 font-light leading-relaxed">{t.step2Desc}</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -top-6 -left-6 text-8xl font-cinzel text-cosmic-gold/5 group-hover:text-cosmic-gold/10 transition-colors">03</div>
          <div className="space-y-4 relative">
            <ShieldCheck className="w-10 h-10 text-cosmic-gold mb-6" />
            <h4 className="text-xl font-cinzel text-white uppercase tracking-widest">{t.step3Title}</h4>
            <p className="text-cosmic-silver/70 font-light leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
