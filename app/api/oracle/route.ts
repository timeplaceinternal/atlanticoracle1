
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();
    
    // Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Select gemini-3-pro-preview for complex reasoning and creative generation tasks.
    const modelName = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Fix: Access the .text property directly instead of calling a method or candidates manually.
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Celestial disruption" }, { status: 500 });
  }
}
