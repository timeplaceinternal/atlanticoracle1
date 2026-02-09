
import React, { useState, useEffect } from 'react';

const LoadingAnimation: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Consulting the Oracle...");
  const [fade, setFade] = useState(true);
  
  const texts = [
    "Consulting the Oracle...",
    "Aligning the cosmic tides...",
    "Decrypting planetary frequencies...",
    "Mapping your celestial blueprint...",
    "Your destiny is manifesting...",
    "Ancient wisdom is descending...",
    "Synchronizing with the Great Above..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
        setFade(true); 
      }, 1000);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Planet data: orbit size (px), duration (s), planet size (px), hasRings, delay, name
  const planets = [
    { orbit: 60,  duration: 4,  size: 5,  name: 'Mercury', hasRings: false, delay: '-1s' },
    { orbit: 90,  duration: 7,  size: 8,  name: 'Venus',   hasRings: false, delay: '-3s' },
    { orbit: 125, duration: 10, size: 9,  name: 'Earth',   hasRings: false, delay: '-5s' },
    { orbit: 160, duration: 14, size: 7,  name: 'Mars',    hasRings: false, delay: '-2s' },
    { orbit: 225, duration: 25, size: 22, name: 'Jupiter', hasRings: false, delay: '-8s' },
    { orbit: 300, duration: 40, size: 18, name: 'Saturn',  hasRings: true,  delay: '-15s' },
    { orbit: 370, duration: 60, size: 13, name: 'Uranus',  hasRings: false, delay: '-10s' },
    { orbit: 430, duration: 85, size: 12, name: 'Neptune', hasRings: false, delay: '-40s' },
    { orbit: 490, duration: 120,size: 4,  name: 'Pluto',   hasRings: false, delay: '-20s' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#02020a] w-full h-full overflow-hidden">
      {/* 1. Backdrop: Deep Cosmic Gradient & Nebula Mist */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,65,1)_0%,rgba(2,2,10,1)_100%)]"></div>
      <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* 2. Stylized Solar System Container with 3D Perspective */}
      <div className="relative w-full h-[600px] flex items-center justify-center mb-12 perspective-[1500px]">
        
        {/* Orbital Plane Tilt Wrapper */}
        <div className="relative w-full h-full flex items-center justify-center rotate-x-[70deg] transform-gpu">
          
          {/* The Golden Sun (Reverse tilted to face the viewer) */}
          <div className="relative z-20 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#fff4d6] via-[#d4af37] to-[#8b6b00] rounded-full shadow-[0_0_80px_rgba(212,175,55,0.8),0_0_160px_rgba(212,175,55,0.4)] animate-sun-breathe -rotate-x-[70deg]">
            <div className="absolute inset-0 rounded-full bg-white/30 blur-[4px]"></div>
            <div className="absolute inset-[-60px] rounded-full bg-[#d4af37]/5 blur-[60px] animate-pulse"></div>
          </div>

          {/* Orbits & Planets */}
          {planets.map((p, idx) => (
            <div 
              key={idx}
              className="absolute border border-cosmic-gold/15 rounded-full"
              style={{
                width: `${p.orbit * 2}px`,
                height: `${p.orbit * 2}px`,
                animation: `orbit-spin ${p.duration}s linear infinite`,
                animationDelay: p.delay
              }}
            >
              {/* Planet Anchor to maintain counter-rotation */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  animation: `counter-spin ${p.duration}s linear infinite`,
                  animationDelay: p.delay
                }}
              >
                <div className="-rotate-x-[70deg] relative">
                  
                  {/* Saturn's Double Rings */}
                  {p.hasRings && (
                    <>
                      {/* Outer Ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[90%] border-2 border-[#d4af37]/30 rounded-[100%] rotate-[20deg] shadow-[inset_0_0_10px_rgba(212,175,55,0.2)]"></div>
                      {/* Inner Ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240%] h-[65%] border border-[#d4af37]/40 rounded-[100%] rotate-[20deg]"></div>
                    </>
                  )}
                  
                  {/* The Planet Sphere */}
                  <div 
                    className="relative rounded-full bg-gradient-to-tr from-[#8b6b00] via-[#d4af37] to-[#fff4d6] shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`
                    }}
                  >
                    {/* Dark Side Shadow */}
                    <div className="absolute inset-0 rounded-full bg-black/50 translate-x-[15%] translate-y-[15%] blur-[1px]"></div>
                    {/* Specular Highlight */}
                    <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-white/50 rounded-full blur-[0.5px]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 3. Text Section */}
      <div className="relative z-10 text-center px-6 max-w-3xl -mt-10">
        <div className={`transition-all duration-1000 ease-in-out transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-2xl md:text-5xl font-cinzel tracking-[0.45em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#fff4d6] to-[#d4af37] py-4 leading-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]">
            {loadingText}
          </h2>
          
          <div className="mt-8 flex flex-col items-center">
            <div className="h-[1px] w-32 md:w-64 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
            <p className="mt-8 text-[#d4af37]/40 text-[10px] md:text-[11px] uppercase tracking-[1.5em] font-black animate-pulse">
              Quantum Resonance Stabilizing
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sun-breathe {
          0%, 100% { 
            transform: scale(1) rotateX(-70deg);
            box-shadow: 0 0 80px rgba(212,175,55,0.8), 0 0 160px rgba(212,175,55,0.4);
          }
          50% { 
            transform: scale(1.15) rotateX(-70deg);
            box-shadow: 0 0 100px rgba(212,175,55,1), 0 0 200px rgba(212,175,55,0.6);
          }
        }

        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .animate-sun-breathe {
          animation: sun-breathe 8s ease-in-out infinite;
        }

        .perspective-1500 {
          perspective: 1500px;
        }

        .rotate-x-70 {
          transform: rotateX(70deg);
        }

        .-rotate-x-70 {
          transform: rotateX(-70deg);
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
