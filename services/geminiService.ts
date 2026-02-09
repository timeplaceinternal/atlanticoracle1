
import { GoogleGenAI } from "@google/genai";
import { ReadingRequest, ServiceType } from "../types";
import { COSMIC_PROMPTS } from "../constants";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  // Инициализация AI напрямую в клиенте
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the "Atlantic Oracle", a master of astrology and numerology.
    Your tone is high-end, poetic, and professional.
    Structure your output as a luxurious spiritual consultation.
    RULES:
    1. Use high-quality Markdown.
    2. Provide at least 1000 words of deep, personalized insight.
    3. DO NOT use double asterisks (**). Use # and ## headers.
    4. Focus on European cycles 2026-2030.
  `;

  let prompt = "";
  if (request.serviceId in COSMIC_PROMPTS) {
    const promptFunc = COSMIC_PROMPTS[request.serviceId];
    if (request.serviceId === ServiceType.UNION_HARMONY) {
      prompt = promptFunc(request.name, request.birthDate, request.partnerName || "Unknown", "");
    } else {
      prompt = (promptFunc as any)(request.name, request.birthDate, request.birthTime || "12:00", request.birthPlace);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    if (!response.text) {
      throw new Error("The stars are silent. No prophecy was returned.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw new Error(error.message || "Celestial connection interrupted.");
  }
};
