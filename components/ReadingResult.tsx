
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
  const [copied, setCopied] = useState(false);

  // Gift Horoscope State
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);
  const [giftResult, setGiftResult] = useState<string | null>(null);

  const handleLanguageChange = async (newLang: ReportLanguage) => {
    if (newLang === currentLang || isTranslating) return;
    setIsTranslating(true);
    try {
      // Translate main content
      const translatedMain = await translateContent(content, newLang);
      setContent(translatedMain);
      
      // If gift exists, translate it too for the PDF
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

  const handleGenerateScroll = async () => {
    try {
      setIsGenerating(true);
      // Background generation uses the currently selected language for inscriptions
      const bg = await generateAestheticBackground(currentLang as any);
      setScrollBg(bg);
      setShowGiftMode(true);
    } catch (error: any) {
      console.error("Scroll Generation Error:", error);
      alert("Celestial turbulence. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClaimGift = async () => {
    setIsGeneratingGift(true);
    try {
      const gift = await generateMonthlyGiftHoroscope(result.userName, "Secret Date", currentLang);
      setGiftResult(gift);
      setTimeout(() => {
        document.getElementById('gift-horoscope')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (e) {
      alert("The stars are shy right now.");
    } finally {
      setIsGeneratingGift(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    const textToCopy = `${result.userName}'s Oracle Decree:\n\n${content}\n\n${giftResult ? '--- MONTHLY GIFT ---\n' + giftResult : ''}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in duration-1000">
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

      <div className="bg-cosmic-800/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 border border-cosmic-gold/10 relative overflow-hidden shadow-2xl printable-area">
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
        <div className={`prose prose-invert max-w-none text-cosmic-silver leading-relaxed font-light text-print-black transition-all duration-700 ${isTranslating ? 'opacity-20 blur-sm translate-y-2' : 'opacity-100 translate-y-0'}`}>
          {content.split('\n').map((para, i) => {
            if (para.startsWith('#')) {
              const text = para.replace(/#/g, '').trim();
              return <h2 key={i} className="text-3xl font-cinzel text-white mt-16 mb-8 border-b border-cosmic-gold/20 pb-4 uppercase tracking-widest">{text}</h2>;
            }
            if (para.trim() === '') return <div key={i} className="h-6" />;
            return <p key={i} className="mb-6 text-justify text-lg font-light leading-relaxed">{para}</p>;
          })}
        </div>

        {/* Gift Section Call-to-action */}
        {!giftResult && (
          <div className="mt-20 p-12 bg-gradient-to-br from-cosmic-gold/20 via-cosmic-gold/5 to-transparent border border-cosmic-gold/30 rounded-[3rem] text-center space-y-8 no-print animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 shadow-[0_0_60px_rgba(212,175,55,0.05)]">
            <div className="w-20 h-20 bg-cosmic-gold rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse relative">
               <div className="absolute inset-0 rounded-full animate-ping bg-cosmic-gold/20"></div>
               <Gift className="w-10 h-10 text-cosmic-900 relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-cinzel text-white uppercase tracking-widest">The Oracle's Gratitude</h3>
              <p className="text-cosmic-silver italic">"As you have sought wisdom, the cosmos offers a token of path."</p>
            </div>
            <p className="text-cosmic-silver/80 text-sm max-w-md mx-auto">Receive a complimentary **Monthly Personal Horoscope** (2-3 pages) for the next 30 days. Our way of saying thank you for trusting the Atlantic Oracle.</p>
            <button 
              onClick={handleClaimGift}
              disabled={isGeneratingGift || isTranslating}
              className="px-12 py-5 bg-white text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {isGeneratingGift ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>Claim My Free 30-Day Forecast</span>
            </button>
          </div>
        )}

        {/* Render Gift Horoscope if exists */}
        {giftResult && (
          <div id="gift-horoscope" className={`mt-24 pt-24 border-t-2 border-dashed border-cosmic-gold/30 animate-in fade-in duration-1000 transition-opacity ${isTranslating ? 'opacity-20' : 'opacity-100'}`}>
            <div className="flex items-center gap-4 mb-12">
              <Star className="w-8 h-8 text-cosmic-gold" />
              <h2 className="text-4xl font-cinzel text-white uppercase tracking-widest">Your Monthly Gift</h2>
            </div>
            <div className="prose prose-invert max-w-none text-cosmic-silver/90 leading-relaxed font-light text-print-black">
              {giftResult.split('\n').map((para, i) => {
                if (para.startsWith('#')) {
                  const text = para.replace(/#/g, '').trim();
                  return <h3 key={i} className="text-2xl font-cinzel text-cosmic-gold mt-12 mb-6 uppercase tracking-wider">{text}</h3>;
                }
                if (para.trim() === '') return <div key={i} className="h-6" />;
                return <p key={i} className="mb-6 text-justify text-lg">{para}</p>;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-5 bg-cosmic-900/90 backdrop-blur-2xl border border-cosmic-gold/20 rounded-full shadow-2xl z-[45] no-print">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-3 px-8 py-3 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all group uppercase tracking-widest text-xs"
        >
          <Printer className="w-5 h-5" />
          <span>Save PDF / Print</span>
        </button>
        <div className="w-[1px] h-10 bg-cosmic-gold/20"></div>
        <button 
          onClick={onReset}
          className="p-3 text-cosmic-silver hover:text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full transition-all group"
        >
          <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform" />
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #root { background: white !important; }
          .printable-area { 
            background: white !important; 
            border: none !important; 
            box-shadow: none !important; 
            padding: 0 !important;
            color: black !important;
            width: 100% !important;
            display: block !important;
          }
          .text-print-black, .prose p, .prose h2, .prose h3 { color: black !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
};

export default ReadingResult;
