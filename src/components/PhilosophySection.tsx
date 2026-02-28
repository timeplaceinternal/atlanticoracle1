import React from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../../translations';
import { BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface PhilosophySectionProps {
  language: ReportLanguage;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({ language }) => {
  const t = translations[language];
  return (
    <section id="philosophy" className="px-6 max-w-4xl mx-auto text-center space-y-12 scroll-mt-32">
      <div className="w-px h-24 bg-gradient-to-b from-cosmic-gold to-transparent mx-auto"></div>
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-cinzel text-white uppercase tracking-widest">{t.philosophyTitle}</h2>
        <p className="text-lg md:text-xl text-cosmic-silver leading-relaxed font-light">
          {t.philosophyText}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
          <BookOpen className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
          <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featureReports}</h4>
          <p className="text-xs text-cosmic-silver/70">{t.featureReportsDesc}</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
          <Compass className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
          <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featureMethodology}</h4>
          <p className="text-xs text-cosmic-silver/70">{t.featureMethodologyDesc}</p>
        </div>
        <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
          <ShieldCheck className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
          <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featurePrivacy}</h4>
          <p className="text-xs text-cosmic-silver/70">{t.featurePrivacyDesc}</p>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
