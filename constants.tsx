
import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Briefcase, 
  Calendar, 
  Hash, 
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { ServiceType, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: ServiceType.SOUL_HOROSCOPE,
    title: "Soul Horoscope",
    description: "A deep, poetic exploration of your karmic path and spiritual destiny based on your birth alignment.",
    icon: "sparkles",
    price: 10
  },
  {
    id: ServiceType.ANNUAL_FORECAST,
    title: "Annual Solar Cycle",
    description: "A comprehensive 12-month map of your celestial transits. Prepare for major shifts in purpose and vitality.",
    icon: "sun",
    price: 10
  },
  {
    id: ServiceType.MONTHLY_FORECAST,
    title: "Lunar Transit Monthly",
    description: "Detailed guidance for the next 30 days. Navigate planetary movements and optimize your emotional rhythm.",
    icon: "moon",
    price: 10
  },
  {
    id: ServiceType.UNION_HARMONY,
    title: "Union Harmony",
    description: "Explore the cosmic synergy between two souls. Reveal strengths and divine challenges in your partnership.",
    icon: "heart",
    price: 10
  },
  {
    id: ServiceType.CAREER_FINANCE,
    title: "Career & Finances",
    description: "Align your professional life and wealth potential with the celestial tides of abundance.",
    icon: "briefcase",
    price: 10
  },
  {
    id: ServiceType.NUMEROLOGY,
    title: "Key to Yourself",
    description: "A deep dive into the vibrations of your name and numbers. Discover your core frequency and destiny.",
    icon: "hash",
    price: 10
  },
  {
    id: ServiceType.BEST_MOMENT,
    title: "Best Moment Chooser",
    description: "Find the perfect astrological window for launches, weddings, or major life changes.",
    icon: "calendar",
    price: 10
  },
  {
    id: ServiceType.MUNDANE,
    title: "Global & EU Trends",
    description: "Cosmic forecasts for countries, the EU, or global shifts for the period of 2026–2030 and beyond.",
    icon: "globe",
    price: 10
  }
];

export const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'sparkles': return <Sparkles className="w-8 h-8 text-yellow-400" />;
    case 'heart': return <Heart className="w-8 h-8 text-red-400" />;
    case 'briefcase': return <Briefcase className="w-8 h-8 text-blue-400" />;
    case 'calendar': return <Calendar className="w-8 h-8 text-green-400" />;
    case 'hash': return <Hash className="w-8 h-8 text-purple-400" />;
    case 'globe': return <Globe className="w-8 h-8 text-indigo-400" />;
    case 'sun': return <Sun className="w-8 h-8 text-orange-400" />;
    case 'moon': return <Moon className="w-8 h-8 text-slate-300" />;
    default: return <Sparkles className="w-8 h-8 text-yellow-400" />;
  }
};

export const COSMIC_PROMPTS = {
  [ServiceType.SOUL_HOROSCOPE]: (name: string, date: string, time: string, place: string) => `
    Generate a deep, poetic "Soul Horoscope" for ${name}, born on ${date} at ${time} in ${place}.
    Format:
    1. Your Cosmic Signature
    2. Soul Mission: The North Node
    3. Core Strengths
    4. Karmic Lessons
    5. Transits for 2026-2027
    6. Advice
    
    1200 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.ANNUAL_FORECAST]: (name: string, date: string, time: string, place: string) => `
    Generate a comprehensive "Annual Solar Cycle Forecast" for ${name} (${date}, ${time}, ${place}) for the next 12 months.
    Analyze major outer planet transits (Jupiter, Saturn, Uranus, Neptune, Pluto).
    Structure:
    1. The Theme of Your Year
    2. Major Planetary Thresholds
    3. Quarterly Chapters: 
       - Q1: Emergence
       - Q2: Manifestation
       - Q3: Re-evaluation
       - Q4: Integration
    4. Love, Career, and Vitality Cycles
    5. Important Dates to Watch
    1400 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.MONTHLY_FORECAST]: (name: string, date: string, time: string, place: string) => `
    Generate a "Lunar Transit Monthly Forecast" for ${name} (${date}, ${time}, ${place}) for the next 30 days.
    Focus on the Moon cycles, Mercury, Venus, and Mars movements relative to the natal chart.
    Structure:
    1. Monthly Vibration Summary
    2. The New Moon & Full Moon Impact
    3. Week-by-Week Navigation
    4. Emotional Tides
    5. Daily Ritual Suggestions
    1200 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.UNION_HARMONY]: (name1: string, date1: string, name2: string, date2: string) => `
    Analyze compatibilty: ${name1} (${date1}) & ${name2} (${date2}).
    Focus on Synastry.
    1200 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.CAREER_FINANCE]: (name: string, date: string) => `
    Career forecast for ${name} (${date}) for 2026-2027.
    Analyze 2nd/10th houses.
    1200 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.NUMEROLOGY]: (name: string, date: string) => `
    Numerology for ${name} (${date}).
    Life Path, Expression, Soul Urge.
    1200 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.BEST_MOMENT]: (goal: string, birthDate: string) => `
    Electional Astrology analysis for goal: "${goal}".
    The seeker was born on ${birthDate}. 
    Identify 3 "Golden Windows" in the next 12 months (starting Feb 2026) that align with their natal chart.
    1000 words. Markdown # headers. No bolding with stars.
  `,
  [ServiceType.MUNDANE]: () => `
    Mundane forecast 2026-2030. Focus on Europe.
    Pluto in Aquarius, Neptune in Aries, Uranus in Gemini.
    1400 words. Markdown # headers. No bolding with stars.
  `
};
