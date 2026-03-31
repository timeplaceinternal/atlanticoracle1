
import React from 'react';
import { 
  Sparkles, Heart, Briefcase, Calendar, Hash, Globe, 
  History, Activity, MoonStar, Star, ShieldCheck, Zap, Gift, Compass, Fingerprint, TrendingUp, Coins, Battery, Baby, Moon
} from 'lucide-react';
import { ServiceType, Service, NewsPost } from './types';

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'init-1',
    slug: 'the-saturn-shift-navigating-the-great-restructuring',
    title: 'The Saturn Shift: Navigating the Great Restructuring',
    date: '2026-02-22',
    topic: 'astrology',
    format: 'forecast',
    text: 'As Saturn moves through the final degrees of its current transit, the collective consciousness is undergoing a profound restructuring. This period marks the end of old systems and the birth of new, more resilient structures. For individuals, this is a time to audit your foundations. What is built on sand will crumble; what is built on truth will endure. Pay close attention to your professional boundaries and long-term commitments during this celestial window.',
    imageUrl: 'https://picsum.photos/seed/saturn/1200/800'
  }
];

export const LIGHT_DROPS: Service[] = [
  {
    id: ServiceType.FORTUNE_MAP,
    title: "The Fortune Map (Weekly Forecast)",
    description: "Your personalized weekly luck index, power windows, and numerical vibrations for the next 7 days.",
    icon: "trending",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04", // Replace with 5 EUR link
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.CAPITAL_ALIGNMENT,
    title: "Capital Alignment",
    description: "Identify your leading income energy and financial resource leaks.",
    icon: "coins",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.ENERGY_PULSE,
    title: "The Energy Pulse",
    description: "Biological rhythm guide and a 1-minute mental reset technique.",
    icon: "battery",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Portuguese: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06",
      Portuguese: "https://buy.stripe.com/aFa6oI4jX2qE3jibAaeEo06"
    }
  },
  {
    id: ServiceType.FREE_DREAM_INTERPRETATION,
    title: "The Dream Whisper",
    description: "A brief psychological insight into your dream. Soft advice from a wise sage to help you find clarity.",
    icon: "moonstar",
    price: 10,
    isFree: false,
    stripeUrls: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  }
];

