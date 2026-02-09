
export enum ServiceType {
  SOUL_HOROSCOPE = 'soul-horoscope',
  UNION_HARMONY = 'union-harmony',
  CAREER_FINANCE = 'career-finance',
  BEST_MOMENT = 'best-moment',
  NUMEROLOGY = 'numerology',
  MUNDANE = 'mundane',
  ANNUAL_FORECAST = 'annual-forecast',
  MONTHLY_FORECAST = 'monthly-forecast'
}

export interface Service {
  id: ServiceType;
  title: string;
  description: string;
  icon: string;
  price: number;
}

export interface ReadingRequest {
  serviceId: ServiceType;
  name: string;
  partnerName?: string;
  birthDate: string;
  partnerBirthDate?: string;
  birthTime?: string;
  birthPlace: string;
}

export interface ReadingResult {
  id: string;
  serviceId: ServiceType;
  content: string;
  timestamp: number;
  userName: string;
}
