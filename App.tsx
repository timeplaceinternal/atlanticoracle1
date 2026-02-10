
import React, { useState } from 'react';
import CosmicBackground from './components/CosmicBackground';
import ReadingForm from './components/ReadingForm';
import LoadingAnimation from './components/LoadingAnimation';
import ReadingResult from './components/ReadingResult';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import { SERVICES, getServiceIcon } from './constants';
import { Service, ServiceType, ReadingRequest, ReadingResult as ReadingResultType } from './types';
import { generateCosmicReading } from './services/geminiService';
import { Star, ChevronRight, ShieldCheck, ExternalLink, Beaker } from 'lucide-react';

const STRIPE_URL = "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04";

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'payment' | 'loading' | 'result'>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ReadingRequest | null>(null);
  const [result, setResult] = useState<ReadingResultType | null>(null);

  const resetToHome = () => {
    setView('home');
    setSelectedService(null);
    setCurrentRequest(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartService = (service: Service) => {
    setSelectedService(service);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (request: ReadingRequest) => {
    setCurrentRequest(request);
    console.log("Saving to database with status: PENDING...", request);
    setView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStripe = () => {
    window.open(STRIPE_URL, '_blank');
    alert("Payment page opened. After payment, the registry will update your status.");
  };

  const simulateSuccess = async () => {
    if (!currentRequest) return;
    setView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const aistudio = (window as any).aistudio;
    if (aistudio) {
      try {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) await aistudio.openSelectKey();
      } catch (e) { console.warn("AI Studio key manager unavailable"); }
    }
    
    try {
      const content = await generateCosmicReading(currentRequest);
      const newResult: ReadingResultType = {
        id: Math.random().toString(36).substring(7),
        serviceId: currentRequest.serviceId,
        content: content,
        timestamp: Date.now(),
        userName: currentRequest.name,
        language: currentRequest.language
      };
      setResult(newResult);
      setView('result');
    } catch (error: any) {
      alert(error.message || "Connection failed.");
      setView('home');
    }
  };

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-inter selection:bg-cosmic-gold selection:text-cosmic-900 overflow-x-hidden">
      <CosmicBackground />
      
      {/* Wrapper to handle print visibility */}
      <div className="main-ui-wrapper">
        <header className="fixed top-0 left-0 right-0 z-[100] bg-cosmic-900/60 backdrop-blur-xl border-b border-cosmic-gold/10 no-print">
          <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button onClick={resetToHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-cosmic-gold rounded-lg flex items-center justify-center shadow-lg">
                <Star className="text-cosmic-900 w-6 h-6" />
              </div>
              <span className="text-xl font-cinzel font-bold text-white tracking-widest uppercase">Atlantic Oracle</span>
            </button>
            <div className="hidden md:flex gap-8 items-center text-xs font-bold text-cosmic-silver uppercase tracking-widest">
              <button onClick={() => scrollToSection('philosophy')} className="hover:text-cosmic-gold transition-colors">Philosophy</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cosmic-gold transition-colors">How it Works</button>
              <button onClick={() => handleStartService(SERVICES[0])} className="px-6 py-2 border border-cosmic-gold text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all">Get Reading</button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto pt-20">
          {view === 'loading' && <LoadingAnimation />}

          {view === 'home' && (
            <div className="space-y-32 py-20">
              <section className="text-center max-w-5xl mx-auto px-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 pt-20">
                <h1 className="text-6xl md:text-8xl font-cinzel text-white leading-[1.1]">The Secret Language of <span className="text-cosmic-gold">Space and Numbers</span></h1>
                <p className="text-xl text-cosmic-silver font-light max-w-2xl mx-auto italic">Professional soul horoscopes and celestial guidance. Comprehensive 3-5 page reports.</p>
                <button onClick={() => scrollToSection('services')} className="px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/20 hover:scale-110 transition-transform active:scale-95">Oracle Consultations</button>
              </section>

              <section id="services" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {SERVICES.map(s => (
                    <div key={s.id} onClick={() => handleStartService(s)} className="group bg-cosmic-800/20 backdrop-blur-2xl border border-cosmic-700/50 p-10 rounded-[2.5rem] hover:border-cosmic-gold transition-all cursor-pointer relative overflow-hidden shadow-xl">
                      <div className="mb-8">{getServiceIcon(s.icon)}</div>
                      <h3 className="text-2xl font-cinzel text-white mb-4">{s.title}</h3>
                      <p className="text-cosmic-silver font-light text-sm mb-8 leading-relaxed h-20 overflow-hidden line-clamp-4">{s.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-cosmic-gold font-cinzel text-xl">€{s.price}</span>
                        <ChevronRight className="text-white group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <PhilosophySection />
              <HowItWorksSection />
            </div>
          )}

          {view === 'form' && selectedService && (
            <div className="py-20 px-6">
              <ReadingForm service={selectedService} onBack={resetToHome} onSubmit={handleFormSubmit} />
            </div>
          )}

          {view === 'payment' && (
            <div className="py-20 px-6 flex flex-col items-center justify-center min-h-[60vh]">
              <div className="bg-cosmic-800/60 p-12 rounded-[3rem] border border-cosmic-gold/30 text-center max-w-md w-full backdrop-blur-3xl animate-in zoom-in-95 shadow-2xl">
                <ShieldCheck className="w-16 h-16 text-cosmic-gold mx-auto mb-6" />
                <h2 className="text-3xl font-cinzel text-white mb-4">Secure Access</h2>
                <p className="text-cosmic-silver mb-8 italic">Your professional report in {currentRequest?.language} is ready. Fee: €10.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleProceedToStripe} 
                    className="w-full py-5 bg-white text-cosmic-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Pay via Stripe <ExternalLink className="w-5 h-5" />
                  </button>
                  
                  <div className="py-4 flex items-center gap-4">
                     <div className="h-px flex-1 bg-cosmic-700"></div>
                     <span className="text-[10px] text-cosmic-silver uppercase tracking-widest opacity-40">Development Preview</span>
                     <div className="h-px flex-1 bg-cosmic-700"></div>
                  </div>

                  <button 
                    onClick={simulateSuccess} 
                    className="w-full py-4 bg-cosmic-gold/10 border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-2xl hover:bg-cosmic-gold hover:text-cosmic-900 transition-all flex items-center justify-center gap-3"
                  >
                    <Beaker className="w-4 h-4" /> Simulate Payment & Generate
                  </button>

                  <button onClick={resetToHome} className="text-cosmic-silver/60 text-xs uppercase tracking-widest hover:text-white transition-colors block mx-auto pt-4">Cancel Request</button>
                </div>
              </div>
            </div>
          )}
          
          {view === 'result' && result && (
            <div className="py-20 px-6">
              <ReadingResult result={result} onReset={resetToHome} />
            </div>
          )}
        </main>

        <footer className="border-t border-cosmic-700/50 py-20 bg-cosmic-900 px-6 text-center no-print">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex items-center justify-center gap-2">
              <Star className="text-cosmic-gold w-8 h-8" />
              <span className="text-3xl font-cinzel text-white uppercase tracking-widest">Atlantic Oracle</span>
            </div>
            <p className="text-cosmic-silver text-xs max-w-xl mx-auto leading-loose opacity-60 uppercase tracking-widest">
              ATLANTICORACLE.COM © 2026. PROFESSIONAL ASTROLOGY SERVICES.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