export const SERVICES: Service[] = [
  {
    id: ServiceType.NATAL_CHART,
    title: "The Natal Matrix (Natal Chart Report)",
    description: "Your cosmic blueprint. A deep psychological portrait based on planetary positions at birth. Discover your innate strengths, core weaknesses, and the unique architecture of your personality.",
    icon: "sparkles",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04", // Replace with 15 EUR link
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04" // Replace with 15 EUR link
    }
  },
  {
    id: ServiceType.LOVE_SYNASTRY,
    title: "Synastry & Love Compatibility",
    description: "Our most requested guide. Why are you drawn to each other? Explore relationship dynamics, domestic harmony, and sexual chemistry between two souls.",
    icon: "heart",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.YEARLY_SOLAR,
    title: "The 12-Month Solar Return (Yearly Forecast)",
    description: "\"Your Year Ahead.\" A comprehensive roadmap for the next 12 months. Identify key dates of fortune, periods of luck, and celestial warnings from birthday to birthday.",
    icon: "calendar",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.KARMIC_DESTINY,
    title: "Karmic Destiny & Past Lives",
    description: "Identify the lessons you've brought from past incarnations. Understand your Nodes of Fate (North/South Node) and your soul's current mission in this life.",
    icon: "history",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.CAREER_WEALTH,
    title: "Career & Wealth Alignment",
    description: "A niche guide for professionals and seekers. Discover where your abundance lies, which sectors offer the highest returns, and the best timing for career shifts.",
    icon: "briefcase",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.PYTHAGOREAN_CODE,
    title: "The Pythagorean Code (Numerology)",
    description: "Mathematical precision for the modern mind. Calculation of your Life Path Number and core vibrations hidden within your birth date and name.",
    icon: "hash",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.HUMAN_DESIGN,
    title: "Human Design: The Strategy of Life",
    description: "Identify your energetic type (Manifestor, Generator, etc.). Learn how to make decisions without resistance and align with your natural flow.",
    icon: "fingerprint",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.ASTRO_CARTOGRAPHY,
    title: "Astro-Cartography (Relocation Map)",
    description: "\"Where is your city of power?\" Find specific coordinates on Earth where you'll encounter love, career breakthroughs, or spiritual peace.",
    icon: "globe",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.SATURN_RETURN,
    title: "Saturn Return Survival Guide",
    description: "Navigate the critical crisis of age 29-30. Learn how to survive this cosmic 'coming of age' and emerge as a mature, victorious version of yourself.",
    icon: "zap",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.DREAM_INTERPRETATION,
    title: "The Sage's Dream Decree",
    description: "A comprehensive interpretation of your dream. Discover the psychological roots, symbolic meanings, and how it aligns with your cosmic path.",
    icon: "moonstar",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.GOLDEN_SEED,
    title: "The Golden Seed (Child’s Cosmic Blueprint)",
    description: "\"The ultimate manual for conscious parents.\" Understand your child's energy from birth. This report is not about \"fate,\" but about potential: how they learn, how they express emotions, and in which activities they will flourish most brightly. Help the \"golden seed\" sprout without resistance.",
    icon: "baby",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  },
  {
    id: ServiceType.SHADOW_WORK,
    title: "The Shadow Work Ritual (Lilith & Pluto Deep Dive)",
    description: "\"Meet your dark side and turn it into your greatest ally.\" A deep analysis of Lilith, Pluto, and retrograde planets in your chart. Explore your repressed desires, fears, and irrational blocks. This report is for those ready for radical honesty and wanting to reclaim energy locked in the \"Shadow\" aspects of their personality.",
    icon: "moon",
    price: 30,
    stripeUrls: {
      English: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05",
      Portuguese: "https://buy.stripe.com/3cI4gA3fTc1e7zycEeeEo05"
    },
    stripeUrlsDiscounted: {
      English: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04",
      Portuguese: "https://buy.stripe.com/eVqbJ28Ad5CQ3ji1ZAeEo04"
    }
  }
];

