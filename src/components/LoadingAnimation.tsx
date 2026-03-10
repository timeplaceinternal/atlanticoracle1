import React, { useState, useEffect } from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface LoadingAnimationProps {
  language: ReportLanguage;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ language }) => {
  const t = translations[language];
  const [phase, setPhase] = useState(0);
  
  const phases = [
    t.loadingPhase1,
    t.loadingPhase2,
    t.loadingPhase3,
    t.loadingPhase4
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden py-20">
      {/* Solar System Container */}
      <div className="relative w-80 h-80 flex items-center justify-center scale-75 md:scale-100">
        
        {/* The Sun */}
        <div className="absolute w-20 h-20 bg-cosmic-gold rounded-full shadow-[0_0_60px_rgba(212,175,55,0.8)] z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-cosmic-gold rounded-full blur-xl opacity-40 animate-pulse" />
          <div className="w-16 h-16 border-2 border-cosmic-900/20 rounded-full animate-spin-slow" />
        </div>

        {/* Orbit 1 - Mercury-like */}
        <div className="absolute w-32 h-32 border border-cosmic-gold/10 rounded-full animate-[spin_4s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cosmic-silver rounded-full shadow-[0_0_10px_rgba(192,192,192,0.5)]" />
        </div>

        {/* Orbit 2 - Venus-like */}
        <div className="absolute w-48 h-48 border border-cosmic-gold/10 rounded-full animate-[spin_8s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-orange-300 rounded-full shadow-[0_0_12px_rgba(253,186,116,0.5)]" />
        </div>

        {/* Orbit 3 - Earth-like */}
        <div className="absolute w-64 h-64 border border-cosmic-gold/10 rounded-full animate-[spin_15s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.5)]">
            {/* Moon */}
            <div className="absolute -top-3 -right-3 w-2 h-2 bg-cosmic-silver rounded-full animate-[spin_3s_linear_infinite]" />
          </div>
        </div>

        {/* Orbit 4 - Mars-like */}
        <div className="absolute w-80 h-80 border border-cosmic-gold/10 rounded-full animate-[spin_25s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-red-400 rounded-full shadow-[0_0_12px_rgba(248,113,113,0.5)]" />
        </div>

        {/* Outer Ring - Jupiter-like (partial) */}
        <div className="absolute w-[400px] h-[400px] border border-cosmic-gold/5 rounded-full animate-[spin_40s_linear_infinite] opacity-50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-200 rounded-full shadow-[0_0_20px_rgba(254,215,170,0.3)]" />
        </div>
      </div>

      {/* Text Content */}
      <div className="mt-20 text-center space-y-6 z-20 max-w-lg px-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-cinzel text-white uppercase tracking-[0.4em] animate-pulse">
            {t.loadingTitle}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto" />
        </div>
        
        <div className="h-16 flex flex-col items-center justify-center">
          <p className="text-cosmic-gold font-cinzel text-sm uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500" key={phase}>
            {phases[phase]}
          </p>
          <p className="text-cosmic-silver italic font-playfair text-lg opacity-60 mt-2">
            {t.loadingSubtitle}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-cosmic-gold/10 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-cosmic-gold transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ width: `${((phase + 1) / phases.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

