import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { History as HistoryIcon } from 'lucide-react';
import { Service, ReadingRequest, ReportLanguage, ServiceType } from '../types';
import { translations } from '../translations';
import { ZODIAC_SIGNS } from '../constants';

registerLocale('pt-BR', ptBR);
registerLocale('en', enUS);
registerLocale('es', es);

interface ReadingFormProps {
  service: Service;
  language: ReportLanguage;
  onBack: () => void;
  onSubmit: (request: ReadingRequest) => void;
  isWidget?: boolean;
  theme?: 'dark' | 'light';
}

const MaskedDateInput = React.forwardRef(({ value, onClick, onChange, placeholder, className, required, nextRef }: any, ref: any) => {
  // Use local state to manage the input text independently of the DatePicker's value
  // This prevents the DatePicker from "fighting" the user while they type an incomplete date
  const [innerValue, setInnerValue] = React.useState(value || '');

  // Update inner value when the prop value changes (e.g., date selected from calendar)
  React.useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value || '');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Strip all non-digits to get the raw numbers
    let digits = val.replace(/\D/g, '');
    if (digits.length > 8) digits = digits.substring(0, 8);
    
    // Apply the mask: DD/MM/YYYY
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
      if (digits.length > 2) {
        formatted += '/' + digits.substring(2, 4);
        if (digits.length > 4) {
          formatted += '/' + digits.substring(4, 8);
        }
      }
    }
    
    // Update local state immediately for a responsive UI
    setInnerValue(formatted);
    
    // Notify DatePicker of the change so it can try to parse the date
    // We pass the formatted value so DatePicker sees the separators
    const event = {
      ...e,
      target: {
        ...e.target,
        value: formatted
      }
    };
    onChange(event);

    // Auto-focus next field only when a full date is entered
    if (digits.length === 8 && nextRef?.current) {
      setTimeout(() => nextRef.current.focus(), 10);
    }
  };

  // Handle backspace specifically to avoid getting stuck on separators
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const target = e.target as HTMLInputElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // If the user is deleting a separator, delete the digit before it too
      if (start === end && start !== null && (target.value[start - 1] === '/' || target.value[start - 1] === '.')) {
        // This is handled naturally by our digits-based logic in handleInputChange,
        // but we can be explicit here if needed.
      }
    }
  };

  return (
    <input
      ref={ref}
      value={innerValue}
      onClick={onClick}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      required={required}
      type="text"
      inputMode="numeric"
      autoComplete="off"
    />
  );
});

const TimeInputFields = ({ data, setter, label, hRef, mRef, t, nextFieldRef, theme }: { 
  data: any, 
  setter: any, 
  label: string, 
  hRef: React.RefObject<HTMLInputElement | null>, 
  mRef: React.RefObject<HTMLInputElement | null>,
  t: any,
  nextFieldRef?: React.RefObject<HTMLInputElement | null>,
  theme?: 'dark' | 'light'
}) => {
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>, is12h: boolean, setter: React.Dispatch<React.SetStateAction<any>>, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) return;
    
    if (val === '') {
      setter((prev: any) => ({ ...prev, hour: '' }));
      return;
    }
    
    const num = parseInt(val);
    const max = is12h ? 12 : 23;
    
    if (num <= max) {
      setter((prev: any) => ({ ...prev, hour: val }));
      // Auto-focus minutes if 2 digits or if first digit is large enough to be a complete hour
      if (val.length === 2 || (val.length === 1 && num > (is12h ? 1 : 2))) {
        setTimeout(() => nextRef?.current?.focus(), 10);
      }
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) return;
    
    if (val === '') {
      setter((prev: any) => ({ ...prev, minute: '' }));
      return;
    }
    
    const num = parseInt(val);
    if (num <= 59) {
      setter((prev: any) => ({ ...prev, minute: val }));
      if (val.length === 2) {
        setTimeout(() => nextRef?.current?.focus(), 10);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, prevRef: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && prevRef.current) {
      prevRef.current.focus();
    }
  };

  return (
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
              onChange={(e) => handleHourChange(e, data.is12h, setter, mRef)}
              placeholder="00"
              className="w-16 bg-cosmic-900/30 text-center text-white outline-none font-mono text-2xl p-2 rounded-xl border border-cosmic-gold/10 focus:border-cosmic-gold/40 transition-all"
              autoComplete="off"
              maxLength={2}
              inputMode="numeric"
            />
          </div>
          <span className="text-cosmic-gold font-bold self-end mb-2 text-xl">:</span>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-cosmic-silver/50 uppercase mb-1">{t.formMinutes}</span>
            <input 
              ref={mRef}
              type="text" 
              value={data.minute} 
              onChange={(e) => handleMinuteChange(e, setter, nextFieldRef)}
              onKeyDown={(e) => handleKeyDown(e, hRef)}
              placeholder="00"
              className="w-16 bg-cosmic-900/30 text-center text-white outline-none font-mono text-2xl p-2 rounded-xl border border-cosmic-gold/10 focus:border-cosmic-gold/40 transition-all"
              autoComplete="off"
              maxLength={2}
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
};

