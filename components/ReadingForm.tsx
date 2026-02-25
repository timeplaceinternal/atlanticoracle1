
import React, { useState } from 'react';
import { Service, ServiceType, ReadingRequest, ReportLanguage } from '../types';
import { ArrowLeft, MapPin, Clock, User, ShieldCheck, Sparkles } from 'lucide-react';

interface ReadingFormProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: ReadingRequest) => void;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ReadingForm: React.FC<ReadingFormProps> = ({ service, onBack, onSubmit }) => {
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [birthMin, setBirthMin] = useState('00');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('1990');
  
  // Language selection is hidden, defaulting to English until full localization is complete.
  const [language] = useState<ReportLanguage>('English');

  const [partnerName, setPartnerName] = useState('');
  const [pMonth, setPMonth] = useState('1');
  const [pDay, setPDay] = useState('1');
  const [pYear, setPYear] = useState('1990');
  const [pHour, setPHour] = useState('12');
  const [pMin, setPMin] = useState('00');

  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamKeywords, setDreamKeywords] = useState('');
  const [dreamMonth, setDreamMonth] = useState('1');
  const [dreamDay, setDreamDay] = useState('1');
  const [dreamYear, setDreamYear] = useState(currentYear.toString());
  const [dreamHour, setDreamHour] = useState('12');
  const [dreamMin, setDreamMin] = useState('00');

  const [showErrors, setShowErrors] = useState(false);

  const isUnion = service.id === ServiceType.LOVE_SYNASTRY;
  const isDream = service.id === ServiceType.DREAM_INTERPRETATION || service.id === ServiceType.FREE_DREAM_INTERPRETATION;
  const isFreeDream = service.id === ServiceType.FREE_DREAM_INTERPRETATION;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const isMainValid = name.trim() !== '' && birthPlace.trim() !== '';
    const isPartnerValid = !isUnion || partnerName.trim() !== '';
    const isDreamValid = !isDream || (dreamDescription.trim() !== '' && (isFreeDream || dreamKeywords.trim() !== ''));

    if (isMainValid && isPartnerValid && isDreamValid) {
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const partnerBirthDate = `${pYear}-${pMonth.padStart(2, '0')}-${pDay.padStart(2, '0')}`;
      const dreamDate = `${dreamYear}-${dreamMonth.padStart(2, '0')}-${dreamDay.padStart(2, '0')}`;
      const birthTime = `${birthHour}:${birthMin}`;
      const partnerBirthTime = `${pHour}:${pMin}`;
      const dreamTime = `${dreamHour}:${dreamMin}`;

      onSubmit({
        serviceId: service.id,
        name,
        birthDate,
        birthTime,
        birthPlace,
        language,
        partnerName: isUnion ? partnerName : undefined,
        partnerBirthDate: isUnion ? partnerBirthDate : undefined,
        partnerBirthTime: isUnion ? partnerBirthTime : undefined,
        dreamDescription: isDream ? dreamDescription : undefined,
        dreamKeywords: isDream ? dreamKeywords : undefined,
        dreamDate: isDream ? dreamDate : undefined,
        dreamTime: isDream ? dreamTime : undefined,
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const years = Array.from({ length: 151 }, (_, i) => currentYear - i);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-12 bg-cosmic-800/40 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] border border-cosmic-gold/20 shadow-2xl relative z-10">
      <button onClick={onBack} className="mb-8 sm:mb-12 flex items-center text-cosmic-gold/60 hover:text-cosmic-gold transition-colors text-xs font-bold uppercase tracking-widest relative z-20">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Sanctuary
      </button>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-cinzel text-white mb-2">{service.title}</h2>
        {service.isFree ? (
          <p className="text-sm text-cosmic-silver italic leading-relaxed">
            The oracle prepares a <strong className="text-cosmic-gold uppercase">brief insight</strong> for you. Full comprehensive Decrees are available as premium services.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-cosmic-silver italic leading-relaxed">
              The oracle prepares a <strong className="text-cosmic-gold uppercase">detailed report</strong> for you.
            </p>
            <div className="p-5 bg-cosmic-gold/5 border border-cosmic-gold/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-700">
              <p className="text-[10px] text-cosmic-gold uppercase tracking-[0.2em] font-bold mb-2">Sage's Requirement</p>
              <p className="text-xs text-cosmic-silver leading-relaxed">
                For a deeper and more precise analysis, we require additional coordinates. Please fill out the form with utmost accuracy. Note that the oracle requires a moment of celestial silence to weave your comprehensive decree.
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-8 sm:space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
           <div className="space-y-6">
              <label className="block text-[10px] text-cosmic-gold uppercase tracking-[0.3em] font-bold">Personal Celestial Coordinates</label>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3 border-b border-cosmic-700 py-3">
                  <User className="w-4 h-4 text-cosmic-gold" />
                  <input 
                    placeholder="Full Name" 
                    className="w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors text-sm" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
                {showErrors && !name && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1">Identity is required</p>}
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <select value={year} onChange={e => setYear(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                  {years.map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                </select>
                <select value={month} onChange={e => setMonth(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                  {MONTHS.map((m,i) => <option key={m} value={i+1} className="bg-cosmic-900">{m.substring(0,3)}</option>)}
                </select>
                <select value={day} onChange={e => setDay(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                </select>
              </div>

              {(service.price > 0 && !service.isFree) && (
                <div className="flex gap-2 sm:gap-4 items-center">
                  <Clock className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-[10px] text-cosmic-silver uppercase tracking-widest">Time:</span>
                  <select value={birthHour} onChange={e => setBirthHour(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {hours.map(h => <option key={h} value={h} className="bg-cosmic-900">{h}h</option>)}
                  </select>
                  <select value={birthMin} onChange={e => setBirthMin(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {minutes.map(m => <option key={m} value={m} className="bg-cosmic-900">{m}m</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-3 border-b border-cosmic-700 py-3">
                  <MapPin className="w-4 h-4 text-cosmic-gold" />
                  <input 
                    placeholder="Birth City & Country" 
                    className="w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors text-sm" 
                    value={birthPlace} 
                    onChange={e => setBirthPlace(e.target.value)} 
                  />
                </div>
                {showErrors && !birthPlace && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1">Location is essential</p>}
              </div>
           </div>

           {isDream && (
             <div className="space-y-6 md:col-span-2 border-t border-cosmic-700/50 pt-8 mt-4">
                <label className="block text-[10px] text-cosmic-gold uppercase tracking-[0.3em] font-bold">Dream Details</label>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <textarea 
                      placeholder="Describe your dream in detail..." 
                      className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-2xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors text-sm min-h-[150px] resize-none" 
                      value={dreamDescription} 
                      onChange={e => setDreamDescription(e.target.value)} 
                    />
                    {showErrors && !dreamDescription && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1">Dream description is required</p>}
                  </div>

                  {!isFreeDream && (
                    <div className="space-y-1">
                      <input 
                        placeholder="Key images or words (e.g., water, flight, old house)" 
                        className="w-full bg-cosmic-900/50 border border-cosmic-700 rounded-2xl p-4 text-white focus:border-cosmic-gold outline-none transition-colors text-sm" 
                        value={dreamKeywords} 
                        onChange={e => setDreamKeywords(e.target.value)} 
                      />
                      {showErrors && !dreamKeywords && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1">Key images are helpful for the sage</p>}
                    </div>
                  )}

                  {!isFreeDream && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] text-cosmic-silver uppercase tracking-widest block">When did it happen?</span>
                        <div className="grid grid-cols-3 gap-2">
                          <select value={dreamYear} onChange={e => setDreamYear(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-2 text-white outline-none text-xs cursor-pointer">
                            {years.slice(0, 21).map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                          </select>
                          <select value={dreamMonth} onChange={e => setDreamMonth(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-2 text-white outline-none text-xs cursor-pointer">
                            {MONTHS.map((m,i) => <option key={m} value={i+1} className="bg-cosmic-900">{m.substring(0,3)}</option>)}
                          </select>
                          <select value={dreamDay} onChange={e => setDreamDay(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-2 text-white outline-none text-xs cursor-pointer">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-cosmic-silver uppercase tracking-widest block">Approximate Time:</span>
                        <div className="flex gap-2 items-center">
                          <select value={dreamHour} onChange={e => setDreamHour(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-2 text-white outline-none text-xs cursor-pointer">
                            {hours.map(h => <option key={h} value={h} className="bg-cosmic-900">{h}h</option>)}
                          </select>
                          <select value={dreamMin} onChange={e => setDreamMin(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-2 text-white outline-none text-xs cursor-pointer">
                            {minutes.map(m => <option key={m} value={m} className="bg-cosmic-900">{m}m</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
             </div>
           )}

           {isUnion && (
             <div className="space-y-6">
                <label className="block text-[10px] text-cosmic-gold uppercase tracking-[0.3em] font-bold">Partner Celestial Coordinates</label>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3 border-b border-cosmic-700 py-3">
                    <User className="w-4 h-4 text-cosmic-gold" />
                    <input 
                      placeholder="Partner Name" 
                      className="w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors text-sm" 
                      value={partnerName} 
                      onChange={e => setPartnerName(e.target.value)} 
                    />
                  </div>
                  {showErrors && !partnerName && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-1">Partner identity needed</p>}
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <select value={pYear} onChange={e => setPYear(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {years.map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                  </select>
                  <select value={pMonth} onChange={e => setPMonth(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {MONTHS.map((m,i) => <option key={m} value={i+1} className="bg-cosmic-900">{m.substring(0,3)}</option>)}
                  </select>
                  <select value={pDay} onChange={e => setPDay(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                  </select>
                </div>

                <div className="flex gap-2 sm:gap-4 items-center">
                  <Clock className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-[10px] text-cosmic-silver uppercase tracking-widest">Time:</span>
                  <select value={pHour} onChange={e => setPHour(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {hours.map(h => <option key={h} value={h} className="bg-cosmic-900">{h}h</option>)}
                  </select>
                  <select value={pMin} onChange={e => setPMin(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none text-xs sm:text-sm cursor-pointer">
                    {minutes.map(m => <option key={m} value={m} className="bg-cosmic-900">{m}m</option>)}
                  </select>
                </div>
             </div>
           )}
        </div>

        <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center justify-between border-t border-cosmic-700/50 gap-6 sm:gap-0">
           <div className="text-center sm:text-left">
             <span className="text-[10px] text-cosmic-gold/50 block font-bold tracking-widest uppercase mb-1">Fee for Wisdom</span>
             <span className="text-3xl sm:text-4xl font-cinzel text-white">{service.isFree ? "FREE" : "€10"}</span>
           </div>
           <button 
             type="submit" 
             className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cosmic-gold/40 flex items-center justify-center gap-3 relative z-[100]"
           >
             {service.isFree ? "START" : "PROCEED TO PAYMENT"}
             {service.isFree ? <Sparkles className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
           </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
