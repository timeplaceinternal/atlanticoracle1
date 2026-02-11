import React, { useState } from 'react';
import { Download, RefreshCw, Gift, Loader2, Copy, Printer, Star, Sparkles, Share2, Facebook, Send, MessageCircle, ChevronRight, Shield } from 'lucide-react';
import { ReadingResult as ReadingResultType, ReportLanguage } from '../types';
import { generateMonthlyGiftHoroscope } from '../services/geminiService';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  const [content] = useState(result.content);
  const [currentLang] = useState<ReportLanguage>(result.language);
  
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

  return (
    <div className="max-w-4xl mx-auto pb-48 animate-in fade-in duration-1000 relative result-page">
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

      {/* Main Report Area - Defaulting to Antique Scroll Look */}
      <div className="antique-paper rounded-sm p-8 md:p-20 border-[12px] border-double border-[#d4af37]/40 relative shadow-2xl printable-area">
        
        {/* Heraldic Header */}
        <div className="text-center mb-20 border-b-2 border-[#d4af37]/20 pb-12">
           <div className="w-20 h-20 bg-transparent border-2 border-[#d4af37]/50 rounded-full mx-auto flex items-center justify-center mb-6">
             <Shield className="w-10 h-10 text-[#d4af37]" />
           </div>
           <h2 className="text-3xl font-cinzel text-[#2d2419] tracking-[0.2em] uppercase print:text-black">Sacred Registry</h2>
           <p className="text-[10px] font-cinzel text-[#8b7355] uppercase tracking-[0.4em] mt-2 font-bold print:text-black">For the seeker: {result.userName}</p>
        </div>

        {/* Content Body with Antique Typography */}
        <div className="prose prose-stone max-w-none text-[#1a1510] leading-relaxed font-serif text-lg selection:bg-[#d4af37]/30 transition-all duration-700 print:text-black">
          {content.split('\n').map((para, i) => {
            if (para.startsWith('#')) {
              const text = para.replace(/#/g, '').trim();
              return <h2 key={i} className="text-2xl md:text-3xl font-cinzel text-[#2d2419] mt-16 mb-8 border-b-2 border-[#d4af37]/20 pb-4 uppercase tracking-[0.15em] font-bold break-after-avoid print:text-black">{text}</h2>;
            }
            if (para.trim() === '') return <div key={i} className="h-6" />;
            
            // Drop cap for the very first paragraph
            if (i === 1 || (i === 0 && !para.startsWith('#'))) {
              return (
                <p key={i} className="mb-8 text-justify font-serif leading-[1.8] first-letter:text-6xl first-letter:font-cinzel first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-[#d4af37] break-inside-avoid-page print:text-black">
                  {para}
                </p>
              );
            }

            return <p key={i} className="mb-8 text-justify font-serif leading-[1.8] break-inside-avoid-page print:text-black">{para}</p>;
          })}
        </div>

        {/* Upsell for Free Reports */}
        {isFree && (
          <div className="mt-20 p-12 bg-[#2d2419] text-[#f4ecd8] rounded-xl text-center space-y-6 no-print shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-cinzel font-bold uppercase tracking-widest leading-tight">Unlock Your Full <br/> Cosmic Decree</h3>
            <p className="text-sm font-serif opacity-80 max-w-md mx-auto italic">
              Experience the depth of a 3-5 page analysis mapping your entire soul's architectural blueprint and karmic path.
            </p>
            <button 
              onClick={onReset}
              className="px-10 py-4 bg-[#d4af37] text-[#2d2419] font-bold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl uppercase tracking-widest text-xs"
            >
              Consult Full Oracle <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gift Section Call-to-action */}
        {!isFree && !giftResult && (
          <div className="mt-20 p-12 bg-white/50 border-2 border-[#d4af37]/30 rounded-xl text-center space-y-8 no-print animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 shadow-inner">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Gift className="w-8 h-8 text-[#2d2419]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-cinzel text-[#2d2419] uppercase tracking-widest font-bold">A Celestial Gift Awaits</h3>
              <p className="text-[#1a1510] font-serif max-w-lg mx-auto italic">
                The oracle has prepared a special 30-day personal forecast as a token of cosmic alignment.
              </p>
            </div>
            <button 
              type="button"
              onClick={handleClaimGift}
              disabled={isGeneratingGift}
              className="px-12 py-5 bg-[#2d2419] text-[#f4ecd8] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {isGeneratingGift ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isGeneratingGift ? "Consulting..." : "Claim Monthly Forecast"}</span>
            </button>
          </div>
        )}

        {/* Gift Content Section */}
        {giftResult && (
          <div id="gift-horoscope" className="mt-20 pt-20 border-t-2 border-[#d4af37]/20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-px bg-[#d4af37]/30"></div>
               <Gift className="w-6 h-6 text-[#d4af37]" />
               <h3 className="text-2xl font-cinzel text-[#2d2419] uppercase tracking-widest font-bold print:text-black">Your Monthly Gift</h3>
               <div className="h-px flex-1 bg-[#d4af37]/30"></div>
             </div>
             
             <div className="prose prose-stone max-w-none text-[#1a1510] leading-relaxed font-serif print:text-black">
               {giftResult.split('\n').map((para, i) => {
                 if (para.startsWith('#')) {
                   const text = para.replace(/#/g, '').trim();
                   return <h3 key={i} className="text-xl font-cinzel text-[#2d2419] mt-12 mb-6 uppercase tracking-wider font-bold print:text-black">{text}</h3>;
                 }
                 if (para.trim() === '') return <div key={i} className="h-4" />;
                 return <p key={i} className="mb-4 text-justify leading-[1.8] print:text-black">{para}</p>;
               })}
             </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-24 pt-12 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-8 no-print">
          <button 
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#2d2419] transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            Seek Another Truth
          </button>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              type="button"
              onClick={handlePrint}
              className="p-4 bg-[#1a1510]/5 text-[#2d2419] rounded-full hover:bg-[#d4af37] hover:text-[#2d2419] transition-all border border-[#d4af37]/20 flex items-center justify-center"
              title="Print Decree"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={handleShare}
              className="p-4 bg-[#1a1510]/5 text-[#2d2419] rounded-full hover:bg-[#d4af37] hover:text-[#2d2419] transition-all border border-[#d4af37]/20 flex items-center justify-center"
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
              className="p-4 bg-[#1a1510]/5 text-[#2d2419] rounded-full hover:bg-[#d4af37] hover:text-[#2d2419] transition-all border border-[#d4af37]/20 flex items-center justify-center"
              title="Copy to Clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Floating Action Bar for Result */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] no-print flex items-center gap-4 w-[90%] sm:w-auto">
        <button 
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 sm:px-12 py-5 bg-[#d4af37] text-[#2d2419] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] uppercase tracking-[0.2em] text-[10px] sm:text-xs group"
        >
          <Printer className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          <span>Save Registry PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ReadingResult;