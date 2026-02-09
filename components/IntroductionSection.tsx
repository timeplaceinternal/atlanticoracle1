
import React from 'react';
import { Infinity, Music, Compass, CheckCircle2, Zap, Star } from 'lucide-react';

const IntroductionSection: React.FC = () => {
  return (
    <section className="px-6 max-w-5xl mx-auto py-20 space-y-24 relative">
      {/* The Path to Harmony */}
      <div className="text-center space-y-8 max-w-3xl mx-auto animate-in fade-in duration-1000">
        <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-[0.3em] leading-tight">
          The Path to <span className="text-[#d4af37]">Harmony</span>
        </h2>
        <p className="text-lg md:text-xl text-cosmic-silver/90 font-playfair italic leading-relaxed">
          Every human being intuitively strives for harmony—with themselves, their loved ones, and the world at large. We are not isolated beings; we live in a world governed by universal laws, rhythms, and vibrations.
        </p>
      </div>

      {/* Two Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center gap-4 text-[#d4af37]">
            <Infinity className="w-6 h-6" />
            <h3 className="text-xl font-cinzel uppercase tracking-widest">Astrology</h3>
          </div>
          <p className="text-cosmic-silver/70 font-light leading-relaxed">
            <span className="text-white font-medium">The Language of the Cosmos:</span> Astrology is a tool for understanding the language of the Cosmos. It reveals the unique rhythm of the planets and stars at the moment of your birth, defining your potential, your cycles of growth, and the natural flow of your energy.
          </p>
        </div>

        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 group hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center gap-4 text-[#d4af37]">
            <Music className="w-6 h-6" />
            <h3 className="text-xl font-cinzel uppercase tracking-widest">Numerology</h3>
          </div>
          <p className="text-cosmic-silver/70 font-light leading-relaxed">
            <span className="text-white font-medium">The Language of Numbers:</span> Numerology is a tool for understanding the language of Numbers. It determines your personal, innate "frequency"—that unique vibration encoded in your name and date of birth which forms the core of your essence.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-4xl mx-auto space-y-12 bg-white/[0.01] border border-white/5 p-12 rounded-[3rem] text-center">
        <div className="space-y-4">
          <Compass className="w-10 h-10 text-[#d4af37] mx-auto opacity-40 mb-4" />
          <h3 className="text-2xl font-cinzel text-white uppercase tracking-[0.25em]">Our Mission</h3>
          <p className="text-cosmic-silver/80 font-light max-w-2xl mx-auto italic">
            We help you become aware of your unique vibration and provide practical guidance on how to "tune" it. This process allows you to:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
            <span className="text-white font-cinzel uppercase tracking-widest text-xs">Reduce internal resistance</span>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
            <span className="text-white font-cinzel uppercase tracking-widest text-xs">Achieve resonance with the world</span>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 space-y-8">
          <Zap className="w-6 h-6 text-[#d4af37] mx-auto opacity-30 animate-pulse" />
          <p className="text-xl md:text-2xl text-white font-playfair italic leading-relaxed max-w-3xl mx-auto">
            "When you are in tune with the Universe, tension fades away. In its place come clarity, peace, and a profound sense of belonging to all that exists."
          </p>
          <div className="inline-block px-8 py-2 border border-[#d4af37]/30 rounded-full">
            <span className="text-[#d4af37] font-cinzel font-bold tracking-[0.5em] uppercase text-[10px]">
              This is true harmony
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
