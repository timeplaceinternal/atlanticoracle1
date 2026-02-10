import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Trash2, CreditCard, EyeOff } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 bg-cosmic-800/40 backdrop-blur-3xl rounded-[3rem] border border-cosmic-gold/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack} 
        className="mb-12 flex items-center text-cosmic-gold/60 hover:text-cosmic-gold transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sanctuary
      </button>

      <div className="text-center mb-16 space-y-4">
        <ShieldCheck className="w-12 h-12 text-cosmic-gold mx-auto mb-4" />
        <h1 className="text-4xl font-cinzel text-white uppercase tracking-widest">Privacy Policy</h1>
        <p className="text-cosmic-silver italic font-playfair">Last updated: February 2026</p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-cosmic-gold/50 to-transparent mx-auto"></div>
      </div>

      <div className="space-y-12 text-cosmic-silver/90 font-light leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <Lock className="w-5 h-5 text-cosmic-gold" />
            1. Data Sovereignty
          </div>
          <p>
            At Atlantic Oracle, we believe your cosmic coordinates belong to you. We do not require user accounts, passwords, or persistent profiles. Your interaction with the Oracle is <strong>ephemeral</strong>.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <EyeOff className="w-5 h-5 text-cosmic-gold" />
            2. Personal Information Collected
          </div>
          <p>
            To generate your report, we temporarily process your:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-cosmic-gold">
            <li>Full Name (for numerological calculations)</li>
            <li>Birth Date, Time, and Location (for celestial mapping)</li>
            <li>Email address (only as provided via Stripe for receipt purposes)</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <Trash2 className="w-5 h-5 text-cosmic-gold" />
            3. Data Retention & Deletion
          </div>
          <p>
            We do not store your birth data in any database. The coordinates you provide are used in a single generation cycle via the Google Gemini API. Once your session ends or you refresh the page, the data is purged from our active memory. We recommend saving your PDF report immediately, as it cannot be recovered by our staff.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <CreditCard className="w-5 h-5 text-cosmic-gold" />
            4. Payments
          </div>
          <p>
            Financial transactions are handled exclusively by <strong>Stripe</strong>. Atlantic Oracle does not see or store your credit card numbers, CVVs, or billing addresses. Stripe’s privacy policy governs the processing of your payment data.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <ShieldCheck className="w-5 h-5 text-cosmic-gold" />
            5. Cookies & Tracking
          </div>
          <p>
            We use zero marketing cookies. No pixels, no trackers, no profiling. We may use essential session storage purely to manage your current report generation process.
          </p>
        </section>

        {/* Section 6 */}
        <section className="pt-8 border-t border-cosmic-gold/10 text-center">
          <p className="text-sm italic">
            Questions regarding our sanctuary's privacy practices can be directed to:<br />
            <a href="mailto:oracle@atlanticoracle.com" className="text-cosmic-gold hover:text-white transition-colors font-bold mt-2 inline-block">oracle@atlanticoracle.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;