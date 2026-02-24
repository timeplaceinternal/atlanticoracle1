
import React from 'react';
import { 
  Sparkles, Heart, Briefcase, Calendar, Hash, Globe, 
  History, Activity, MoonStar, Star, ShieldCheck, Zap, Gift, Compass, Fingerprint, TrendingUp, Coins, Battery
} from 'lucide-react';
import { ServiceType, Service, NewsPost } from './types';

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'init-1',
    title: 'The Saturn Shift: Navigating the Great Restructuring',
    date: '2026-02-22',
    topic: 'astrology',
    format: 'forecast',
    text: 'As Saturn moves through the final degrees of its current transit, the collective consciousness is undergoing a profound restructuring. This period marks the end of old systems and the birth of new, more resilient structures. For individuals, this is a time to audit your foundations. What is built on sand will crumble; what is built on truth will endure. Pay close attention to your professional boundaries and long-term commitments during this celestial window.',
    imageUrl: 'https://picsum.photos/seed/saturn/1200/800'
  }
];

export const FREE_SERVICES: Service[] = [
  {
    id: ServiceType.FORTUNE_MAP,
    title: "The Fortune Map (Weekly Forecast)",
    description: "Your personalized weekly luck index, power windows, and numerical vibrations for the next 7 days.",
    icon: "trending",
    price: 0,
    isFree: true
  },
  {
    id: ServiceType.CAPITAL_ALIGNMENT,
    title: "Capital Alignment",
    description: "Identify your leading income energy and financial resource leaks.",
    icon: "coins",
    price: 0,
    isFree: true
  },
  {
    id: ServiceType.ENERGY_PULSE,
    title: "The Energy Pulse",
    description: "Biological rhythm guide and a 1-minute mental reset technique.",
    icon: "battery",
    price: 0,
    isFree: true
  },
  {
    id: ServiceType.FREE_DREAM_INTERPRETATION,
    title: "The Dream Whisper (FREE)",
    description: "A brief psychological insight into your dream. Soft advice from a wise sage to help you find clarity.",
    icon: "moonstar",
    price: 0,
    isFree: true
  }
];

export const SERVICES: Service[] = [
  {
    id: ServiceType.NATAL_CHART,
    title: "The Natal Matrix (Natal Chart Report)",
    description: "Your cosmic blueprint. A deep psychological portrait based on planetary positions at birth. Discover your innate strengths, core weaknesses, and the unique architecture of your personality.",
    icon: "sparkles",
    price: 10
  },
  {
    id: ServiceType.LOVE_SYNASTRY,
    title: "Synastry & Love Compatibility",
    description: "Our most requested guide. Why are you drawn to each other? Explore relationship dynamics, domestic harmony, and sexual chemistry between two souls.",
    icon: "heart",
    price: 10
  },
  {
    id: ServiceType.YEARLY_SOLAR,
    title: "The 12-Month Solar Return (Yearly Forecast)",
    description: "\"Your Year Ahead.\" A comprehensive roadmap for the next 12 months. Identify key dates of fortune, periods of luck, and celestial warnings from birthday to birthday.",
    icon: "calendar",
    price: 10
  },
  {
    id: ServiceType.KARMIC_DESTINY,
    title: "Karmic Destiny & Past Lives",
    description: "Identify the lessons you've brought from past incarnations. Understand your Nodes of Fate (North/South Node) and your soul's current mission in this life.",
    icon: "history",
    price: 10
  },
  {
    id: ServiceType.CAREER_WEALTH,
    title: "Career & Wealth Alignment",
    description: "A niche guide for professionals and seekers. Discover where your abundance lies, which sectors offer the highest returns, and the best timing for career shifts.",
    icon: "briefcase",
    price: 10
  },
  {
    id: ServiceType.PYTHAGOREAN_CODE,
    title: "The Pythagorean Code (Numerology)",
    description: "Mathematical precision for the modern mind. Calculation of your Life Path Number and core vibrations hidden within your birth date and name.",
    icon: "hash",
    price: 10
  },
  {
    id: ServiceType.HUMAN_DESIGN,
    title: "Human Design: The Strategy of Life",
    description: "Identify your energetic type (Manifestor, Generator, etc.). Learn how to make decisions without resistance and align with your natural flow.",
    icon: "fingerprint",
    price: 10
  },
  {
    id: ServiceType.ASTRO_CARTOGRAPHY,
    title: "Astro-Cartography (Relocation Map)",
    description: "\"Where is your city of power?\" Find specific coordinates on Earth where you'll encounter love, career breakthroughs, or spiritual peace.",
    icon: "globe",
    price: 10
  },
  {
    id: ServiceType.SATURN_RETURN,
    title: "Saturn Return Survival Guide",
    description: "Navigate the critical crisis of age 29-30. Learn how to survive this cosmic 'coming of age' and emerge as a mature, victorious version of yourself.",
    icon: "zap",
    price: 10
  },
  {
    id: ServiceType.DREAM_INTERPRETATION,
    title: "The Sage's Dream Decree",
    description: "A comprehensive interpretation of your dream. Discover the psychological roots, symbolic meanings, and how it aligns with your cosmic path.",
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
    case 'fingerprint': return <Fingerprint {...props} className="text-cosmic-purple" />;
    case 'trending': return <TrendingUp {...props} className="text-cosmic-gold" />;
    case 'coins': return <Coins {...props} className="text-cosmic-gold" />;
    case 'battery': return <Battery {...props} className="text-cosmic-gold" />;
    default: return <Sparkles {...props} />;
  }
};

