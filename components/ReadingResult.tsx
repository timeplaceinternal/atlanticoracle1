
import React, { useState } from 'react';
import { Download, RefreshCw, Gift, Loader2, Copy, Printer, Star, Sparkles, Share2, Facebook, Send, MessageCircle, ChevronRight } from 'lucide-react';
import { ReadingResult as ReadingResultType, ReportLanguage } from '../types';
import { generateAestheticBackground } from '../services/imageService';
import { generateMonthlyGiftHoroscope } from '../services/geminiService';
import GiftScroll from './GiftScroll';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  const [content] = useState(result.content);
  const [currentLang] = useState<ReportLanguage>(result.language);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [scrollBg, setScrollBg] = useState<string | null>(null);
  const [showGiftMode, setShowGiftMode] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Gift Horoscope State
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);
  const [giftResult, setGiftResult] = useState<string | null>(null);

  const isFree = result.serviceId.toString().startsWith('free-');

  const handleClaimGift = async () => {
    if (isGeneratingGift) return;
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
      alert("The stars are currently obscured. Please try again later.");
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Atlantic Oracle Decree',
      text: `I just received my personal cosmic reading from Atlantic Oracle! 🌌 Explore your path at atlanticoracle.com`,
      url: 'https://atlanticoracle.com'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const shareToSocial = (platform: 'fb' | 'wa' | 'tg') => {
    const text = encodeURIComponent(`I just received my cosmic decree from Atlantic Oracle! 🌌 Check your path: `);
    const url = encodeURIComponent('https://atlanticoracle.com');
    
    let link = '';
    if (platform === 'fb') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'wa') link = `https://wa.me/?text=${text}${url}`;
    if (platform === 'tg') link = `https://t.me/share/url?url=${url}&text=${text}`;
    
    window.open(link, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-48 animate-in fade-in duration-1000 relative">
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
        {isFree && <div className="inline-block px-3 py-0.5 bg-cosmic-gold text-cosmic-900 text-[8px] font-bold uppercase tracking-[0.3em] rounded mb-3">Free Insight</div>}
        <h1 className="text-4xl md:text-6xl font-cinzel text-cosmic-gold mb-4 leading-tight uppercase tracking-widest">
          {isFree ? "Oracle Insight" : "The Oracle's Decree"}
        </h1>
        <p className="text-cosmic-silver italic max-w-xl mx-auto font-playfair text-lg">
          "The stars do not command, they whisper truth to the soul."
        </p>
      </div>

      {/* Main Report Area */}
      <div className="bg-cosmic-800/40 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 border border-cosmic-gold/10 relative shadow-2xl printable-area">
        {/* Aesthetic generation controls */}
        {!isFree && (
          <div className="mb-12 p-8 bg-cosmic-gold/5 border border-cosmic-gold/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 no-print">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-white font-cinzel text-xl tracking-widest uppercase">Premium Export</h3>
              <p className="text-cosmic-silver text-xs opacity-70">Transform your decree into a visual masterpiece.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                type="button"
                onClick={handleGenerateScroll}
                disabled={isGenerating}
                className="px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-cosmic-gold/10 uppercase tracking-widest active:scale-95"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                <span>Artistic Scroll</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="prose prose-invert max-w-none text-cosmic-silver leading-relaxed font-light transition-all duration-700">
          {content.split('\n').map((para, i) => {
            if (para.startsWith('#')) {
              const text = para.replace(/#/g, '').trim();
              return <h2 key={i} className="text-3xl font-cinzel text-white mt-16 mb-8 border-b border-cosmic-gold/20 pb-4 uppercase tracking-widest break-after-avoid">{text}</h2>;
            }
            if (para.trim() === '') return <div key={i} className="h-6" />;
            return <p key={i} className="mb-6 text-justify text-lg font-light leading-relaxed break-inside-avoid-page">{para}</p>;
          })}
        </div>

        {/* Upsell for Free Reports */}
        {isFree && (
          <div className="mt-20 p-12 bg-cosmic-gold text-cosmic-900 rounded-[3rem] text-center space-y-6 no-print shadow-2xl shadow-cosmic-gold/20 animate-in zoom-in-95">
            <h3 className="text-2xl font-cinzel font-bold uppercase tracking-widest leading-tight">Unlock Your Full <br/> Cosmic Decree</h3>
            <p className="text-sm font-medium opacity-80 max-w-md mx-auto italic">
              Experience the depth of a 3-5 page analysis mapping your entire soul's architectural blueprint and karmic path.
            </p>
            <button 
              onClick={onReset}
              className="px-10 py-4 bg-cosmic-900 text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl uppercase tracking-widest text-xs"
            >
              Consult Full Oracle <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gift Section Call-to-action */}
        {!isFree && !giftResult && (
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
              type="button"
              onClick={handleClaimGift}
              disabled={isGeneratingGift}
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
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 text-cosmic-gold/60 hover:text-cosmic-gold transition-colors font-bold uppercase tracking-widest text-xs"
          >
            Seek Another Truth
          </button>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              type="button"
              onClick={handlePrint}
              className="p-4 bg-cosmic-gold/10 text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all border border-cosmic-gold/20 flex items-center justify-center"
              title="Print Decree"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={handleShare}
              className="p-4 bg-cosmic-gold/10 text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all border border-cosmic-gold/20 flex items-center justify-center"
              title="Share Decree"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={() => {
                const fullText = content + (giftResult ? `\n\n# YOUR MONTHLY GIFT\n\n${giftResult}` : '');
                navigator.clipboard.writeText(fullText);
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

      {/* Share Popover */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[400] bg-cosmic-900/90 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowShareMenu(false)}>
          <div className="bg-cosmic-800 border border-cosmic-gold/30 p-10 rounded-[2.5rem] max-w-sm w-full space-y-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Share the Light</h3>
              <p className="text-cosmic-silver text-xs mt-2 italic">Choose a channel to spread the wisdom.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => shareToSocial('wa')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                  <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-cosmic-silver tracking-widest">WhatsApp</span>
              </button>
              <button onClick={() => shareToSocial('tg')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#0088cc]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0088cc] group-hover:text-white transition-all">
                  <Send className="w-6 h-6 text-[#0088cc] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-cosmic-silver tracking-widest">Telegram</span>
              </button>
              <button onClick={() => shareToSocial('fb')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-cosmic-silver tracking-widest">Facebook</span>
              </button>
            </div>
            <button onClick={() => setShowShareMenu(false)} className="w-full py-4 bg-cosmic-gold/10 text-cosmic-gold text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-cosmic-gold/20 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fixed Floating Action Bar for Result */}
      {!showGiftMode && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] no-print flex items-center gap-4 w-[90%] sm:w-auto">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 sm:px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] uppercase tracking-[0.2em] text-[10px] sm:text-xs group"
          >
            <Printer className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span>Save PDF</span>
          </button>
          <button 
            type="button"
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 sm:px-12 py-5 bg-white text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] uppercase tracking-[0.2em] text-[10px] sm:text-xs group"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            <span>Share</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingResult;
