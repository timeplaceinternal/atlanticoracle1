
import React from 'react';
import { Star, Moon, Sparkles } from 'lucide-react';

const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="relative py-32 px-6 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cosmic-gold/50 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto">
        {/* Header Block */}
        <div className="text-center mb-20 space-y-6">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="h-[1px] w-12 bg-cosmic-gold/30"></div>
            <Sparkles className="w-5 h-5 text-cosmic-gold animate-pulse" />
            <div className="h-[1px] w-12 bg-cosmic-gold/30"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-cinzel text-white tracking-widest uppercase">
            Our <span className="text-cosmic-gold">Philosophy</span>
          </h2>
          <p className="text-xl md:text-2xl font-playfair italic text-cosmic-silver/80">
            "Destiny is not a cage, but a set of coordinates."
          </p>
        </div>

        {/* Content Body */}
        <article className="relative space-y-12 text-lg md:text-xl font-light leading-relaxed text-cosmic-silver/90">
          <div className="absolute -left-12 top-0 text-6xl text-cosmic-gold/10 font-cinzel select-none hidden lg:block">“</div>
          
          <div className="space-y-10 first-letter:text-5xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:mr-3 first-letter:float-left">
            <p>
              We view life as a complex interplay of natural rhythms. Just as a navigator needs both a compass and a map of the stars, a person seeking harmony needs to understand both their internal frequency and the external environment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
              <div className="space-y-4 p-8 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white font-cinzel tracking-widest uppercase text-sm mb-2">
                  <Star className="w-5 h-5 text-cosmic-gold" />
                  Astrology
                </div>
                <p className="text-base leading-relaxed">
                  Astrology is the study of cosmic cycles and planetary transits. It reveals the "climate" of your life—when to act, when to wait, and where the universal energy is flowing at any given moment.
                </p>
              </div>

              <div className="space-y-4 p-8 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white font-cinzel tracking-widest uppercase text-sm mb-2">
                  <Moon className="w-5 h-5 text-cosmic-gold" />
                  Numerology
                </div>
                <p className="text-base leading-relaxed">
                  Numerology decodes the structural vibration of your name and birth date. It describes your "engine"—the innate qualities, strengths, and spiritual lessons that define your unique identity.
                </p>
              </div>
            </div>

            <p className="text-center max-w-3xl mx-auto italic font-playfair text-2xl text-white">
              By combining these two ancient disciplines, we provide a high-resolution view of your path, allowing you to move in sync with the world rather than against it.
            </p>

            <div className="bg-gradient-to-br from-cosmic-gold/10 to-transparent border-l-2 border-cosmic-gold p-10 rounded-r-3xl">
              <p className="text-xl md:text-2xl font-cinzel text-white leading-relaxed">
                When the internal vibration (Numbers) aligns with the external rhythm (Stars), friction disappears. This is the state of natural flow we help our visitors achieve.
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-20 text-center">
            <div className="inline-block relative">
              <span className="text-3xl md:text-5xl font-cinzel text-white font-bold tracking-tighter uppercase">Atlantic Oracle</span>
              <div className="absolute -bottom-4 left-0 right-0 h-px bg-cosmic-gold"></div>
            </div>
            <p className="mt-8 text-cosmic-silver/60 text-sm tracking-[0.3em] uppercase">
              Deciphering the secret language of the stars.
            </p>
          </div>
        </article>
      </div>

      {/* Side Decorative Icons */}
      <div className="absolute top-1/4 -left-20 opacity-5 pointer-events-none rotate-12 hidden xl:block">
        <Star className="w-96 h-96 text-cosmic-gold" />
      </div>
      <div className="absolute bottom-1/4 -right-20 opacity-5 pointer-events-none -rotate-12 hidden xl:block">
        <Moon className="w-96 h-96 text-cosmic-gold" />
      </div>
    </section>
  );
};

export default PhilosophySection;
