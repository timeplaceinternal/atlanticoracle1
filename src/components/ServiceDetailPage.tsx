
import React from 'react';
import { Service, ReportLanguage } from '../types';
import { getServiceIcon } from '../constants';
import { ChevronLeft, Compass, ShieldCheck, Zap, Star } from 'lucide-react';
import { translations } from '../translations';

interface ServiceDetailPageProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onStart: (service: Service) => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ 
  service, 
  language, 
  onBack, 
  onStart 
}) => {
  const t = translations[language];

  // Schema.org Structured Data
  React.useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "Atlantic Oracle"
      },
      "offers": {
        "@type": "Offer",
        "price": service.price,
        "priceCurrency": "EUR"
      },
      "category": "Astrology & Numerology Analysis"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-schema';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Update Meta Title & Description for SEO
    const originalTitle = document.title;
    document.title = `${service.title} - Atlantic Oracle™`;
    
    return () => {
      document.head.removeChild(script);
      document.title = originalTitle;
    };
  }, [service]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-colors mb-12 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">{t.backToStart}</span>
      </button>

      <div className="bg-cosmic-800/20 backdrop-blur-2xl border border-cosmic-gold/20 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-16 space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 bg-cosmic-gold/10 rounded-3xl flex items-center justify-center border border-cosmic-gold/20 shadow-inner">
              {getServiceIcon(service.icon)}
            </div>
            <div className="flex-1 space-y-2">
              <h1 className="text-4xl md:text-5xl font-cinzel text-white leading-tight">
                {service.title}
              </h1>
              <div className="inline-block px-4 py-1 bg-cosmic-gold text-cosmic-900 font-bold text-[10px] uppercase tracking-[0.3em] rounded-full">
                €{service.price} Decree
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-cosmic-gold/30 to-transparent"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 border border-cosmic-gold/10 rounded-2xl bg-cosmic-900/40">
              <Compass className="w-6 h-6 text-cosmic-gold" />
              <h3 className="text-white font-cinzel text-xs uppercase tracking-widest">Architectural Path</h3>
              <p className="text-cosmic-silver/70 text-xs leading-relaxed">
                A structured roadmap synthesizing celestial mechanics and numerical vibrations.
              </p>
            </div>
            <div className="space-y-4 p-6 border border-cosmic-gold/10 rounded-2xl bg-cosmic-900/40">
              <ShieldCheck className="w-6 h-6 text-cosmic-gold" />
              <h3 className="text-white font-cinzel text-xs uppercase tracking-widest">Privacy Absolute</h3>
              <p className="text-cosmic-silver/70 text-xs leading-relaxed">
                Ephemeral data processing. Your coordinates are deleted immediately after synthesis.
              </p>
            </div>
            <div className="space-y-4 p-6 border border-cosmic-gold/10 rounded-2xl bg-cosmic-900/40">
              <Zap className="w-6 h-6 text-cosmic-gold" />
              <h3 className="text-white font-cinzel text-xs uppercase tracking-widest">Instant Reach</h3>
              <p className="text-cosmic-silver/70 text-xs leading-relaxed">
                Receive your professional 15-page report in your digital sanctuary within moments.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest flex items-center gap-3">
              <Star className="w-5 h-5 text-cosmic-gold fill-current" />
              The Oracle's Synthesis
            </h2>
            <div className="prose prose-invert prose-p:text-cosmic-silver prose-p:font-light prose-p:leading-relaxed prose-p:text-lg">
              <p className="first-letter:text-5xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {service.seoContent || service.description}
              </p>
              
              {/* Additional generic text to reach 300+ words if seoContent is short */}
              {!service.seoContent && (
                <>
                  <p>
                    Every soul manifests in this physical plane under a specific set of coordinates—mathematical and celestial markers that define the architectural blueprint of one's existence. At Atlantic Oracle, we believe that understanding these markers is not about predicting a fixed destiny, but about revealing the map of potentials you carry.
                  </p>
                  <p>
                    This comprehensive study deep-dives into the structural vibrations of your identity. We use advanced algorithms to synthesize the ancient wisdom of Pythagorean numerology with the precise mechanics of modern astrology. The result is a substantive report, ranging from 800 to 1500 words, that provides clarity on your innate strengths, karmic leassons, and the energetic climate of your destiny.
                  </p>
                </>
              )}
              
              {/* Some additional depth text for all services */}
              <p>
                The {service.title} ritual is designed for those seeking high-resolution clarity. It bridges the gap between general horoscope forecasts and personal structural analysis. By mapping the interaction between your inner engine (Numerology) and the outer environment (Astrology), we help you achieve a state of flow where friction disappears and your path becomes clear.
              </p>
              <p>
                Your report will be delivered as a professional 15-page PDF document, suitable for printing and long-term reflection. It includes detailed quarterly breakdowns, specific celestial windows of opportunity, and a psychological roadmap for your current cycle.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center gap-6">
            <button 
              onClick={() => onStart(service)}
              className="w-full md:w-auto px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/30 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-[0.2em]"
            >
              Start Your Consultation
            </button>
            <p className="text-[10px] text-cosmic-silver/40 uppercase tracking-[0.3em]">
              Fee for Wisdom: €{service.price} • Professional Synthesis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
