import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Send, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Target, 
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  BarChart3,
  Smartphone,
  Users,
  FileText
} from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface DealerProgramProps {
  language: ReportLanguage;
  setLanguage: (lang: ReportLanguage) => void;
  onBack: () => void;
}

const DealerProgram: React.FC<DealerProgramProps> = ({ language, setLanguage, onBack }) => {
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState<number | null>(null);

  const nextSlide = () => {
    if (currentSlide !== null && currentSlide < 10) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide !== null && currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const closeDeck = () => setCurrentSlide(null);

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
            <div className="w-24 h-24 bg-cosmic-gold/10 rounded-full flex items-center justify-center border border-cosmic-gold/20 animate-pulse">
              <TrendingUp className="w-12 h-12 text-cosmic-gold" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-cinzel text-white uppercase tracking-widest leading-tight">
                {t.pitchSlide1Title}
              </h1>
              <p className="text-cosmic-silver text-xl font-light italic font-playfair max-w-2xl mx-auto">
                {t.pitchSlide1Subtitle}
              </p>
            </div>
            <div className="relative w-64 h-64 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-cosmic-gold/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 border border-cosmic-gold/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 border border-cosmic-gold/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">02. {t.pitchSlide2Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide2Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[t.pitchSlide2Point1, t.pitchSlide2Point2, t.pitchSlide2Point3].map((point, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-cosmic-silver text-lg font-light leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BarChart3 className="w-24 h-24 text-cosmic-gold" />
                </div>
                <p className="text-xl text-white font-playfair italic leading-relaxed relative z-10">
                  "{t.pitchSlide2Message}"
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">03. {t.pitchSlide3Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide3Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-xl text-cosmic-silver font-light leading-relaxed">
                  {t.pitchSlide3Desc}
                </p>
                <div className="space-y-4 pt-4">
                  {[t.pitchSlide3Feature1, t.pitchSlide3Feature2, t.pitchSlide3Feature3].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-cosmic-gold/20 flex items-center justify-center shrink-0">
                        <Zap className="w-3 h-3 text-cosmic-gold" />
                      </div>
                      <span className="text-white font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-64 h-64 bg-cosmic-gold/5 rounded-full border border-cosmic-gold/10 flex items-center justify-center">
                  <Smartphone className="w-32 h-32 text-cosmic-gold/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border border-cosmic-gold/20 rounded-full animate-ping opacity-20" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">04. {t.pitchSlide4Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide4Title}</h2>
            </div>
            <div className="space-y-8">
              <p className="text-xl text-cosmic-silver font-light leading-relaxed max-w-3xl">
                {t.pitchSlide4Desc}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-2xl space-y-4">
                  <div className="w-10 h-10 bg-cosmic-gold/10 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cosmic-gold" />
                  </div>
                  <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">Premium</h3>
                  <p className="text-cosmic-silver">{t.pitchSlide4Premium}</p>
                </div>
                <div className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-2xl space-y-4">
                  <div className="w-10 h-10 bg-cosmic-gold/10 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cosmic-gold" />
                  </div>
                  <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">Standard</h3>
                  <p className="text-cosmic-silver">{t.pitchSlide4Standard}</p>
                </div>
                <div className="md:col-span-2 p-6 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-cosmic-gold/10 rounded-full flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-cosmic-gold" />
                  </div>
                  <p className="text-white font-light italic">{t.pitchSlide4Free}</p>
                </div>
              </div>
              <div className="p-6 bg-cosmic-gold/5 border-l-2 border-cosmic-gold rounded-r-xl">
                <p className="text-cosmic-gold font-medium italic">
                  {t.pitchSlide4Accent}
                </p>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">05. {t.pitchSlide5Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide5Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
                <div className="w-12 h-12 bg-cosmic-gold/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-cosmic-gold" />
                </div>
                <h3 className="text-white font-cinzel text-lg uppercase tracking-widest">{t.pitchSlide5ClientTitle}</h3>
                <p className="text-cosmic-silver leading-relaxed">{t.pitchSlide5Client}</p>
              </div>
              <div className="p-8 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
                <div className="w-12 h-12 bg-cosmic-gold/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-cosmic-gold" />
                </div>
                <h3 className="text-white font-cinzel text-lg uppercase tracking-widest">{t.pitchSlide5PartnerTitle}</h3>
                <p className="text-cosmic-silver leading-relaxed">{t.pitchSlide5Partner}</p>
              </div>
              <div className="md:col-span-2 p-8 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-[2rem] text-center">
                <p className="text-2xl text-white font-cinzel uppercase tracking-widest">
                  {t.pitchSlide5Result}
                </p>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">06. {t.pitchSlide6Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide6Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-xl text-cosmic-silver font-light italic">{t.pitchSlide6Text1}</p>
                <div className="space-y-4">
                  {[t.pitchSlide6Text2, t.pitchSlide6Text3, t.pitchSlide6Text4].map((text, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <ShieldCheck className="w-5 h-5 text-cosmic-gold shrink-0" />
                      <span className="text-white font-light">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="p-8 bg-white rounded-2xl">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-12" referrerPolicy="no-referrer" />
                </div>
                <div className="flex items-center gap-4 px-6 py-4 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-cosmic-gold" />
                  <span className="text-white font-cinzel uppercase tracking-widest text-sm">{t.pitchSlide6Visual}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">07. {t.pitchSlide7Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide7Title}</h2>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-cosmic-gold" />
                    <h3 className="text-white font-cinzel text-lg uppercase tracking-widest">EN</h3>
                  </div>
                  <p className="text-cosmic-silver leading-relaxed">{t.pitchSlide7En}</p>
                </div>
                <div className="p-8 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-cosmic-gold" />
                    <h3 className="text-white font-cinzel text-lg uppercase tracking-widest">PT-BR</h3>
                  </div>
                  <p className="text-cosmic-silver leading-relaxed">{t.pitchSlide7Pt}</p>
                </div>
              </div>
              <div className="text-center pt-8">
                <p className="text-2xl text-white font-playfair italic">
                  "{t.pitchSlide7Message}"
                </p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">08. {t.pitchSlide8Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide8Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <p className="text-xl text-cosmic-silver font-light leading-relaxed">
                {t.pitchSlide8Text}
              </p>
              <div className="relative">
                <div className="aspect-square bg-cosmic-gold/5 border border-cosmic-gold/20 rounded-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <span className="text-6xl font-cinzel text-cosmic-gold">+40%</span>
                    <p className="text-[10px] text-cosmic-silver uppercase tracking-widest">Growth in 2 years</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-cosmic-gold/10 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="flex flex-col h-full space-y-12 p-8 md:p-16">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">09. {t.pitchSlide9Badge}</span>
              <h2 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-widest">{t.pitchSlide9Title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, text: t.pitchSlide9Step1 },
                { icon: MessageCircle, text: t.pitchSlide9Step2 },
                { icon: DollarSign, text: t.pitchSlide9Step3 },
                { icon: FileText, text: t.pitchSlide9Step4 }
              ].map((step, i) => (
                <div key={i} className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-[2rem] space-y-6 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-cosmic-gold text-cosmic-900 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div className="w-16 h-16 bg-cosmic-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-cosmic-gold" />
                  </div>
                  <p className="text-white font-light leading-relaxed text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 p-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">10. {t.pitchSlide10Badge}</span>
              <h2 className="text-4xl md:text-6xl font-cinzel text-white uppercase tracking-widest leading-tight">
                {t.pitchSlide10Title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <a href="https://t.me/+351926160750" target="_blank" rel="noopener noreferrer" className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-2xl flex flex-col items-center gap-4 hover:bg-cosmic-gold/5 transition-colors">
                <Send className="w-8 h-8 text-[#24A1DE]" />
                <span className="text-white font-cinzel text-xs uppercase tracking-widest">Telegram</span>
              </a>
              <a href="mailto:timeplace.internal@gmail.com" className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-2xl flex flex-col items-center gap-4 hover:bg-cosmic-gold/5 transition-colors">
                <Mail className="w-8 h-8 text-cosmic-gold" />
                <span className="text-white font-cinzel text-xs uppercase tracking-widest">Email</span>
              </a>
              <a href="https://wa.me/351926160750" target="_blank" rel="noopener noreferrer" className="p-6 bg-cosmic-800/30 border border-cosmic-gold/10 rounded-2xl flex flex-col items-center gap-4 hover:bg-cosmic-gold/5 transition-colors">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
                <span className="text-white font-cinzel text-xs uppercase tracking-widest">WhatsApp</span>
              </a>
            </div>

            <div className="space-y-6">
              <p className="text-cosmic-silver text-xl font-light italic font-playfair max-w-2xl mx-auto">
                {t.pitchSlide10CTA}
              </p>
              <button 
                onClick={closeDeck}
                className="px-8 py-4 bg-cosmic-gold text-cosmic-900 font-cinzel text-sm uppercase tracking-widest rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95"
              >
                {t.backToStart}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentSlide === null) {
    return (
      <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[70vh] flex flex-col justify-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.formBack}</span>
        </button>

        <div className="text-center space-y-12 py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
              <TrendingUp className="w-4 h-4 text-cosmic-gold" />
              <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">
                {t.pitchWinWin}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 p-1 bg-cosmic-800/50 border border-cosmic-gold/10 rounded-full backdrop-blur-sm">
              {[
                { code: 'English', label: 'EN' },
                { code: 'Russian', label: 'RU' },
                { code: 'Spanish', label: 'ES' },
                { code: 'Portuguese', label: 'PT' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as ReportLanguage)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                    language === lang.code 
                      ? 'bg-cosmic-gold text-cosmic-900' 
                      : 'text-cosmic-silver hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-7xl font-cinzel text-white uppercase tracking-widest leading-tight">
              {t.pitchDealerProgram}
            </h1>
            <p className="text-cosmic-silver text-xl md:text-2xl font-light italic font-playfair max-w-2xl mx-auto">
              {t.pitchDealerSubtitle}
            </p>
          </div>

          <button 
            onClick={() => setCurrentSlide(1)}
            className="group relative px-12 py-6 bg-cosmic-gold text-cosmic-900 font-cinzel text-lg uppercase tracking-widest rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              {t.pitchButton}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 opacity-60">
            <a href="https://wa.me/351926160750" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-all">
              <MessageCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.dealerContactWhatsApp}</span>
            </a>
            <a href="https://t.me/+351926160750" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-all">
              <Send className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.dealerContactTelegram}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-cosmic-900 flex flex-col overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-gold/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-cosmic-gold/10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-cosmic-gold/10 rounded-full flex items-center justify-center border border-cosmic-gold/20">
            <TrendingUp className="w-4 h-4 text-cosmic-gold" />
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Atlantic Oracle Pitch Deck</span>
        </div>
        <button 
          onClick={closeDeck}
          className="p-2 text-cosmic-silver hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full max-w-6xl mx-auto w-full"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Navigation */}
      <div className="relative z-10 p-6 border-t border-cosmic-gold/10 flex items-center justify-between bg-cosmic-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i + 1)}
              className={`h-1 transition-all duration-300 rounded-full ${
                currentSlide === i + 1 ? 'w-8 bg-cosmic-gold' : 'w-2 bg-cosmic-gold/20 hover:bg-cosmic-gold/40'
              }`}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-3 bg-cosmic-800/50 border border-cosmic-gold/10 rounded-full text-cosmic-silver hover:text-cosmic-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === 10}
            className="p-3 bg-cosmic-gold text-cosmic-900 rounded-full hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealerProgram;
