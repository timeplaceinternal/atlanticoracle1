
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ChevronRight, Loader2, Quote } from 'lucide-react';
import { ZODIAC_SIGNS } from '../constants';
import { ReportLanguage } from '../types';
import { translations } from '../translations';
import { generateHoroscope } from '../services/geminiService';
import Markdown from 'react-markdown';

interface HoroscopeServiceProps {
  language: ReportLanguage;
  onExploreServices: () => void;
}

const HoroscopeService: React.FC<HoroscopeServiceProps> = ({ language, onExploreServices }) => {
  const t = translations[language] || translations['English'];
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignClick = async (signId: string) => {
    setSelectedSign(signId);
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      // Artificial delay for the "splash" effect as requested
      const sign = ZODIAC_SIGNS.find(s => s.id === signId);
      const signName = sign ? sign.name[language === 'Portuguese' ? 'Portuguese' : 'English'] : signId;
      
      const [result] = await Promise.all([
        generateHoroscope(signName, language),
        new Promise(resolve => setTimeout(resolve, 2500)) // 2.5 seconds splash
      ]);
      
      setForecast(result);
    } catch (err: any) {
      setError(err.message || "The stars are obscured today.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedSign(null);
    setForecast(null);
    setError(null);
  };

  return (
    <section className="w-full py-12 px-4 bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
      <div className="max-w-4xl mx-auto space-y-12">
        {!selectedSign && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
              <Sparkles className="w-4 h-4 text-cosmic-gold" />
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">{t.horoscopeTitle}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.horoscopeTitle}</h2>
            <p className="text-cosmic-silver/60 italic font-playfair text-lg">{t.horoscopeSubtitle}</p>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 pt-8">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => handleSignClick(sign.id)}
                  className="group flex flex-col items-center gap-3 transition-all hover:scale-110 active:scale-95"
                >
                  {/* The Golden Coin - Pure Circle (Reduced Size) */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#FFE27D] via-[#D4AF37] to-[#8A6E2F] border-2 border-[#F3E5AB]/60 flex items-center justify-center shadow-[0_8px_20px_-5px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.5)] group-hover:shadow-[0_15px_30px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.5)] transition-all duration-500 relative overflow-hidden">
                    {/* Coin Rim Detail */}
                    <div className="absolute inset-1 rounded-full border border-black/15 pointer-events-none"></div>
                    
                    {/* Black Zodiac Symbol - Forced Glyph Rendering */}
                    <span 
                      className="text-4xl md:text-5xl font-bold z-10 select-none leading-none"
                      style={{ 
                        color: 'transparent',
                        textShadow: '0 0 0 rgba(0,0,0,0.85)',
                        fontVariantEmoji: 'text'
                      }}
                    >
                      {sign.symbol}
                    </span>
                    
                    {/* Subtle Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  <div className="text-center space-y-0.5">
                    <span className="block text-[10px] font-bold text-white uppercase tracking-[0.2em] group-hover:text-cosmic-gold transition-colors">{sign.name[language === 'Portuguese' ? 'Portuguese' : 'English']}</span>
                    <span className="block text-[8px] text-cosmic-silver/50 uppercase tracking-widest">{sign.dates}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-16 space-y-8 text-center"
            >
              <div className="relative">
                <div className="w-32 h-32 border-2 border-cosmic-gold/20 rounded-full animate-ping absolute inset-0"></div>
                {/* Large Golden Coin for Loading (Reduced Size) */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#FFE27D] via-[#D4AF37] to-[#8A6E2F] border-4 border-[#F3E5AB]/60 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_4px_8px_rgba(255,255,255,0.5)] relative">
                  <div className="absolute inset-2 rounded-full border-2 border-black/15"></div>
                  <span 
                    className="text-7xl font-bold select-none leading-none"
                    style={{ 
                      color: 'transparent',
                      textShadow: '0 0 0 rgba(0,0,0,0.85)',
                      fontVariantEmoji: 'text'
                    }}
                  >
                    {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.symbol}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-cinzel text-white uppercase tracking-widest animate-pulse">{t.horoscopeLoading}</h3>
                <div className="flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cosmic-gold rounded-full animate-bounce delay-0"></div>
                  <div className="w-1.5 h-1.5 bg-cosmic-gold rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-cosmic-gold rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </motion.div>
          )}

          {forecast && !loading && (
            <motion.div 
              key="forecast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 py-6"
            >
              <div className="flex items-center justify-between border-b border-cosmic-gold/20 pb-6">
                <div className="flex items-center gap-6">
                  {/* Result Header Coin (Reduced Size) */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFE27D] via-[#D4AF37] to-[#8A6E2F] border-2 border-[#F3E5AB]/60 flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.5)] relative">
                    <div className="absolute inset-1 rounded-full border border-black/15"></div>
                    <span 
                      className="text-4xl font-bold select-none leading-none"
                      style={{ 
                        color: 'transparent',
                        textShadow: '0 0 0 rgba(0,0,0,0.85)',
                        fontVariantEmoji: 'text'
                      }}
                    >
                      {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.symbol}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-cinzel text-white uppercase tracking-widest">
                      {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name[language === 'Portuguese' ? 'Portuguese' : 'English']}
                    </h3>
                    <p className="text-cosmic-gold text-xs font-bold uppercase tracking-[0.3em] mt-1">{t.horoscopeForecastLabel}</p>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="text-cosmic-silver/40 hover:text-cosmic-gold transition-colors text-[10px] uppercase tracking-[0.3em]"
                >
                  Change Sign
                </button>
              </div>

              <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-p:text-lg prose-p:font-serif prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold first-letter:text-6xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:mr-4 first-letter:float-left first-letter:mt-2">
                <Markdown>{forecast}</Markdown>
              </div>

              <div className="pt-12 border-t border-cosmic-gold/10 text-center space-y-8">
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-cosmic-gold/20 mx-auto" />
                  <p className="text-cosmic-silver italic font-playfair text-lg max-w-2xl mx-auto">
                    {t.horoscopeInvite}
                  </p>
                </div>
                
                <button 
                  onClick={onExploreServices}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-cosmic-gold/10"
                >
                  {t.horoscopeCTA} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-6"
            >
              <p className="text-red-400 font-serif italic text-xl">{error}</p>
              <button 
                onClick={reset}
                className="px-8 py-3 border border-cosmic-gold/30 text-cosmic-gold rounded-full hover:bg-cosmic-gold/5 transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HoroscopeService;
