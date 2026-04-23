
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
  initialSign?: string | null;
  isWidget?: boolean;
  theme?: 'dark' | 'light';
}

const HoroscopeService: React.FC<HoroscopeServiceProps> = ({ language, onExploreServices, initialSign, isWidget, theme = 'dark' }) => {
  const t = translations[language] || translations['English'];
  const [selectedSign, setSelectedSign] = useState<string | null>(initialSign || null);
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('tomorrow');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSign && !forecast && !loading) {
      handleSignClick(initialSign);
    }
  }, [initialSign]);

  const getDateStr = (day: 'today' | 'tomorrow') => {
    const d = new Date();
    if (day === 'tomorrow') d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingPhases = [
    t.horoscope_phase1,
    t.horoscope_phase2,
    t.horoscope_phase3,
    t.horoscope_phase4
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % loadingPhases.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, language]);

  const handleSignClick = async (signId: string, dayOverride?: 'today' | 'tomorrow') => {
    const day = dayOverride || selectedDay;
    setSelectedSign(signId);
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const sign = ZODIAC_SIGNS.find(s => s.id === signId);
      const signName = sign ? sign.name[language] || sign.name.English : signId;
      
      const dateStr = getDateStr(day);
      
      // 1. Check Cache
      try {
        console.log(`[Horoscope] Checking cache for ${signId} (${day}) on ${dateStr}...`);
        const cacheRes = await fetch(`/api/horoscope-cache?sign=${signId}&lang=${language}&date=${dateStr}`);
        if (cacheRes.ok) {
          const cachedData = await cacheRes.json();
          console.log(`[Horoscope] Cache HIT for ${signId} (${day})`);
          setForecast(cachedData.content);
          setLoading(false);
          return; // Exit early if found in cache
        }
        console.log(`[Horoscope] Cache MISS for ${signId} (${day})`);
      } catch (cacheErr) {
        console.warn("[Horoscope] Cache check failed, proceeding to AI generation", cacheErr);
      }

      // 2. Generate if not in cache
      const [result] = await Promise.all([
        generateHoroscope(signName, language, day),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds splash
      ]);
      
      setForecast(result);

      // 3. Save to Cache (Fire and forget)
      fetch('/api/horoscope-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sign: signId,
          lang: language,
          date: dateStr,
          content: result
        })
      }).catch(err => console.error("Failed to save to cache:", err));

    } catch (err: any) {
      setError(err.message || "The stars are obscured today.");
    } finally {
      setLoading(false);
      // Trigger background fill for both today and tomorrow
      fillMissingCache(getDateStr('today'), 'today');
      fillMissingCache(getDateStr('tomorrow'), 'tomorrow');
    }
  };

  const reset = () => {
    setSelectedSign(null);
    setForecast(null);
    setError(null);
  };

  const fillMissingCache = async (dateStr: string, day: 'today' | 'tomorrow') => {
    try {
      const res = await fetch(`/api/horoscope-cache-status?lang=${language}&date=${dateStr}`);
      if (!res.ok) return;
      const { missing } = await res.json();
      
      if (missing.length === 0) return;
      
      console.log(`[Background] Filling missing signs for ${day} (${dateStr}): ${missing.join(', ')}`);
      
      for (const signId of missing) {
        const sign = ZODIAC_SIGNS.find(s => s.id === signId);
        if (!sign) continue;
        
        const signName = sign.name[language] || sign.name.English;
        const content = await generateHoroscope(signName, language, day);
        
        await fetch('/api/horoscope-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sign: signId,
            lang: language,
            date: dateStr,
            content: content
          })
        });
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("Background cache fill failed:", err);
    }
  };

  return (
    <section className={`w-full ${isWidget ? 'py-4 px-2' : theme === 'light' ? 'py-12 px-4 bg-white/40 backdrop-blur-xl border border-cosmic-gold/20 rounded-[3rem] shadow-xl' : 'py-12 px-4 bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 rounded-[3rem] shadow-2xl'} overflow-hidden relative`}>
      <div className={`max-w-4xl mx-auto ${isWidget ? 'space-y-6' : 'space-y-12'}`}>
        {!selectedSign && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {!isWidget && (
              <div className={`inline-flex items-center gap-3 px-4 py-2 ${theme === 'light' ? 'bg-cosmic-gold/5 border-cosmic-gold/30' : 'bg-cosmic-gold/10 border-cosmic-gold/20'} border rounded-full`}>
                <Sparkles className="w-4 h-4 text-cosmic-gold" />
                <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">{t.horoscopeTitle}</span>
              </div>
            )}
            <h2 className={`${isWidget ? 'text-2xl' : 'text-3xl md:text-5xl'} font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} uppercase tracking-widest`}>{t.horoscopeTitle}</h2>
            {!isWidget && <p className={`${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver/60'} italic font-playfair text-lg`}>{t.horoscopeSubtitle}</p>}
            
            {/* Day Selector Toggle */}
            <div className="flex justify-center pt-4">
              <div className={`inline-flex p-1 ${theme === 'light' ? 'bg-slate-100 border-cosmic-gold/30' : 'bg-cosmic-900/60 border-cosmic-gold/20'} border rounded-2xl`}>
                <button
                  onClick={() => setSelectedDay('today')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedDay === 'today' 
                      ? 'bg-cosmic-gold text-cosmic-900 shadow-lg shadow-cosmic-gold/20' 
                      : `${theme === 'light' ? 'text-slate-500 hover:text-cosmic-900' : 'text-cosmic-silver/60 hover:text-cosmic-gold'}`
                  }`}
                >
                  {t.horoscopeToday}
                </button>
                <button
                  onClick={() => setSelectedDay('tomorrow')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedDay === 'tomorrow' 
                      ? 'bg-cosmic-gold text-cosmic-900 shadow-lg shadow-cosmic-gold/20' 
                      : `${theme === 'light' ? 'text-slate-500 hover:text-cosmic-900' : 'text-cosmic-silver/60 hover:text-cosmic-gold'}`
                  }`}
                >
                  {t.horoscopeTomorrow}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 pt-4">
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
                    <span className={`block text-[10px] font-bold ${theme === 'light' ? 'text-cosmic-950' : 'text-white'} uppercase tracking-[0.2em] group-hover:text-cosmic-gold transition-colors`}>{sign.name[language] || sign.name.English}</span>
                    <span className={`block text-[8px] ${theme === 'light' ? 'text-cosmic-950/40' : 'text-cosmic-silver/50'} uppercase tracking-widest`}>{sign.dates}</span>
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
              <div className="space-y-6 w-full max-w-xs mx-auto">
                <h3 className={`text-xl font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} uppercase tracking-widest h-8`}>
                  {loadingPhases[loadingPhase]}
                </h3>
                
                {/* Progress bar */}
                <div className={`w-full h-1 ${theme === 'light' ? 'bg-cosmic-gold/20' : 'bg-cosmic-gold/10'} rounded-full overflow-hidden`}>
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-cosmic-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  />
                </div>

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
              <div className={`flex items-center justify-between border-b ${theme === 'light' ? 'border-cosmic-gold/40' : 'border-cosmic-gold/20'} pb-6`}>
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
                    <h3 className={`text-3xl font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} uppercase tracking-widest`}>
                      {ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name[language] || ZODIAC_SIGNS.find(s => s.id === selectedSign)?.name.English}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-cosmic-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                        {selectedDay === 'today' ? t.horoscopeToday : t.horoscopeTomorrow} {t.horoscopeForecastLabel} ({getDateStr(selectedDay)})
                      </p>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedDay('today');
                            handleSignClick(selectedSign!, 'today');
                          }}
                          className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${
                            selectedDay === 'today' 
                              ? 'bg-cosmic-gold text-cosmic-900' 
                              : `${theme === 'light' ? 'text-slate-500 hover:text-cosmic-900 border-slate-300' : 'text-cosmic-silver/40 hover:text-cosmic-gold border-cosmic-gold/20'} border`
                          }`}
                        >
                          {t.horoscopeToday}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDay('tomorrow');
                            handleSignClick(selectedSign!, 'tomorrow');
                          }}
                          className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${
                            selectedDay === 'tomorrow' 
                              ? 'bg-cosmic-gold text-cosmic-900' 
                              : `${theme === 'light' ? 'text-slate-500 hover:text-cosmic-900 border-slate-300' : 'text-cosmic-silver/40 hover:text-cosmic-gold border-cosmic-gold/20'} border`
                          }`}
                        >
                          {t.horoscopeTomorrow}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className={`${theme === 'light' ? 'text-slate-400 hover:text-cosmic-900' : 'text-cosmic-silver/40 hover:text-cosmic-gold'} transition-colors text-[10px] uppercase tracking-[0.3em]`}
                >
                  {t.horoscope_change_sign}
                </button>
              </div>

              <div className={`prose ${theme === 'light' ? 'prose-slate' : 'prose-invert'} prose-gold max-w-none prose-p:leading-relaxed prose-p:text-lg prose-p:font-sans prose-headings:font-cinzel ${theme === 'light' ? 'prose-headings:text-cosmic-900' : 'prose-headings:text-white'} prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-xl prose-headings:mt-12 prose-headings:mb-6 prose-strong:text-cosmic-gold prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2`}>
                <Markdown>{forecast}</Markdown>
              </div>

              <div className={`pt-12 border-t ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} text-center space-y-8`}>
                <div className="space-y-4">
                  <Star className={`w-8 h-8 ${theme === 'light' ? 'text-cosmic-gold/30' : 'text-cosmic-gold/20'} mx-auto`} />
                  <p className={`${theme === 'light' ? 'text-slate-600' : 'text-cosmic-silver'} italic font-playfair text-lg max-w-2xl mx-auto`}>
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
                {t.horoscope_try_again}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HoroscopeService;
