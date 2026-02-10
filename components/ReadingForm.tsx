
import React, { useState } from 'react';
import { Service, ServiceType, ReadingRequest, ReportLanguage } from '../types';
import { ArrowLeft, MapPin, Clock, User, ShieldCheck } from 'lucide-react';

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
  
  // Убран выбор языка, фиксируем English до момента полной локализации сайта
  const [language] = useState<ReportLanguage>('English');

  const [partnerName, setPartnerName] = useState('');
  const [pMonth, setPMonth] = useState('1');
  const [pDay, setPDay] = useState('1');
  const [pYear, setPYear] = useState('1990');
  const [pHour, setPHour] = useState('12');
  const [pMin, setPMin] = useState('00');

  const [showErrors, setShowErrors] = useState(false);

  const isUnion = service.id === ServiceType.LOVE_SYNASTRY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const isMainValid = name.trim() !== '' && birthPlace.trim() !== '';
    const isPartnerValid = !isUnion || partnerName.trim() !== '';

    if (isMainValid && isPartnerValid) {
      const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const partnerBirthDate = `${pYear}-${pMonth.padStart(2, '0')}-${pDay.padStart(2, '0')}`;
      const birthTime = `${birthHour}:${birthMin}`;
      const partnerBirthTime = `${pHour}:${pMin}`;

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
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const years = Array.from({ length: 121 }, (_, i) => currentYear - i);
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
        <p className="text-sm text-cosmic-silver italic leading-relaxed">The oracle prepares a detailed report for you. Provide precise birth time for supreme accuracy.</p>
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
             <span className="text-3xl sm:text-4xl font-cinzel text-white">€10</span>
           </div>
           <button 
             type="submit" 
             className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cosmic-gold/40 flex items-center justify-center gap-3 relative z-[100]"
           >
             PROCEED TO PAYMENT
             <ShieldCheck className="w-5 h-5" />
           </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
