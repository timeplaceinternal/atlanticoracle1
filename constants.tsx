
import React from 'react';
import { 
  Sparkles, Heart, Briefcase, Calendar, Hash, Globe, 
  History, Activity, MoonStar, Star, ShieldCheck, Zap, Gift
} from 'lucide-react';
import { ServiceType, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: ServiceType.NATAL_MATRIX,
    title: "The Natal Matrix (Matrix Natalis)",
    description: "A complete personality decoding based on your precise birth coordinates. Discover your hidden talents, core fears, and the manual to your true self.",
    icon: "sparkles",
    price: 10
  },
  {
    id: ServiceType.CELESTIAL_UNION,
    title: "Celestial Union (Unio Caelestis)",
    description: "A deep synastry analysis of two souls. Explore the karmic tasks, points of harmony, and potential challenges within your partnership.",
    icon: "heart",
    price: 10
  },
  {
    id: ServiceType.PYTHAGOREAN_DESTINY,
    title: "The Pythagorean Destiny (Destinatio Pythagorica)",
    description: "The pure mathematics of destiny. Analysis based on the Pythagoras Square and the core numbers of your soul and path.",
    icon: "hash",
    price: 10
  },
  {
    id: ServiceType.MATRIX_FATE,
    title: "Personal Horoscope for 1 Year (Horoscopus Annua)",
    description: "A comprehensive map of your upcoming year. Detailed analysis of planetary transits and life-changing cycles tailored to your unique birth chart.",
    icon: "zap",
    price: 10
  },
  {
    id: ServiceType.VOCATIONAL_STARS,
    title: "Vocational Stars (Astra Vocationalis)",
    description: "Align your career and finances with the stars. Analysis of the 2nd, 8th, and 10th houses to find your path to success and wealth.",
    icon: "briefcase",
    price: 10
  },
  {
    id: ServiceType.SOLAR_RETURN,
    title: "Solar Return (Revolutio Solaris)",
    description: "Your personal annual roadmap. A comprehensive forecast from your current birthday to the next, mapping your upcoming 12 months.",
    icon: "calendar",
    price: 10
  },
  {
    id: ServiceType.KARMIC_ECHOES,
    title: "Karmic Echoes (Echoes Karmica)",
    description: "Unveil the mysteries of your previous incarnations. Understand the Rahu and Ketu nodes and the lessons influencing your current life.",
    icon: "history",
    price: 10
  },
  {
    id: ServiceType.GOLDEN_NAME,
    title: "The Golden Name (Nomen Aureum)",
    description: "The vibration of your name and its impact on your luck. A perfect analysis for those choosing names for children or business.",
    icon: "star",
    price: 10
  },
  {
    id: ServiceType.TRANSIT_ORACLE,
    title: "Transit Oracle (Oraculum Transitus)",
    description: "Real-time celestial guidance. Understand how current planetary transits (Saturn, Jupiter) influence your unique personal biorhythms.",
    icon: "moonstar",
    price: 10
  }
];

export const getServiceIcon = (iconName: string) => {
  const props = { className: "w-8 h-8" };
  switch (iconName) {
    case 'sparkles': return <Sparkles {...props} className="text-yellow-400" />;
    case 'heart': return <Heart {...props} className="text-red-400" />;
    case 'briefcase': return <Briefcase {...props} className="text-blue-400" />;
    case 'calendar': return <Calendar {...props} className="text-green-400" />;
    case 'hash': return <Hash {...props} className="text-purple-400" />;
    case 'globe': return <Globe {...props} className="text-indigo-400" />;
    case 'history': return <History {...props} className="text-amber-600" />;
    case 'activity': return <Activity {...props} className="text-emerald-400" />;
    case 'moonstar': return <MoonStar {...props} className="text-sky-300" />;
    case 'zap': return <Zap {...props} className="text-orange-400" />;
    case 'star': return <Star {...props} className="text-cosmic-gold" />;
    case 'gift': return <Gift {...props} className="text-cosmic-gold" />;
    default: return <Sparkles {...props} />;
  }
};

