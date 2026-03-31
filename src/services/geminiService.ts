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
  const { serviceId, name, birthDate, birthTime, birthPlace, language, partnerName, partnerBirthDate, partnerBirthTime, dreamDescription, dreamKeywords, dreamDate, dreamTime } = request;

  if (serviceId === ServiceType.LOVE_SYNASTRY) {
    prompt = COSMIC_PROMPTS[ServiceType.LOVE_SYNASTRY](
      name, birthDate, birthTime || "unknown",
      partnerName || "Partner", partnerBirthDate || "unknown", partnerBirthTime || "unknown",
      language
    );
  } else if (serviceId === ServiceType.DREAM_INTERPRETATION || serviceId === ServiceType.FREE_DREAM_INTERPRETATION) {
    prompt = COSMIC_PROMPTS[serviceId](
      name, birthDate, birthTime || "unknown", birthPlace,
      dreamDescription || "", dreamKeywords || "", dreamDate || "", dreamTime || "",
      language
    );
  } else if (serviceId === ServiceType.PYTHAGOREAN_CODE || serviceId === ServiceType.FORTUNE_MAP || serviceId === ServiceType.CAPITAL_ALIGNMENT || serviceId === ServiceType.ENERGY_PULSE) {
    prompt = (COSMIC_PROMPTS as any)[serviceId](name, birthDate, language);
  } else {
    // Standard services (Natal Chart, Yearly Solar, etc.)
    prompt = (COSMIC_PROMPTS as any)[serviceId](name, birthDate, birthTime || "unknown", birthPlace, language);
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "The stars are silent today.";
};

export const generateHoroscope = async (sign: string, language: ReportLanguage): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing from environment variables.");
    throw new Error("The Oracle is currently disconnected from the cosmic source (API Key missing).");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = (COSMIC_PROMPTS as any)[ServiceType.HOROSCOPE_TOMORROW](sign, language);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "The stars are silent today.";
};