export const ZODIAC_SIGNS = [
  { id: 'aries', name: { English: 'Aries', Portuguese: 'Áries' }, symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { id: 'taurus', name: { English: 'Taurus', Portuguese: 'Touro' }, symbol: '♉', dates: 'Apr 20 - May 20' },
  { id: 'gemini', name: { English: 'Gemini', Portuguese: 'Gêmeos' }, symbol: '♊', dates: 'May 21 - Jun 20' },
  { id: 'cancer', name: { English: 'Cancer', Portuguese: 'Câncer' }, symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { id: 'leo', name: { English: 'Leo', Portuguese: 'Leão' }, symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { id: 'virgo', name: { English: 'Virgo', Portuguese: 'Virgem' }, symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { id: 'libra', name: { English: 'Libra', Portuguese: 'Libra' }, symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { id: 'scorpio', name: { English: 'Scorpio', Portuguese: 'Escorpião' }, symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { id: 'sagittarius', name: { English: 'Sagittarius', Portuguese: 'Sagitário' }, symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { id: 'capricorn', name: { English: 'Capricorn', Portuguese: 'Capricórnio' }, symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { id: 'aquarius', name: { English: 'Aquarius', Portuguese: 'Aquário' }, symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { id: 'pisces', name: { English: 'Pisces', Portuguese: 'Peixes' }, symbol: '♓', dates: 'Feb 19 - Mar 20' }
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
    case 'baby': return <Baby {...props} className="text-cosmic-gold" />;
    case 'moon': return <Moon {...props} className="text-cosmic-purple" />;
    default: return <Sparkles {...props} />;
  }
};

const BASE_RULES = (lang: string) => {
  const langRules: Record<string, string> = {
    'English': 'REPLY ONLY IN AMERICAN ENGLISH (EN-US).',
    'Portuguese': 'REPLY ONLY IN BRAZILIAN PORTUGUESE (PT-BR).'
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
    STRICTION: DO NOT use Markdown tables. Use plain text or sequential lists.
    STRICTION: NEVER generate URLs, links, or calls to action with fake links.
  `;
};

const PROMPT_CORE = (lang: string) => `
  ${BASE_RULES(lang)}
  DEPTH: Professional, analytical.
  LENGTH: As specified in the service task below.
  STRUCTURE: Use a structured approach with clear chapters or sections where appropriate.
  ENVIRONMENTAL INFLUENCE: Include a few interesting sentences about the subject's birth place (city/country/region). Explain how the specific environment and culture of their origin have helped shape their unique personality and energetic signature.
`;

export const COSMIC_PROMPTS = {
  [ServiceType.NATAL_CHART]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Natal Chart Report (Cosmic Blueprint). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate an extremely deep, professional psychological and astrological portrait. 
    This is a premium 15-page report. Structure it into detailed chapters:
    1. The Ascendant & First Impression.
    2. The Sun: Core Identity & Purpose.
    3. The Moon: Emotional Architecture & Subconscious.
    4. Planetary Clusters & Major Aspects.
    5. Internal Architecture: Strengths, Challenges, and Shadow Aspects.
    6. Life Path & Evolutionary Mandate.
    Provide professional, nuanced analysis for each section.
  `,
  [ServiceType.LOVE_SYNASTRY]: (n1: string, d1: string, t1: string, n2: string, d2: string, t2: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Synastry & Love Compatibility (Relationship Analysis). Partners: ${n1} (${d1} ${t1}) and ${n2} (${d2} ${t2}).
    Generate a comprehensive, professional 15-page relationship analysis.
    Analyze the complex energetic pull between them using multi-layered astrological techniques:
    1. Individual Relationship Needs (Venus/Mars/7th House).
    2. Synastry Overlays: How planets activate each other's houses.
    3. Major Aspects: Harmony vs. Friction.
    4. Composite Energy: The 'Third Entity' of the relationship.
    5. Long-term Compatibility: Domestic life, emotional support, and intimacy.
    6. Karmic Lessons & Growth Potential.
  `,
  [ServiceType.YEARLY_SOLAR]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: 12-Month Solar Return (Yearly Forecast). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, highly detailed 15-page yearly forecast.
    Map out the year ahead with precision:
    1. The Solar Return Chart: The theme of the year.
    2. Quarterly Breakdowns: Detailed analysis of each 3-month period.
    3. Major Transits: Lucky windows, critical action points, and warnings.
    4. Monthly Focus: Specific celestial guidance for each month.
    5. Key Life Areas: Career, Love, Health, and Personal Growth.
  `,
  [ServiceType.KARMIC_DESTINY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Karmic Destiny & Past Lives. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a profound, professional 15-page karmic analysis.
    Explore the soul's journey:
    1. The South Node: Past life residues and comfort zones.
    2. The North Node: The current life's spiritual mandate and growth direction.
    3. Saturn & Pluto: Karmic debts and transformative blocks.
    4. Retrograde Planets: Internalized lessons from the past.
    5. The Evolutionary Path: How to align with the soul's purpose.
  `,
  [ServiceType.CAREER_WEALTH]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Career & Wealth Alignment. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, strategic 15-page financial and career guide.
    Focus on abundance and professional trajectory:
    1. The 2nd House: Personal resources and value systems.
    2. The 6th House: Daily work, service, and environment.
    3. The 10th House: Public status, career, and legacy.
    4. Midheaven (MC): The professional peak and sectors of highest return.
    5. Financial Timing: Best windows for shifts, investments, and expansion.
    6. Overcoming Hurdles: Identifying and clearing wealth blocks.
  `,
  [ServiceType.PYTHAGOREAN_CODE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Pythagorean Code (Numerology). Subject: ${name}, born ${date}.
    Generate a mathematically precise, professional 15-page numerological report.
    1. The Life Path Number: The destined trajectory.
    2. Expression & Soul Urge Numbers: Hidden desires and talents.
    3. Birthday Number: Specific tools for the journey.
    4. Personal Year Cycle: Current vibrations and timing.
    5. The Core Matrix: How numbers interact to form the personality.
  `,
  [ServiceType.HUMAN_DESIGN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Human Design Strategy. Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate an in-depth, professional 15-page Human Design manual.
    1. Type & Strategy: How to move through the world without resistance.
    2. Inner Authority: The correct way to make decisions.
    3. Profile: The costume of your purpose.
    4. Defined vs. Undefined Centers: Where you are consistent vs. where you are conditioned.
    5. Channels & Gates: Specific energetic strengths.
    6. Living Your Design: Practical integration for daily life.
  `,
  [ServiceType.ASTRO_CARTOGRAPHY]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Astro-Cartography (Power Locations). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, comprehensive 15-page global relocation guide.
    1. Planetary Lines: Detailed analysis of Sun, Moon, Venus, Jupiter, and Mars lines.
    2. City of Power: Identifying coordinates for career breakthroughs.
    3. Love & Sanctuary: Best locations for relationships and peace.
    4. Local Space Astrology: How specific directions impact the subject.
    5. Timing for Travel/Relocation: When to move for maximum benefit.
  `,
  [ServiceType.SATURN_RETURN]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: Saturn Return Survival Guide (Age 29-30 Crisis). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, transformative 15-page guide for this critical life stage.
    1. Saturn's Natal Placement: The foundation of your responsibility.
    2. The 29.5-Year Cycle: Understanding the 'Cosmic Coming of Age'.
    3. The Return Transit: Specific phases and challenges of the return.
    4. Mastering Lessons: Career, relationships, and self-authority.
    5. Emerging Victorious: How to build a solid foundation for the next 30 years.
  `,
  // FREE SERVICES PROMPTS
  [ServiceType.FORTUNE_MAP]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE FORTUNE MAP. Subject: ${name}, born ${date}.
    Generate a professional, highly detailed 4-page weekly forecast.
    1. Weekly Chart: List 7 days sequentially. Format: "Day 1 - [Details], Day 2 - [Details]...". Include Luck Index (1-10), Power Window, and Risk Level for each day. DO NOT USE TABLES.
    2. Numerology: Calculate 3 'Golden Numbers' for the subject this week.
    3. Strategic Advice: Define the emotional state in which they MUST NOT make risky decisions.
    4. Detailed Daily Breakdown: Provide a paragraph of analysis for each day of the week to ensure the report reaches at least 4 pages of depth.
  `,
  [ServiceType.CAPITAL_ALIGNMENT]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: CAPITAL ALIGNMENT. Subject: ${name}, born ${date}.
    Generate a professional, comprehensive 4-page financial energy analysis.
    1. Capital Analysis: Define leading income energy (structure, charisma, or intuition).
    2. Loss Zone: Where are they leaking resources internally?
    3. Investment in SELF: Professional advice on why knowing their mechanics provides the highest ROI.
    4. Weekly Plan: List 3 specific financial actions sequentially (Action 1, Action 2, Action 3). DO NOT USE TABLES.
    5. Deep Financial Strategy: Expand on each point with professional depth to ensure a 4-page comprehensive report.
  `,
  [ServiceType.ENERGY_PULSE]: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE ENERGY PULSE. Subject: ${name}, born ${date}.
    Generate a professional, detailed 4-page energetic rhythm guide.
    1. Force Dynamics: List weekly energy peak and silence days sequentially. DO NOT USE TABLES.
    2. Bio-rhythms: Professional sleep/activity advice based on birth date.
    3. Reset Technique: One 1-minute mental reset practice (breathing/visualization).
    4. Focus Mode: Strategic direction for energy (Health, Relations, Career).
    5. Extended Energetic Analysis: Provide deep insights into the subject's biological rhythms to ensure the report reaches at least 4 pages.
  `,
  [ServiceType.FREE_DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE DREAM WHISPER. Subject: ${name}. 
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a professional, deep psychological interpretation (~4 pages). 
    STYLE: Professional, analytical yet empathetic, soft advice from a "wise sage". 
    Focus on clarity and a strategic path forward. Expand on the symbols and archetypes to provide a comprehensive 4-page decree.
  `,
  [ServiceType.DREAM_INTERPRETATION]: (name: string, bDate: string, bTime: string, bPlace: string, description: string, keywords: string, dDate: string, dTime: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SERVICE: THE SAGE'S DREAM DECREE. Subject: ${name}, born ${bDate} at ${bTime} in ${bPlace}.
    DREAM DATE/TIME: ${dDate} ${dTime}.
    DREAM DESCRIPTION: ${description}
    KEYWORDS: ${keywords}
    
    TASK: Provide a professional, comprehensive 15-page dream analysis.
    1. Symbolic & Archetypal Analysis: Deep psychological dive.
    2. The "Why": Detailed logic behind symbols based on collective unconscious.
    3. Cosmic Alignment: How this dream interacts with the subject's natal chart and current transits.
    4. The Sage's Path: Professional advice and a gentle, wise path forward.
    
    STYLE: Simple, understandable language of a "wise sage". Trusting and positive.
  `,
  [ServiceType.GOLDEN_SEED]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Golden Seed (Child’s Cosmic Blueprint). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a professional, highly detailed 15-page child's cosmic manual.
    1. Energetic Potential: The core essence of the child.
    2. Learning & Cognitive Style: How they process information.
    3. Emotional Expression: Understanding their internal world.
    4. Talents & Flourishing: Activities that align with their nature.
    5. Conscious Parenting: Practical advice for supporting their unique path.
  `,
  [ServiceType.SHADOW_WORK]: (name: string, date: string, time: string, place: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    Service: The Shadow Work Ritual (Lilith & Pluto Deep Dive). Subject: ${name}, born ${date} at ${time} in ${place}.
    Generate a profound, professional 15-page shadow analysis.
    1. Lilith & Pluto: The primary shadow archetypes in the chart.
    2. Retrograde Planets: Internalized karmic blocks.
    3. Repressed Desires & Fears: Identifying the hidden self.
    4. The Reclaiming Ritual: A professional therapeutic/ritualistic approach to integration.
    5. Transformative Integration: Turning shadow into power.
    5. Transformative Integration: Turning shadow into power.
  `,
  [ServiceType.HOROSCOPE_TOMORROW]: (sign: string, lang: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();

    return `
      ${BASE_RULES(lang)}
      SERVICE: PERSONAL HOROSCOPE FOR TOMORROW. 
      ZODIAC SIGN: ${sign}.
      TARGET DATE: ${tomorrowStr}.
      
      TASK: Provide a concise, friendly, and advising astrological forecast for ${sign} for tomorrow.
      STYLE: Simple, clear, friendly, and encouraging. No "water" or filler text.
      CONTENT: General astrological advice for everyone born under this sign. 
      STRICTION: DO NOT mention birth place, birth time, or any personal details. This is a general forecast.
      STRICTION: Keep it short (1-2 small paragraphs).
      FORMAT: Markdown. No stars (*). Use ## for the title.
    `;
  },
  GIFT_MONTHLY_HOROSCOPE: (name: string, date: string, lang: string) => `
    ${PROMPT_CORE(lang)}
    SPECIAL GIFT: Personal Monthly Forecast. Subject: ${name}, born ${date}.
    Provide a detailed 30-day forecast. Highlight major transits, weekly focus points, and high-vibration spiritual advice.
  `
};
