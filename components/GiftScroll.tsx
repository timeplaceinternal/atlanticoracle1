
import React from 'react';
import { Printer, Shield, ArrowLeft } from 'lucide-react';

interface GiftScrollProps {
  backgroundImage: string;
  text: string;
  userName: string;
  onClose: () => void;
}

const GiftScroll: React.FC<GiftScrollProps> = ({ backgroundImage, text, userName, onClose }) => {
  const handlePrint = () => {
    // Add temporary class to root for print styling
    document.documentElement.setAttribute('data-print-mode', 'scroll');
    window.print();
    document.documentElement.removeAttribute('data-print-mode');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/98 flex flex-col items-center overflow-y-auto py-10 px-4 animate-in fade-in duration-500 scroll-container no-scrollbar">
      {/* Control Bar - Hidden on print */}
      <div className="w-full max-w-[850px] flex justify-between items-center mb-10 no-print">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-cosmic-silver rounded-full hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>
        <button 
          onClick={handlePrint} 
          className="flex items-center gap-2 px-10 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-all shadow-2xl group uppercase tracking-widest text-xs"
        >
          <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Save PDF / Print Scroll</span>
        </button>
      </div>

      <div id="printable-scroll" className="relative w-full max-w-[850px] bg-[#fcf5e5] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm border-[16px] border-[#e8dcc4] min-h-[1200px] scroll-paper">
        {/* Parchment texture */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]"></div>
        
        {/* Background Image */}
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale contrast-125 bg-print-visible" 
          />
        )}

        <div className="relative h-full flex flex-col p-12 md:p-24 overflow-visible">
          <div className="text-center mb-20">
            <div className="w-24 h-24 border-2 border-[#8b7355] rounded-full mx-auto flex items-center justify-center mb-8 shadow-inner">
              <Shield className="w-12 h-12 text-[#8b7355]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-cinzel text-[#2d2419] font-bold tracking-[0.2em] uppercase mb-4">Atlantic Oracle</h1>
            <div className="w-48 h-[2px] bg-[#8b7355] mx-auto mb-8"></div>
            <p className="text-sm font-cinzel text-[#5d4a36] uppercase tracking-[0.5em] font-bold">Sacred Registry for {userName}</p>
          </div>

          <div className="prose prose-stone max-w-none text-[#1a1510] font-serif leading-relaxed text-xl text-justify hyphens-auto">
             {text.split('\n').map((para, i) => {
               if (para.startsWith('#')) {
                 const title = para.replace(/#/g, '').trim();
                 return (
                   <h2 key={i} className="font-cinzel text-2xl text-[#5d4a36] mt-16 mb-10 border-b border-[#8b7355]/30 pb-4 uppercase tracking-widest text-center font-bold">
                     {title}
                   </h2>
                 );
               }
               if (para.trim() === '') return <div key={i} className="h-8" />;
               return <p key={i} className="mb-8 font-serif">{para}</p>;
             })}
          </div>

          <div className="mt-32 pt-20 text-center border-t border-[#8b7355]/20">
             <span className="text-xs font-cinzel text-[#8b7355] uppercase tracking-[0.6em] font-bold">Authorized by the Atlantic Oracle Registry • AD 2026</span>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @media print {
          html[data-print-mode="scroll"] body > *:not(.scroll-container) { display: none !important; }
          html[data-print-mode="scroll"] #root > *:not(.scroll-container) { display: none !important; }
          
          .no-print { display: none !important; }
          
          .scroll-container { 
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            display: block !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          #printable-scroll { 
            margin: 0 auto !important;
            width: 210mm !important; 
            border: none !important;
            box-shadow: none !important;
            background-color: #fcf5e5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .bg-print-visible {
            opacity: 0.25 !important;
            display: block !important;
            filter: grayscale(100%) !important;
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
