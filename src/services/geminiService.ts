import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReadingRequest, ServiceType, ReportLanguage } from "../types";
import { COSMIC_PROMPTS } from "../constants";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing from environment variables.");
    throw new Error("The Oracle is currently disconnected from the cosmic source (API Key missing). Please contact support.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    tools: request.serviceId === ServiceType.SPORTS_ORACLE ? [{ googleSearch: {} }] as any : undefined
  });
  
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
  } else if (serviceId === ServiceType.ACTION_PLAN_10 || serviceId === ServiceType.ACTION_PLAN_30 || serviceId === ServiceType.ACTION_PLAN_100) {
    prompt = (COSMIC_PROMPTS as any).ACTION_PLAN(
      name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown",
      request.goal || "Achievement", request.duration || 10,
      language
    );
  } else if (serviceId === ServiceType.PYTHAGOREAN_CODE || serviceId === ServiceType.FORTUNE_MAP || serviceId === ServiceType.CAPITAL_ALIGNMENT || serviceId === ServiceType.ENERGY_PULSE) {
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", language);
  } else {
    // Standard services (Natal Chart, Yearly Solar, etc.)
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown", language);
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || "The stars are silent today.";
};

export const generateAssistantResponse = async (message: string, history: { role: 'user' | 'model', text: string }[], language: ReportLanguage): Promise<string> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing.");
    return "The Oracle is currently disconnected. Please try again later.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    tools: [{ googleSearch: {} }] as any
  });
  
  const systemPrompt = (COSMIC_PROMPTS as any).AI_ASSISTANT(language);
  
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "Understood. I am the Cosmic Guide. I will assist the seeker with expert precision and brevity." }] },
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    ]
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text() || "The stars are silent today.";
};

export const generateHoroscope = async (sign: string, language: ReportLanguage, day: 'today' | 'tomorrow' = 'tomorrow'): Promise<string> => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : null);
  
  if (!apiKey) {
    console.error("!!! GEMINI_API_KEY is missing from environment variables.");
    throw new Error("The Oracle is currently disconnected from the cosmic source (API Key missing).");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = (COSMIC_PROMPTS as any)[ServiceType.HOROSCOPE_TOMORROW](sign, language, day);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || "The stars are silent today.";
};
