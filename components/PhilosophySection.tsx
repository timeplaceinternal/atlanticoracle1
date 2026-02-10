
import React from 'react';
import { Star, Moon, Sparkles, Wind } from 'lucide-react';

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
            "Harmony is the rhythm of the soul dancing with the cosmos."
          </p>
        </div>

        {/* Content Body */}
        <article className="relative space-y-12 text-lg md:text-xl font-light leading-relaxed text-cosmic-silver/90">
          <div className="absolute -left-12 top-0 text-6xl text-cosmic-gold/10 font-cinzel select-none hidden lg:block">“</div>
          
          <div className="space-y-10 first-letter:text-5xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:mr-3 first-letter:float-left">
            <p>
              Every person naturally seeks harmony — within themselves, with their loved ones, and with the world around them. 
              We are not alone in this journey. We live in a world governed by universal laws, natural rhythms, and vibrations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8">
              <div className="space-y-4 p-8 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white font-cinzel tracking-widest uppercase text-sm mb-2">
                  <Star className="w-5 h-5 text-cosmic-gold" />
                  Astrology
                </div>
                <p className="text-base leading-relaxed">
                  Astrology is a tool for understanding the language of the Stars. It reveals the unique rhythm you were born with, highlighting your inner potential, your growth cycles, and the natural flow of your energy.
                </p>
              </div>

              <div className="space-y-4 p-8 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center gap-3 text-white font-cinzel tracking-widest uppercase text-sm mb-2">
                  <Moon className="w-5 h-5 text-cosmic-gold" />
                  Numerology
                </div>
                <p className="text-base leading-relaxed">
                  Numerology is a tool for understanding the language of Numbers. It reveals your personal "frequency" — the unique vibration hidden in your name and birth date that forms the very heart of who you are.
                </p>
              </div>
            </div>

            <p className="text-center max-w-3xl mx-auto italic font-playfair text-2xl text-white">
              We help you discover your unique vibration and give you practical ways to "tune" it. This allows you to stop fighting against life and start moving in sync with the world around you.
            </p>

            <div className="bg-gradient-to-br from-cosmic-gold/10 to-transparent border-l-2 border-cosmic-gold p-10 rounded-r-3xl">
              <p className="text-xl md:text-2xl font-cinzel text-white leading-relaxed">
                When you are in harmony with the Universe, stress fades away. In its place come clarity, peace, and a deep feeling of being right where you belong. <span className="text-cosmic-gold">This is true harmony.</span>
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-20 text-center">
            <div className="inline-block relative">
              <span className="text-3xl md:text-5xl font-cinzel text-white font-bold tracking-tighter">ATLANTIC ORACLE</span>
              <div className="absolute -bottom-4 left-0 right-0 h-px bg-cosmic-gold"></div>
            </div>
            <p className="mt-8 text-cosmic-silver/60 text-sm tracking-[0.3em] uppercase">
              Align your soul with the secret language of the stars.
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
