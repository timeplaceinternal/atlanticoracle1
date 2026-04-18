import React from 'react';
import { ChevronLeft, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  React.useEffect(() => {
    const originalTitle = document.title;
    document.title = `Privacy Policy | data Sovereignty | Atlantic Oracle™`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content');
    
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Understand how Atlantic Oracle™ handles your sacred data. Ephemeral privacy, GDPR compliance, and absolute transparency.');
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Sanctuary
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
          <ShieldCheck className="w-4 h-4 text-cosmic-gold" />
          <span className="text-[10px] font-bold text-cosmic-gold uppercase tracking-[0.3em]">Privacy Guaranteed</span>
        </div>
      </div>

      <div className="bg-cosmic-800/40 backdrop-blur-3xl border border-cosmic-gold/20 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-cinzel text-white uppercase tracking-widest">Privacy Policy</h1>
          <p className="text-cosmic-silver italic font-playfair">Your data is as sacred as your soul.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
            <Lock className="w-8 h-8 text-cosmic-gold" />
            <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Secure Encryption</h4>
            <p className="text-xs text-cosmic-silver/70 leading-relaxed">All birth data is encrypted and processed through secure channels.</p>
          </div>
          <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
            <EyeOff className="w-8 h-8 text-cosmic-gold" />
            <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">No Data Selling</h4>
            <p className="text-xs text-cosmic-silver/70 leading-relaxed">We never sell or share your personal information with third parties.</p>
          </div>
          <div className="p-8 border border-cosmic-gold/10 rounded-3xl bg-cosmic-800/10 space-y-4">
            <Database className="w-8 h-8 text-cosmic-gold" />
            <h4 className="text-white font-cinzel text-sm uppercase tracking-widest">Data Deletion</h4>
            <p className="text-xs text-cosmic-silver/70 leading-relaxed">You can request the deletion of your data at any time.</p>
          </div>
        </div>

        <div className="prose prose-invert prose-gold max-w-none prose-p:text-cosmic-silver prose-p:leading-relaxed prose-headings:font-cinzel prose-headings:text-white prose-strong:text-cosmic-gold">
          <h3>1. Information We Collect</h3>
          <p>We collect your name, birth date, and email address solely for the purpose of generating your cosmic reports and delivering them to you.</p>
          <h3>2. How We Use Your Data</h3>
          <p>Your data is used by our AI models to calculate planetary positions and numerical vibrations. We do not use your data for marketing purposes without your explicit consent.</p>
          <h3>3. Cookies</h3>
          <p>We use essential cookies to maintain your session and ensure the security of our platform. You can manage your cookie preferences in the Privacy Settings.</p>
          <div className="mt-4">
            <button 
              onClick={() => (window as any).openPrivacySettings?.()}
              className="px-6 py-3 bg-cosmic-gold/10 border border-cosmic-gold/20 text-cosmic-gold text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-cosmic-gold/20 transition-colors"
            >
              Manage Cookie Preferences
            </button>
          </div>
          <h3>4. GDPR Compliance</h3>
          <p>Under the General Data Protection Regulation (GDPR), European residents have the right to access, export, and delete their personal data. Our "Ephemeral Privacy" model ensures that most data is deleted automatically after your report is generated.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
