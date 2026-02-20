
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
  // Free Services
  FORTUNE_MAP = 'free-fortune-map',
  CAPITAL_ALIGNMENT = 'free-capital-alignment',
  ENERGY_PULSE = 'free-energy-pulse'
}

export type ReportLanguage = 'English' | 'French' | 'German' | 'Spanish' | 'Italian' | 'Russian' | 'Ukrainian';

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

export type PostFormat = 'fact' | 'forecast' | 'series';

export interface NewsPost {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  format: PostFormat;
  topic: 'astrology' | 'numerology' | 'astronomy';
  date: string;
  images?: string[]; // For slider format
  videoUrl?: string; // YouTube URL
}
