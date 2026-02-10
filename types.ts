
export enum ServiceType {
  NATAL_MATRIX = 'natal-matrix',
  CELESTIAL_UNION = 'celestial-union',
  PYTHAGOREAN_DESTINY = 'pythagorean-destiny',
  MATRIX_FATE = 'matrix-fate',
  VOCATIONAL_STARS = 'vocational-stars',
  SOLAR_RETURN = 'solar-return',
  KARMIC_ECHOES = 'karmic-echoes',
  GOLDEN_NAME = 'golden-name',
  TRANSIT_ORACLE = 'transit-oracle'
}

export type ReportLanguage = 'English' | 'French' | 'German' | 'Spanish' | 'Italian' | 'Russian' | 'Ukrainian';

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
}
