
import { ReadingRequest, ServiceType } from "../types";
import { COSMIC_PROMPTS } from "../constants";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
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

  // Вызываем наш собственный серверный роут вместо прямого обращения к Google
  const response = await fetch('/api/oracle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "The stars are silent. Connection failed.");
  }

  return data.text;
};
