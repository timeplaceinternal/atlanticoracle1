import React, { useState } from 'react';
import { Service, ReadingRequest, ReportLanguage, ServiceType } from '../types';
import { translations } from '../translations';

interface ReadingFormProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onSubmit: (request: ReadingRequest) => void;
}

const ReadingForm: React.FC<ReadingFormProps> = ({ service, language, onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  
  // Partner fields
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');
  const [partnerBirthTime, setPartnerBirthTime] = useState('');
  
  // Dream fields
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamKeywords, setDreamKeywords] = useState('');
  const [dreamDate, setDreamDate] = useState('');
  const [dreamTime, setDreamTime] = useState('');

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      birthDate,
      birthTime,
      birthPlace,
      language,
      serviceId: service.id,
      partnerName: service.id === ServiceType.LOVE_SYNASTRY ? partnerName : undefined,
      partnerBirthDate: service.id === ServiceType.LOVE_SYNASTRY ? partnerBirthDate : undefined,
      partnerBirthTime: service.id === ServiceType.LOVE_SYNASTRY ? partnerBirthTime : undefined,
      dreamDescription: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamDescription : undefined,
      dreamKeywords: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamKeywords : undefined,
      dreamDate: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamDate : undefined,
      dreamTime: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamTime : undefined,
      timestamp: Date.now()
    });
  };

  const isDreamService = service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION;
  const isSynastryService = service.id === ServiceType.LOVE_SYNASTRY;
  const isFree = service.isFree;

  return (
    <div className="max-w-2xl mx-auto bg-cosmic-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-cosmic-gold/20">
      <h2 className="text-3xl font-cinzel text-white mb-6">{service.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <h3 className="text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b border-cosmic-gold/10 pb-2">Your Details</h3>
          <div>
            <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formName}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formBirthDate}</label>
              <input 
                type="date"
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors [color-scheme:dark]"
                required
              />
            </div>
            {!isFree && (
              <div>
                <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formBirthTime}</label>
                <input 
                  type="text" 
                  value={birthTime} 
                  onChange={(e) => setBirthTime(e.target.value)} 
                  placeholder={t.formBirthTimePlaceholder}
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                />
              </div>
            )}
            <div className={isFree ? "md:col-span-1" : "md:col-span-2"}>
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formBirthPlace}</label>
              <input 
                type="text" 
                value={birthPlace} 
                onChange={(e) => setBirthPlace(e.target.value)} 
                placeholder={t.formBirthPlacePlaceholder}
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {isSynastryService && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b border-cosmic-gold/10 pb-2">Partner Details</h3>
            <div>
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formPartnerName}</label>
              <input 
                type="text" 
                value={partnerName} 
                onChange={(e) => setPartnerName(e.target.value)} 
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formPartnerBirthDate}</label>
                <input 
                  type="date"
                  value={partnerBirthDate} 
                  onChange={(e) => setPartnerBirthDate(e.target.value)} 
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors [color-scheme:dark]"
                  required
                />
              </div>
              {!isFree && (
                <div>
                  <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formBirthTime}</label>
                  <input 
                    type="text" 
                    value={partnerBirthTime} 
                    onChange={(e) => setPartnerBirthTime(e.target.value)} 
                    placeholder={t.formBirthTimePlaceholder}
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isDreamService && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b border-cosmic-gold/10 pb-2">Dream Details</h3>
            <div>
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formDreamDescription}</label>
              <textarea 
                value={dreamDescription} 
                onChange={(e) => setDreamDescription(e.target.value)} 
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors min-h-[150px] resize-none"
                required
              />
            </div>
            {!isFree && (
              <>
                <div>
                  <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formDreamKeywords}</label>
                  <input 
                    type="text" 
                    value={dreamKeywords} 
                    onChange={(e) => setDreamKeywords(e.target.value)} 
                    className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formDreamDate}</label>
                    <input 
                      type="date"
                      value={dreamDate} 
                      onChange={(e) => setDreamDate(e.target.value)} 
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formDreamTime}</label>
                    <input 
                      type="text" 
                      value={dreamTime} 
                      onChange={(e) => setDreamTime(e.target.value)} 
                      placeholder="e.g. 3:00 AM"
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-8">
          <button type="button" onClick={onBack} className="flex-1 py-4 border border-cosmic-gold/20 text-cosmic-silver rounded-xl hover:bg-cosmic-gold/5 transition-colors">{t.formBack}</button>
          <button type="submit" className="flex-1 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform">{t.formSubmit}</button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
