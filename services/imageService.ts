
import { GoogleGenAI } from "@google/genai";

export type ScrollLanguage = 'Latin' | 'English' | 'French' | 'German' | 'Spanish' | 'Italian' | 'Portuguese' | 'Russian' | 'Ukrainian';

const LANGUAGE_INSCRIPTIONS: Record<ScrollLanguage, string> = {
  'Latin': 'Zodiacus, Astra, Numeri, Oraculum, Firmamentum',
  'English': 'The Secret Language of the Cosmos and Numbers',
  'French': 'Le Langage Secret du Cosmos et des Nombres',
  'German': 'Die Geheime Sprache des Kosmos und der Zahlen',
  'Spanish': 'El Lenguaje Secreto del Cosmos y los Números',
  'Italian': 'Il Linguaggio Segreto del Cosmo e dei Numeri',
  'Portuguese': 'A Linguagem Secreta do Cosmos e dos Números',
  'Russian': 'Тайный язык космоса и чисел',
  'Ukrainian': 'Таємна мова космосу та чисел'
};

/**
 * Generates an aesthetic background image using gemini-2.5-flash-image.
 * Faster performance for background textures.
 */
export const generateAestheticBackground = async (language: ScrollLanguage): Promise<string> => {
  // Always create a new instance to pick up the latest injected API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inscription = LANGUAGE_INSCRIPTIONS[language];

  const prompt = `
    A highly detailed 17th-century antique astronomical manuscript background for a premium oracle. 
    STYLE: 1600-1700s authentic aged parchment paper. Realistic textures: yellow-brown age stains, light creases, worn irregular edges, tiny ink blots, candle wax traces, soot marks, visible vellum veins. 
    CENTER COMPOSITION: Translucent vintage constellations and 12 zodiac signs in a classic 17th-century engraving style. Fine lines, star points, constellation connecting lines, tiny Latin names in calligraphic script. 
    Zodiac symbols Arranged harmoniously in a circular orbit like an ancient celestial map.
    BACKGROUND: Deep indigo/midnight starry cosmos visible through the parchment or surrounding it, with golden and silver stars.
    EDGES: Darkened vignette corners, decorative Baroque/Renaissance border frame with fine swirls. 
    DETAILS: Small astronomical instruments (sextant, astrolabe, compass) depicted in the corners.
    INSCRIPTION: Include the text: "${inscription}". 
    TEXT AREA: Leave a large clear oval space in the center-bottom third for overlaying main text. 
    COLOR PALETTE: Warm earthy parchment tones, old gold and silver accents.
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

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response from the celestial realms.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image part found in response");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
       throw new Error("API_KEY_ERROR");
    }
    throw error;
  }
};