const PROMPT_CORE = (lang: string) => {
  const langRules: Record<string, string> = {
    'Russian': 'ОТВЕЧАЙ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗУЙ КИРИЛЛИЦУ.',
    'Ukrainian': 'ВІДПОВІДАЙ ВИКЛЮЧНО УКРАЇНСЬКОЮ МОВОЮ. ВИКОРИСТОВУЙ КИРИЛИЦЮ.',
    'English': 'REPLY ONLY IN ENGLISH.'
  };
  return `
    ${langRules[lang] || `Reply strictly in ${lang}.`}
    IDENTITY: ATLANTIC ORACLE. Authority in Astrology & Numerology.
    DATE: FEBRUARY 9, 2026.
    FORMAT: No stars (*). Use headers # and ##.
    DEPTH: Professional and extensive analysis.
    
    MANDATORY FINAL SECTION: 
    Every report MUST end with a substantial section titled "# Synthesis and the Path of Harmony" (or translation). 
    REQUIREMENTS FOR THIS FINAL SECTION:
    1. Summarize the entire study in simple, clear, and accessible language (layman's terms).
    2. Motivate the subject towards creativity, positive construction, and deep mutual understanding.
    3. Infuse the text with a "High Vibration" - a positive, uplifting, and empowering vibe.
    4. Include a gentle protective warning against impulsive, reactive, or ill-considered decisions.
    5. Ensure it feels like a standalone "Page of Wisdom" that the user will want to remember.
  `;
};

export const COSMIC_PROMPTS = {
  [ServiceType.NATAL_MATRIX]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Matrix Natalis. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate 2000-2500 words. Comprehensive soul map, Ascendant, Moon nodes. Include the final "Path of Harmony" section.
  `,
  [ServiceType.CELESTIAL_UNION]: (n1: string, d1: string, t1: string, n2: string, d2: string, t2: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Unio Caelestis. ${n1} (${d1} ${t1}) and ${n2} (${d2} ${t2}).
    Analyze synastry. 2000-2500 words. Karmic connection and advice. Include the final "Path of Harmony" section.
  `,
  GIFT_MONTHLY_HOROSCOPE: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SPECIAL GIFT SERVICE: Monthly Personal Horoscope. 
    Subject: ${name}, born ${date}.
    Generate a 1200-1500 word forecast for the next 30 days starting from February 9, 2026.
    Structure:
    1. Overall monthly vibration.
    2. Weekly breakdown (Weeks 1-4).
    3. Days of power.
    4. Health and Love focus.
    5. Final "Path of Harmony" section (Motivation, Simple Summary, High Vibrations).
    Tone: Deeply encouraging, precise, mystical.
  `,
  [ServiceType.PYTHAGOREAN_DESTINY]: (name: string, date: string, lang: string) => `${PROMPT_CORE(lang)} Service: Destinatio Pythagorica. ${name} (${date}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.MATRIX_FATE]: (name: string, date: string, lang: string) => `${PROMPT_CORE(lang)} Service: Horoscopus Annua. ${name} (${date}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.VOCATIONAL_STARS]: (name: string, date: string, time: string, lang: string) => `${PROMPT_CORE(lang)} Service: Astra Vocationalis. ${name} (${date} ${time}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.SOLAR_RETURN]: (name: string, date: string, time: string, lang: string) => `${PROMPT_CORE(lang)} Service: Revolutio Solaris. ${name} (${date} ${time}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.KARMIC_ECHOES]: (name: string, date: string, time: string, lang: string) => `${PROMPT_CORE(lang)} Service: Echoes Karmica. ${name} (${date} ${time}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.GOLDEN_NAME]: (name: string, date: string, lang: string) => `${PROMPT_CORE(lang)} Service: Nomen Aureum. ${name} (${date}). 2000+ words. Include Path of Harmony.`,
  [ServiceType.TRANSIT_ORACLE]: (name: string, date: string, time: string, lang: string) => `${PROMPT_CORE(lang)} Service: Oraculum Transitus. ${name} (${date} ${time}). 2000+ words. Include Path of Harmony.`
};
