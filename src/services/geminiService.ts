import { GoogleGenAI } from "@google/genai";
import { ReadingRequest } from "../types";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a cosmic reading for ${request.name} born on ${request.birthDate} in ${request.language}. Service: ${request.serviceId}`,
  });
  return response.text || "The stars are silent today.";
};
