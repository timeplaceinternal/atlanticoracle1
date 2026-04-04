import { GoogleGenAI } from "@google/genai";
import { ReadingRequest, ServiceType, ReportLanguage } from "../types";
import { COSMIC_PROMPTS } from "../constants";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing from environment variables.");
    throw new Error("The Oracle is currently disconnected from the cosmic source (API Key missing). Please contact support.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  let prompt = "";
  const { 
    serviceId, name, birthDate, birthTime, birthPlace, language, 
    partnerName, partnerBirthDate, partnerBirthTime, 
    dreamDescription, dreamKeywords, dreamDate, dreamTime,
    sportsSide1, sportsSide2, sportsVenue, sportsDate
  } = request;

  if (serviceId === ServiceType.LOVE_SYNASTRY || serviceId === ServiceType.RELATIONSHIP_SPARK) {
    prompt = (COSMIC_PROMPTS as any)[serviceId](
      name, birthDate, birthTime || "unknown",
      partnerName || "Partner", partnerBirthDate || "unknown", partnerBirthTime || "unknown",
      language
    );
  } else if (serviceId === ServiceType.SPORTS_ORACLE) {
    prompt = COSMIC_PROMPTS[ServiceType.SPORTS_ORACLE](
      sportsSide1 || "Unknown Side 1",
      sportsSide2 || "Unknown Side 2",
      sportsVenue || "Unknown Venue",
      sportsDate || "Unknown Date",
      language
    );
  } else if (serviceId === ServiceType.DREAM_INTERPRETATION || serviceId === ServiceType.FREE_DREAM_INTERPRETATION) {
    prompt = COSMIC_PROMPTS[serviceId](
      name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown",
      dreamDescription || "", dreamKeywords || "", dreamDate || "", dreamTime || "",
      language
    );
  } else if (serviceId === ServiceType.PYTHAGOREAN_CODE || serviceId === ServiceType.FORTUNE_MAP || serviceId === ServiceType.CAPITAL_ALIGNMENT || serviceId === ServiceType.ENERGY_PULSE) {
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", language);
  } else {
    // Standard services (Natal Chart, Yearly Solar, etc.)
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown", language);
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: serviceId === ServiceType.SPORTS_ORACLE ? [{ googleSearch: {} }] : undefined
    }
  });
  
  return response.text || "The stars are silent today.";
};

export const generateHoroscope = async (sign: string, language: ReportLanguage, day: 'today' | 'tomorrow' = 'tomorrow'): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing from environment variables.");
    throw new Error("The Oracle is currently disconnected from the cosmic source (API Key missing).");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = (COSMIC_PROMPTS as any)[ServiceType.HOROSCOPE_TOMORROW](sign, language, day);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "The stars are silent today.";
};
