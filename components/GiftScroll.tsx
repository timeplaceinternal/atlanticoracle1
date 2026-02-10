import React, { useState } from 'react';
import { Printer, Shield, ArrowLeft, Share2, Facebook, Send, MessageCircle, X } from 'lucide-react';

interface GiftScrollProps {
  backgroundImage: string;
  text: string;
  userName: string;
  onClose: () => void;
}

const GiftScroll: React.FC<GiftScrollProps> = ({ backgroundImage, text, userName, onClose }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handlePrint = () => {
    document.documentElement.setAttribute('data-print-mode', 'scroll');
    window.print();
    document.documentElement.removeAttribute('data-print-mode');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Atlantic Oracle Artistic Decree',
      text: `I just received my beautiful artistic decree from Atlantic Oracle! 🌌`,
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
    const shareText = encodeURIComponent(`Check out this cosmic oracle! I just got my artistic decree. 🌌 `);
    const url = encodeURIComponent('https://atlanticoracle.com');
    
    let link = '';
    if (platform === 'fb') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'wa') link = `https://wa.me/?text=${shareText}${url}`;
    if (platform === 'tg') link = `https://t.me/share/url?url=${url}&text=${shareText}`;
    
    window.open(link, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/98 flex flex-col items-center overflow-y-auto py-10 px-4 animate-in fade-in duration-500 scroll-container no-scrollbar">
      {/* Control Bar - Hidden on print */}
      <div className="w-full max-w-[850px] flex flex-wrap justify-between items-center mb-10 gap-4 no-print">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-cosmic-silver rounded-full hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare} 
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 uppercase tracking-widest text-[10px]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-10 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-all shadow-2xl group uppercase tracking-widest text-xs"
          >
            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Save PDF / Print Scroll</span>
          </button>
        </div>
      </div>

      <div id="printable-scroll" className="relative w-full max-w-[850px] bg-[#fcf5e5] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm border-[16px] border-[#e8dcc4] min-h-[1200px] scroll-paper">
        {/* Parchment texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] no-print"></div>
        
        {/* Background Image */}
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale contrast-125 bg-print-visible" 
          />
        )}

        <div className="relative flex flex-col p-12 md:p-24">
          <div className="text-center mb-20">
            <div className="w-24 h-24 border-2 border-[#8b7355] rounded-full mx-auto flex items-center justify-center mb-8 shadow-inner">
              <Shield className="w-12 h-12 text-[#8b7355]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-cinzel text-[#2d2419] font-bold tracking-[0.2em] uppercase mb-4">Atlantic Oracle</h1>
            <div className="w-48 h-[2px] bg-[#8b7355] mx-auto mb-8"></div>
            <p className="text-sm font-cinzel text-[#5d4a36] uppercase tracking-[0.5em] font-bold">Sacred Registry for {userName}</p>
          </div>

          <div className="prose prose-stone max-w-none text-[#1a1510] font-serif leading-relaxed text-xl text-justify">
             {text.split('\n').map((para, i) => {
               if (para.startsWith('#')) {
                 const title = para.replace(/#/g, '').trim();
                 return (
                   <h2 key={i} className="font-cinzel text-2xl text-[#5d4a36] mt-16 mb-10 border-b border-[#8b7355]/30 pb-4 uppercase tracking-widest text-center font-bold break-after-avoid">
                     {title}
                   </h2>
                 );
               }
               if (para.trim() === '') return <div key={i} className="h-8" />;
               return <p key={i} className="mb-8 font-serif break-inside-avoid-page">{para}</p>;
             })}
          </div>

          <div className="mt-32 pt-20 text-center border-t border-[#8b7355]/20">
             <span className="text-xs font-cinzel text-[#8b7355] uppercase tracking-[0.6em] font-bold">Authorized by the Atlantic Oracle Registry • AD 2026</span>
          </div>
        </div>
      </div>

      {/* Share Popover */}
      {showShareMenu && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 no-print" onClick={() => setShowShareMenu(false)}>
          <div className="bg-[#1a1510] border border-[#8b7355]/50 p-10 rounded-[2.5rem] max-w-sm w-full space-y-8 animate-in zoom-in-95 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowShareMenu(false)} className="absolute top-6 right-6 text-[#8b7355] hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Share the Wisdom</h3>
              <p className="text-[#8b7355] text-xs mt-2 italic">Spread the cosmic light to your circle.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => shareToSocial('wa')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] transition-all">
                  <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#8b7355] tracking-widest">WhatsApp</span>
              </button>
              <button onClick={() => shareToSocial('tg')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#0088cc]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#0088cc] transition-all">
                  <Send className="w-6 h-6 text-[#0088cc] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#8b7355] tracking-widest">Telegram</span>
              </button>
              <button onClick={() => shareToSocial('fb')} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#1877F2] transition-all">
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#8b7355] tracking-widest">Facebook</span>
              </button>
            </div>
            <button onClick={() => setShowShareMenu(false)} className="w-full py-4 bg-[#8b7355]/10 text-[#8b7355] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#8b7355]/20 transition-all border border-[#8b7355]/20">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @media print {
          html[data-print-mode="scroll"], 
          html[data-print-mode="scroll"] body,
          html[data-print-mode="scroll"] #root {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          html[data-print-mode="scroll"] body > *:not(.scroll-container) { display: none !important; }
          html[data-print-mode="scroll"] #root > *:not(.scroll-container) { display: none !important; }
          
          .no-print { display: none !important; }
          
          .scroll-container { 
            position: static !important;
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          
          #printable-scroll { 
            position: relative !important;
            margin: 0 auto !important;
            width: 100% !important; 
            max-width: none !important;
            border: none !important;
            box-shadow: none !important;
            background-color: #fcf5e5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: visible !important;
            min-height: 0 !important;
          }

          .bg-print-visible {
            opacity: 0.15 !important;
            filter: grayscale(100%) !important;
            position: absolute !important;
            height: 100% !important;
          }

          .prose p, .prose h2 {
            page-break-inside: avoid;
          }

          @page { 
            margin: 0; 
            size: A4 portrait; 
          }
        }
      `}</style>
    </div>
  );
};

export default GiftScroll;