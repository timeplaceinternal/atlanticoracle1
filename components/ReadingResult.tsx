import React, { useState } from 'react';
import { Gift, Loader2, Copy, Printer, Sparkles, Share2, Facebook, Send, MessageCircle, ChevronRight, Shield, X } from 'lucide-react';
import { ReadingResult as ReadingResultType, ReportLanguage } from '../types';
import { generateMonthlyGiftHoroscope } from '../services/geminiService';

import { translations } from '../translations';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  const t = translations[result.language];
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
    // Small delay to ensure any pending UI updates are settled
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error("Print failed", e);
        alert("To save as PDF, please use your browser's 'Print' or 'Share' menu directly.");
      }
    }, 250);
  };

  const handleShare = async () => {
    const shareData = {
      title: t.shareTitle,
      text: t.shareText,
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
    const shareText = encodeURIComponent(t.shareText + ' ');
    const url = encodeURIComponent('https://atlanticoracle.com');
    
    let link = '';
    if (platform === 'fb') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'wa') link = `https://wa.me/?text=${shareText}${url}`;
    if (platform === 'tg') link = `https://t.me/share/url?url=${url}&text=${shareText}`;
    
    window.open(link, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-48 animate-in fade-in duration-1000 relative result-page">
      {/* Result Header */}
      <div className="text-center mb-12 py-10 border-b border-cosmic-gold/10 no-print">
        {isFree && <div className="inline-block px-3 py-0.5 bg-cosmic-gold text-cosmic-900 text-[8px] font-bold uppercase tracking-[0.3em] rounded mb-3">{t.oracleInsight}</div>}
        <h1 className="text-4xl md:text-6xl font-cinzel text-cosmic-gold mb-4 leading-tight uppercase tracking-widest">
          {isFree ? t.oracleInsight : t.oraclesDecree}
        </h1>
        <p className="text-cosmic-silver italic max-w-xl mx-auto font-playfair text-lg">
          {t.starsWhisper}
        </p>
      </div>

      {/* Main Report Area */}
      <div className="antique-paper rounded-sm p-8 md:p-20 border-[12px] border-double border-[#d4af37]/40 relative shadow-2xl printable-area">
        
        {/* Heraldic Header */}
        <div className="text-center mb-20 border-b-2 border-[#d4af37]/20 pb-12">
           <div className="w-20 h-20 bg-transparent border-2 border-[#d4af37]/50 rounded-full mx-auto flex items-center justify-center mb-6">
             <Shield className="w-10 h-10 text-[#d4af37]" />
           </div>
           <h2 className="text-3xl font-cinzel text-[#2d2419] tracking-[0.2em] uppercase print:text-black">{t.sacredRegistry}</h2>
           <p className="text-[10px] font-cinzel text-[#8b7355] uppercase tracking-[0.4em] mt-2 font-bold print:text-black">{t.seekerLabel} {result.userName}</p>
        </div>

        {/* Content Body */}
        <div className="prose prose-stone max-w-none text-[#1a1510] leading-relaxed font-serif text-lg selection:bg-[#d4af37]/30 transition-all duration-700 print:text-black">
          {content.split('\n').map((para, i) => {
            if (para.startsWith('#')) {
              const text = para.replace(/#/g, '').trim();
              return <h2 key={i} className="text-2xl md:text-3xl font-cinzel text-[#2d2419] mt-16 mb-8 border-b-2 border-[#d4af37]/20 pb-4 uppercase tracking-[0.15em] font-bold break-after-avoid print:text-black">{text}</h2>;
            }
            if (para.trim() === '') return <div key={i} className="h-6" />;
            
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

        {/* Upsell */}
        {isFree && (
          <div className="mt-20 p-12 bg-[#2d2419] text-[#f4ecd8] rounded-xl text-center space-y-6 no-print shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-cinzel font-bold uppercase tracking-widest leading-tight">{t.unlockFullDecree}</h3>
            <p className="text-sm font-serif opacity-80 max-w-md mx-auto italic">
              {t.experienceDepth}
            </p>
            <button 
              onClick={onReset}
              className="px-10 py-4 bg-[#d4af37] text-[#2d2419] font-bold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl uppercase tracking-widest text-xs"
            >
              {t.consultFullOracle} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gift Section */}
        {!isFree && !giftResult && (
          <div className="mt-20 p-12 bg-white/50 border-2 border-[#d4af37]/30 rounded-xl text-center space-y-8 no-print animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 shadow-inner">
            <div className="w-16 h-16 bg-[#d4af37] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Gift className="w-8 h-8 text-[#2d2419]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-cinzel text-[#2d2419] uppercase tracking-widest font-bold">{t.giftAwaits}</h3>
              <p className="text-[#1a1510] font-serif max-w-lg mx-auto italic">
                {t.giftForecast}
              </p>
            </div>
            <button 
              type="button"
              onClick={handleClaimGift}
              disabled={isGeneratingGift}
              className="px-12 py-5 bg-[#2d2419] text-[#f4ecd8] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {isGeneratingGift ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{isGeneratingGift ? t.consulting : t.claimGift}</span>
            </button>
          </div>
        )}

        {/* Gift Content */}
        {giftResult && (
          <div id="gift-horoscope" className="mt-20 pt-20 border-t-2 border-[#d4af37]/20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-px bg-[#d4af37]/30"></div>
               <Gift className="w-6 h-6 text-[#d4af37]" />
               <h3 className="text-2xl font-cinzel text-[#2d2419] uppercase tracking-widest font-bold print:text-black">{t.monthlyGift}</h3>
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
            {t.seekAnotherTruth}
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
                const fullText = content + (giftResult ? `\n\n# ${t.monthlyGift.toUpperCase()}\n\n${giftResult}` : '');
                navigator.clipboard.writeText(fullText);
                alert(t.copiedMessage);
              }}
              className="p-4 bg-[#1a1510]/5 text-[#2d2419] rounded-full hover:bg-[#d4af37] hover:text-[#2d2419] transition-all border border-[#d4af37]/20 flex items-center justify-center"
              title={t.copyClipboard}
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Popover */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowShareMenu(false)}>
          <div className="bg-[#1a1510] border border-[#d4af37]/50 p-10 rounded-[2.5rem] max-w-sm w-full space-y-8 animate-in zoom-in-95 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowShareMenu(false)} className="absolute top-6 right-6 text-[#d4af37] hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">{t.shareWisdom}</h3>
              <p className="text-[#d4af37] text-xs mt-2 italic">{t.spreadLight}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => shareToSocial('wa')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] transition-all">
                  <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">WhatsApp</span>
              </button>
              <button onClick={() => shareToSocial('tg')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#0088cc] transition-all">
                  <Send className="w-6 h-6 text-[#0088cc] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">Telegram</span>
              </button>
              <button onClick={() => shareToSocial('fb')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#1877F2] transition-all">
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-widest">Facebook</span>
              </button>
            </div>
            <button onClick={() => setShowShareMenu(false)} className="w-full py-4 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#d4af37]/20 transition-all border border-[#d4af37]/20">
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Fixed Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] no-print flex items-center gap-4 w-[90%] sm:w-auto">
        <button 
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 sm:px-12 py-5 bg-[#d4af37] text-[#2d2419] font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] uppercase tracking-[0.2em] text-[10px] sm:text-xs group"
        >
          <Printer className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          <span>{t.savePdf}</span>
        </button>
      </div>
    </div>
  );
};

export default ReadingResult;