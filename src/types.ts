
export enum ServiceType {
  NATAL_CHART = 'natal-chart',
  LOVE_SYNASTRY = 'love-synastry',
  YEARLY_SOLAR = 'yearly-solar',
  KARMIC_DESTINY = 'karmic-destiny',
  CAREER_WEALTH = 'career-wealth',
  PYTHAGOREAN_CODE = 'pythagorean-code',
  HUMAN_DESIGN = 'human-design',
  ASTRO_CARTOGRAPHY = 'astro-cartography',
  SATURN_RETURN = 'saturn-return',
  DREAM_INTERPRETATION = 'dream-interpretation',
  GOLDEN_SEED = 'golden-seed',
  SHADOW_WORK = 'shadow-work',
  DAILY_VIBRATION = 'daily-vibration',
  RELATIONSHIP_SPARK = 'relationship-spark',
  SPORTS_ORACLE = 'sports-oracle',
  ASTRO_WEATHER = 'astro-weather',
  // Free Services
  FORTUNE_MAP = 'free-fortune-map',
  CAPITAL_ALIGNMENT = 'free-capital-alignment',
  ENERGY_PULSE = 'free-energy-pulse',
  FREE_DREAM_INTERPRETATION = 'free-dream-interpretation',
  HOROSCOPE_TOMORROW = 'horoscope-tomorrow',
  GOAL_10_DAYS = 'goal-10-days',
  GOAL_30_DAYS = 'goal-30-days',
  GOAL_100_DAYS = 'goal-100-days'
}

export type ReportLanguage = 'English' | 'Spanish' | 'Portuguese';

export interface Service {
  id: ServiceType;
  slug: string;
  title: string;
  description: string;
  seoContent?: string;
  icon: string;
  price: number;
  isFree?: boolean;
  stripeUrls?: {
    [key in ReportLanguage]?: string;
  };
  stripeUrlsDiscounted?: {
    [key in ReportLanguage]?: string;
  };
}

export interface ReadingRequest {
  serviceId: ServiceType;
  name?: string;
  partnerName?: string;
  birthDate?: string;
  partnerBirthDate?: string;
  birthTime?: string;
  partnerBirthTime?: string;
  birthPlace?: string;
  email?: string;
  language: ReportLanguage;
  isTest?: boolean;
  dreamDescription?: string;
  dreamKeywords?: string;
  dreamDate?: string;
  dreamTime?: string;
  sportsEvent?: string;
  sportsSide1?: string;
  sportsSide2?: string;
  sportsVenue?: string;
  sportsDate?: string;
  sportsContext?: string;
  sportsOdds?: string;
  city?: string;
  forecastDuration?: 'today' | 'tomorrow' | '3days' | '10days';
  zodiacSign?: string;
  goal?: string;
  timestamp: number;
}

export interface ReadingResult {
  id: string;
  serviceId: ServiceType;
  content: string;
  timestamp: number;
  userName: string;
  language: ReportLanguage;
  birthDate: string;
}

export type PostFormat = 'fact' | 'forecast' | 'series' | 'horoscope';

export type KBCategory = 
  | 'astrological-entities' 
  | 'numerical-vibrations' 
  | 'synthesis-methodology' 
  | 'human-design-basics';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface KnowledgeBasePost {
  id: string;
  slug: string;
  category: KBCategory;
  title: string | { [key in ReportLanguage]?: string };
  shortDefinition: string | { [key in ReportLanguage]?: string };
  mainContent: string | { [key in ReportLanguage]?: string };
  dataTable?: string | { [key in ReportLanguage]?: string }; // HTML string for table
  synthesisNote?: string | { [key in ReportLanguage]?: string };
  faq?: FAQItem[] | { [key in ReportLanguage]?: FAQItem[] };
  imageUrl?: string;
  metaTitle?: string | { [key in ReportLanguage]?: string };
  metaDescription?: string | { [key in ReportLanguage]?: string };
  dateModified: string;
  relatedProductId?: ServiceType;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string | { [key in ReportLanguage]?: string };
  text: string | { [key in ReportLanguage]?: string };
  imageUrl: string;
  imageSize?: 'small' | 'large';
  format: PostFormat;
  topic: 'astrology' | 'numerology' | 'astronomy' | 'horoscope';
  date: string;
  images?: string[]; // For slider format
  videoUrl?: string; // YouTube URL
  metaTitle?: string;
  metaDescription?: string;
}
