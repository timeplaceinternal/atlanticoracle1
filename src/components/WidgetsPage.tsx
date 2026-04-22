
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Layout, Code, Copy, Check, ExternalLink, 
  Sparkles, CloudSun, Smartphone, Share2
} from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';
import HoroscopeService from './HoroscopeService';

interface WidgetsPageProps {
  language: ReportLanguage;
  onBack: () => void;
}

const WidgetsPage: React.FC<WidgetsPageProps> = ({ language, onBack }) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const widgets = [
    {
      id: 'horoscope',
      title: 'Daily Horoscope Widget',
      description: 'A beautiful, golden zodiac selector that provides daily cosmic insights directly on your site.',
      icon: <Sparkles className="w-6 h-6 text-cosmic-gold" />,
      url: `${window.location.origin}/daily-horoscope?widget=true`,
      preview: 'horoscope'
    },
    {
      id: 'weather',
      title: 'Astro-Weather Widget',
      description: 'Real-time weather data synthesized with celestial mechanics. A unique vertical for your audience.',
      icon: <CloudSun className="w-6 h-6 text-sky-400" />,
      url: `${window.location.origin}/astro-weather?widget=true`,
      preview: 'weather'
    }
  ];

  const copyToClipboard = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cosmic-950 px-6 py-20 pb-40">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-6 text-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest mx-auto"
          >
            <ChevronLeft className="w-4 h-4" /> {t.backToStart}
          </button>
          
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
            <Share2 className="w-4 h-4 text-cosmic-gold" />
            <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">Affiliate & Partners</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-cinzel text-white uppercase tracking-widest">
            Widgets for Webmasters
          </h1>
          <p className="text-cosmic-silver/60 italic font-playfair text-xl max-w-2xl mx-auto leading-relaxed">
            Enhance your website with the professional insights of Atlantic Oracle. 
            Free, beautiful, and fully responsive widgets.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Layout className="w-6 h-6" />, title: 'Premium Design', desc: 'Crafted with our signature cosmic theme to fit any modern website.' },
            { icon: <Code className="w-6 h-6" />, title: 'Easy Integration', desc: 'Simply copy and paste the iframe code. No complex JS needed.' },
            { icon: <ExternalLink className="w-6 h-6" />, title: 'Traffic Retention', desc: 'Keep your visitors engaged with daily content updates from the stars.' }
          ].map((benefit, i) => (
            <div key={i} className="bg-cosmic-900/40 p-8 rounded-3xl border border-cosmic-gold/10 space-y-4">
              <div className="text-cosmic-gold">{benefit.icon}</div>
              <h3 className="text-white font-cinzel text-lg tracking-widest uppercase">{benefit.title}</h3>
              <p className="text-cosmic-silver/50 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Widgets List */}
        <div className="space-y-24 pt-10">
          {widgets.map((widget) => (
            <div key={widget.id} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Info & Code */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cosmic-900 rounded-2xl border border-cosmic-gold/20 shadow-lg animate-pulse">
                    {widget.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest">{widget.title}</h2>
                    <p className="text-cosmic-gold/60 text-[10px] font-bold uppercase tracking-widest">Live Integration</p>
                  </div>
                </div>
                
                <p className="text-cosmic-silver text-lg font-light leading-relaxed">
                  {widget.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-silver/40 text-[10px] font-bold uppercase tracking-widest">Embed Code (iframe)</span>
                  </div>
                  <div className="relative group">
                    <pre className="bg-cosmic-950 p-6 rounded-2xl border border-white/5 text-cosmic-gold/80 text-[11px] font-mono overflow-x-auto">
                      {`<iframe 
  src="${widget.url}" 
  width="100%" 
  height="600" 
  style="border:none; border-radius:32px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));"
></iframe>`}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(widget.id, `<iframe src="${widget.url}" width="100%" height="600" style="border:none; border-radius:32px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));"></iframe>`)}
                      className="absolute top-4 right-4 p-2 bg-cosmic-gold text-cosmic-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                      {copiedId === widget.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                   <div className="flex items-center gap-2 text-cosmic-silver/40 text-[10px] font-bold uppercase">
                     <Smartphone className="w-4 h-4" /> Fully Bio-Responsive
                   </div>
                   <div className="flex items-center gap-2 text-cosmic-silver/40 text-[10px] font-bold uppercase">
                     <Check className="w-4 h-4" /> No Credit Required
                   </div>
                </div>
              </div>

              {/* Preview */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-cosmic-gold/5 via-transparent to-cosmic-gold/5 rounded-[3rem] blur-2xl group-hover:bg-cosmic-gold/10 transition-all"></div>
                <div className="bg-cosmic-900 border border-cosmic-gold/20 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-[600px] pointer-events-none opacity-80 scale-95 origin-top-right">
                  {/* Fake iFrame Header */}
                  <div className="bg-cosmic-950/50 border-b border-cosmic-gold/10 p-3 flex items-center justify-between px-6">
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-400/20"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-400/20"></div>
                       <div className="w-2 h-2 rounded-full bg-green-400/20"></div>
                    </div>
                    <div className="text-[9px] text-cosmic-silver/30 font-mono tracking-widest truncate max-w-[200px]">
                      {widget.url}
                    </div>
                    <div className="w-10"></div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="p-4 overflow-y-auto h-full bg-cosmic-950 scale-75 origin-top">
                    {widget.id === 'horoscope' ? (
                       <HoroscopeService 
                         language={language} 
                         onExploreServices={() => {}} 
                         isWidget={true}
                       />
                    ) : (
                      <div className="space-y-8 animate-pulse p-10 text-center">
                        <div className="w-20 h-20 bg-cosmic-gold/10 rounded-full mx-auto" />
                        <div className="h-8 bg-cosmic-gold/5 w-1/2 mx-auto rounded" />
                        <div className="h-4 bg-cosmic-gold/5 w-3/4 mx-auto rounded" />
                        <div className="grid grid-cols-3 gap-4 pt-10">
                          {[1,2,3].map(i => <div key={i} className="h-20 bg-cosmic-gold/5 rounded-2xl" />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Contact */}
        <div className="pt-20 border-t border-cosmic-gold/10 text-center space-y-6">
          <h3 className="text-xl font-cinzel text-white uppercase tracking-widest">Custom Partnership?</h3>
          <p className="text-cosmic-silver/60">
            For white-label solutions, custom designs, or API access, contact our technical sanctuary.
          </p>
          <a 
            href="mailto:oracle@atlanticoracle.com" 
            className="inline-block px-10 py-4 border border-cosmic-gold text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all uppercase tracking-widest text-xs"
          >
            Inquire via Telegram or Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default WidgetsPage;
