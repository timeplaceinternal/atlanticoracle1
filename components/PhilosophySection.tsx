
import React from 'react';
import { Star, Moon, Sparkles } from 'lucide-react';

const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-16">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-cinzel text-white tracking-[0.4em] uppercase drop-shadow-md">
              The <span className="text-[#d4af37]">Legacy</span>
            </h2>
            <p className="font-playfair italic text-3xl md:text-4xl text-white drop-shadow-sm leading-snug">
              "We do not read the stars to find fate, but to find ourselves."
            </p>
          </div>

          <p className="max-w-3xl mx-auto leading-loose text-cosmic-silver/90 text-lg font-light">
            At Atlantic Oracle, we believe the universe is not silent — it speaks in whispers of light and shadow. 
            Our work is the bridge between ancient celestial observation and modern psychological depth. 
            We provide the maps, but you are the explorer of your own destiny.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16">
            {[
              { icon: <Moon className="w-8 h-8" />, title: "Sacred", text: "Every reading is a silent conversation with the eternal." },
              { icon: <Star className="w-8 h-8" />, title: "Sovereign", text: "The stars suggest, but your path is your divine choice." },
              { icon: <Sparkles className="w-8 h-8" />, title: "Deep", text: "We seek wisdom that endures over shallow, transient comfort." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="text-[#d4af37] flex justify-center group-hover:scale-110 transition-transform duration-500 drop-shadow-glow">{item.icon}</div>
                <h4 className="text-xs font-cinzel text-white uppercase tracking-widest">{item.title}</h4>
                <p className="text-[12px] uppercase tracking-wider leading-relaxed text-cosmic-silver/60 group-hover:text-cosmic-silver/90 transition-colors">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