const ReadingForm: React.FC<ReadingFormProps> = ({ service, language, onBack, onSubmit, isWidget, theme = 'dark' }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthTime, setBirthTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });
  const [birthPlace, setBirthPlace] = useState('');
  const [goal, setGoal] = useState('');
  
  // Partner fields
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState<Date | null>(null);
  const [partnerBirthTime, setPartnerBirthTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });
  
  // Dream fields
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamKeywords, setDreamKeywords] = useState('');
  const [dreamDate, setDreamDate] = useState<Date | null>(null);
  const [dreamTime, setDreamTime] = useState({ hour: '', minute: '', is12h: false, amPm: 'AM' });

  // Sports fields
  const [sportsEvent, setSportsEvent] = useState('');
  const [sportsSide1, setSportsSide1] = useState('');
  const [sportsSide2, setSportsSide2] = useState('');
  const [sportsVenue, setSportsVenue] = useState('');
  const [sportsDate, setSportsDate] = useState<Date | null>(null);
  const [sportsContext, setSportsContext] = useState('');
  const [sportsOdds, setSportsOdds] = useState('');
  
  // Astro Weather fields
  const [city, setCity] = useState('');
  const [zodiacSign, setZodiacSign] = useState('aries');
  const [forecastDuration, setForecastDuration] = useState<'today' | 'tomorrow' | '3days' | '10days'>('today');
  const [chartImage, setChartImage] = useState<string | undefined>(undefined);
  const [chartImageName, setChartImageName] = useState<string | undefined>(undefined);

  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const partnerHourRef = React.useRef<HTMLInputElement>(null);
  const partnerMinuteRef = React.useRef<HTMLInputElement>(null);
  const dreamHourRef = React.useRef<HTMLInputElement>(null);
  const dreamMinuteRef = React.useRef<HTMLInputElement>(null);
  const birthPlaceRef = React.useRef<HTMLInputElement>(null);

  const birthDateRef = React.useRef<HTMLInputElement>(null);
  const partnerBirthDateRef = React.useRef<HTMLInputElement>(null);
  const dreamDateRef = React.useRef<HTMLInputElement>(null);

  const t = translations[language];

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const handleSubmit = (e: React.FormEvent, isTest: boolean = false) => {
    e.preventDefault();
    const isSportsOracle = service.id === ServiceType.SPORTS_ORACLE;
    const isProfDecoding = service.id === ServiceType.PROFESSIONAL_DECODING;
    
    onSubmit({
      name: isSportsOracle ? undefined : name,
      birthDate: (isSportsOracle || isProfDecoding) ? undefined : formatDate(birthDate),
      birthTime: (isSportsOracle || isProfDecoding) ? undefined : formatTimeForSubmit(birthTime),
      birthPlace: (isSportsOracle || isProfDecoding) ? undefined : birthPlace,
      language,
      isTest,
      serviceId: service.id,
      chartImage,
      goal: (service.id === ServiceType.GOAL_10_DAYS || service.id === ServiceType.GOAL_30_DAYS || service.id === ServiceType.GOAL_100_DAYS) ? goal : undefined,
      partnerName: (service.id === ServiceType.LOVE_SYNASTRY || service.id === ServiceType.RELATIONSHIP_SPARK) ? partnerName : undefined,
      partnerBirthDate: (service.id === ServiceType.LOVE_SYNASTRY || service.id === ServiceType.RELATIONSHIP_SPARK) ? formatDate(partnerBirthDate) : undefined,
      partnerBirthTime: (service.id === ServiceType.LOVE_SYNASTRY || service.id === ServiceType.RELATIONSHIP_SPARK) ? formatTimeForSubmit(partnerBirthTime) : undefined,
      dreamDescription: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamDescription : undefined,
      dreamKeywords: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? dreamKeywords : undefined,
      dreamDate: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? formatDate(dreamDate) : undefined,
      dreamTime: (service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION) ? formatTimeForSubmit(dreamTime) : undefined,
      sportsEvent: service.id === ServiceType.SPORTS_ORACLE ? sportsEvent : undefined,
      sportsSide1: service.id === ServiceType.SPORTS_ORACLE ? sportsSide1 : undefined,
      sportsSide2: service.id === ServiceType.SPORTS_ORACLE ? sportsSide2 : undefined,
      sportsVenue: service.id === ServiceType.SPORTS_ORACLE ? sportsVenue : undefined,
      sportsDate: service.id === ServiceType.SPORTS_ORACLE ? formatDate(sportsDate) : undefined,
      sportsContext: service.id === ServiceType.SPORTS_ORACLE ? sportsContext : undefined,
      sportsOdds: service.id === ServiceType.SPORTS_ORACLE ? sportsOdds : undefined,
      city: service.id === ServiceType.ASTRO_WEATHER ? city : undefined,
      zodiacSign: service.id === ServiceType.ASTRO_WEATHER ? zodiacSign : undefined,
      forecastDuration: service.id === ServiceType.ASTRO_WEATHER ? forecastDuration : undefined,
      timestamp: Date.now()
    });
  };

  const getServiceTitle = () => {
    switch (service.id) {
      case ServiceType.DAILY_VIBRATION:
        return t.dailyVibrationTitle;
      case ServiceType.RELATIONSHIP_SPARK:
        return t.relationshipSparkTitle;
      default:
        return service.title;
    }
  };

  const isDreamService = service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION;
  const isSynastryService = service.id === ServiceType.LOVE_SYNASTRY || service.id === ServiceType.RELATIONSHIP_SPARK;
  const isGoalService = service.id === ServiceType.GOAL_10_DAYS || service.id === ServiceType.GOAL_30_DAYS || service.id === ServiceType.GOAL_100_DAYS;
  const isProfDecoding = service.id === ServiceType.PROFESSIONAL_DECODING;
  const isSportsOracle = service.id === ServiceType.SPORTS_ORACLE;
  const isAstroWeather = service.id === ServiceType.ASTRO_WEATHER;
  const isFree = service.isFree;

  return (
    <div className={`max-w-2xl mx-auto ${isWidget ? 'bg-transparent border-none p-2 shadow-none' : theme === 'light' ? 'bg-white border border-cosmic-gold/20 rounded-[2rem] p-8 shadow-xl' : 'bg-cosmic-800/40 backdrop-blur-xl border border-cosmic-gold/20 rounded-[2rem] p-8'} overflow-hidden`}>
      <h2 className={`text-3xl font-cinzel ${theme === 'light' ? 'text-cosmic-900' : 'text-white'} mb-6`}>{getServiceTitle()}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {isAstroWeather && (
            <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
              <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionForecast}</h3>
              
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formCity}</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder={t.formCityPlaceholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  required
                />
              </div>

              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formZodiacSign}</label>
                <select 
                  value={zodiacSign} 
                  onChange={(e) => setZodiacSign(e.target.value)}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors appearance-none`}
                >
                  {ZODIAC_SIGNS.map(sign => (
                    <option key={sign.id} value={sign.id} className={theme === 'light' ? 'bg-white' : 'bg-cosmic-900'}>
                      {(sign.name as any)[language] || sign.name.English} {sign.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formDuration}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['today', 'tomorrow', '3days', '10days'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForecastDuration(d)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        forecastDuration === d 
                          ? 'bg-cosmic-gold border-cosmic-gold text-cosmic-900' 
                          : `${theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-500 hover:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-cosmic-silver hover:border-cosmic-gold/40'}`
                      }`}
                    >
                      {d === 'today' ? t.durationToday : d === 'tomorrow' ? t.durationTomorrow : d === '3days' ? t.duration3Days : t.duration10Days}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isSportsOracle && !isAstroWeather ? (
            <>
              <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionUser}</h3>
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formName}</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  required
                />
              </div>

              {isProfDecoding ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                  <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm uppercase tracking-widest`}>{t.formChartImage}</label>
                  <div className={`relative group cursor-pointer ${theme === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-cosmic-900/50 border-cosmic-gold/20'} border-2 border-dashed rounded-2xl p-8 transition-all hover:border-cosmic-gold/50 text-center`}>
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setChartImageName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setChartImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required={!chartImage}
                    />
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <div className="p-4 bg-cosmic-gold/10 rounded-full text-cosmic-gold group-hover:scale-110 transition-transform">
                          <HistoryIcon className="w-8 h-8" />
                        </div>
                      </div>
                      <p className={`text-sm ${theme === 'light' ? 'text-cosmic-900' : 'text-white'}`}>
                        {chartImageName || t.formChartImage}
                      </p>
                      <p className={`text-[10px] ${theme === 'light' ? 'text-slate-400' : 'text-cosmic-silver/50'} italic`}>
                        {t.formChartImageHelp}
                      </p>
                    </div>
                  </div>
                  {chartImage && (
                    <div className="relative rounded-xl overflow-hidden border border-cosmic-gold/30 h-48 animate-in zoom-in-95">
                      <img src={chartImage} alt="Preview" className="w-full h-full object-contain bg-black/20" />
                      <button 
                        type="button" 
                        onClick={() => { setChartImage(undefined); setChartImageName(undefined); }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formBirthDate}</label>
                    <DatePicker
                      selected={birthDate}
                      onChange={(date: Date | null) => setBirthDate(date)}
                      locale={language === 'Portuguese' ? 'pt-BR' : language === 'Spanish' ? 'es' : 'en'}
                      dateFormat={language === 'English' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
                      placeholderText={t.formBirthDatePlaceholder}
                      className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      required
                      customInput={
                        <MaskedDateInput 
                          nextRef={isFree ? birthPlaceRef : hourRef} 
                        />
                      }
                    />
                  </div>
                  {!isFree && (
                    <div className="md:col-span-2">
                      <TimeInputFields 
                        data={birthTime} 
                        setter={setBirthTime} 
                        label={t.formBirthTime} 
                        hRef={hourRef} 
                        mRef={minuteRef} 
                        t={t}
                        nextFieldRef={birthPlaceRef}
                        theme={theme}
                      />
                    </div>
                  )}
                  <div className={isFree ? "md:col-span-1" : "md:col-span-2"}>
                    <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formBirthPlace}</label>
                    <input 
                      ref={birthPlaceRef}
                      type="text" 
                      value={birthPlace} 
                      onChange={(e) => setBirthPlace(e.target.value)} 
                      placeholder={t.formBirthPlacePlaceholder}
                      className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                      required
                    />
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {isGoalService && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionGoal}</h3>
            <div>
              <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formGoal}</label>
              <textarea 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)} 
                placeholder={t.formGoalPlaceholder}
                className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors min-h-[100px] resize-none`}
                required
              />
              <p className={`text-[10px] ${theme === 'light' ? 'text-slate-400' : 'text-cosmic-silver/50'} mt-2 italic`}>{t.formGoalHelp}</p>
            </div>
          </div>
        )}

        {isSynastryService && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionPartner}</h3>
            <div>
              <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formPartnerName}</label>
              <input 
                type="text" 
                value={partnerName} 
                onChange={(e) => setPartnerName(e.target.value)} 
                className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formPartnerBirthDate}</label>
                <DatePicker
                  selected={partnerBirthDate}
                  onChange={(date: Date | null) => setPartnerBirthDate(date)}
                  locale={language === 'Portuguese' ? 'pt-BR' : language === 'Spanish' ? 'es' : 'en'}
                  dateFormat={language === 'English' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
                  placeholderText={t.formBirthDatePlaceholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  required
                  customInput={
                    <MaskedDateInput 
                      nextRef={isFree ? undefined : partnerHourRef} 
                    />
                  }
                />
              </div>
              {!isFree && (
                <div className="md:col-span-2">
                  <TimeInputFields 
                    data={partnerBirthTime} 
                    setter={setPartnerBirthTime} 
                    label={t.formBirthTime} 
                    hRef={partnerHourRef} 
                    mRef={partnerMinuteRef} 
                    t={t}
                    theme={theme}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isDreamService && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionDream}</h3>
            <div>
              <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formDreamDescription}</label>
              <textarea 
                value={dreamDescription} 
                onChange={(e) => setDreamDescription(e.target.value)} 
                className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors min-h-[150px] resize-none`}
                required
              />
            </div>
            {!isFree && (
              <>
                <div>
                  <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formDreamKeywords}</label>
                  <input 
                    type="text" 
                    value={dreamKeywords} 
                    onChange={(e) => setDreamKeywords(e.target.value)} 
                    className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.formDreamDate}</label>
                    <DatePicker
                      selected={dreamDate}
                      onChange={(date: Date | null) => setDreamDate(date)}
                      locale={language === 'Portuguese' ? 'pt-BR' : language === 'Spanish' ? 'es' : 'en'}
                      dateFormat={language === 'English' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
                      placeholderText={t.formBirthDatePlaceholder}
                      className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      customInput={
                        <MaskedDateInput 
                          nextRef={isFree ? undefined : dreamHourRef} 
                        />
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <TimeInputFields 
                      data={dreamTime} 
                      setter={setDreamTime} 
                      label={t.formDreamTime} 
                      hRef={dreamHourRef} 
                      mRef={dreamMinuteRef} 
                      t={t}
                      theme={theme}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {service.id === ServiceType.SPORTS_ORACLE && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-4">
            <h3 className={`text-cosmic-gold font-cinzel text-sm uppercase tracking-[0.2em] border-b ${theme === 'light' ? 'border-cosmic-gold/20' : 'border-cosmic-gold/10'} pb-2`}>{t.formSectionSports}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.sportsSide1Label}</label>
                <input 
                  type="text" 
                  value={sportsSide1} 
                  onChange={(e) => setSportsSide1(e.target.value)} 
                  placeholder={t.sportsSide1Placeholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  required
                />
              </div>
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.sportsSide2Label}</label>
                <input 
                  type="text" 
                  value={sportsSide2} 
                  onChange={(e) => setSportsSide2(e.target.value)} 
                  placeholder={t.sportsSide2Placeholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.sportsVenueLabel}</label>
                <input 
                  type="text" 
                  value={sportsVenue} 
                  onChange={(e) => setSportsVenue(e.target.value)} 
                  placeholder={t.sportsVenuePlaceholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  required
                />
              </div>
              <div>
                <label className={`block ${theme === 'light' ? 'text-cosmic-900/60' : 'text-cosmic-silver'} text-sm mb-2 uppercase tracking-widest`}>{t.sportsDateLabel}</label>
                <DatePicker
                  selected={sportsDate}
                  onChange={(date: Date | null) => setSportsDate(date)}
                  locale={language === 'Portuguese' ? 'pt-BR' : language === 'Spanish' ? 'es' : 'en'}
                  dateFormat={language === 'English' ? 'MM/dd/yyyy' : 'dd/MM/yyyy'}
                  placeholderText={t.sportsDatePlaceholder}
                  className={`w-full ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-cosmic-900 focus:border-cosmic-gold' : 'bg-cosmic-900/50 border-cosmic-gold/20 text-white focus:border-cosmic-gold'} rounded-xl p-4 outline-none transition-colors`}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={10}
                  required
                  customInput={
                    <MaskedDateInput />
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button type="button" onClick={onBack} className={`flex-1 py-4 border ${theme === 'light' ? 'border-slate-300 text-slate-500 hover:bg-slate-50' : 'border-cosmic-gold/20 text-cosmic-silver hover:bg-cosmic-gold/5'} rounded-xl transition-colors`}>{t.formBack}</button>
          
          <button 
            type="submit" 
            onClick={(e) => handleSubmit(e, false)}
            className="flex-1 py-4 bg-cosmic-gold text-cosmic-900 font-bold rounded-xl hover:scale-105 transition-transform"
          >
            {t.formSubmit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
