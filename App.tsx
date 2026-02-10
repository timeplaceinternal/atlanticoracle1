
import React, { useState, useEffect } from 'react';
import CosmicBackground from './components/CosmicBackground';
import ReadingForm from './components/ReadingForm';
import LoadingAnimation from './components/LoadingAnimation';
import ReadingResult from './components/ReadingResult';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import { SERVICES, getServiceIcon } from './constants';
import { Service, ServiceType, ReadingRequest, ReadingResult as ReadingResultType } from './types';
import { generateCosmicReading } from './services/geminiService';
import { Star, ChevronRight, ShieldCheck, ExternalLink, Beaker, Menu, X, Sparkles, BookOpen, Compass } from 'lucide-react';

const STRIPE_URL = "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04";

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'payment' | 'loading' | 'result'>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ReadingRequest | null>(null);
  const [result, setResult] = useState<ReadingResultType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resetToHome = () => {
    setView('home');
    setSelectedService(null);
    setCurrentRequest(null);
    setResult(null);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartService = (service: Service) => {
    setSelectedService(service);
    setView('form');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (request: ReadingRequest) => {
    setCurrentRequest(request);
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
    setIsMenuOpen(false);
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
              <button onClick={() => scrollToSection('services')} className="hover:text-cosmic-gold transition-colors">Readings</button>
              <button onClick={() => handleStartService(SERVICES[0])} className="px-6 py-2 border border-cosmic-gold text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all">Start Reading</button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-cosmic-gold p-2 hover:bg-cosmic-gold/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          <div className={`md:hidden absolute top-20 left-0 right-0 bg-cosmic-900/95 backdrop-blur-2xl border-b border-cosmic-gold/10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col p-8 gap-6 text-center text-sm font-bold text-cosmic-silver uppercase tracking-[0.2em]">
              <button onClick={() => scrollToSection('philosophy')} className="py-2 hover:text-cosmic-gold">Philosophy</button>
              <button onClick={() => scrollToSection('how-it-works')} className="py-2 hover:text-cosmic-gold">How it Works</button>
              <button onClick={() => scrollToSection('services')} className="py-2 hover:text-cosmic-gold">Our Services</button>
              <button onClick={() => handleStartService(SERVICES[0])} className="mt-4 px-6 py-4 bg-cosmic-gold text-cosmic-900 rounded-full">Request Consultation</button>
            </div>
          </div>
        </header>

        <main className="container mx-auto pt-20">
          {view === 'loading' && <LoadingAnimation />}

          {view === 'home' && (
            <div className="space-y-32 py-20">
              {/* HERO SECTION */}
              <section className="text-center max-w-5xl mx-auto px-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 pt-20">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">The Synthesis of Stars and Numbers</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-cinzel text-white leading-[1.1]">The Secret Language of <span className="text-cosmic-gold">Space and Numbers</span></h1>
                <p className="text-lg md:text-2xl text-cosmic-silver font-light max-w-3xl mx-auto italic font-playfair">"We merge the cosmic mechanics of Astrology with the mathematical fate of Numerology to decode your life's navigation map."</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <button onClick={() => scrollToSection('services')} className="w-full sm:w-auto px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/20 hover:scale-105 transition-transform active:scale-95">Consult the Oracle</button>
                  <button onClick={() => scrollToSection('philosophy')} className="w-full sm:w-auto px-10 py-5 bg-transparent border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold/5 transition-all">Explore Philosophy</button>
                </div>
              </section>

              {/* INTRODUCTORY PRELUDE */}
              <section className="px-6 max-w-4xl mx-auto text-center space-y-12">
                <div className="w-px h-24 bg-gradient-to-b from-cosmic-gold to-transparent mx-auto"></div>
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-cinzel text-white uppercase tracking-widest">A Unified Map of your <span className="text-cosmic-gold">Existence</span></h2>
                  <p className="text-lg md:text-xl text-cosmic-silver leading-relaxed font-light">
                    Atlantic Oracle represents a shift from general horoscopes to structured data analysis. We believe that <strong>Astrology</strong> provides the external context—the "weather" of your destiny—while <strong>Numerology</strong> reveals the internal engine: the vibrations hidden in your name and date of birth.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <BookOpen className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">3-5 Page Reports</h4>
                    <p className="text-xs text-cosmic-silver/70">Substantial analysis ranging from 800 to 1500 words per reading.</p>
                  </div>
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <Compass className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">Dual Methodology</h4>
                    <p className="text-xs text-cosmic-silver/70">The synthesis of celestial transits and the Pythagorean matrix.</p>
                  </div>
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <ShieldCheck className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">Ephemeral Privacy</h4>
                    <p className="text-xs text-cosmic-silver/70">No personal accounts. Your data is deleted immediately after the report.</p>
                  </div>
                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="text-center mb-16 space-y-4">
                  <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">Available Pathfinds</h3>
                  <p className="text-cosmic-silver italic font-playfair">Select a focus area for your personalized study.</p>
                </div>
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
                <h2 className="text-3xl font-cinzel text-white mb-4">Secure Gateway</h2>
                <p className="text-cosmic-silver mb-8 italic">Your study in {currentRequest?.language} is formatted and ready for the matrix. Fee: €10.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleProceedToStripe} 
                    className="w-full py-5 bg-white text-cosmic-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Pay via Stripe <ExternalLink className="w-5 h-5" />
                  </button>
                  
                  <div className="py-4 flex items-center gap-4">
                     <div className="h-px flex-1 bg-cosmic-700"></div>
                     <span className="text-[10px] text-cosmic-silver uppercase tracking-widest opacity-40">Sandbox Access</span>
                     <div className="h-px flex-1 bg-cosmic-700"></div>
                  </div>

                  <button 
                    onClick={simulateSuccess} 
                    className="w-full py-4 bg-cosmic-gold/10 border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-2xl hover:bg-cosmic-gold hover:text-cosmic-900 transition-all flex items-center justify-center gap-3"
                  >
                    <Beaker className="w-4 h-4" /> Bypas for Testing
                  </button>

                  <button onClick={resetToHome} className="text-cosmic-silver/60 text-xs uppercase tracking-widest hover:text-white transition-colors block mx-auto pt-4">Return to Sanctuary</button>
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
              ATLANTICORACLE.COM © 2026. THE SECRET LANGUAGE OF SPACE AND NUMBERS.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
