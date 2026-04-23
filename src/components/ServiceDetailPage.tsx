
import React from 'react';
import { Service, ReportLanguage } from '../types';
import { getServiceIcon } from '../constants';
import { ChevronLeft, Compass, ShieldCheck, Zap, Star } from 'lucide-react';
import { translations } from '../translations';

interface ServiceDetailPageProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onStart: (service: Service) => void;
  isWidget?: boolean;
  theme?: 'dark' | 'light';
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ 
  service, 
  language, 
  onBack, 
  onStart,
  isWidget,
  theme = 'dark'
}) => {
  const t = translations[language];

  // Schema.org Structured Data
  React.useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "Organization",
        "name": "Atlantic Oracle"
      },
      "offers": {
        "@type": "Offer",
        "price": service.price,
        "priceCurrency": "EUR"
      },
      "category": "Astrology & Numerology Analysis"
    };

    // Breadcrumb Schema
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Services",
          "item": `https://atlanticoracle.com/#services`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": service.title,
          "item": `https://atlanticoracle.com/services/${service.slug}`
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-schema';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    const bScript = document.createElement('script');
    bScript.type = 'application/ld+json';
    bScript.id = 'breadcrumb-schema';
    bScript.text = JSON.stringify(breadcrumbData);
    document.head.appendChild(bScript);

    // Update Meta Title & Description for SEO
    const originalTitle = document.title;
    const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    document.title = `${service.title} - Atlantic Oracle™`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', service.description);
    
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(bScript);
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
    };
  }, [service]);

  return (
    <div className={`max-w-4xl mx-auto ${isWidget ? 'px-2 py-4' : 'px-6 py-12'} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
      {!isWidget && (
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 ${theme === 'light' ? 'text-slate-500 hover:text-cosmic-gold' : 'text-cosmic-silver hover:text-cosmic-gold'} transition-colors mb-12 group`}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">{t.s_back_to_start}</span>
        </button>
      )}

      <div className={`${isWidget ? 'bg-transparent border-none shadow-none' : theme === 'light' ? 'bg-white border border-cosmic-gold/20 rounded-[3rem] shadow-xl' : 'bg-cosmic-800/20 backdrop-blur-2xl border border-cosmic-gold/20 rounded-[3rem] shadow-2xl'} overflow-hidden`}>
        <div className={`${isWidget ? 'p-4' : 'p-8 md:p-16'} space-y-12`}>
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className={`w-24 h-24 ${theme === 'light' ? 'bg-cosmic-gold/5 border-cosmic-gold/20' : 'bg-cosmic-gold/10 border-cosmic-gold/20'} rounded-3xl flex items-center justify-center border shadow-inner`}>
              {getServiceIcon(service.icon)}
            </div>
            <div className="flex-1 space-y-2">
              <h1 className={`text-4xl md:text-5xl font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} leading-tight`}>
                {service.title}
              </h1>
              <div className="inline-block px-4 py-1 bg-cosmic-gold text-cosmic-900 font-bold text-[10px] uppercase tracking-[0.3em] rounded-full">
                €{service.price} {t.s_decree}
              </div>
            </div>
          </div>

          <div className={`w-full h-px bg-gradient-to-r from-transparent ${theme === 'light' ? 'via-cosmic-gold/50' : 'via-cosmic-gold/30'} to-transparent`}></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`space-y-4 p-6 border ${theme === 'light' ? 'border-cosmic-gold/20 bg-slate-50/50' : 'border-cosmic-gold/10 bg-cosmic-900/40'} rounded-2xl`}>
              <Compass className="w-6 h-6 text-cosmic-gold" />
              <h3 className={`font-cinzel text-xs uppercase tracking-widest ${theme === 'light' ? 'text-cosmic-900' : 'text-white'}`}>{t.s_arch_path}</h3>
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-cosmic-silver/70'} text-xs leading-relaxed`}>
                {t.s_arch_path_desc}
              </p>
            </div>
            <div className={`space-y-4 p-6 border ${theme === 'light' ? 'border-cosmic-gold/20 bg-slate-50/50' : 'border-cosmic-gold/10 bg-cosmic-900/40'} rounded-2xl`}>
              <ShieldCheck className="w-6 h-6 text-cosmic-gold" />
              <h3 className={`font-cinzel text-xs uppercase tracking-widest ${theme === 'light' ? 'text-cosmic-900' : 'text-white'}`}>{t.s_privacy}</h3>
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-cosmic-silver/70'} text-xs leading-relaxed`}>
                {t.s_privacy_desc}
              </p>
            </div>
            <div className={`space-y-4 p-6 border ${theme === 'light' ? 'border-cosmic-gold/20 bg-slate-50/50' : 'border-cosmic-gold/10 bg-cosmic-900/40'} rounded-2xl`}>
              <Zap className="w-6 h-6 text-cosmic-gold" />
              <h3 className={`font-cinzel text-xs uppercase tracking-widest ${theme === 'light' ? 'text-cosmic-900' : 'text-white'}`}>{t.s_instant}</h3>
              <p className={`${theme === 'light' ? 'text-slate-600' : 'text-cosmic-silver/70'} text-xs leading-relaxed`}>
                {t.s_instant_desc}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className={`text-2xl font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} uppercase tracking-widest flex items-center gap-3`}>
              <Star className="w-5 h-5 text-cosmic-gold fill-current" />
              {t.s_oracle_synthesis}
            </h2>
            <div className={`prose ${theme === 'light' ? 'prose-slate' : 'prose-invert'} prose-p:text-lg`}>
              <p className="first-letter:text-5xl first-letter:font-cinzel first-letter:text-cosmic-gold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {service.seoContent || service.description}
              </p>
              
              {/* Additional generic text to reach 300+ words if seoContent is short */}
              {!service.seoContent && (
                <>
                  <p>
                    {t.s_philosophy_1}
                  </p>
                  <p>
                    {t.s_philosophy_2}
                  </p>
                </>
              )}
              
              {/* Some additional depth text for all services */}
              <p>
                {t.s_ritual_desc}
              </p>
              <p>
                {t.s_report_delivery}
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center gap-6">
            <button 
              onClick={() => onStart(service)}
              className="w-full md:w-auto px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full shadow-2xl shadow-cosmic-gold/30 hover:scale-105 transition-transform active:scale-95 text-sm uppercase tracking-[0.2em]"
            >
              {t.s_start_consultation}
            </button>
            <p className={`text-[10px] ${theme === 'light' ? 'text-slate-400' : 'text-cosmic-silver/40'} uppercase tracking-[0.3em]`}>
              {t.s_fee_wisdom}: €{service.price} • {t.s_prof_synthesis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
