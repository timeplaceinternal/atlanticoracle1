
import React from 'react';
import { 
  Map, 
  UserPlus, 
  CreditCard, 
  ScrollText, 
  Brain, 
  Infinity, 
  Compass, 
  Gift,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';
import { translations } from '../translations';
import { ReportLanguage } from '../types';

interface HowItWorksSectionProps {
  language: ReportLanguage;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section id="how-it-works" className="relative py-32 px-6 overflow-hidden bg-cosmic-900/50">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cosmic-purple/5 rounded-full blur-[140px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cosmic-gold/5 rounded-full blur-[140px] -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Main Header */}
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-4xl md:text-6xl font-cinzel text-white tracking-widest uppercase">
            {t.howItWorksTitle} <span className="text-cosmic-gold">—</span> <span className="italic font-playfair lowercase font-normal">{language === 'Portuguese' ? "E por que ressoa" : "And Why It Resonates"}</span>
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto"></div>
          <p className="text-xl md:text-2xl text-cosmic-silver font-light max-w-4xl mx-auto leading-relaxed">
            {language === 'Portuguese' ? "Na " : "At "} <span className="text-cosmic-gold font-medium">Atlantic Oracle</span>, {language === 'Portuguese' ? "combinamos sistemas simbólicos antigos com tecnologia moderna para criar experiências reflexivas significativas." : "we blend ancient symbolic systems with modern technology to create meaningful, reflective experiences."}
          </p>
        </div>

        {/* Steps Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-700 to-transparent -translate-y-12"></div>

          {/* Step 1 */}
          <div className="group relative p-8 bg-cosmic-800/20 backdrop-blur-md border border-cosmic-700/50 rounded-[2.5rem] hover:border-cosmic-gold transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-16 h-16 bg-cosmic-700/30 rounded-2xl flex items-center justify-center mb-8 border border-cosmic-600 group-hover:bg-cosmic-gold group-hover:text-cosmic-900 transition-all shadow-lg">
              <Map className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-cinzel text-white mb-4 tracking-wider uppercase">1. {language === 'Portuguese' ? "Escolha sua Jornada" : "Choose Your Journey"}</h3>
            <p className="text-sm text-cosmic-silver leading-relaxed font-light">
              {language === 'Portuguese' ? "Selecione entre nossos serviços: Horóscopo da Alma, Harmonia da União, Carreira e Finanças, Chave para Si Mesmo ou previsões globais para países e a UE (2026–2030). Cada um é uma exploração focada e única ao preço de " : "Select from our services: Soul Horoscope, Union Harmony, Career & Finances, Key to Yourself, or global forecasts for countries and the EU (2026–2030). Each is a focused, one-time exploration priced at "} <strong>€10</strong> {language === 'Portuguese' ? "— simples, transparente, sem compromissos recorrentes." : "— simple, transparent, no recurring commitments."}
            </p>
          </div>

          {/* Step 2 */}
          <div className="group relative p-8 bg-cosmic-800/20 backdrop-blur-md border border-cosmic-700/50 rounded-[2.5rem] hover:border-cosmic-gold transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-16 h-16 bg-cosmic-700/30 rounded-2xl flex items-center justify-center mb-8 border border-cosmic-600 group-hover:bg-cosmic-gold group-hover:text-cosmic-900 transition-all shadow-lg">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-cinzel text-white mb-4 tracking-wider uppercase">2. {language === 'Portuguese' ? "Coordenadas Pessoais" : "Personal Coordinates"}</h3>
            <p className="text-sm text-cosmic-silver leading-relaxed font-light">
              {language === 'Portuguese' ? "Insira detalhes mínimos e relevantes: seu nome (para vibrações numerológicas), data de nascimento (essencial para ambos os sistemas) e hora/local opcionais para maior profundidade. Não é necessário login — seus dados permanecem privados e são excluídos após a sessão." : "Enter minimal, relevant details: Your name (for numerological vibrations), birth date (core for both systems), and optional time/place for added depth. No login required — your data remains private and is deleted after your session."}
            </p>
          </div>

          {/* Step 3 */}
          <div className="group relative p-8 bg-cosmic-800/20 backdrop-blur-md border border-cosmic-700/50 rounded-[2.5rem] hover:border-cosmic-gold transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-16 h-16 bg-cosmic-700/30 rounded-2xl flex items-center justify-center mb-8 border border-cosmic-600 group-hover:bg-cosmic-gold group-hover:text-cosmic-900 transition-all shadow-lg">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-cinzel text-white mb-4 tracking-wider uppercase">3. {language === 'Portuguese' ? "Pagamento Seguro" : "Secure Payment"}</h3>
            <p className="text-sm text-cosmic-silver leading-relaxed font-light">
              {language === 'Portuguese' ? "Pague €10 através do " : "Pay €10 through "} <strong>Stripe</strong> {language === 'Portuguese' ? "— confiável, criptografado e aceito em toda a Europa. Sua leitura personalizada é acionada instantaneamente após a confirmação." : "— reliable, encrypted, and accepted across Europe. Your personalized reading is triggered instantly upon confirmation."}
            </p>
          </div>

          {/* Step 4 */}
          <div className="group relative p-8 bg-cosmic-800/20 backdrop-blur-md border border-cosmic-700/50 rounded-[2.5rem] hover:border-cosmic-gold transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <div className="w-16 h-16 bg-cosmic-700/30 rounded-2xl flex items-center justify-center mb-8 border border-cosmic-600 group-hover:bg-cosmic-gold group-hover:text-cosmic-900 transition-all shadow-lg">
              <ScrollText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-cinzel text-white mb-4 tracking-wider uppercase">4. {language === 'Portuguese' ? "Receba Insights" : "Receive Insights"}</h3>
            <p className="text-sm text-cosmic-silver leading-relaxed font-light">
              {language === 'Portuguese' ? "Em instantes, você recebe uma leitura estruturada de 800–1400 palavras: uma narrativa calorosa e madura tecida a partir de trânsitos astrológicos precisos e arquétipos numerológicos centrais (Caminho de Vida, Destino, Desejo da Alma)." : "In moments, you receive an 800–1400 word structured reading: a warm, adult-toned narrative woven from precise astrological transits and core numerological archetypes (Life Path, Destiny, Soul Urge)."}
            </p>
          </div>
        </div>

        {/* Why It Resonates Section */}
        <div className="relative rounded-[4rem] overflow-hidden bg-cosmic-800/10 border border-cosmic-700/50 p-12 md:p-24">
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-gold/5 to-transparent pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4">
              <h3 className="text-3xl md:text-5xl font-cinzel text-white uppercase tracking-wider">
                {t.whyItResonatesTitle.split('“')[0]} <span className="italic font-playfair font-normal">“{language === 'Portuguese' ? "Funciona" : "Works"}”</span>
              </h3>
              <p className="text-cosmic-gold/60 font-cinzel text-sm tracking-[0.4em] uppercase">{t.whyItResonatesSubtitle}</p>
            </div>

            <p className="text-lg md:text-xl text-cosmic-silver font-light leading-relaxed text-center px-4 mb-12">
              {t.whyItResonatesIntro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-cinzel tracking-[0.2em] uppercase">
                  <div className="w-10 h-10 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                    <Infinity className="w-4 h-4 text-cosmic-gold" />
                  </div>
                  {t.asAboveTitle}
                </div>
                <p className="text-sm text-cosmic-silver leading-relaxed font-light pl-14">
                  {t.asAboveDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-cinzel tracking-[0.2em] uppercase">
                  <div className="w-10 h-10 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cosmic-gold" />
                  </div>
                  {t.vibrationalTitle}
                </div>
                <p className="text-sm text-cosmic-silver leading-relaxed font-light pl-14">
                  {t.vibrationalDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-cinzel tracking-[0.2em] uppercase">
                  <div className="w-10 h-10 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-cosmic-gold" />
                  </div>
                  {t.synchronicityTitle}
                </div>
                <p className="text-sm text-cosmic-silver leading-relaxed font-light pl-14">
                  {t.synchronicityDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-cinzel tracking-[0.2em] uppercase">
                  <div className="w-10 h-10 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-cosmic-gold" />
                  </div>
                  {t.psychologicalTitle}
                </div>
                <p className="text-sm text-cosmic-silver leading-relaxed font-light pl-14">
                  {t.psychologicalDesc}
                </p>
              </div>
            </div>

            <div className="pt-16 text-center border-t border-cosmic-700/50">
              <p className="text-sm italic text-cosmic-silver/70 max-w-3xl mx-auto leading-relaxed">
                {t.freeWillDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar & Gift Reminder */}
        <div className="mt-32 flex flex-col items-center gap-16 text-center">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full max-w-4xl px-6">
            <div className="flex-1 p-8 bg-cosmic-800/20 border border-cosmic-700/50 rounded-3xl group hover:border-cosmic-gold transition-colors">
              <Gift className="w-8 h-8 text-cosmic-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-white font-cinzel mb-2 tracking-widest uppercase text-sm">{t.saveCherishTitle}</h4>
              <p className="text-xs text-cosmic-silver leading-relaxed font-light">
                {t.saveCherishDesc}
              </p>
            </div>
            <div className="flex-1 p-8 bg-cosmic-800/20 border border-cosmic-700/50 rounded-3xl group hover:border-cosmic-gold transition-colors">
              <ShieldCheck className="w-8 h-8 text-green-500/50 mx-auto mb-4" />
              <h4 className="text-white font-cinzel mb-2 tracking-widest uppercase text-sm">{t.privacySovereigntyTitle}</h4>
              <p className="text-xs text-cosmic-silver leading-relaxed font-light">
                {t.privacySovereigntyDesc}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-2xl font-cinzel text-white tracking-[0.3em] uppercase">{t.readyToListen}</h4>
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 bg-white text-cosmic-900 font-bold rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/5"
            >
              {t.consultSecretLanguage}
            </button>
          </div>
          
          <div className="pt-10 max-w-3xl text-[10px] text-cosmic-silver/40 uppercase tracking-[0.3em] leading-loose">
            {t.finalLegalDisclaimer}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
