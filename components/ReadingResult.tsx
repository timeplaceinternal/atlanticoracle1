import React, { useState } from 'react';
import { Download, RefreshCw, AlertCircle, Gift, Loader2, Copy, Check, Send, Printer, Share2, Star, Sparkles, Globe } from 'lucide-react';
import { ReadingResult as ReadingResultType, ReportLanguage } from '../types';
import { generateAestheticBackground, ScrollLanguage } from '../services/imageService';
import { generateMonthlyGiftHoroscope, translateContent } from '../services/geminiService';
import GiftScroll from './GiftScroll';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const LANGUAGES: ReportLanguage[] = ['English', 'French', 'German', 'Spanish', 'Italian', 'Russian', 'Ukrainian'];

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  const [content, setContent] = useState(result.content);
  const [currentLang, setCurrentLang] = useState<ReportLanguage>(result.language);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [scrollBg, setScrollBg] = useState<string | null>(null);
  const [showGiftMode, setShowGiftMode] = useState(false);

  // Gift Horoscope State
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);
  const [giftResult, setGiftResult] = useState<string | null>(null);

  const handleLanguageChange = async (newLang: ReportLanguage) => {
    if (newLang === currentLang || isTranslating) return;
    setIsTranslating(true);
    try {
      const translatedMain = await translateContent(content, newLang);
      setContent(translatedMain);
      
      if (giftResult) {
        const translatedGift = await translateContent(giftResult, newLang);
        setGiftResult(translatedGift);
      }
      
      setCurrentLang(newLang);
    } catch (e) {
      console.error("Translation error", e);
      alert("Celestial translation failed. Using current version.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClaimGift = async () => {
    if (isGeneratingGift || isTranslating) return;
    setIsGeneratingGift(true);
    try {
      const gift = await generateMonthlyGiftHoroscope(
        result.userName,
        result.birthDate,
        currentLang
      );
      setGiftResult(gift);
      
      setTimeout(() => {
        document.getElementById('gift-horoscope')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error("Gift generation error:", error);
      alert("The stars are currently obscured. Please try claiming your gift again later.");
    } finally {
      setIsGeneratingGift(false);
    }
  };

  const handleGenerateScroll = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await aistudio.openSelectKey();
        }
      } catch (e) {
        console.warn("Key selection unavailable, proceeding anyway.");
      }
    }

    try {
      setIsGenerating(true);
      const bg = await generateAestheticBackground(currentLang as any);
      setScrollBg(bg);
      setShowGiftMode(true);
    } catch (error: any) {
      console.error("Scroll Generation Error:", error);
      if (error.message === "API_KEY_ERROR") {
        alert("Please select your API key to generate premium imagery.");
        if (aistudio) await aistudio.openSelectKey();
      } else {
        alert("Celestial turbulence. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in duration-1000 relative">
      {/* Translation Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 z-[120] bg-cosmic-900/90 backdrop-blur-xl flex flex-col items-center justify-center no-print text-center px-6">
          <div className="relative mb-10">
            <Globe className="w-20 h-20 text-cosmic-gold animate-spin [animation-duration:4s]" />
            <div className="absolute inset-0 bg-cosmic-gold/30 rounded-full animate-ping"></div>
          </div>
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl md:text-3xl font-cinzel text-white uppercase tracking-[0.4em] animate-pulse">
              {currentLang === 'Russian' ? 'Перевод откровения...' : 'Translating Decree...'}
            </h2>
            <div className="w-48 h-[2px] bg-cosmic-gold/20 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-cosmic-gold w-1/2 animate-[loading_1.5s_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {showGiftMode && scrollBg && (
        <GiftScroll 
          backgroundImage={scrollBg}
          text={giftResult ? `${content}\n\n# YOUR MONTHLY GIFT\n\n${giftResult}` : content}
          userName={result.userName}
          onClose={() => setShowGiftMode(false)}
        />
      )}

      {/* Result Header */}
      <div className="text-center mb-12 py-10 border-b border-cosmic-gold/10 no-print">
        <h1 className="text-4xl md:text-6xl font-cinzel text-cosmic-gold mb-4 leading-tight uppercase tracking-widest">
          The Oracle's Decree
        </h1>
        <p className="text-cosmic-silver italic max-w-xl mx-auto font-playfair text-lg">
          "The stars do not command, they whisper truth to the soul."
        </p>
      </div>

      {/* Main Report Area */}
      <div className="bg-cosmic-800/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 border border-cosmic-gold/10 relative shadow-2xl printable-area">
        {/* Aesthetic generation controls */}
        <div className="mb-12 p-8 bg-cosmic-gold/5 border border-cosmic-gold/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 no-print">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-white font-cinzel text-xl tracking-widest uppercase">Language & Export</h3>
            <p className="text-cosmic-silver text-xs opacity-70">Set document language for your PDF or Gift Scroll.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-cosmic-900 border border-cosmic-gold/20 rounded-xl">
               <Globe className="w-4 h-4 text-cosmic-gold" />
               <select 
                 value={currentLang}
                 onChange={(e) => handleLanguageChange(e.target.value as ReportLanguage)}
                 disabled={isTranslating}
                 className="bg-transparent text-cosmic-gold text-xs font-bold uppercase tracking-widest focus:outline-none disabled:opacity-50 cursor-pointer"
               >
                 {LANGUAGES.map(lang => (
                   <option key={lang} value={lang} className="bg-cosmic-900">{lang}</option>
                 ))}
               </select>
            </div>
            
            <button 
              onClick={handleGenerateScroll}
              disabled={isGenerating || isTranslating}
              className="px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-cosmic-gold/10 uppercase tracking-widest active:scale-95"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
              <span>Create Scroll</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className={`prose prose-invert max-w-none text-cosmic-silver leading-relaxed font-light transition-all duration-700 ${isTranslating ? 'opacity-20 blur-sm translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {content.split('\n').map((para, i) => {
            if (para.startsWith('#')) {
              const text = para.replace(/#/g, '').trim();
              return <h2 key={i} className="text-3xl font-cinzel text-white mt-16 mb-8 border-b border-cosmic-gold/20 pb-4 uppercase tracking-widest break-after-avoid">{text}</h2>;
            }
            if (para.trim() === '') return <div key={i} className="h-6" />;
            return <p key={i} className="mb-6 text-justify text-lg font-light leading-relaxed break-inside-avoid-page">{para}</p>;
          })}
        </div>

        {/* Gift Section Call-to-action */}
        {!giftResult && (
          <div className="mt-20 p-12 bg-gradient-to-br from-cosmic-gold/20 via-cosmic-gold/5 to-transparent border border-cosmic-gold/30 rounded-[3rem] text-center space-y-8 no-print animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 shadow-[0_0_60px_rgba(212,175,55,0.05)]">
            <div className="w-20 h-20 bg-cosmic-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Gift className="w-10 h-10 text-cosmic-900" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-cinzel text-white uppercase tracking-widest">A Celestial Gift Awaits</h3>
              <p className="text-cosmic-silver max-w-lg mx-auto italic">
                The oracle has prepared a special 30-day personal forecast as a token of cosmic alignment.
              </p>
            </div>
            <button 
              onClick={handleClaimGift}
              disabled={isGeneratingGift || isTranslating}
              className="px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cosmic-gold/20 flex items-center justify-center gap-3 mx-auto disabled:opacity-50 uppercase tracking-widest"
            >
              {isGeneratingGift ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>Claim Monthly Forecast</span>
            </button>
          </div>
        )}

        {/* Gift Content Section */}
        {giftResult && (
          <div id="gift-horoscope" className="mt-20 pt-20 border-t border-cosmic-gold/20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-px bg-cosmic-gold/30"></div>
               <Gift className="w-6 h-6 text-cosmic-gold" />
               <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Your Monthly Gift</h3>
               <div className="h-px flex-1 bg-cosmic-gold/30"></div>
             </div>
             
             <div className="prose prose-invert max-w-none text-cosmic-silver/90 leading-relaxed font-light">
               {giftResult.split('\n').map((para, i) => {
                 if (para.startsWith('#')) {
                   const text = para.replace(/#/g, '').trim();
                   return <h3 key={i} className="text-2xl font-cinzel text-white mt-12 mb-6 uppercase tracking-wider">{text}</h3>;
                 }
                 if (para.trim() === '') return <div key={i} className="h-4" />;
                 return <p key={i} className="mb-4 text-justify">{para}</p>;
               })}
             </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-24 pt-12 border-t border-cosmic-gold/10 flex flex-col sm:flex-row items-center justify-between gap-8 no-print">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors font-bold uppercase tracking-widest text-xs"
          >
            Seek Another Truth
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrint}
              className="p-4 bg-cosmic-gold/10 text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all border border-cosmic-gold/20 flex items-center justify-center"
              title="Print Decree"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(content + (giftResult ? `\n\n${giftResult}` : ''));
                alert("The decree has been copied to your clipboard.");
              }}
              className="p-4 bg-cosmic-gold/10 text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all border border-cosmic-gold/20 flex items-center justify-center"
              title="Copy to Clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Floating Action Bar for Print */}
      {!showGiftMode && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] uppercase tracking-[0.2em] text-sm group"
          >
            <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>Save PDF / Print Scroll</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingResult;