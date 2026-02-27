import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface LoadingAnimationProps {
  language?: ReportLanguage;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ language = 'English' }) => {
  const t = translations[language];
  const [loadingText, setLoadingText] = useState(t.loadingPhase1);
  const texts = [
    t.loadingPhase1,
    t.loadingPhase2,
    t.loadingPhase3,
    t.loadingPhase4,
    translations[language].loadingSubtitle
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-cosmic-900 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#14142b_0%,_#050510_70%)] opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-purple/5 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* The Golden Orrery (Solar System) */}
      <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center mb-16">
        
        {/* The Sun (Central Star) */}
        <div className="absolute z-10 w-12 h-12 sm:w-16 sm:h-16 bg-cosmic-gold rounded-full shadow-[0_0_60px_rgba(212,175,55,0.8)] flex items-center justify-center animate-pulse">
           <Star className="text-cosmic-900 w-6 h-6 sm:w-8 sm:h-8" />
           <div className="absolute inset-0 bg-cosmic-gold rounded-full animate-ping opacity-20"></div>
        </div>

        {/* Orbits & Planets */}
        <div className="absolute inset-0 flex items-center justify-center">
          
          {/* Mercury - Tiny & Fast */}
          <div className="orbit w-[15%] h-[15%] animate-[rotate_3s_linear_infinite]">
            <div className="planet w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cosmic-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
          </div>

          {/* Venus */}
          <div className="orbit w-[22%] h-[22%] animate-[rotate_5s_linear_infinite]">
            <div className="planet w-2 h-2 sm:w-3 sm:h-3 bg-cosmic-gold/80 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
          </div>

          {/* Earth */}
          <div className="orbit w-[30%] h-[30%] animate-[rotate_8s_linear_infinite]">
            <div className="planet w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-cosmic-silver rounded-full shadow-[0_0_10px_rgba(192,192,192,0.4)]"></div>
          </div>

          {/* Mars */}
          <div className="orbit w-[38%] h-[38%] animate-[rotate_12s_linear_infinite]">
            <div className="planet w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#cd7f32] rounded-full"></div>
          </div>

          {/* Jupiter - The Giant */}
          <div className="orbit w-[52%] h-[52%] animate-[rotate_20s_linear_infinite]">
            <div className="planet w-5 h-5 sm:w-8 sm:h-8 bg-gradient-to-br from-cosmic-gold to-[#8b7355] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)]"></div>
          </div>

          {/* Saturn - With Rings */}
          <div className="orbit w-[68%] h-[68%] animate-[rotate_35s_linear_infinite]">
            <div className="planet relative w-4 h-4 sm:w-6 sm:h-6 bg-[#d2b48c] rounded-full">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[40%] border border-cosmic-gold/40 rounded-full rotate-[25deg]"></div>
            </div>
          </div>

          {/* Uranus */}
          <div className="orbit w-[80%] h-[80%] animate-[rotate_50s_linear_infinite]">
            <div className="planet w-3 h-3 sm:w-4 sm:h-4 bg-cosmic-silver/50 rounded-full"></div>
          </div>

          {/* Neptune */}
          <div className="orbit w-[90%] h-[90%] animate-[rotate_70s_linear_infinite]">
            <div className="planet w-3 h-3 sm:w-4 sm:h-4 bg-cosmic-purple/30 rounded-full border border-cosmic-gold/10"></div>
          </div>

          {/* Pluto - Tiny Outcast */}
          <div className="orbit w-[100%] h-[100%] animate-[rotate_120s_linear_infinite]">
            <div className="planet w-0.5 h-0.5 sm:w-1 sm:h-1 bg-cosmic-silver/30 rounded-full"></div>
          </div>

        </div>
      </div>

      {/* Loading Text & Progress */}
      <div className="text-center relative z-20 space-y-8 px-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-cinzel text-white tracking-[0.3em] uppercase animate-pulse">{loadingText}</h2>
          <p className="text-cosmic-gold/60 text-[10px] uppercase tracking-[0.5em] font-bold">{t.loadingSubtitle}</p>
        </div>
        
        <div className="w-64 h-px bg-cosmic-gold/10 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent w-full animate-[scan_2s_infinite]"></div>
        </div>
      </div>

      <style>{`
        .orbit {
          position: absolute;
          border: 1px solid rgba(212, 175, 55, 0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .planet {
          transform: translateX(-50%);
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;