import React from 'react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';
import { Info, Shield, Zap, User } from 'lucide-react';

interface AboutSectionProps {
  language: ReportLanguage;
}

const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const t = translations[language] || translations['English'];

  return (
    <section id="about" className="px-6 max-w-5xl mx-auto py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-cosmic-gold/50 to-transparent"></div>
      
      <div className="bg-cosmic-800/10 backdrop-blur-xl border border-cosmic-gold/10 rounded-[4rem] p-12 md:p-20 space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">
            <User className="w-3 h-3" />
            About the Author
          </div>
          <h2 className="text-4xl md:text-6xl font-cinzel text-white uppercase tracking-tighter leading-none">
            The <span className="text-cosmic-gold">Oracle</span> Philosophy
          </h2>
          <p className="text-cosmic-silver font-playfair italic text-xl max-w-2xl mx-auto">
            "We don't predict the future; we decode the architecture of the present."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">The Weather & The Engine</h3>
              <p className="text-cosmic-silver/80 font-light leading-relaxed">
                Atlantic Oracle was born from a simple realization: human life is a synthesis of external cycles and internal vibrations. We call this the <strong>Weather/Engine</strong> system. 
              </p>
              <p className="text-cosmic-silver/80 font-light leading-relaxed">
                Astrology provides the 'Weather'—the cosmic environment and timing. Numerology provides the 'Engine'—your core structural vibration and drive. By mapping both, we reveal the soul's true blueprint.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Ephemeral Privacy</h3>
              <p className="text-cosmic-silver/80 font-light leading-relaxed">
                Unlike other astrology sites, Atlantic Oracle provides free natal chart calculations without registration. We value your <strong>ephemeral privacy</strong>. No email required, no cookies tracking your destiny. Your data is processed and then released back into the void.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-cosmic-gold/10 rounded-[3rem] blur-2xl group-hover:bg-cosmic-gold/20 transition-all duration-1000"></div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-cosmic-gold/20 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80" 
                alt="Cosmic Architecture" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-900 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-center">
                <span className="text-cosmic-gold font-cinzel text-xs uppercase tracking-[0.4em]">Lead Architect</span>
                <span className="block text-white font-cinzel text-2xl uppercase tracking-widest mt-2">The Oracle</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-cosmic-gold/10">
          <div className="text-center space-y-3">
            <Shield className="w-6 h-6 text-cosmic-gold mx-auto" />
            <h4 className="text-white font-cinzel text-xs uppercase tracking-widest">Zero Tracking</h4>
            <p className="text-[10px] text-cosmic-silver/50 uppercase tracking-widest">Your destiny is yours alone.</p>
          </div>
          <div className="text-center space-y-3">
            <Zap className="w-6 h-6 text-cosmic-gold mx-auto" />
            <h4 className="text-white font-cinzel text-xs uppercase tracking-widest">AI Synthesis</h4>
            <p className="text-[10px] text-cosmic-silver/50 uppercase tracking-widest">Modern tech meets ancient wisdom.</p>
          </div>
          <div className="text-center space-y-3">
            <Info className="w-6 h-6 text-cosmic-gold mx-auto" />
            <h4 className="text-white font-cinzel text-xs uppercase tracking-widest">High Precision</h4>
            <p className="text-[10px] text-cosmic-silver/50 uppercase tracking-widest">Calculated to the exact degree.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
