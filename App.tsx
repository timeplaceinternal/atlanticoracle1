import React, { useState, useEffect } from 'react';
import CosmicBackground from './components/CosmicBackground';
import ReadingForm from './components/ReadingForm';
import LoadingAnimation from './components/LoadingAnimation';
import ReadingResult from './components/ReadingResult';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import NewsPage from './components/NewsPage';
import AdminPanel from './components/AdminPanel';
import { SERVICES, FREE_SERVICES, getServiceIcon } from './constants';
import { Service, ServiceType, ReadingRequest, ReadingResult as ReadingResultType } from './types';
import { generateCosmicReading } from './services/geminiService';
import { Star, ChevronRight, ShieldCheck, ExternalLink, Menu, X, Sparkles, BookOpen, Compass, Mail, Quote, Facebook, Send, MessageCircle } from 'lucide-react';

const STRIPE_URL = "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04";
const STORAGE_KEY = "atlantic_oracle_pending_request";

const TESTIMONIALS = [
  {
    quote: "Mind-blown.",
    text: "Finally, something that actually resonates. That 'Projector' advice hit home. It’s like they’ve known me my whole life.",
    author: "Jordan K.",
    location: "NYC"
  },
  {
    quote: "So accurate!",
    text: "The report is beautiful and very deep. I printed my Decree and put it on my desk. It gives me so much peace.",
    author: "Amelia W.",
    location: "London"
  },
  {
    quote: "Simply perfect.",
    text: "I love the golden stars! The words are true and the PDF is very good. My destiny is clear now. 10/10.",
    author: "Ivan P.",
    location: "Prague"
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'payment' | 'loading' | 'result' | 'privacy' | 'news' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const path = window.location.pathname;
      
      // Support both path and query param for static hosting
      const cleanPath = path.replace(/\/$/, ''); // Remove trailing slash
      if (cleanPath.endsWith('/admin162463') || params.get('view') === 'admin') return 'admin';
      if (cleanPath.endsWith('/news') || params.get('view') === 'news') return 'news';
      
      if (params.get('payment_status') === 'success' && localStorage.getItem(STORAGE_KEY)) {
        return 'loading';
      }
    }
    return 'home';
  });

  // Sync URL with view state (without reloading)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'home') {
        url.searchParams.delete('view');
        window.history.pushState({}, '', url.pathname + url.search);
      } else if (view === 'admin') {
        // Use the secret path for admin
        window.history.pushState({}, '', '/admin162463');
      } else if (['news', 'privacy'].includes(view)) {
        url.searchParams.set('view', view);
        window.history.pushState({}, '', url.pathname + url.search);
      }
    }
  }, [view]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ReadingRequest | null>(null);
  const [result, setResult] = useState<ReadingResultType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success') {
      const savedRequest = localStorage.getItem(STORAGE_KEY);
      if (savedRequest) {
        try {
          const request = JSON.parse(savedRequest) as ReadingRequest;
          window.history.replaceState({}, document.title, window.location.pathname);
          localStorage.removeItem(STORAGE_KEY);
          startGeneration(request);
        } catch (e) {
          console.error("Failed to parse saved request", e);
          setView('home');
        }
      } else if (view === 'loading') {
        setView('home');
      }
    }
  }, []);

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
    if (selectedService?.isFree) {
      startGeneration(request);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(request));
      setView('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProceedToStripe = () => {
    window.location.href = STRIPE_URL;
  };

  const startGeneration = async (request: ReadingRequest) => {
    setView('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const content = await generateCosmicReading(request);
      const newResult: ReadingResultType = {
        id: Math.random().toString(36).substring(7),
        serviceId: request.serviceId,
        content: content,
        timestamp: Date.now(),
        userName: request.name,
        language: request.language,
        birthDate: request.birthDate
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

  const handleBypass = () => {
    const savedReq = currentRequest || JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (savedReq.name) {
      startGeneration(savedReq);
    }
  };

  return (
    <div className="min-h-screen font-inter selection:bg-cosmic-gold selection:text-cosmic-900 overflow-x-hidden">
      <CosmicBackground />
      
      <div className="main-ui-wrapper">
        <header className="fixed top-0 left-0 right-0 z-[100] bg-cosmic-900/40 backdrop-blur-xl border-b border-cosmic-gold/10 no-print">
          <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={resetToHome} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="Atlantic Oracle Home"
            >
              <div className="w-10 h-10 bg-cosmic-gold rounded-lg flex items-center justify-center shadow-lg">
                <Star className="text-cosmic-900 w-6 h-6" />
              </div>
              <span className="text-xl font-cinzel font-bold text-white tracking-widest uppercase hidden sm:inline">Atlantic Oracle</span>
              <span className="text-xl font-cinzel font-bold text-white tracking-widest uppercase sm:hidden">Oracle</span>
            </button>

            <div className="hidden md:flex gap-8 items-center text-xs font-bold text-cosmic-silver uppercase tracking-widest">
              <button 
                onClick={() => setView('news')} 
                className="hover:text-cosmic-gold transition-colors"
                aria-label="View Cosmic News"
              >
                Cosmic News
              </button>
              <button 
                onClick={() => scrollToSection('philosophy')} 
                className="hover:text-cosmic-gold transition-colors"
                aria-label="Read our Philosophy"
              >
                Philosophy
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="hover:text-cosmic-gold transition-colors"
                aria-label="How it Works"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="px-6 py-2 border border-cosmic-gold text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all font-cinzel tracking-[0.2em] shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95"
                aria-label="Oracle Consult"
              >
                Oracle Consult
              </button>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-cosmic-gold p-2 hover:bg-cosmic-gold/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>

          <div className={`md:hidden absolute top-20 left-0 right-0 bg-cosmic-900/95 backdrop-blur-2xl border-b border-cosmic-gold/10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col p-8 gap-6 text-center text-sm font-bold text-cosmic-silver uppercase tracking-[0.2em]">
              <button onClick={() => { setView('news'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">Cosmic News</button>
              <button onClick={() => { scrollToSection('philosophy'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">Philosophy</button>
              <button onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">How it Works</button>
              <button onClick={() => { scrollToSection('services'); setIsMenuOpen(false); }} className="mt-4 px-6 py-4 bg-cosmic-gold text-cosmic-900 rounded-full font-cinzel">Oracle Consult</button>
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
                <p className="text-lg md:text-2xl text-cosmic-silver font-light max-w-3xl mx-auto italic font-playfair text-lg md:text-2xl">"We merge the cosmic mechanics of Astrology with the mathematical fate of Numerology to decode your life's navigation map."</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <button onClick={() => scrollToSection('services')} className="w-full sm:w-auto px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/20 hover:scale-105 transition-transform active:scale-95">Consult the Oracle</button>
                  <button onClick={() => scrollToSection('free-insights')} className="w-full sm:w-auto px-10 py-5 bg-transparent border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold/5 transition-all">Free Insights</button>
                </div>
              </section>

              {/* FREE INSIGHTS SECTION */}
              <section id="free-insights" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="text-center mb-16 space-y-4">
                  <div className="inline-block px-4 py-1 bg-cosmic-gold text-cosmic-900 font-bold text-[9px] uppercase tracking-[0.3em] rounded mb-2">Essential Access</div>
                  <h3 className="text-3xl font-cinzel text-white uppercase tracking-[0.2em]">Free Oracle <span className="text-cosmic-gold">Services</span></h3>
                  <p className="text-cosmic-silver italic font-playfair text-sm">Experience the precision of the Registry through these introductory studies.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {FREE_SERVICES.map(s => (
                    <div key={s.id} onClick={() => handleStartService(s)} className="group bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/10 p-8 rounded-[2rem] hover:border-cosmic-gold transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-cosmic-gold/5">
                      <div className="absolute top-4 right-4 text-[9px] font-black text-cosmic-900 px-3 py-1 rounded-full tracking-[0.2em] uppercase bg-cosmic-gold shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse">FREE</div>
                      <div className="mb-6">{getServiceIcon(s.icon)}</div>
                      <h3 className="text-lg font-cinzel text-white mb-2">{s.title}</h3>
                      <p className="text-cosmic-silver/70 font-light text-xs mb-6 leading-relaxed line-clamp-2">{s.description}</p>
                      <div className="flex justify-end">
                        <ChevronRight className="text-cosmic-gold group-hover:translate-x-1 transition-transform w-4 h-4" />
                      </div>
                    </div>
                  ))}
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
                  <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">Cosmic Decrees</h3>
                  <p className="text-cosmic-silver italic font-playfair">Select a focus area for your comprehensive study.</p>
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

              {/* TESTIMONIALS SECTION */}
              <section id="testimonials" className="px-6 max-w-7xl mx-auto py-20 relative">
                <div className="text-center mb-20 space-y-4">
                  <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">Echoes from the <span className="text-cosmic-gold">Souls</span></h3>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
                  <p className="text-cosmic-silver italic font-playfair">Voices of those who walked the path before you.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="bg-cosmic-800/10 backdrop-blur-sm border border-cosmic-gold/10 p-10 rounded-[3rem] space-y-6 relative group hover:border-cosmic-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cosmic-gold/5">
                      <Quote className="absolute top-8 right-10 w-12 h-12 text-cosmic-gold/5 group-hover:text-cosmic-gold/10 transition-colors" />
                      
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className="w-3 h-3 text-cosmic-gold fill-cosmic-gold" />
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-cinzel text-lg tracking-widest uppercase">"{t.quote}"</h4>
                        <p className="text-cosmic-silver/80 font-light text-sm leading-relaxed italic">
                          {t.text}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-cosmic-gold/10">
                        <span className="block text-white font-cinzel text-xs tracking-[0.2em] uppercase">{t.author}</span>
                        <span className="block text-cosmic-silver/40 text-[10px] uppercase tracking-widest mt-1">{t.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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
                <ShieldCheck 
                  onClick={handleBypass}
                  className="w-16 h-16 text-cosmic-gold mx-auto mb-6 cursor-pointer hover:scale-110 active:scale-95 transition-all" 
                />
                <h2 className="text-3xl font-cinzel text-white mb-4">Secure Gateway</h2>
                <p className="text-cosmic-silver mb-8 italic">Your study in {currentRequest?.language} is formatted and ready for the matrix. Fee: €10.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleProceedToStripe} 
                    className="w-full py-5 bg-white text-cosmic-900 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Pay via Stripe <ExternalLink className="w-5 h-5" />
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

          {view === 'privacy' && (
            <div className="py-20 px-6">
              <PrivacyPolicy onBack={resetToHome} />
            </div>
          )}

          {view === 'news' && (
            <div className="py-10 md:py-20">
              <NewsPage />
            </div>
          )}

          {view === 'admin' && (
            <div className="py-20">
              <AdminPanel />
            </div>
          )}
        </main>

        <footer className="border-t border-cosmic-700/50 py-20 bg-cosmic-900 px-6 text-center no-print">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="text-cosmic-gold w-8 h-8" />
                <span className="text-3xl font-cinzel text-white uppercase tracking-widest">Atlantic Oracle</span>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <a 
                  href="https://www.facebook.com/atlanticoracle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cosmic-silver/60 hover:text-cosmic-gold transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://t.me/+HdwxIRpFv3xkM2M0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cosmic-silver/60 hover:text-cosmic-gold transition-all hover:scale-110"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5" />
                </a>
                <a 
                  href="https://whatsapp.com/channel/0029Vb7qaTg11ulKGsQXZq2g" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cosmic-silver/60 hover:text-cosmic-gold transition-all hover:scale-110"
                  aria-label="Whatsapp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              
              <div className="space-y-3 pt-4">
                 <a 
                   href="mailto:oracle@atlanticoracle.com" 
                   className="flex items-center justify-center gap-3 text-cosmic-gold hover:text-white transition-all group"
                 >
                   <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   <span className="text-sm font-bold tracking-[0.2em] uppercase">oracle@atlanticoracle.com</span>
                 </a>
                 <div className="flex flex-col gap-2">
                    <p className="text-cosmic-silver/40 text-[9px] uppercase tracking-[0.3em] font-medium">Contact • Suggestions • Support</p>
                    <p className="text-cosmic-silver/40 text-[9px] uppercase tracking-[0.2em] font-medium">R. Dom Martinho Castelo Branco 12 14, 8500-782 Portimão, Portugal</p>
                    <button 
                      onClick={() => setView('privacy')} 
                      className="text-cosmic-silver/60 hover:text-cosmic-gold transition-colors text-[9px] uppercase tracking-[0.3em] underline underline-offset-4 decoration-cosmic-gold/30"
                    >
                      Privacy Policy
                    </button>
                 </div>
              </div>
            </div>

            <p 
              onClick={() => setView('admin')}
              className="text-cosmic-silver text-[10px] max-w-xl mx-auto leading-loose opacity-60 uppercase tracking-[0.4em] pt-8 cursor-default hover:text-cosmic-gold transition-colors"
            >
              ATLANTICORACLE.COM © 2026. THE SECRET LANGUAGE OF SPACE AND NUMBERS.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;