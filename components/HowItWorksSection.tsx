
import React from 'react';
import { Map, UserPlus, CreditCard, ScrollText, Infinity, Sparkles, Compass, Brain } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-32 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-3xl md:text-4xl font-cinzel text-white tracking-[0.4em] uppercase">The Process</h2>
          <div className="h-px w-16 bg-cosmic-gold/40 mx-auto"></div>
          <p className="text-lg text-cosmic-silver/80 font-playfair italic">Ancient symbolism meets modern analytical clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-32">
          {[
            { icon: <Map />, title: "1. Select", text: "Choose from our specialized celestial lenses for navigation." },
            { icon: <UserPlus />, title: "2. Input", text: "Provide your birth coordinates for precise calculation." },
            { icon: <CreditCard />, title: "3. Confirm", text: "An exchange of €10 to unlock deep celestial insights." },
            { icon: <ScrollText />, title: "4. Receive", text: "Your personal transmission manifests in seconds." }
          ].map((step, idx) => (
            <div key={idx} className="p-8 bg-cosmic-900/60 border border-white/10 rounded-3xl hover:border-cosmic-gold/30 transition-all duration-500">
              <div className="w-12 h-12 bg-cosmic-gold/15 text-cosmic-gold rounded-xl flex items-center justify-center mb-8 shadow-glow-gold-small">
                {React.cloneElement(step.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <h3 className="text-xs font-cinzel text-white mb-4 tracking-[0.2em] uppercase font-bold">{step.title}</h3>
              <p className="text-[12px] text-cosmic-silver/80 leading-relaxed uppercase tracking-widest font-medium">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto border-t border-white/10 pt-20">
          {[
            { icon: <Infinity />, title: "Hermetic Law", text: "As above, so below. The macrocosm mirrors the microcosm. Planetary positions reflect energetic patterns." },
            { icon: <Sparkles />, title: "Vibrations", text: "Everything reduces to frequency. We decode the unique celestial signature imprinted at your first breath." },
            { icon: <Compass />, title: "Sync", text: "We utilize synchronicity as a meaningful connection. Our systems highlight recurring archetypal themes." },
            { icon: <Brain />, title: "Reflection", text: "The Oracle functions as a symbolic mirror to prompt self-inquiry and reveal your latent potentials." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="text-cosmic-gold shrink-0 mt-1 p-2 bg-cosmic-gold/5 rounded-lg border border-cosmic-gold/10">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-cinzel text-white uppercase tracking-[0.2em] font-bold">{item.title}</h4>
                <p className="text-[12px] text-cosmic-silver/70 leading-relaxed uppercase tracking-widest font-medium">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
