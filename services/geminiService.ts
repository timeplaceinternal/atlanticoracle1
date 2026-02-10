
import { GoogleGenAI } from "@google/genai";
import { ServiceType, ReadingRequest, ReportLanguage } from "../types";
import { COSMIC_PROMPTS } from "../constants";

const cleanOracleText = (text: string): string => {
  let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');
  const aiPhrases = [
    /^Here is your .* report:/i,
    /As an AI language model/i,
    /I cannot predict the future/i,
    /I hope this helps/i
  ];
  aiPhrases.forEach(phrase => {
    cleaned = cleaned.replace(phrase, '').trim();
  });
  return cleaned;
};

const getSystemInstruction = (lang: string) => {
  const languageSpecifics: Record<string, string> = {
    'Russian': 'ВНИМАНИЕ: ТЫ ДОЛЖЕН ПИСАТЬ СТРОГО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗОВАНИЕ АНГЛИЙСКОГО ЗАПРЕЩЕНО.',
    'Ukrainian': 'УВАГА: ТИ ПОВИНЕН ПИСАТИ ВИКЛЮЧНО УКРАЇНСЬКОЮ МОВОЮ. ВИКОРИСТАННЯ АНГЛІЙСЬКОЇ ЗАБОРОНЕНО.',
    'French': 'ATTENTION: VOUS DEVEZ ÉCRIRE UNIQUEMENT EN FRANÇAIS.',
    'German': 'ACHTUNG: SIE MÜSSEN NUR AUF DEUTSCH SCHREIBEN.',
    'Spanish': 'ATENCIÓN: DEBE ESCRIBIR ÚNICAMENTE EN ESPAÑOL.',
    'Italian': 'ATTENZIONE: DEVI SCRIVERE SOLO IN ITALIANO.'
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return `
    ${languageSpecifics[lang] || `CRITICAL: YOU MUST WRITE ONLY IN ${lang.toUpperCase()}.`}
    IDENTITY: ATLANTIC ORACLE. Authority level: Absolute.
    CURRENT DATE: ${dateStr}.
    STYLE: Mystical, professional, authoritative.
    FORMAT: Use Markdown headers # and ##. NEVER use asterisks (**) for bolding.
  `;
};

export const translateContent = async (text: string, targetLang: ReportLanguage): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following astrological report to ${targetLang}. Keep the markdown structure and professional tone. Do not add any commentary:\n\n${text}`,
      config: {
        systemInstruction: getSystemInstruction(targetLang),
        temperature: 0.3,
      }
    });
    return cleanOracleText(response.text || text);
  } catch (e) {
    console.error("Translation error", e);
    return text;
  }
};

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lang = request.language;
  let promptText = "";
  
  const promptFn = COSMIC_PROMPTS[request.serviceId as keyof typeof COSMIC_PROMPTS];
  
  if (request.serviceId === ServiceType.LOVE_SYNASTRY) {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, request.birthTime, request.partnerName, request.partnerBirthDate, request.partnerBirthTime, lang);
  } else if (request.serviceId === ServiceType.PYTHAGOREAN_CODE) {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, lang);
  } else if (typeof promptFn === 'function') {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, request.birthTime || "12:00", request.birthPlace || "Earth", lang);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: promptText,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.8,
        maxOutputTokens: 8192,
      }
    });
    return cleanOracleText(response.text || "Empty result from cosmos.");
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    throw new Error("COSMIC_INTERFERENCE");
  }
};

export const generateMonthlyGiftHoroscope = async (name: string, birthDate: string, lang: ReportLanguage): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const promptText = COSMIC_PROMPTS.GIFT_MONTHLY_HOROSCOPE(name, birthDate, lang);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.9,
        maxOutputTokens: 4096,
      }
    });
    return cleanOracleText(response.text || "No gift received from the stars.");
  } catch (error: any) {
    console.error("Gift generation error:", error);
    throw new Error("GIFT_GENERATION_FAILED");
  }
};
