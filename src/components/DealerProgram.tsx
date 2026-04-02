import React from 'react';
import { TrendingUp, ArrowLeft, Send, MessageCircle, Users, ShieldCheck } from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface DealerProgramProps {
  language: ReportLanguage;
  onBack: () => void;
}

const DealerProgram: React.FC<DealerProgramProps> = ({ language, onBack }) => {
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.formBack}</span>
      </button>

      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
          <TrendingUp className="w-4 h-4 text-cosmic-gold" />
          <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">
            {language === 'Portuguese' ? 'Parceria Ganha-Ganha' : 'Win-Win Partnership'}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-cinzel text-white uppercase tracking-widest">
          {language === 'Portuguese' ? 'Programa de Revendedores' : 'Dealer Program'}
        </h1>
        <p className="text-cosmic-silver text-lg md:text-xl font-light italic font-playfair max-w-2xl mx-auto">
          {language === 'Portuguese' 
            ? 'Monetize seu público compartilhando a sabedoria das estrelas e dos números.' 
            : 'Monetize your audience by sharing the wisdom of the stars and numbers.'}
        </p>

        {/* Quick Contact Bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-cosmic-gold/60 uppercase tracking-[0.2em]">
              {t.dealerContactTitle}
            </span>
          </div>
          <a 
            href="https://wa.me/351926160750" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-all hover:scale-105"
          >
            <div className="w-8 h-8 bg-[#25D366]/10 rounded-full flex items-center justify-center border border-[#25D366]/20">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.dealerContactWhatsApp}</span>
          </a>
          <a 
            href="https://t.me/+351926160750" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cosmic-silver hover:text-cosmic-gold transition-all hover:scale-105"
          >
            <div className="w-8 h-8 bg-[#24A1DE]/10 rounded-full flex items-center justify-center border border-[#24A1DE]/20">
              <Send className="w-4 h-4 text-[#24A1DE]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.dealerContactTelegram}</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-cosmic-800/20 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
          <Users className="w-8 h-8 text-cosmic-gold" />
          <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">
            {language === 'Portuguese' ? 'Público Alvo' : 'Target Audience'}
          </h3>
          <p className="text-xs text-cosmic-silver/70 leading-relaxed">
            {language === 'Portuguese' 
              ? 'Ideal para canais de astrologia, espiritualidade, autoconhecimento e bem-estar.' 
              : 'Perfect for channels focused on astrology, spirituality, self-knowledge, and wellness.'}
          </p>
        </div>
        <div className="p-8 bg-cosmic-800/20 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
          <TrendingUp className="w-8 h-8 text-cosmic-gold" />
          <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">
            {language === 'Portuguese' ? 'Alta Conversão' : 'High Conversion'}
          </h3>
          <p className="text-xs text-cosmic-silver/70 leading-relaxed">
            {language === 'Portuguese' 
              ? 'Nossos relatórios de 3 a 15 páginas oferecem valor real, resultando em altas taxas de конверсия.' 
              : 'Our 3-15 page reports offer real value, resulting in high conversion rates.'}
          </p>
        </div>
        <div className="p-8 bg-cosmic-800/20 border border-cosmic-gold/10 rounded-[2rem] space-y-4">
          <ShieldCheck className="w-8 h-8 text-cosmic-gold" />
          <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">
            {language === 'Portuguese' ? 'Transparência' : 'Transparency'}
          </h3>
          <p className="text-xs text-cosmic-silver/70 leading-relaxed">
            {language === 'Portuguese' 
              ? 'Acompanhamento claro de vendas e pagamentos semanais via Stripe.' 
              : 'Clear tracking of sales and weekly payouts via Stripe.'}
          </p>
        </div>
      </div>

      <div className="text-center text-[10px] text-cosmic-silver/40 uppercase tracking-[0.2em] max-w-lg mx-auto">
        {language === 'Portuguese' 
          ? 'Entre em contato para discutir os termos da parceria.' 
          : 'Contact us to discuss partnership terms.'}
      </div>
    </div>
  );
};

export default DealerProgram;
