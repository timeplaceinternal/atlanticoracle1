import React, { useState, useEffect } from 'react';
import CosmicBackground from './components/CosmicBackground';
import ReadingForm from './components/ReadingForm';
import LoadingAnimation from './components/LoadingAnimation';
import ReadingResult from './components/ReadingResult';
import PhilosophySection from './components/PhilosophySection';
import HowItWorksSection from './components/HowItWorksSection';
import LatestNewsPreview from './components/LatestNewsPreview';
import PrivacyPolicy from './components/PrivacyPolicy';
import NewsPage from './components/NewsPage';
import AdminPanel from './components/AdminPanel';
import { SERVICES, FREE_SERVICES, getServiceIcon } from './constants';
import { Service, ServiceType, ReadingRequest, ReadingResult as ReadingResultType, ReportLanguage } from './types';
import { generateCosmicReading } from './services/geminiService';
import { Star, ChevronRight, ShieldCheck, ExternalLink, Menu, X, Sparkles, BookOpen, Compass, Mail, Quote, Facebook, Send, MessageCircle, Globe } from 'lucide-react';
import { translations } from '../translations';

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
      const cleanPath = path.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash;
      console.log('Admin check - Path:', cleanPath, 'Params:', params.toString(), 'Hash:', hash);
      
      if (cleanPath.includes('admin162463') || params.get('view') === 'admin' || params.get('admin') === 'true' || hash === '#admin') return 'admin';
      if (cleanPath.includes('/news') || params.get('view') === 'news') return 'news';
      
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
        window.history.pushState({}, '', '/' + url.search);
      } else if (view === 'admin') {
        url.searchParams.set('view', 'admin');
        window.history.pushState({}, '', '/admin162463' + url.search);
      } else if (view === 'news') {
        if (newsSlug) {
          window.history.pushState({}, '', `/news/${newsSlug}`);
        } else {
          window.history.pushState({}, '', '/news');
        }
      } else if (view === 'privacy') {
        window.history.pushState({}, '', '/privacy');
      }
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const path = window.location.pathname;
      const hash = window.location.hash;
      const cleanPath = path.toLowerCase().replace(/\/$/, '');
      
      if (cleanPath.includes('admin162463') || params.get('view') === 'admin' || params.get('admin') === 'true' || hash === '#admin') {
        setView('admin');
      } else if (cleanPath.includes('/news') || params.get('view') === 'news') {
        const match = cleanPath.match(/\/news\/([^/]+)/);
        setNewsSlug(match ? match[1] : null);
        setView('news');
      } else if (params.get('view') === 'privacy' || cleanPath === '/privacy') {
        setView('privacy');
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    (window as any).setAppView = setView;
  }, []);

  const [language, setLanguage] = useState<ReportLanguage>('English');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newsSlug, setNewsSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/\/news\/([^/]+)/);
      return match ? match[1] : null;
    }
    return null;
  });
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

  const t = translations[language];

  const TESTIMONIALS = [
    {
      quote: t.testimonial1Quote,
      text: t.testimonial1Text,
      author: "Jordan K.",
      location: "NYC"
    },
    {
      quote: t.testimonial2Quote,
      text: t.testimonial2Text,
      author: "Amelia W.",
      location: "London"
    },
    {
      quote: t.testimonial3Quote,
      text: t.testimonial3Text,
      author: "Ivan P.",
      location: "Prague"
    }
  ];

  const resetToHome = () => {
    setView('home');
    setSelectedService(null);
    setCurrentRequest(null);
    setResult(null);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Ensure we are at the root path
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
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

            <div className="hidden md:flex gap-6 items-center text-[10px] font-bold text-cosmic-silver uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-cosmic-800/80 border border-cosmic-gold/30 rounded-full mr-2 hover:border-cosmic-gold transition-colors">
                <Globe className="w-3.5 h-3.5 text-cosmic-gold" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as ReportLanguage)}
                  className="bg-transparent text-cosmic-gold outline-none cursor-pointer font-bold"
                >
                  <option value="English" className="bg-cosmic-900">EN</option>
                  <option value="Portuguese" className="bg-cosmic-900">PT</option>
                </select>
              </div>
              <button 
                onClick={() => setView('news')} 
                className="hover:text-cosmic-gold transition-colors uppercase"
                aria-label="View Cosmic News"
              >
                {t.navNews}
              </button>
              <button 
                onClick={() => scrollToSection('philosophy')} 
                className="hover:text-cosmic-gold transition-colors uppercase"
                aria-label="Read our Philosophy"
              >
                {t.navPhilosophy}
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="hover:text-cosmic-gold transition-colors uppercase"
                aria-label="How it Works"
              >
                {t.navHowItWorks}
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="px-6 py-2 border border-cosmic-gold text-cosmic-gold rounded-full hover:bg-cosmic-gold hover:text-cosmic-900 transition-all font-cinzel tracking-[0.2em] shadow-[0_0_15px_rgba(212,175,55,0.1)] active:scale-95 uppercase"
                aria-label="Oracle Consult"
              >
                {t.navConsult}
              </button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cosmic-800/80 border border-cosmic-gold/30 rounded-full shadow-lg">
                <Globe className="w-3.5 h-3.5 text-cosmic-gold" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as ReportLanguage)}
                  className="bg-transparent text-cosmic-gold outline-none cursor-pointer text-[10px] font-bold"
                >
                  <option value="English" className="bg-cosmic-900">EN</option>
                  <option value="Portuguese" className="bg-cosmic-900">PT</option>
                </select>
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-cosmic-gold p-2 hover:bg-cosmic-gold/10 rounded-lg transition-colors border border-cosmic-gold/10"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          <div className={`md:hidden absolute top-20 left-0 right-0 bg-cosmic-900/95 backdrop-blur-2xl border-b border-cosmic-gold/10 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col p-8 gap-6 text-center text-sm font-bold text-cosmic-silver uppercase tracking-[0.2em]">
              <div className="flex items-center justify-center gap-3 border-b border-cosmic-gold/10 pb-6 mb-2">
                <Globe className="w-4 h-4 text-cosmic-gold" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as ReportLanguage)}
                  className="bg-transparent text-cosmic-gold outline-none cursor-pointer"
                >
                  <option value="English" className="bg-cosmic-900">English (EN)</option>
                  <option value="Portuguese" className="bg-cosmic-900">Português (PT-BR)</option>
                </select>
              </div>
              <button onClick={() => { setView('news'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">{t.navNews}</button>
              <button onClick={() => { scrollToSection('philosophy'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">{t.navPhilosophy}</button>
              <button onClick={() => { scrollToSection('how-it-works'); setIsMenuOpen(false); }} className="py-2 hover:text-cosmic-gold">{t.navHowItWorks}</button>
              <button onClick={() => { scrollToSection('services'); setIsMenuOpen(false); }} className="mt-4 px-6 py-4 bg-cosmic-gold text-cosmic-900 rounded-full font-cinzel">{t.navConsult}</button>
            </div>
          </div>
        </header>

        <main className="container mx-auto pt-20">
          {view === 'loading' && <LoadingAnimation language={language} />}

          {view === 'home' && (
            <div className="space-y-32 py-20">
              {/* HERO SECTION */}
              <section className="text-center max-w-5xl mx-auto px-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000 pt-20">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">{t.heroBadge}</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-cinzel text-white leading-[1.1]">{t.heroTitle}</h1>
                <p className="text-lg md:text-2xl text-cosmic-silver font-light max-w-3xl mx-auto italic font-playfair text-lg md:text-2xl">"{t.heroSubtitle}"</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                  <button onClick={() => scrollToSection('services')} className="w-full sm:w-auto px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/20 hover:scale-105 transition-transform active:scale-95">{t.heroCTA}</button>
                  <button onClick={() => scrollToSection('free-insights')} className="w-full sm:w-auto px-10 py-5 bg-transparent border border-cosmic-gold/30 text-cosmic-gold font-bold rounded-full hover:bg-cosmic-gold/5 transition-all">{t.heroFreeCTA}</button>
                </div>
              </section>

              {/* FREE INSIGHTS SECTION */}
              <section id="free-insights" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="text-center mb-16 space-y-4">
                  <div className="inline-block px-4 py-1 bg-cosmic-gold text-cosmic-900 font-bold text-[9px] uppercase tracking-[0.3em] rounded mb-2">Essential Access</div>
                  <h3 className="text-3xl font-cinzel text-white uppercase tracking-[0.2em]">{t.freeInsightsTitle}</h3>
                  <p className="text-cosmic-silver italic font-playfair text-sm">{t.freeInsightsSubtitle}</p>
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
                  <h2 className="text-3xl md:text-4xl font-cinzel text-white uppercase tracking-widest">{t.philosophyTitle}</h2>
                  <p className="text-lg md:text-xl text-cosmic-silver leading-relaxed font-light">
                    {t.philosophyText}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <BookOpen className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featureReports}</h4>
                    <p className="text-xs text-cosmic-silver/70">{t.featureReportsDesc}</p>
                  </div>
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <Compass className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featureMethodology}</h4>
                    <p className="text-xs text-cosmic-silver/70">{t.featureMethodologyDesc}</p>
                  </div>
                  <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10">
                    <ShieldCheck className="w-6 h-6 text-cosmic-gold mx-auto mb-4" />
                    <h4 className="text-white font-cinzel text-sm uppercase mb-2">{t.featurePrivacy}</h4>
                    <p className="text-xs text-cosmic-silver/70">{t.featurePrivacyDesc}</p>
                  </div>
                </div>
              </section>

              {/* SERVICES SECTION */}
              <section id="services" className="px-6 max-w-7xl mx-auto scroll-mt-32">
                <div className="text-center mb-16 space-y-4">
                  <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">{t.decreesTitle}</h3>
                  <p className="text-cosmic-silver italic font-playfair">{t.decreesSubtitle}</p>
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
              
              <LatestNewsPreview 
              onViewNews={() => setView('news')} 
              onViewPost={(slug) => {
                setNewsSlug(slug);
                setView('news');
              }}
              language={language} 
            />
              
              <PhilosophySection language={language} />
              <HowItWorksSection language={language} />

              {/* TESTIMONIALS SECTION */}
              <section id="testimonials" className="px-6 max-w-7xl mx-auto py-20 relative">
                <div className="text-center mb-20 space-y-4">
                  <h3 className="text-4xl font-cinzel text-white uppercase tracking-[0.2em]">{t.testimonialsTitle}</h3>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
                  <p className="text-cosmic-silver italic font-playfair">{t.testimonialsSubtitle}</p>
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
              <ReadingForm 
                service={selectedService} 
                language={language}
                onBack={resetToHome} 
                onSubmit={handleFormSubmit} 
              />
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
              <NewsPage onBack={resetToHome} language={language} initialSlug={newsSlug} onSlugChange={setNewsSlug} />
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
              <button 
                onClick={resetToHome}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Atlantic Oracle Home"
              >
                <Star className="text-cosmic-gold w-8 h-8" />
                <span className="text-3xl font-cinzel text-white uppercase tracking-widest">Atlantic Oracle</span>
              </button>

              <p className="text-cosmic-silver/60 text-xs italic max-w-xs">
                {t.footerTagline}
              </p>

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
                    <p className="text-cosmic-silver/40 text-[9px] uppercase tracking-[0.3em] font-medium">{t.contactSupport}</p>
                    <p className="text-cosmic-silver/40 text-[9px] uppercase tracking-[0.2em] font-medium">R. Dom Martinho Castelo Branco 12 14, 8500-782 Portimão, Portugal</p>
                    <button 
                      onClick={() => setView('privacy')} 
                      className="text-cosmic-silver/60 hover:text-cosmic-gold transition-colors text-[9px] uppercase tracking-[0.3em] underline underline-offset-4 decoration-cosmic-gold/30"
                    >
                      {t.privacyPolicy}
                    </button>
                 </div>
              </div>
            </div>

            <p className="text-cosmic-silver text-[10px] max-w-xl mx-auto leading-loose opacity-60 uppercase tracking-[0.4em] pt-8 block">
              {t.footerCopyright}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;