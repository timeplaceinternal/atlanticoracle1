import React from 'react';
import { ReadingResult as ReadingResultType } from '../types';
import { Star, Download, Share2, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';

interface ReadingResultProps {
  result: ReadingResultType;
  onReset: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent opacity-50" />
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="w-16 h-16 bg-cosmic-gold rounded-2xl flex items-center justify-center shadow-2xl shadow-cosmic-gold/20">
            <Star className="text-cosmic-900 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-cinzel text-white uppercase tracking-widest">{result.userName}'s Cosmic Decree</h2>
          <div className="flex items-center gap-4 text-cosmic-silver/60 text-xs uppercase tracking-[0.3em]">
            <span>{new Date(result.timestamp).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-cosmic-gold rounded-full" />
            <span>ID: {result.id}</span>
          </div>
        </div>
        <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold">
          <Markdown>{result.content}</Markdown>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 pt-12 border-t border-cosmic-gold/10 no-print">
          <button onClick={() => window.print()} className="flex items-center gap-3 px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-transform"><Download className="w-5 h-5" /> Save Decree</button>
          <button onClick={onReset} className="flex items-center gap-3 px-8 py-4 border border-cosmic-gold/20 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold/5 transition-all"><RefreshCw className="w-5 h-5" /> New Consultation</button>
        </div>
      </div>
    </div>
  );
};

export default ReadingResult;