const PROMPT_CORE = (lang: string) => {
  const langRules: Record<string, string> = {
    'Russian': 'REPLY ONLY IN RUSSIAN. USE CYRILLIC.',
    'Ukrainian': 'REPLY ONLY IN UKRAINIAN. USE CYRILLIC.',
    'English': 'REPLY ONLY IN ENGLISH.'
  };
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  return `
    ${langRules[lang] || `Reply strictly in ${lang}.`}
    IDENTITY: ATLANTIC ORACLE. Authority in Astrology, Numerology, and Human Design.
    CURRENT DATE: ${dateStr}.
    FORMAT: No stars (*). Use headers # and ##.
    DEPTH: Professional, analytical.
    STRICTION: DO NOT use Markdown tables. Use plain text or sequential lists.
  `;
};

export const COSMIC_PROMPTS = {
  [ServiceType.NATAL_CHART]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Natal Chart Report (Cosmic Blueprint). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a deep psychological portrait. Analyze the Ascendant, Sun, and Moon placements. Focus on internal architecture, strengths, and shadow aspects.
  `,
  [ServiceType.LOVE_SYNASTRY]: (n1: string, d1: string, t1: string, n2: string, d2: string, t2: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Synastry & Love Compatibility (Relationship Analysis). Partners: ${n1} (${d1} ${t1}) and ${n2} (${d2} ${t2}).
    Analyze the energetic pull between them. Discuss compatibility in domestic life, emotional support, and physical intimacy. Explain the 'why' behind their connection.
  `,
  [ServiceType.YEARLY_SOLAR]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: 12-Month Solar Return (Yearly Forecast). Subject: ${name}, born ${date} at ${time} in ${place}.
    Map out the year ahead starting from the current date. Identify lucky transits, critical windows for action, and celestial warnings.
  `,
  [ServiceType.KARMIC_DESTINY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Karmic Destiny & Past Lives. Subject: ${name}, born ${date} at ${time} in ${place}.
    Explore the Lunar Nodes (North/South). What lessons are brought from previous lives? What is the current life's spiritual mandate?
  `,
  [ServiceType.CAREER_WEALTH]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Career & Wealth Alignment. Subject: ${name}, born ${date} at ${time} in ${place}.
    Focus on the 2nd, 6th, and 10th houses. Identify sectors of abundance, professional timing for shifts, and financial hurdles to overcome.
  `,
  [ServiceType.PYTHAGOREAN_CODE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Pythagorean Code (Numerology). Subject: ${name}, born ${date}.
    Calculate the Life Path Number with mathematical precision. Explain its vibration and the destined trajectory it sets for the subject.
  `,
  [ServiceType.HUMAN_DESIGN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Human Design Strategy. Subject: ${name}, born ${date} at ${time} in ${place}.
    Identify Type, Authority, and Profile. Explain how to make decisions correctly to avoid resistance and live authentically.
  `,
  [ServiceType.ASTRO_CARTOGRAPHY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Astro-Cartography (Power Locations). Subject: ${name}, born ${date} at ${time} in ${place}.
    Suggest global locations based on planetary lines. Where will they find love? Where is the career rise? Where is the sanctuary?
  `,
  [ServiceType.SATURN_RETURN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Saturn Return Survival Guide (Age 29-30 Crisis). Subject: ${name}, born ${date} at ${time} in ${place}.
    Analyze Saturn's placement. Explain the significance of the 29.5-year cycle. Provide advice for maturity and mastering life's heavy lessons.
  `,
  // FREE SERVICES PROMPTS
  [ServiceType.FORTUNE_MAP]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: [FREE] THE FORTUNE MAP. Subject: ${name}, born ${date}.
    1. Weekly Chart: List 7 days sequentially. Format: "Day 1 - [Details], Day 2 - [Details]...". Include Luck Index (1-10), Power Window, and Risk Level for each day. DO NOT USE TABLES.
    2. Numerology: Calculate 3 'Golden Numbers' for the subject this week.
    3. Player Advice: Define the emotional state in which they MUST NOT make risky decisions.
    End with a call to see their full Natal Decree.
  `,
  [ServiceType.CAPITAL_ALIGNMENT]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: [FREE] CAPITAL ALIGNMENT. Subject: ${name}, born ${date}.
    1. Capital Analysis: Define leading income energy (structure, charisma, or intuition).
    2. Loss Zone: Where are they leaking resources internally?
    3. Investment in SELF: Advice on why knowing their mechanics provides the highest ROI.
    4. Weekly Plan: List 3 specific financial actions sequentially (Action 1, Action 2, Action 3). DO NOT USE TABLES.
    End with a link to the full Career & Wealth Decree.
  `,
  [ServiceType.ENERGY_PULSE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: [FREE] THE ENERGY PULSE. Subject: ${name}, born ${date}.
    1. Force Dynamics: List weekly energy peak and silence days sequentially. DO NOT USE TABLES.
    2. Bio-rhythms: Sleep/activity advice based on birth date.
    3. Reset Technique: One 1-minute mental reset practice (breathing/visualization).
    4. Focus Mode: Where to direct energy (Health, Relations, Career).
    End with a call to unlock their full energetic cycles in a Natal Decree.
  `,
  [ServiceType.FREE_DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: [FREE] THE DREAM WHISPER. Subject: ${name}. 
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a brief psychological interpretation (~0.5 A4 page). 
    STYLE: Trusting, positive, problem-solving, soft advice from a "wise sage". 
    Avoid complex psychological terms. Focus on clarity and a gentle path forward.
  `,
  [ServiceType.DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE SAGE'S DREAM DECREE. Subject: ${name}, born ${bDate} at ${bTime} in ${bPlace}.
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a comprehensive interpretation. 
    1. The Interpretation: Deep psychological and symbolic analysis.
    2. The "Why": Explain the logic behind this interpretation (symbols, archetypes).
    3. Cosmic Alignment: How this dream relates to the subject's current astrological and numerical vibrations (based on their birth data and the dream's timing).
    4. The Sage's Summary: A gentle, wise summary and advice.
    
    STYLE: Simple, understandable language of a "wise sage". Trusting and positive.
  `,
  GIFT_MONTHLY_HOROSCOPE: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SPECIAL GIFT: Personal Monthly Forecast. Subject: ${name}, born ${date}.
    Provide a detailed 30-day forecast. Highlight major transits, weekly focus points, and high-vibration spiritual advice.
  `
};
