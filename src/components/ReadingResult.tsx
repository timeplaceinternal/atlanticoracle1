import React from 'react';
import { ReadingResult as ReadingResultType, ServiceType } from '../types';
import { Star, Download, Share2, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { translations } from '../translations';
import { SERVICES } from '../constants';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
  onSelectService: (service: any) => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset, onSelectService }) => {
  const t = translations[result.language];

  // Map free services to their paid counterparts for the CTA
  const getPaidCounterpart = (serviceId: ServiceType) => {
    switch (serviceId) {
      case ServiceType.FORTUNE_MAP:
      case ServiceType.ENERGY_PULSE:
        return SERVICES.find(s => s.id === ServiceType.NATAL_CHART);
      case ServiceType.CAPITAL_ALIGNMENT:
        return SERVICES.find(s => s.id === ServiceType.CAREER_WEALTH);
      case ServiceType.FREE_DREAM_INTERPRETATION:
        return SERVICES.find(s => s.id === ServiceType.DREAM_INTERPRETATION);
      default:
        return null;
    }
  };

  const paidService = getPaidCounterpart(result.serviceId);
  const isFreeService = [
    ServiceType.FORTUNE_MAP, 
    ServiceType.CAPITAL_ALIGNMENT, 
    ServiceType.ENERGY_PULSE, 
    ServiceType.FREE_DREAM_INTERPRETATION
  ].includes(result.serviceId);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent opacity-50" />
        
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="w-16 h-16 bg-cosmic-gold rounded-full flex items-center justify-center shadow-2xl shadow-cosmic-gold/20">
            <Star className="text-cosmic-900 fill-current w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-cinzel text-white uppercase tracking-widest leading-tight">{result.userName}'s Cosmic Decree</h2>
          <div className="flex items-center gap-4 text-cosmic-silver/60 text-[10px] md:text-xs uppercase tracking-[0.3em]">
            <span>{new Date(result.timestamp).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-cosmic-gold rounded-full" />
            <span>ID: {result.id}</span>
          </div>
        </div>

        <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold prose-li:text-cosmic-silver">
          <Markdown>{result.content}</Markdown>
        </div>

        {/* Reliable CTA Section for Free Services */}
        {isFreeService && paidService && (
          <div className="mt-16 p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-cosmic-gold/10 to-cosmic-purple/10 border border-cosmic-gold/20 relative overflow-hidden group no-print">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cosmic-gold/10 blur-3xl rounded-full group-hover:bg-cosmic-gold/20 transition-colors duration-700" />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 text-cosmic-gold">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold">{t.unlockFullDecree}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-cinzel text-white">{paidService.title}</h3>
              <p className="text-cosmic-silver/80 leading-relaxed max-w-2xl">
                {t.experienceDepth}
              </p>
              
              <button 
                onClick={() => onSelectService(paidService)}
                className="flex items-center gap-3 px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-cosmic-gold/20"
              >
                {t.consultFullOracle}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-16 pt-12 border-t border-cosmic-gold/10 no-print">
          <button onClick={() => window.print()} className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-all border border-white/10">
            <Download className="w-5 h-5" /> {t.savePdf}
          </button>
          <button onClick={onReset} className="flex items-center gap-3 px-8 py-4 border border-cosmic-gold/20 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold/5 transition-all">
            <RefreshCw className="w-5 h-5" /> {t.seekAnotherTruth}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingResult;
