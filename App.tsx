
'use client';

import React, { useState } from 'react';
import CosmicBackground from './components/CosmicBackground';
import ReadingForm from './components/ReadingForm';
import LoadingAnimation from './components/LoadingAnimation';
import ReadingResult from './components/ReadingResult';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import { SERVICES, getServiceIcon } from './constants';
import { Service, ReadingRequest, ReadingResult as ReadingResultType } from './types';
import { generateCosmicReading } from './services/geminiService';
import { Star, ChevronRight, Activity, Sparkles as SparklesIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'loading' | 'result' | 'error'>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [result, setResult] = useState<ReadingResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartService = (service: Service) => {
    setSelectedService(service);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (request: ReadingRequest) => {
    setView('loading');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const content = await generateCosmicReading(request);
      const newResult: ReadingResultType = {
        id: Math.random().toString(36).substring(7),
        serviceId: request.serviceId,
        content: content,
        timestamp: Date.now(),
        userName: request.name
      };
      setResult(newResult);
      setView('result');
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrorMessage(error.message || "An unexpected planetary alignment blocked the signal.");
      setView('error');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-inter bg-cosmic-900 transition-colors duration-1000 selection:bg-[#d4af37] selection:text-black">
      <CosmicBackground />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic-900/40 backdrop-blur-xl border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => { setView('home'); setSelectedService(null); }}
          >
            <Star className="w-6 h-6 text-[#d4af37] fill-current group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
            <span className="text-xl font-cinzel font-bold tracking-[0.25em] text-white uppercase drop-shadow-md">Atlantic Oracle</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['services', 'how-it-works', 'philosophy'].map((sec) => (
              <button 
                key={sec}
                onClick={() => scrollToSection(sec)} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-cosmic-silver/60 hover:text-[#d4af37] transition-all relative group"
              >
                {sec.replace('-', ' ')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="w-20 hidden md:block"></div>
        </nav>
      </header>

      <main className="relative z-10">
        {view === 'home' && (
          <div className="space-y-40 pt-40 pb-48">
            <section className="px-6 text-center max-w-6xl mx-auto space-y-14 min-h-[60vh] flex flex-col justify-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-8xl font-cinzel text-white leading-tight tracking-[0.05em] uppercase">
                  The Secret Language <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cosmic-gold-light to-[#d4af37] drop-shadow-2xl">of Stars & Numbers</span>
                </h1>
                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mx-auto mt-8"></div>
              </div>
              <p className="text-2xl md:text-4xl text-cosmic-silver/90 font-playfair italic max-w-4xl mx-auto leading-relaxed">
                "Decrypting the sacred resonance of the universe to illuminate your path."
              </p>
            </section>

            <section id="services" className="px-6 max-w-7xl mx-auto scroll-mt-32">
              <div className="mb-24 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#d4af37]/10 blur-[60px] rounded-full animate-pulse-slow scale-125"></div>
                  <div className="relative px-12 py-8 bg-[#05051a]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
                    <div className="flex items-center gap-8">
                      <SparklesIcon className="w-6 h-6 text-[#d4af37] opacity-60" />
                      <h2 className="text-xl md:text-3xl font-cinzel font-bold uppercase tracking-[0.5em] text-white">
                        Consult The Oracle
                      </h2>
                      <SparklesIcon className="w-6 h-6 text-[#d4af37] opacity-60" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {SERVICES.map((service, index) => (
                  <div 
                    key={service.id}
                    className="group relative bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:bg-white/[0.06] hover:border-[#d4af37]/40 transition-all duration-500 cursor-pointer flex flex-col"
                    onClick={() => handleStartService(service)}
                  >
                    <div className="absolute top-6 right-8 text-[#d4af37]/5 font-cinzel text-6xl group-hover:text-[#d4af37]/10 transition-all">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="mb-8 p-3 bg-white/5 w-fit rounded-2xl group-hover:bg-[#d4af37]/10 transition-colors">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-lg font-cinzel text-white mb-4 tracking-widest uppercase group-hover:text-[#d4af37] transition-colors">{service.title}</h3>
                    <p className="text-cosmic-silver/60 text-sm leading-relaxed mb-10 font-light italic flex-grow">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#d4af37]/60 font-bold uppercase tracking-[0.3em] mb-1">Exchange</span>
                        <span className="text-white font-cinzel text-2xl tracking-tighter">€{service.price}</span>
                      </div>
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-black transition-all shadow-xl">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <HowItWorksSection />
            <PhilosophySection />
          </div>
        )}
        
        {view === 'form' && selectedService && (
          <div className="pt-32 pb-40 px-6">
            <ReadingForm 
              service={selectedService} 
              onBack={() => setView('home')} 
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        
        {view === 'loading' && <LoadingAnimation />}
        
        {view === 'result' && result && (
          <div className="pt-32 pb-40 px-6">
            <ReadingResult result={result} onReset={() => setView('home')} />
          </div>
        )}

        {view === 'error' && (
          <div className="pt-40 pb-40 px-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <Activity className="w-16 h-16 text-red-500/40 mb-10 animate-pulse" />
            <h2 className="text-3xl font-cinzel text-white mb-6 uppercase tracking-[0.2em]">Signal Lost</h2>
            <p className="text-cosmic-silver/70 max-w-xl mb-12 text-lg italic leading-relaxed">"{errorMessage}"</p>
            <button 
              onClick={() => setView('home')}
              className="px-12 py-5 bg-[#d4af37] text-black text-[10px] font-black rounded-full hover:bg-[#e3c58e] transition-all uppercase tracking-[0.4em] shadow-2xl"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </main>

      <footer className="bg-black/40 backdrop-blur-3xl border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <Star className="w-10 h-10 text-[#d4af37] opacity-60" />
            <span className="text-2xl font-cinzel font-bold text-white uppercase tracking-[0.4em]">Atlantic Oracle</span>
          </div>
          <div className="text-[9px] text-cosmic-silver/20 uppercase tracking-[0.4em] pt-12 border-t border-white/5 w-full text-center">
            © {new Date().getFullYear()} Atlantic Oracle. Synthesized Celestial Wisdom.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
