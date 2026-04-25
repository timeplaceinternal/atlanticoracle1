import { ReadingRequest, ServiceType, ReportLanguage } from "../types";
import { COSMIC_PROMPTS } from "../constants";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  let prompt = "";
  const { 
    serviceId, name, birthDate, birthTime, birthPlace, language, 
    partnerName, partnerBirthDate, partnerBirthTime, 
    dreamDescription, dreamKeywords, dreamDate, dreamTime,
    sportsSide1, sportsSide2, sportsVenue, sportsDate,
    city, zodiacSign, forecastDuration
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
  } else if (serviceId === ServiceType.GOAL_10_DAYS || serviceId === ServiceType.GOAL_30_DAYS || serviceId === ServiceType.GOAL_100_DAYS) {
    const days = serviceId === ServiceType.GOAL_10_DAYS ? 10 : (serviceId === ServiceType.GOAL_30_DAYS ? 30 : 100);
    prompt = (COSMIC_PROMPTS as any).GOAL_ACHIEVEMENT(
      name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown",
      request.goal || "Achieve success", days, language
    );
  } else if (serviceId === ServiceType.PYTHAGOREAN_CODE || serviceId === ServiceType.FORTUNE_MAP || serviceId === ServiceType.CAPITAL_ALIGNMENT || serviceId === ServiceType.ENERGY_PULSE) {
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", language);
  } else if (serviceId === ServiceType.ASTRO_WEATHER) {
    prompt = COSMIC_PROMPTS[ServiceType.ASTRO_WEATHER](
      city || "Unknown City",
      zodiacSign || "aries",
      forecastDuration || "today",
      language
    );
  } else if (serviceId === ServiceType.PROFESSIONAL_DECODING) {
    prompt = COSMIC_PROMPTS[ServiceType.PROFESSIONAL_DECODING](name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown", language);
  } else {
    // Standard services (Natal Chart, Yearly Solar, etc.)
    prompt = (COSMIC_PROMPTS as any)[serviceId](name || "Seeker", birthDate || "unknown", birthTime || "unknown", birthPlace || "unknown", language);
  }

  const isPro = (serviceId === ServiceType.NATAL_CHART || 
                serviceId === ServiceType.LOVE_SYNASTRY || 
                serviceId === ServiceType.YEARLY_SOLAR || 
                serviceId === ServiceType.KARMIC_DESTINY || 
                serviceId === ServiceType.CAREER_WEALTH || 
                serviceId === ServiceType.SATURN_RETURN || 
                serviceId === ServiceType.SHADOW_WORK ||
                serviceId === ServiceType.PROFESSIONAL_DECODING);

  const modelName = isPro ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

  // Prepare contents for Gemini
  const parts: any[] = [{ text: prompt }];

  // Add image if available and service requires it
  if (request.chartImage && serviceId === ServiceType.PROFESSIONAL_DECODING) {
    const base64Data = request.chartImage.split(',')[1] || request.chartImage;
    const mimeType = request.chartImage.split(';')[0].split(':')[1] || 'image/jpeg';
    
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request, prompt, modelName, isPro, parts })
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "The Oracle is momentarily unreachable.");
  }

  const data = await res.json();
  return data.text || "The stars are silent today.";
};

export const generateAssistantResponse = async (message: string, history: { role: 'user' | 'model', text: string }[], language: ReportLanguage): Promise<string> => {
  const systemPrompt = (COSMIC_PROMPTS as any).AI_ASSISTANT(language);
  
  // Build contents with alternating roles
  const contents: any[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: language === 'Spanish' ? "Entendido. Soy el Guía Cósmico. Asistiré al buscador con precisión experta y brevedad." : language === 'Portuguese' ? "Entendido. Sou o Guia Cósmico. Assistirei ao buscador com precisão especialista e brevidade." : "Understood. I am the Cosmic Guide. I will assist the seeker with expert precision and brevity." }] }
  ];

  history.forEach((h) => {
    contents.push({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents })
  });

  if (!res.ok) return "The Oracle is currently disconnected. Please try again later.";

  const data = await res.json();
  return data.text || "The stars are silent today.";
};

export const generateHoroscope = async (sign: string, language: ReportLanguage, day: 'today' | 'tomorrow' = 'tomorrow'): Promise<string> => {
  const prompt = (COSMIC_PROMPTS as any)[ServiceType.HOROSCOPE_TOMORROW](sign, language, day);

  const res = await fetch("/api/horoscope", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error("The Oracle is currently disconnected.");

  const data = await res.json();
  return data.text || "The stars are silent today.";
};

