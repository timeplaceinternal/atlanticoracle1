
import React, { useState } from 'react';
import { Service, ServiceType, ReadingRequest, ReportLanguage } from '../types';
import { ArrowLeft, MapPin, Clock, User, ShieldCheck, Globe } from 'lucide-react';

interface ReadingFormProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: ReadingRequest) => void;
}

const LANGUAGES: ReportLanguage[] = ['English', 'French', 'German', 'Spanish', 'Italian', 'Russian', 'Ukrainian'];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ReadingForm: React.FC<ReadingFormProps> = ({ service, onBack, onSubmit }) => {
  const currentYear = 2026;
  const currentMonth = 2; // February
  const currentDay = 9;

  const [name, setName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [birthMin, setBirthMin] = useState('00');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('1990');
  const [language, setLanguage] = useState<ReportLanguage>('English');

  const [partnerName, setPartnerName] = useState('');
  const [pMonth, setPMonth] = useState('1');
  const [pDay, setPDay] = useState('1');
  const [pYear, setPYear] = useState('1990');
  const [pHour, setPHour] = useState('12');
  const [pMin, setPMin] = useState('00');

  const [showErrors, setShowErrors] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const isUnion = service.id === ServiceType.CELESTIAL_UNION;
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
    }
  };

  const isUnion = service.id === ServiceType.CELESTIAL_UNION;
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="max-w-4xl mx-auto p-12 bg-cosmic-800/40 backdrop-blur-3xl rounded-[3rem] border border-cosmic-gold/20 shadow-2xl relative">
      <div className="absolute top-0 right-0 p-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-cosmic-gold/10 border border-cosmic-gold/20 rounded-full">
           <Globe className="w-4 h-4 text-cosmic-gold" />
           <select 
             className="bg-transparent text-xs font-bold text-cosmic-gold uppercase focus:outline-none"
             value={language}
             onChange={(e) => setLanguage(e.target.value as ReportLanguage)}
           >
             {LANGUAGES.map(l => <option key={l} value={l} className="bg-cosmic-900">{l}</option>)}
           </select>
        </div>
      </div>

      <button onClick={onBack} className="mb-12 flex items-center text-cosmic-gold/60 hover:text-cosmic-gold transition-colors text-xs font-bold uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Sanctuary
      </button>

      <div className="mb-12">
        <h2 className="text-4xl font-cinzel text-white mb-2">{service.title}</h2>
        <p className="text-cosmic-silver italic">The oracle prepares a detailed report for you in {language}. Current date: {MONTHS[currentMonth - 1]} {currentDay}, {currentYear}. Provide precise birth time for supreme accuracy.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-6">
              <label className="block text-[10px] text-cosmic-gold uppercase tracking-[0.3em] font-bold">Personal Celestial Coordinates</label>
              
              <div className="space-y-1">
                <div className="flex items-center gap-3 border-b border-cosmic-700 py-3">
                  <User className="w-4 h-4 text-cosmic-gold" />
                  <input 
                    placeholder="Full Name" 
                    autoComplete="off"
                    className={`w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors`} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
                {showErrors && !name && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Identity is required</p>}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <select value={year} onChange={e => setYear(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                  {years.map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                </select>
                <select value={month} onChange={e => setMonth(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                  {MONTHS.map((m,i) => <option key={m} value={i+1} className="bg-cosmic-900">{m}</option>)}
                </select>
                <select value={day} onChange={e => setDay(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                </select>
              </div>

              <div className="flex gap-4 items-center">
                <Clock className="w-4 h-4 text-cosmic-gold" />
                <span className="text-[10px] text-cosmic-silver uppercase tracking-widest">Time:</span>
                <select value={birthHour} onChange={e => setBirthHour(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                  {hours.map(h => <option key={h} value={h} className="bg-cosmic-900">{h}h</option>)}
                </select>
                <select value={birthMin} onChange={e => setBirthMin(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                  {minutes.map(m => <option key={m} value={m} className="bg-cosmic-900">{m}m</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 border-b border-cosmic-700 py-3">
                  <MapPin className="w-4 h-4 text-cosmic-gold" />
                  <input 
                    placeholder="Birth City & Country" 
                    autoComplete="off"
                    className={`w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors`} 
                    value={birthPlace} 
                    onChange={e => setBirthPlace(e.target.value)} 
                  />
                </div>
                {showErrors && !birthPlace && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Location is essential</p>}
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
                      autoComplete="off"
                      className={`w-full bg-transparent text-white focus:border-cosmic-gold outline-none transition-colors`} 
                      value={partnerName} 
                      onChange={e => setPartnerName(e.target.value)} 
                    />
                  </div>
                  {showErrors && !partnerName && <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Partner identity needed</p>}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <select value={pYear} onChange={e => setPYear(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                    {years.map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                  </select>
                  <select value={pMonth} onChange={e => setPMonth(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                    {MONTHS.map((m,i) => <option key={m} value={i+1} className="bg-cosmic-900">{m}</option>)}
                  </select>
                  <select value={pDay} onChange={e => setPDay(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                  </select>
                </div>

                <div className="flex gap-4 items-center">
                  <Clock className="w-4 h-4 text-cosmic-gold" />
                  <span className="text-[10px] text-cosmic-silver uppercase tracking-widest">Time:</span>
                  <select value={pHour} onChange={e => setPHour(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                    {hours.map(h => <option key={h} value={h} className="bg-cosmic-900">{h}h</option>)}
                  </select>
                  <select value={pMin} onChange={e => setPMin(e.target.value)} className="bg-transparent border-b border-cosmic-700 py-3 text-white outline-none">
                    {minutes.map(m => <option key={m} value={m} className="bg-cosmic-900">{m}m</option>)}
                  </select>
                </div>
             </div>
           )}
        </div>

        <div className="pt-12 flex items-center justify-between border-t border-cosmic-700/50">
           <div>
             <span className="text-xs text-cosmic-gold/50 block font-bold tracking-widest uppercase mb-1">Fee for Wisdom</span>
             <span className="text-4xl font-cinzel text-white">€10</span>
           </div>
           <button type="submit" className="px-12 py-5 bg-cosmic-gold text-cosmic-900 font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cosmic-gold/20 flex items-center gap-3">
             PROCEED TO PAYMENT
             <ShieldCheck className="w-5 h-5" />
           </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
