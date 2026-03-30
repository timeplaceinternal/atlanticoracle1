import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { enUS } from 'date-fns/locale/en-US';
import { Service, ReadingRequest, ReportLanguage, ServiceType } from '../types';
import { translations } from '../translations';

registerLocale('pt-BR', ptBR);
registerLocale('en', enUS);

interface ReadingFormProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onSubmit: (request: ReadingRequest) => void;
}

const ReadingForm: React.FC<ReadingFormProps> = ({ service, language, onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });
  const [birthPlace, setBirthPlace] = useState('');
  const [email, setEmail] = useState('');
  
  // Partner fields
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState<Date | null>(null);
  const [partnerBirthTime, setPartnerBirthTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });
  
  // Dream fields
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamKeywords, setDreamKeywords] = useState('');
  const [dreamDate, setDreamDate] = useState<Date | null>(null);
  const [dreamTime, setDreamTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });

  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const partnerHourRef = React.useRef<HTMLInputElement>(null);
  const partnerMinuteRef = React.useRef<HTMLInputElement>(null);
  const dreamHourRef = React.useRef<HTMLInputElement>(null);
  const dreamMinuteRef = React.useRef<HTMLInputElement>(null);

  const t = translations[language];

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatTimeForSubmit = (data: { hour: string, minute: string, is12h: boolean, amPm: string }) => {
    if (!data.hour && !data.minute) return 'Unknown';
    const h = data.hour.padStart(2, '0');
    const m = data.minute.padStart(2, '0');
    if (data.is12h) {
      return `${h}:${m} ${data.amPm}`;
    }
    return `${h}:${m}`;
  };

  const handleHourChange = (val: string, is12h: boolean, setter: React.Dispatch<React.SetStateAction<any>>, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    // Allow only digits and take the last 2 entered
    const digits = val.replace(/\D/g, '');
    const clean = digits.slice(-2);
    
    if (digits === '') {
      setter((prev: any) => ({ ...prev, hour: '' }));
      return;
    }
    
    const num = parseInt(clean);
    if (isNaN(num)) return;

    if (is12h) {
      // In 12h mode, we allow 0-12 (0 will be treated as 12 or prefix for 01-09)
      if (num >= 0 && num <= 12) {
        setter((prev: any) => ({ ...prev, hour: clean }));
        // Auto-focus minutes if 2 digits or if first digit is 2-9
        if (clean.length === 2 || (clean.length === 1 && num > 1)) {
          nextRef?.current?.focus();
        }
      } else if (digits.length === 1) {
        // If they typed a single digit that's > 1, it's a valid 1-digit hour
        setter((prev: any) => ({ ...prev, hour: digits }));
        nextRef?.current?.focus();
      }
    } else {
      // In 24h mode, allow 0-23
      if (num >= 0 && num <= 23) {
        setter((prev: any) => ({ ...prev, hour: clean }));
        // Auto-focus minutes if 2 digits or if first digit is 3-9
        if (clean.length === 2 || (clean.length === 1 && num > 2)) {
          nextRef?.current?.focus();
        }
      } else if (digits.length === 1) {
        // If they typed a single digit that's > 2, it's a valid 1-digit hour
        setter((prev: any) => ({ ...prev, hour: digits }));
        nextRef?.current?.focus();
      }
    }
  };

  const handleMinuteChange = (val: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    const digits = val.replace(/\D/g, '');
    const clean = digits.slice(-2);
    
    if (digits === '') {
      setter((prev: any) => ({ ...prev, minute: '' }));
      return;
    }
    
    const num = parseInt(clean);
    if (num >= 0 && num <= 59) {
      setter((prev: any) => ({ ...prev, minute: clean }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, prevRef: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && prevRef.current) {
      prevRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      birthDate: formatDate(birthDate),
      birthTime: formatTimeForSubmit(birthTime),
      birthPlace,
      email,
      language,
      serviceId: service.id,
      partnerName: service.id === ServiceType.LOVE_SYNASTRY ? partnerName : undefined,
      partnerBirthDate: service.id === ServiceType.LOVE_SYNASTRY ? formatDate(partnerBirthDate) : undefined,
      partnerBirthTime: service.id === ServiceType.LOVE_SYNASTRY ? formatTimeForSubmit(partnerBirthTime) : undefined,
      dreamDescription: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamDescription : undefined,
      dreamKeywords: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamKeywords : undefined,
      dreamDate: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? formatDate(dreamDate) : undefined,
      dreamTime: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? formatTimeForSubmit(dreamTime) : undefined,
      timestamp: Date.now()
    });
  };

  const TimeInputFields = ({ data, setter, label, hRef, mRef }: { data: any, setter: any, label: string, hRef: React.RefObject<HTMLInputElement | null>, mRef: React.RefObject<HTMLInputElement | null> }) => (
    <div className="space-y-2">
      <label className="block text-cosmic-silver text-sm uppercase tracking-widest">{label}</label>
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 items-center bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-2">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-cosmic-silver/50 uppercase mb-1">{t.formHours}</span>
            <input 
              ref={hRef}
              type="text" 
              value={data.hour} 
              onChange={(e) => handleHourChange(e.target.value, data.is12h, setter, mRef)}
              onFocus={(e) => e.target.select()}
              placeholder="00"
              className="w-12 bg-transparent text-center text-white outline-none font-mono text-lg"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
          <span className="text-cosmic-gold font-bold self-end mb-1">:</span>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-cosmic-silver/50 uppercase mb-1">{t.formMinutes}</span>
            <input 
              ref={mRef}
              type="text" 
              value={data.minute} 
              onChange={(e) => handleMinuteChange(e.target.value, setter)}
              onKeyDown={(e) => handleKeyDown(e, hRef)}
              onFocus={(e) => e.target.select()}
              placeholder="00"
              className="w-12 bg-transparent text-center text-white outline-none font-mono text-lg"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="flex bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl overflow-hidden">
          <button 
            type="button"
            onClick={() => setter((prev: any) => ({ ...prev, is12h: false, hour: parseInt(prev.hour) > 23 ? '' : prev.hour }))}
            className={`px-3 py-2 text-xs font-bold transition-colors ${!data.is12h ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-silver hover:bg-cosmic-gold/10'}`}
          >
            {t.form24h}
          </button>
          <button 
            type="button"
            onClick={() => setter((prev: any) => ({ ...prev, is12h: true, hour: parseInt(prev.hour) > 12 ? '' : prev.hour }))}
            className={`px-3 py-2 text-xs font-bold transition-colors ${data.is12h ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-silver hover:bg-cosmic-gold/10'}`}
          >
            {t.form12h}
          </button>
        </div>

        {data.is12h && (
          <div className="flex bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setter((prev: any) => ({ ...prev, amPm: 'AM' }))}
              className={`px-3 py-2 text-xs font-bold transition-colors ${data.amPm === 'AM' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-silver hover:bg-cosmic-gold/10'}`}
            >
              {t.formAM}
            </button>
            <button 
              type="button"
              onClick={() => setter((prev: any) => ({ ...prev, amPm: 'PM' }))}
              className={`px-3 py-2 text-xs font-bold transition-colors ${data.amPm === 'PM' ? 'bg-cosmic-gold text-cosmic-900' : 'text-cosmic-silver hover:bg-cosmic-gold/10'}`}
            >
              {t.formPM}
            </button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-cosmic-silver/50 italic">{t.formBirthTimeHelp}</p>
    </div>
  );

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
              <DatePicker
                selected={birthDate}
                onChange={(date: Date | null) => setBirthDate(date)}
                locale={language === 'Portuguese' ? 'pt-BR' : 'en'}
                dateFormat={language === 'Portuguese' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
                placeholderText={t.formBirthDatePlaceholder}
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                required
              />
            </div>
            {!isFree && (
              <div className="md:col-span-2">
                <TimeInputFields data={birthTime} setter={setBirthTime} label={t.formBirthTime} hRef={hourRef} mRef={minuteRef} />
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
            <div className="md:col-span-2">
              <label className="block text-cosmic-silver text-sm mb-2 uppercase tracking-widest">{t.formEmail}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={t.formEmailPlaceholder}
                className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                required
              />
              <p className="text-[10px] text-cosmic-silver/50 mt-2 italic">{t.formEmailHelp}</p>
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
                <DatePicker
                  selected={partnerBirthDate}
                  onChange={(date: Date | null) => setPartnerBirthDate(date)}
                  locale={language === 'Portuguese' ? 'pt-BR' : 'en'}
                  dateFormat={language === 'Portuguese' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
                  placeholderText={t.formBirthDatePlaceholder}
                  className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  required
                />
              </div>
              {!isFree && (
                <div className="md:col-span-2">
                  <TimeInputFields data={partnerBirthTime} setter={setPartnerBirthTime} label={t.formBirthTime} hRef={partnerHourRef} mRef={partnerMinuteRef} />
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
                    <DatePicker
                      selected={dreamDate}
                      onChange={(date: Date | null) => setDreamDate(date)}
                      locale={language === 'Portuguese' ? 'pt-BR' : 'en'}
                      dateFormat={language === 'Portuguese' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
                      placeholderText={t.formBirthDatePlaceholder}
                      className="w-full bg-cosmic-900/50 border border-cosmic-gold/20 rounded-xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TimeInputFields data={dreamTime} setter={setDreamTime} label={t.formDreamTime} hRef={dreamHourRef} mRef={dreamMinuteRef} />
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
