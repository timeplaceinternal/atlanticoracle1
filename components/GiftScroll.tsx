
import React from 'react';
import { X, Printer, Download, Share2 } from 'lucide-react';

interface GiftScrollProps {
  text: string;
  userName: string;
  onClose: () => void;
}

const GiftScroll: React.FC<GiftScrollProps> = ({ text, userName, onClose }) => {
  const currentYear = new Date().getFullYear();
  
  const handlePrint = () => {
    window.print();
  };

  const cleanMarkdown = (line: string) => {
    return line.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/98 flex items-start justify-center p-4 md:p-10 overflow-y-auto animate-in fade-in duration-700">
      {/* Premium Controls */}
      <div className="fixed top-8 right-8 flex flex-col gap-6 no-print z-[120]">
        <button 
          onClick={handlePrint}
          className="group p-5 bg-cosmic-gold text-cosmic-900 rounded-full hover:scale-110 transition-all shadow-[0_0_50px_rgba(212,175,55,0.5)] active:scale-95 flex items-center justify-center"
          title="Manifest Physical Scroll"
        >
          <Printer className="w-7 h-7" />
          <span className="absolute right-full mr-6 bg-cosmic-gold text-cosmic-900 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Print Scroll</span>
        </button>
        <button 
          onClick={onClose}
          className="p-5 bg-cosmic-800/80 text-white rounded-full hover:scale-110 transition-all border border-cosmic-gold/20 hover:border-cosmic-gold/50"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* The Master Sacred Scroll Template */}
      <div id="printable-scroll" className="relative w-full max-w-[900px] bg-[#fdf5e6] min-h-[1200px] my-12 shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col parchment-container animate-in slide-in-from-bottom-20 duration-1000">
        
        {/* Authentic Aged Overlays */}
        <div className="absolute inset-0 pointer-events-none parchment-stains opacity-80"></div>
        <div className="absolute inset-0 pointer-events-none paper-texture opacity-30 mix-blend-multiply"></div>
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-image-parchment"></div>

        {/* Header Header */}
        <div className="relative z-20 flex flex-col items-center pt-24 pb-16 px-16 text-center">
          <div className="w-24 h-[1px] bg-[#2c1810]/20 mb-8"></div>
          <h2 className="text-5xl md:text-6xl font-cinzel font-bold text-[#2c1810] tracking-[0.2em] uppercase mb-4">
            Atlantic Oracle
          </h2>
          <p className="text-xs font-playfair italic text-[#2c1810]/60 tracking-widest uppercase">Ancient Wisdom • Modern Soul</p>
          <div className="w-24 h-[1px] bg-[#2c1810]/20 mt-8"></div>
        </div>

        {/* Subtle Astronomical Embellishments */}
        <div className="absolute top-20 left-20 opacity-20 pointer-events-none text-4xl select-none">
          <div className="font-serif">☉ ☽ ☿ ♀ ♂ ♃ ♄</div>
        </div>
        <div className="absolute top-20 right-20 opacity-20 pointer-events-none text-4xl select-none">
           <div className="font-serif">♈ ♉ ♊ ♋ ♌ ♍</div>
        </div>

        {/* Side Rail of Power */}
        <div className="absolute left-12 top-1/4 bottom-1/4 w-px bg-[#2c1810]/10 flex flex-col items-center justify-between py-12 pointer-events-none text-xl font-serif text-[#2c1810]/30 select-none">
          <span>N</span><span>E</span><span>W</span><span>S</span>
        </div>

        {/* Content Body */}
        <div className="relative flex-1 p-20 md:p-32 pt-10 pb-48 z-10">
          {/* Greeting */}
          <div className="mb-20 text-center border-b border-[#2c1810]/5 pb-12">
            <p className="text-[10px] font-cinzel text-[#2c1810]/40 uppercase tracking-[0.6em] mb-4">A Sacred Decree Cast For</p>
            <h1 className="text-5xl md:text-6xl font-cinzel text-[#2c1810] uppercase tracking-widest font-bold drop-shadow-sm">
              {userName}
            </h1>
            <p className="mt-8 text-[11px] font-serif text-[#2c1810]/50 tracking-[0.3em] uppercase">Ref ID: {currentYear}-{Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>

          {/* Reading Text Content */}
          <div className="prose prose-stone max-w-none text-[#2c1810]/95 font-playfair italic leading-relaxed text-justify space-y-12 text-lg md:text-xl">
            {text.split('\n').map((line, i) => {
              const cleanLine = cleanMarkdown(line);
              if (!cleanLine.trim()) return null;
              
              if (line.startsWith('#')) {
                const level = (line.match(/#/g) || []).length;
                return (
                  <h4 key={i} className={`font-cinzel not-italic font-bold uppercase tracking-[0.3em] text-[#2c1810]/70 border-b border-[#2c1810]/10 pb-4 mt-20 mb-10 text-center ${level === 1 ? 'text-2xl' : 'text-xl'}`}>
                    {cleanLine.replace(/#/g, '').trim()}
                  </h4>
                );
              }
              
              return (
                <p key={i} className="mb-8 first-letter:text-4xl first-letter:font-cinzel first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-[#2c1810]/80">
                  {cleanLine}
                </p>
              );
            })}
          </div>
          
          {/* Authentic Seal Section */}
          <div className="mt-32 pt-20 border-t border-[#2c1810]/10 flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-[#8b4513]/20 rounded-full rotate-45"></div>
               <div className="absolute inset-2 border border-[#8b4513]/10 rounded-full -rotate-12"></div>
               <div className="text-4xl font-cinzel font-bold text-[#8b4513]/40 tracking-tighter">AO</div>
            </div>
            <p className="text-[10px] font-cinzel mt-6 tracking-[0.5em] text-[#2c1810]/40 uppercase">Verified Atlantic Transmission</p>
            <p className="text-[9px] font-serif mt-2 italic text-[#2c1810]/30">The stars incline, but do not compel.</p>
          </div>
        </div>

        {/* Footer Coordinate Bar */}
        <div className="absolute bottom-12 left-12 right-12 h-16 flex items-center justify-between px-12 border border-[#2c1810]/5 pointer-events-none text-[9px] font-cinzel tracking-[0.5em] text-[#2c1810]/30 uppercase">
          <span>Temporal Alignment: {new Date().toLocaleDateString()}</span>
          <div className="flex-1 h-px bg-[#2c1810]/5 mx-12"></div>
          <span>Archived: Atlantic Sanctuary</span>
        </div>
      </div>

      <style>{`
        .parchment-container {
          background-color: #fdf5e6;
          position: relative;
          clip-path: polygon(
            0% 0.5%, 1% 0%, 99% 0%, 100% 0.5%, 
            100% 99.5%, 99% 100%, 1% 100%, 0% 99.5%,
            0.5% 95%, 0.2% 90%, 0.8% 85%, 0% 80%, 0.5% 75%, 0.2% 70%, 1% 65%, 0% 60%, 0.8% 55%, 0.2% 50%,
            0.5% 45%, 0% 40%, 1% 35%, 0.2% 30%, 0.8% 25%, 0% 20%, 0.5% 15%, 0.2% 10%, 1% 5%
          );
        }

        .paper-texture {
          background-image: url("https://www.transparenttextures.com/patterns/handmade-paper.png");
        }

        .parchment-stains {
          background: 
            radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(139, 69, 19, 0.07) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(139, 69, 19, 0.03) 0%, transparent 80%),
            linear-gradient(45deg, rgba(0,0,0,0.02) 0%, transparent 100%);
        }

        @media print {
          body * { 
            visibility: hidden; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          #printable-scroll, #printable-scroll * { 
            visibility: visible; 
          }

          #printable-scroll { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background-color: #fdf5e6 !important;
            clip-path: none !important;
            border: none !important;
          }

          .no-print { display: none !important; }

          @page {
            size: portrait;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};

export default GiftScroll;
