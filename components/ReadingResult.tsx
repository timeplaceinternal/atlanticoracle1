
import React, { useState } from 'react';
import { RefreshCw, Check, Copy, Sparkles, ScrollText } from 'lucide-react';
import { ReadingResult as ReadingResultType } from '../types';
import GiftScroll from './GiftScroll';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const copyToClipboard = () => {
    const textToCopy = result.content.replace(/#/g, '');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cleanMarkdown = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  return (
    <div className="max-w-4xl mx-auto pb-40 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center mb-16 space-y-4">
        <Sparkles className="w-6 h-6 text-cosmic-gold mx-auto opacity-50" />
        <h1 className="text-3xl md:text-4xl font-cinzel text-white uppercase tracking-widest">The Oracle Speaks</h1>
        <p className="text-cosmic-silver/40 font-playfair italic text-sm">Transmitted for {result.userName}</p>
        <div className="w-12 h-px bg-cosmic-gold/20 mx-auto mt-6"></div>
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-10 md:p-16 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="flex justify-end gap-4 mb-12 no-print">
          <button 
            onClick={() => setShowScroll(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 rounded-full hover:bg-[#d4af37]/20 transition-all text-[10px] font-bold uppercase tracking-widest"
            title="View as Sacred Scroll"
          >
            <ScrollText className="w-4 h-4" />
            Sacred Scroll
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-3 text-cosmic-silver/40 hover:text-cosmic-gold hover:bg-white/5 rounded-full transition-all"
              title="Copy Reading"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button 
              onClick={onReset}
              className="p-3 text-cosmic-silver/40 hover:text-cosmic-gold hover:bg-white/5 rounded-full transition-all"
              title="Start New Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-cosmic-silver/80 leading-relaxed font-light text-lg space-y-10">
          {result.content.split('\n').map((para, i) => {
            const cleanPara = cleanMarkdown(para);
            if (!cleanPara.trim()) return null;
            
            if (para.startsWith('#')) {
              const level = (para.match(/#/g) || []).length;
              return (
                <h2 key={i} className={`font-cinzel text-white tracking-[0.2em] uppercase pt-8 ${level === 1 ? 'text-2xl' : 'text-lg'}`}>
                  {cleanPara.replace(/#/g, '').trim()}
                </h2>
              );
            }
            
            return <p key={i} className="mb-6 font-playfair italic">{cleanPara}</p>;
          })}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-[8px] text-cosmic-silver/20 uppercase tracking-[0.3em]">
            Archival Coordinate: {new Date(result.timestamp).toLocaleDateString()} • Atlantic Oracle Sanctuary
          </p>
        </div>
      </div>

      {showScroll && (
        <GiftScroll 
          text={result.content} 
          userName={result.userName} 
          onClose={() => setShowScroll(false)} 
        />
      )}
    </div>
  );
};

export default ReadingResult;
