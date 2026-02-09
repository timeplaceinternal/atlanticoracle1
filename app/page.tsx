
'use client';

import React, { useState, useEffect } from 'react';
import CosmicBackground from '../components/CosmicBackground';
import IntroductionSection from '../components/IntroductionSection';
import ReadingForm from '../components/ReadingForm';
import LoadingAnimation from '../components/LoadingAnimation';
import ReadingResult from '../components/ReadingResult';
import PhilosophySection from '../components/PhilosophySection';
import HowItWorksSection from '../components/HowItWorksSection';
import { SERVICES, getServiceIcon } from '../constants';
import { Service, ReadingRequest, ReadingResult as ReadingResultType } from '../types';
import { generateCosmicReading } from '../services/geminiService';
import { Star, ChevronRight, Activity, Sparkles as SparklesIcon } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'home' | 'form' | 'loading' | 'result' | 'error'>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [result, setResult] = useState<ReadingResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Smooth scroll to hash on load
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, []);

  const handleStartService = (service: Service) => {
    setSelectedService(service);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (request: ReadingRequest) => {
    setView('loading');
    setErrorMessage(null);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setErrorMessage(error.message || "Celestial connection interrupted.");
      setView('error');
    }
  };

  const handleReturnHome = () => {
    setView('home');
    setSelectedService(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cosmic-900 font-inter text-white selection:bg-[#d4af37] selection:text-black overflow-x-hidden">
      <CosmicBackground />
      
      <header className="fixed top-0 left-0 right-0 z-[100] bg-cosmic-900/60 backdrop-blur-2xl border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={handleReturnHome}
          >
            <Star className="w-6 h-6 text-[#d4af37] fill-current group-hover:rotate-90 transition-transform duration-700" />
            <span className="text-xl font-cinzel font-bold tracking-[0.25em] uppercase text-white drop-shadow-md">Atlantic Oracle</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['services', 'how-it-works', 'philosophy'].map((id) => (
              <button 
                key={id}
                onClick={() => {
                  if (view !== 'home') setView('home');
                  setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-[#d4af37] transition-colors relative group"
              >
                {id.replace('-', ' ')}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] transition-all group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {view === 'home' && (
          <div className="space-y-40 pt-40 pb-48">
            {/* Hero Section */}
            <section className="px-6 text-center max-w-5xl mx-auto space-y-12 min-h-[50vh] flex flex-col justify-center">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-cinzel leading-tight tracking-wider uppercase">
                  The Language <br />
                  <span className="text-[#d4af37] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">of Stars</span>
                </h1>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mx-auto"></div>
              </div>
              <p className="text-xl md:text-2xl text-cosmic-silver/80 font-playfair italic max-w-2xl mx-auto">
                "Decrypting the sacred resonance of the universe to illuminate your path."
              </p>
            </section>

            <IntroductionSection />

            {/* Services Section */}
            <section id="services" className="px-6 max-w-7xl mx-auto scroll-mt-32">
              <div className="mb-24 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#d4af37]/10 blur-[60px] rounded-full animate-pulse-slow scale-125"></div>
                  <div className="relative px-12 py-8 bg-[#05051a]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-center">
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
                {SERVICES.map((service, idx) => (
                  <div 
                    key={service.id}
                    className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:border-[#d4af37]/50 transition-all duration-500 cursor-pointer flex flex-col shadow-2xl"
                    onClick={() => handleStartService(service)}
                  >
                    <div className="absolute top-6 right-8 text-[#d4af37]/5 font-cinzel text-5xl group-hover:text-[#d4af37]/10 transition-all">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="mb-6 text-[#d4af37] transition-transform duration-500 group-hover:scale-110">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-lg font-cinzel mb-3 tracking-widest uppercase text-white group-hover:text-[#d4af37] transition-colors">{service.title}</h3>
                    <p className="text-sm text-cosmic-silver/60 font-light leading-relaxed mb-8 flex-grow italic">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest">Exchange</span>
                        <span className="text-xl font-cinzel text-[#d4af37]">€{service.price}</span>
                      </div>
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-black transition-all">
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
              onBack={handleReturnHome} 
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        
        {view === 'loading' && <LoadingAnimation />}
        
        {view === 'result' && result && (
          <div className="pt-32 pb-40 px-6">
            <ReadingResult result={result} onReset={handleReturnHome} />
          </div>
        )}

        {view === 'error' && (
          <div className="pt-40 pb-40 px-6 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <Activity className="w-16 h-16 text-red-500/40 mb-8 animate-pulse" />
            <h2 className="text-3xl font-cinzel mb-4 uppercase tracking-widest">Signal Interrupted</h2>
            <p className="text-white/50 mb-10 max-w-md italic">"{errorMessage}"</p>
            <button 
              onClick={handleReturnHome}
              className="px-10 py-4 bg-[#d4af37] text-black text-[10px] font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </main>

      <footer className="bg-black/40 backdrop-blur-3xl border-t border-white/10 pt-24 pb-12 px-6 text-center">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Star className="w-8 h-8 text-[#d4af37] opacity-60" />
            <span className="text-xl font-cinzel font-bold text-white uppercase tracking-[0.4em]">Atlantic Oracle</span>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} Atlantic Oracle. Synthesized Celestial Wisdom.
          </p>
        </div>
      </footer>
    </div>
  );
}
