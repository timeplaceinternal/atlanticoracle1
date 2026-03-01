
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
  // Free Services
  FORTUNE_MAP = 'free-fortune-map',
  CAPITAL_ALIGNMENT = 'free-capital-alignment',
  ENERGY_PULSE = 'free-energy-pulse',
  FREE_DREAM_INTERPRETATION = 'free-dream-interpretation'
}

export type ReportLanguage = 'English' | 'French' | 'German' | 'Spanish' | 'Italian' | 'Portuguese';

export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  icon: string;
  price: number;
  isFree?: boolean;
}

export interface ReadingRequest {
  serviceId: ServiceType;
  name: string;
  partnerName?: string;
  birthDate: string;
  partnerBirthDate?: string;
  birthTime?: string;
  partnerBirthTime?: string;
  birthPlace: string;
  language: ReportLanguage;
  dreamDescription?: string;
  dreamKeywords?: string;
  dreamDate?: string;
  dreamTime?: string;
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

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  text: string;
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
