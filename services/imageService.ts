
import { GoogleGenAI } from "@google/genai";

export type ScrollLanguage = 'Latin' | 'English' | 'French' | 'German' | 'Spanish' | 'Italian' | 'Portuguese';

const LANGUAGE_INSCRIPTIONS: Record<ScrollLanguage, string> = {
  'Latin': 'Zodiacus, Astra, Numeri, Oraculum, Firmamentum',
  'English': 'The Secret Language of the Cosmos and Numbers',
  'French': 'Le Langage Secret du Cosmos et des Nombres',
  'German': 'Die Geheime Sprache des Kosmos und der Zahlen',
  'Spanish': 'El Linguaje Secreto del Cosmos y los Números',
  'Italian': 'Il Linguaggio Segreto del Cosmo e dei Numeri',
  'Portuguese': 'A Linguagem Secreta do Cosmos e dos Números'
};

export const generateAestheticBackground = async (language: ScrollLanguage): Promise<string> => {
  // Fix: Initialize GoogleGenAI directly with the environment variable process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inscription = LANGUAGE_INSCRIPTIONS[language];

  const prompt = `
    A highly detailed 17th-century antique astronomical manuscript background. 
    STYLE: 1600-1700s authentic aged parchment paper. Realistic textures: yellow-brown age stains, worn irregular edges.
    COMPOSITION: Translucent vintage constellations and 12 zodiac signs in a classic engraving style. 
    Details: Small astronomical instruments (astrolabe, compass) in corners. 
    Inscription: "${inscription}". 
    Color Palette: Warm earthy parchment, midnight indigo, gold accents.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    // Handle potential candidate absence
    if (!response.candidates || response.candidates.length === 0) {
       throw new Error("The oracle was unable to manifest the image.");
    }

    // Fix: Correctly iterate through parts to extract image data (inlineData) as per image generation guidelines.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      } else if (part.text) {
        console.log("Image generation message:", part.text);
      }
    }
    throw new Error("No image data returned from the stars.");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
