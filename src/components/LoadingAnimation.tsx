import React from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../../translations';

interface LoadingAnimationProps {
  language: ReportLanguage;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-cosmic-gold/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-4 border-2 border-cosmic-gold/40 border-b-transparent rounded-full animate-spin-slow" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest">{t.loadingTitle}</h2>
        <p className="text-cosmic-silver italic font-playfair animate-pulse">{t.loadingSubtitle}</p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
