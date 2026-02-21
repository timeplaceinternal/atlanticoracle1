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
            1. Data Sovereignty & The Ephemeral Nature
          </div>
          <p>
            At Atlantic Oracle, we believe your cosmic coordinates—the precise alignment of stars and numbers at your birth—belong solely to you. We do not require user accounts, passwords, or persistent profiles. Your interaction with the Oracle is <strong>ephemeral</strong>; we do not build a "shadow profile" of your destiny.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <EyeOff className="w-5 h-5 text-cosmic-gold" />
            2. Celestial Data Collection
          </div>
          <p>
            To generate your unique report, we temporarily process the following data points:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-cosmic-gold">
            <li><strong>Full Name:</strong> Used exclusively for Gematria and Pythagorean numerological calculations.</li>
            <li><strong>Birth Coordinates:</strong> Date, exact time, and location are used to map the celestial sphere at your moment of entry.</li>
            <li><strong>Email Address:</strong> If you choose a premium study, your email is processed via Stripe for receipt delivery and secure access to your PDF.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <Trash2 className="w-5 h-5 text-cosmic-gold" />
            3. Immediate Purge Protocol
          </div>
          <p>
            We do not maintain a permanent database of your birth data. The information you provide is used in a single, isolated generation cycle via the Google Gemini API. Once the report is generated and your session ends, the data is purged from our active memory. <strong>We cannot recover lost reports</strong> because we do not store them. We strongly advise downloading your PDF immediately upon generation.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <CreditCard className="w-5 h-5 text-cosmic-gold" />
            4. Financial Security
          </div>
          <p>
            All financial transactions are handled by <strong>Stripe</strong>, a global leader in secure payments. Atlantic Oracle never sees, touches, or stores your credit card numbers or sensitive billing details. Stripe’s independent Privacy Policy governs your payment data.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-white font-cinzel tracking-wider uppercase text-lg">
            <ShieldCheck className="w-5 h-5 text-cosmic-gold" />
            5. Cookies & Tracking
          </div>
          <p>
            We operate a "Zero-Tracking" sanctuary. We do not use marketing cookies, tracking pixels, or third-party profiling tools. We use only essential local storage to ensure your report generation process remains stable during your visit.
          </p>
        </section>

        {/* Section 6 */}
        <section className="pt-8 border-t border-cosmic-gold/10 text-center">
          <p className="text-sm italic">
            If you have questions regarding the security of your cosmic data, please reach out to the Oracle's stewards at:<br />
            <a href="mailto:oracle@atlanticoracle.com" className="text-cosmic-gold hover:text-white transition-colors font-bold mt-2 inline-block">oracle@atlanticoracle.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;