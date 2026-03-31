import React, { useState } from 'react';
import { Star, Send, Users, TrendingUp, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface DealerProgramProps {
  language: ReportLanguage;
  onBack: () => void;
}

const DealerProgram: React.FC<DealerProgramProps> = ({ language, onBack }) => {
  const t = translations[language];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    legalName: '',
    channelName: '',
    audience: '',
    email: '',
    messenger: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/dealer-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Dealer registration error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-20 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-cosmic-gold rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cosmic-gold/20">
          <Star className="text-cosmic-900 fill-current w-10 h-10" />
        </div>
        <h2 className="text-4xl font-cinzel text-white uppercase tracking-widest">
          {language === 'Portuguese' ? 'Candidatura Enviada' : 'Application Received'}
        </h2>
        <p className="text-cosmic-silver text-lg italic font-playfair">
          {language === 'Portuguese' 
            ? 'Obrigado pelo seu interesse! Nossa equipe analisará seu perfil e entrará em contato em breve.' 
            : 'Thank you for your interest! Our team will review your profile and contact you shortly.'}
        </p>
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 transition-transform"
        >
          {t.backToStart}
        </button>
      </div>
    );
  }

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
              ? 'Nossos relatórios de 3 a 15 páginas oferecem valor real, resultando em altas taxas de conversão.' 
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

      <div className="bg-cosmic-900/40 backdrop-blur-xl border border-cosmic-gold/20 p-8 md:p-12 rounded-[3rem] shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.2em] ml-4">
                {language === 'Portuguese' ? 'Nome Jurídico / Completo' : 'Legal Name / Full Name'}
              </label>
              <input
                required
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full bg-cosmic-800/50 border border-cosmic-gold/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-cosmic-gold transition-colors"
                placeholder={language === 'Portuguese' ? 'Ex: João Silva ou Empresa Ltda' : 'e.g. John Doe or Company Inc.'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.2em] ml-4">
                {language === 'Portuguese' ? 'E-mail de Contato' : 'Contact Email'}
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-cosmic-800/50 border border-cosmic-gold/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-cosmic-gold transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.2em] ml-4">
              {language === 'Portuguese' ? 'WhatsApp / Telegram' : 'WhatsApp / Telegram'}
            </label>
            <input
              required
              type="text"
              value={formData.messenger}
              onChange={(e) => setFormData({ ...formData, messenger: e.target.value })}
              className="w-full bg-cosmic-800/50 border border-cosmic-gold/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-cosmic-gold transition-colors"
              placeholder={language === 'Portuguese' ? 'Ex: +55 11 99999-9999 или @usuario' : 'e.g. +1 234 567 8900 or @username'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.2em] ml-4">
              {language === 'Portuguese' ? 'Nome do Canal / Plataforma' : 'Channel Name / Platform'}
            </label>
            <input
              required
              type="text"
              value={formData.channelName}
              onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
              className="w-full bg-cosmic-800/50 border border-cosmic-gold/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-cosmic-gold transition-colors"
              placeholder={language === 'Portuguese' ? 'Ex: @astrologia_viva no Instagram' : 'e.g. @cosmic_vibes on YouTube'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.2em] ml-4">
              {language === 'Portuguese' ? 'Descrição do Público' : 'Audience Description'}
            </label>
            <textarea
              required
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="w-full bg-cosmic-800/50 border border-cosmic-gold/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-cosmic-gold transition-colors min-h-[120px] resize-none"
              placeholder={language === 'Portuguese' 
                ? 'Conte-nos um pouco sobre quem te segue e o tamanho da sua audiência.' 
                : 'Tell us a bit about who follows you and your audience size.'}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center italic">{error}</p>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {language === 'Portuguese' ? 'Enviar Candidatura' : 'Submit Application'}
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-[10px] text-cosmic-silver/40 uppercase tracking-[0.2em] max-w-lg mx-auto">
        {language === 'Portuguese' 
          ? 'Ao enviar, você concorda que entraremos em contato para discutir os termos da parceria.' 
          : 'By submitting, you agree that we will contact you to discuss partnership terms.'}
      </div>
    </div>
  );
};

export default DealerProgram;
