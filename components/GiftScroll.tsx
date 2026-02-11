
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    // Set a print mode attribute on the HTML element to toggle CSS states
    document.documentElement.setAttribute('data-print-mode', 'scroll');
    window.print();
    // Use a slight delay or a simple reset to ensure standard UI returns if they cancel
    setTimeout(() => {
      document.documentElement.removeAttribute('data-print-mode');
    }, 500);
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

  // Using a portal to avoid parent container constraints during print
  const scrollContent = (
    <div className="fixed inset-0 z-[600] bg-black/98 flex flex-col items-center overflow-y-auto py-10 px-4 animate-in fade-in duration-500 scroll-container no-scrollbar">
      {/* Control Bar */}
      <div className="w-full max-w-[850px] flex flex-wrap justify-between items-center mb-10 gap-4 no-print">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-cosmic-silver rounded-full hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Scroll View</span>
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare} 
            className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20 uppercase tracking-widest text-[10px]"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-10 py-4 bg-[#d4af37] text-[#050510] font-bold rounded-full hover:scale-105 transition-all shadow-2xl group uppercase tracking-widest text-xs"
          >
            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Save Artistic PDF</span>
          </button>
        </div>
      </div>

      {/* The Scroll Container */}
      <div id="printable-scroll" className="relative w-full max-w-[850px] antique-paper shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm border-[20px] border-double border-[#d4af37]/40 min-h-[1400px] scroll-paper">
        
        {/* Parchment texture Overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] no-print"></div>
        
        {/* AI Generated Background Image */}
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 grayscale contrast-125 bg-print-visible" 
            style={{ display: 'block' }}
          />
        )}

        <div className="relative flex flex-col p-12 md:p-24">
          <div className="text-center mb-24 border-b-2 border-[#d4af37]/30 pb-12">
            <div className="w-24 h-24 border-2 border-[#d4af37] rounded-full mx-auto flex items-center justify-center mb-8 shadow-inner bg-white/10">
              <Shield className="w-12 h-12 text-[#d4af37]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-cinzel text-[#1a1a1a] font-bold tracking-[0.2em] uppercase mb-4">Atlantic Oracle</h1>
            <div className="w-48 h-[2px] bg-[#d4af37] mx-auto mb-8"></div>
            <p className="text-sm font-cinzel text-[#1a1a1a] uppercase tracking-[0.5em] font-bold">Authorized Cosmic Registry for {userName}</p>
          </div>

          <div className="prose prose-stone max-w-none text-[#1a1a1a] font-serif leading-[1.8] text-xl text-justify">
             {text.split('\n').map((para, i) => {
               if (para.startsWith('#')) {
                 const title = para.replace(/#/g, '').trim();
                 return (
                   <h2 key={i} className="font-cinzel text-2xl md:text-3xl text-[#1a1a1a] mt-16 mb-12 border-b-2 border-[#d4af37]/20 pb-4 uppercase tracking-[0.15em] text-center font-bold break-after-avoid">
                     {title}
                   </h2>
                 );
               }
               if (para.trim() === '') return <div key={i} className="h-8" />;

               // Apply drop cap to the first paragraph of content
               if (i === 1 || (i === 0 && !para.startsWith('#'))) {
                return (
                  <p key={i} className="mb-10 font-serif break-inside-avoid-page first-letter:text-6xl first-letter:font-cinzel first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-[#d4af37]">
                    {para}
                  </p>
                );
              }

               return <p key={i} className="mb-10 font-serif break-inside-avoid-page">{para}</p>;
             })}
          </div>

          <div className="mt-40 pt-20 text-center border-t-2 border-[#d4af37]/20">
             <span className="text-[10px] font-cinzel text-[#1a1a1a] uppercase tracking-[0.6em] font-bold">Authentic Celestial Registry • AD 2026 • Atlantic Oracle Society</span>
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
              <h3 className="text-2xl font-cinzel text-white uppercase tracking-widest">Share the Wisdom</h3>
              <p className="text-[#d4af37] text-xs mt-2 italic">Spread the cosmic light to your circle.</p>
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
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @media print {
          html[data-print-mode="scroll"] .scroll-container { 
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            z-index: 9999 !important;
          }
          
          #printable-scroll { 
            position: relative !important;
            margin: 0 auto !important;
            width: 100% !important; 
            max-width: none !important;
            border: 1px solid #d4af37 !important;
            box-shadow: none !important;
            background-color: #fcf5e5 !important;
            overflow: visible !important;
            min-height: 297mm !important;
          }

          .bg-print-visible {
            opacity: 0.25 !important;
            filter: grayscale(100%) !important;
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          .prose p, .prose h2 {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(scrollContent, document.body);
};

export default GiftScroll;
