
import React, { useState } from 'react';
import { Service, ServiceType, ReadingRequest } from '../types';
import { ArrowLeft, Sparkles, MapPin, Clock, User, ChevronDown, AlertCircle } from 'lucide-react';

interface ReadingFormProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: ReadingRequest) => void;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const ReadingForm: React.FC<ReadingFormProps> = ({ service, onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('1990');
  const [partnerName, setPartnerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isUnion = service.id === ServiceType.UNION_HARMONY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation to avoid browser-default Russian bubbles
    if (!name.trim()) {
      setError("Please reveal your name to the Oracle.");
      return;
    }
    if (!birthPlace.trim()) {
      setError("The Oracle requires your city of origin.");
      return;
    }
    if (isUnion && !partnerName.trim()) {
      setError("The synergy reading requires the partner's name.");
      return;
    }

    setError(null);
    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    onSubmit({
      serviceId: service.id,
      name,
      birthDate,
      birthTime,
      birthPlace,
      partnerName: isUnion ? partnerName : undefined,
    });
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl py-4 px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37] focus:bg-white/15 transition-all text-sm";

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-12 bg-cosmic-800/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="mb-10 flex items-center text-cosmic-silver/80 hover:text-[#d4af37] transition-all text-[11px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Sanctuary
      </button>

      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] rounded-2xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-cinzel text-white uppercase tracking-[0.1em]">{service.title}</h2>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.4em] mt-1">Celestial Entry Coordinates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] border-b border-white/10 pb-3">Natal Data</h3>
            
            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`${inputClass} pl-12`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); if(error) setError(null); }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-10 text-xs font-bold`}>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1} className="bg-cosmic-900">{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#d4af37] pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={day} onChange={(e) => setDay(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-10 text-xs font-bold`}>
                    {days.map(d => <option key={d} value={d} className="bg-cosmic-900">{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#d4af37] pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={year} onChange={(e) => setYear(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-10 text-xs font-bold`}>
                    {years.map(y => <option key={y} value={y} className="bg-cosmic-900">{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[#d4af37] pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="time"
                    className={`${inputClass} pl-12 text-xs font-bold`}
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Birth City"
                    className={`${inputClass} pl-12 text-xs`}
                    value={birthPlace}
                    onChange={(e) => { setBirthPlace(e.target.value); if(error) setError(null); }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isUnion && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] border-b border-white/10 pb-3">Synergy Link</h3>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Partner's Name"
                  className={`${inputClass} pl-12`}
                  value={partnerName}
                  onChange={(e) => { setPartnerName(e.target.value); if(error) setError(null); }}
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs font-bold text-red-200 uppercase tracking-widest">{error}</span>
          </div>
        )}

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-white/40 text-[10px] block uppercase tracking-[0.4em] mb-1">Exchange</span>
            <span className="text-4xl font-cinzel text-white">€{service.price}</span>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-16 py-6 bg-[#d4af37] text-[#0a0a14] font-black rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:bg-[#e3c58e] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[0.25em]"
          >
            Generate Reading
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingForm;
