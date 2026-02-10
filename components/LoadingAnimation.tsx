
import React, { useState, useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Aligning the stars...");
  const texts = [
    "Aligning the stars...",
    "Consulting the Akashic records...",
    "Calculating planetary degrees...",
    "Mapping your soul's blueprint...",
    "Your cosmic portrait is forming...",
    "Wisdom of the ancients is descending..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cosmic-900 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cosmic-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cosmic-gold/10 rounded-full blur-3xl animate-float"></div>

      {/* Main Animation */}
      <div className="relative w-64 h-64 mb-12">
        {/* Sun Flare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-gold/50 to-transparent rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-4 border-2 border-cosmic-gold/30 rounded-full animate-spin [animation-duration:8s]"></div>
        <div className="absolute inset-8 border border-white/10 rounded-full animate-spin [animation-duration:12s] direction-reverse"></div>
        
        {/* The Earth/Center */}
        <div className="absolute inset-20 bg-gradient-to-br from-blue-900 via-cosmic-purple to-indigo-900 rounded-full shadow-[0_0_50px_rgba(109,40,217,0.4)] flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-[url('https://picsum.photos/200')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Orbiting Particles */}
        <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full blur-sm shadow-[0_0_15px_white] animate-twinkle"></div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-cinzel text-white mb-2 tracking-widest uppercase animate-pulse">{loadingText}</h2>
        <div className="w-48 h-1 bg-cosmic-700 rounded-full mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-cosmic-gold w-1/3 rounded-full animate-[loading_2s_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
