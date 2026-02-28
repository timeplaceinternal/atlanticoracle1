import React, { useState } from 'react';
import { Service, ReadingRequest, ReportLanguage } from '../types';
import { translations } from '../../translations';

interface ReadingFormProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onSubmit: (request: ReadingRequest) => void;
}

const ReadingForm: React.FC<ReadingFormProps> = ({ service, language, onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      birthDate,
      birthPlace,
      language,
      serviceId: service.id,
      timestamp: Date.now()
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-cosmic-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-cosmic-gold/20">
      <h2 className="text-3xl font-cinzel text-white mb-6">{service.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formBirthPlace}</label>
            <input 
              type="text" 
              value={birthPlace} 
              onChange={(e) => setBirthPlace(e.target.value)} 
              placeholder="City, Country"
              className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
              required
            />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onBack} className="flex-1 py-4 border border-cosmic-gold/20 text-cosmic-silver rounded-xl hover:bg-cosmic-gold/5 transition-colors">{t.formBack}</button>
          <button type="submit" className="flex-1 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform">{t.formSubmit}</button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
