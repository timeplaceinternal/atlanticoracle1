import { ReadingRequest, ReportLanguage } from "../types";

export const generateCosmicReading = async (request: ReadingRequest): Promise<string> => {
  const response = await fetch("/api/generate-reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Connection failed");
  return data.text;
};

export const generateAssistantResponse = async (message: string, history: { role: 'user' | 'model', text: string }[], language: ReportLanguage): Promise<string> => {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, language })
  });
  
  const data = await response.json();
  if (!response.ok) return "The Oracle is currently disconnected. Please try again later.";
  return data.text;
};

export const generateHoroscope = async (sign: string, language: ReportLanguage, day: 'today' | 'tomorrow' = 'tomorrow'): Promise<string> => {
  const response = await fetch("/api/horoscope", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sign, language, day })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Connection failed");
  return data.text;
};
