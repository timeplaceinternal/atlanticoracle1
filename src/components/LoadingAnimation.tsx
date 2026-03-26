import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  const planets = [
    { name: 'Mercury', size: 4, color: 'bg-cosmic-silver', orbit: 100, speed: 4, shadow: 'rgba(192,192,192,0.5)' },
    { name: 'Venus', size: 7, color: 'bg-orange-200', orbit: 140, speed: 7, shadow: 'rgba(253,186,116,0.4)' },
    { name: 'Earth', size: 8, color: 'bg-blue-500', orbit: 180, speed: 10, shadow: 'rgba(59,130,246,0.5)', hasMoon: true },
    { name: 'Mars', size: 6, color: 'bg-red-600', orbit: 220, speed: 15, shadow: 'rgba(220,38,38,0.5)' },
    { name: 'Jupiter', size: 16, color: 'bg-orange-300', orbit: 280, speed: 25, shadow: 'rgba(251,146,60,0.3)' },
    { name: 'Saturn', size: 12, color: 'bg-yellow-200', orbit: 350, speed: 35, shadow: 'rgba(254,240,138,0.3)', hasRings: true },
    { name: 'Uranus', size: 10, color: 'bg-cyan-300', orbit: 410, speed: 45, shadow: 'rgba(103,232,249,0.3)' },
    { name: 'Neptune', size: 10, color: 'bg-blue-700', orbit: 470, speed: 55, shadow: 'rgba(29,78,216,0.3)' },
    { name: 'Pluto', size: 3, color: 'bg-slate-400', orbit: 520, speed: 70, shadow: 'rgba(148,163,184,0.3)' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden py-20">
      {/* Solar System Container */}
      <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center scale-[0.6] sm:scale-[0.8] md:scale-100">
        
        {/* Sun Rays / Lens Flare */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-cosmic-gold/20 to-transparent"
              style={{ rotate: i * 45 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleX: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* The Sun */}
        <div className="relative w-24 h-24 z-10">
          <motion.div 
            className="absolute inset-0 bg-cosmic-gold rounded-full shadow-[0_0_80px_rgba(212,175,55,0.9)]"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 60px rgba(212,175,55,0.8)',
                '0 0 100px rgba(212,175,55,1)',
                '0 0 60px rgba(212,175,55,0.8)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-gold via-yellow-200 to-white rounded-full opacity-80" />
          
          {/* Sun Glimmer Rays */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-[-20%] border border-cosmic-gold/30 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}
        </div>

        {/* Orbits and Planets */}
        {planets.map((planet, idx) => (
          <div
            key={planet.name}
            className="absolute rounded-full border border-cosmic-gold/5"
            style={{
              width: planet.orbit,
              height: planet.orbit,
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: planet.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${planet.color} relative`}
                style={{
                  width: planet.size,
                  height: planet.size,
                  boxShadow: `0 0 ${planet.size * 2}px ${planet.shadow}`
                }}
              >
                {/* Earth's Moon */}
                {planet.hasMoon && (
                  <motion.div
                    className="absolute w-2 h-2 bg-cosmic-silver rounded-full"
                    style={{ top: -10, left: -10 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                {/* Saturn's Rings */}
                {planet.hasRings && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240%] h-[40%] border-[2px] border-cosmic-gold/40 rounded-[100%] rotate-[25deg]" />
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Text Content */}
      <div className="mt-12 text-center space-y-6 z-20 max-w-lg px-6">
        <div className="space-y-2">
          <motion.h2 
            className="text-3xl font-cinzel text-white uppercase tracking-[0.4em]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {t.loadingTitle}
          </motion.h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto" />
        </div>
        
        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-cosmic-gold font-cinzel text-sm uppercase tracking-widest">
                {phases[phase]}
              </p>
              <p className="text-cosmic-silver italic font-playfair text-lg opacity-60 mt-2">
                {t.loadingSubtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-cosmic-gold/10 rounded-full mx-auto overflow-hidden">
          <motion.div 
            className="h-full bg-cosmic-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((phase + 1) / phases.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

