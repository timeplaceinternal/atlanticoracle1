
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

const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key) {
    console.warn("Gemini API Key is missing. Please ensure GEMINI_API_KEY is set.");
  }
  return key || "";
};

export const translateContent = async (text: string, targetLang: ReportLanguage): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_API_KEY");
  
  const ai = new GoogleGenAI({ apiKey });
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
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_API_KEY");

  const ai = new GoogleGenAI({ apiKey });
  const lang = request.language;
  let promptText = "";
  
  const promptFn = COSMIC_PROMPTS[request.serviceId as keyof typeof COSMIC_PROMPTS];
  
  if (request.serviceId === ServiceType.LOVE_SYNASTRY) {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, request.birthTime, request.partnerName, request.partnerBirthDate, request.partnerBirthTime, lang);
  } else if (request.serviceId === ServiceType.PYTHAGOREAN_CODE || 
             request.serviceId === ServiceType.FORTUNE_MAP || 
             request.serviceId === ServiceType.CAPITAL_ALIGNMENT || 
             request.serviceId === ServiceType.ENERGY_PULSE) {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, lang);
  } else if (typeof promptFn === 'function') {
    // @ts-ignore
    promptText = promptFn(request.name, request.birthDate, request.birthTime || "12:00", request.birthPlace || "Earth", lang);
  }

  try {
    const isFree = request.serviceId.toString().startsWith('free-');
    const response = await ai.models.generateContent({
      model: isFree ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview',
      contents: promptText,
      config: {
        systemInstruction: getSystemInstruction(lang),
        temperature: 0.8,
        maxOutputTokens: isFree ? 2048 : 8192,
      }
    });
    return cleanOracleText(response.text || "Empty result from cosmos.");
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    throw new Error("COSMIC_INTERFERENCE");
  }
};

export const generateMonthlyGiftHoroscope = async (name: string, birthDate: string, lang: ReportLanguage): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_API_KEY");

  const ai = new GoogleGenAI({ apiKey });
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

export const generateDailyForecast = async (lang: ReportLanguage, userPrompt?: string): Promise<{title: string, text: string, imageUrl: string}> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("MISSING_API_KEY");
  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1. Generate Text
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a daily cosmic forecast for today. 
      ${userPrompt ? `Focus on this specific theme: "${userPrompt}".` : 'Topic: General energy, astrology, and advice.'}
      Style: Mystical, professional.
      Language: ${lang}.
      Structure: Use Markdown. Include a catchy title, an introduction, and then break down the forecast by zodiac signs or cosmic themes using headers (##) and bullet points.
      Format: Return JSON with "title" and "text" fields. The "text" field should contain the full Markdown content.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: getSystemInstruction(lang),
      }
    });
    
    const parsed = JSON.parse(textResponse.text || '{}');
    const title = parsed.title || "Daily Cosmic Alignment";
    const text = parsed.text || "The stars are aligning in a unique pattern today.";

    // 2. Generate Image Prompt
    const promptResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this forecast title: "${title}", generate a short, highly descriptive image prompt for an AI image generator. 
      Focus on: 17th-century astronomical style, parchment, stars, mystical symbols, antique map feel. 
      Return only the prompt text.`,
    });
    const imagePrompt = promptResponse.text || `A mystical 17th-century astronomical map representing ${title}`;

    // 3. Generate Image
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    let imageUrl = '';
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return { title, text, imageUrl: imageUrl || 'https://picsum.photos/seed/cosmos/800/400' };
  } catch (error) {
    console.error("Daily forecast generation error:", error);
    throw error;
  }
};
