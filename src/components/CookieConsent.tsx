import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Settings } from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface CookieConsentProps {
  language: ReportLanguage;
  onOpenSettings: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ language, onOpenSettings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100]"
        >
          <div className="bg-cosmic-800/90 backdrop-blur-2xl border border-cosmic-gold/30 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cosmic-gold to-transparent opacity-50" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cosmic-gold/10 rounded-2xl">
                <Cookie className="w-6 h-6 text-cosmic-gold" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-white font-cinzel text-sm uppercase tracking-widest">{t.cookieConsentTitle}</h3>
                <p className="text-xs text-cosmic-silver/80 leading-relaxed">
                  {t.cookieConsentText}
                </p>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-cosmic-silver/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2 bg-cosmic-gold text-cosmic-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
              >
                {t.cookieAcceptAll}
              </button>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 text-cosmic-gold text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-cosmic-gold/20 transition-colors"
              >
                {t.cookieRejectAll}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 bg-cosmic-800 border border-cosmic-gold/10 text-cosmic-silver rounded-xl hover:text-cosmic-gold transition-colors"
                title={t.cookieSettings}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
