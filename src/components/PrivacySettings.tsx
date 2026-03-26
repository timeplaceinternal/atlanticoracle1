import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, Eye, Database, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { ReportLanguage } from '../types';
import { translations } from '../translations';

interface PrivacySettingsProps {
  language: ReportLanguage;
  isOpen: boolean;
  onClose: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ language, isOpen, onClose }) => {
  const t = translations[language];
  const [settings, setSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookie-consent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({
          essential: true,
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false
        });
      } catch (e) {
        console.error('Failed to parse cookie consent', e);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...settings,
      timestamp: Date.now()
    }));
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleExport = () => {
    const data = {
      localStorage: { ...localStorage },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: language
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlantic-oracle-data-export-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete all your local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-cosmic-950/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-cosmic-800/90 backdrop-blur-3xl border border-cosmic-gold/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cosmic-gold/10 rounded-2xl">
                <Shield className="w-8 h-8 text-cosmic-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-cinzel text-white uppercase tracking-widest">{t.privacySettingsTitle}</h2>
                <p className="text-xs text-cosmic-silver/60 italic font-playfair">{t.privacySettingsDesc}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-cosmic-silver/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Essential */}
            <div className="flex items-start gap-4 p-6 bg-cosmic-gold/5 border border-cosmic-gold/10 rounded-3xl">
              <Lock className="w-6 h-6 text-cosmic-gold mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">{t.privacyEssentialCookies}</h4>
                  <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-widest opacity-50">Required</span>
                </div>
                <p className="text-xs text-cosmic-silver/70 leading-relaxed">{t.privacyEssentialDesc}</p>
              </div>
            </div>

            {/* Analytics */}
            <div 
              onClick={() => setSettings(s => ({ ...s, analytics: !s.analytics }))}
              className={`flex items-start gap-4 p-6 border transition-all cursor-pointer rounded-3xl ${
                settings.analytics ? 'bg-cosmic-gold/10 border-cosmic-gold/30' : 'bg-cosmic-800/50 border-cosmic-gold/10 hover:border-cosmic-gold/20'
              }`}
            >
              <Eye className={`w-6 h-6 mt-1 transition-colors ${settings.analytics ? 'text-cosmic-gold' : 'text-cosmic-silver/40'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">{t.privacyAnalyticsCookies}</h4>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.analytics ? 'bg-cosmic-gold' : 'bg-cosmic-900'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.analytics ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-cosmic-silver/70 leading-relaxed">{t.privacyAnalyticsDesc}</p>
              </div>
            </div>

            {/* Marketing */}
            <div 
              onClick={() => setSettings(s => ({ ...s, marketing: !s.marketing }))}
              className={`flex items-start gap-4 p-6 border transition-all cursor-pointer rounded-3xl ${
                settings.marketing ? 'bg-cosmic-gold/10 border-cosmic-gold/30' : 'bg-cosmic-800/50 border-cosmic-gold/10 hover:border-cosmic-gold/20'
              }`}
            >
              <Database className={`w-6 h-6 mt-1 transition-colors ${settings.marketing ? 'text-cosmic-gold' : 'text-cosmic-silver/40'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">{t.privacyMarketingCookies}</h4>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.marketing ? 'bg-cosmic-gold' : 'bg-cosmic-900'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.marketing ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-cosmic-silver/70 leading-relaxed">{t.privacyMarketingDesc}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-cosmic-gold/10 space-y-6">
            <div className="space-y-4">
              <h4 className="text-cosmic-gold font-cinzel text-xs uppercase tracking-[0.3em]">{t.dataRightsTitle}</h4>
              <p className="text-xs text-cosmic-silver/60 leading-relaxed">{t.dataRightsDesc}</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-cosmic-800 border border-cosmic-gold/10 text-cosmic-silver text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-cosmic-gold hover:border-cosmic-gold/30 transition-all"
                >
                  <Download className="w-3 h-3" /> {t.requestDataExport}
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-cosmic-800 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> {t.requestDataDeletion}
                </button>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={showSuccess}
              className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${
                showSuccess ? 'bg-green-500 text-white' : 'bg-cosmic-gold text-cosmic-900 hover:scale-[1.02]'
              }`}
            >
              {showSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved
                </>
              ) : (
                t.saveSettings
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacySettings;
