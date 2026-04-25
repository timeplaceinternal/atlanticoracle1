import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Proxy for Gemini
  app.post("/api/generate", async (req, res) => {
    try {
      const { request, prompt, modelName, isPro, parts } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key missing on server" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const serviceId = request.serviceId;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts }],
        config: {
          tools: (serviceId === 'sports-oracle' || serviceId === 'astro-weather') ? [{ googleSearch: {} }] : undefined,
          thinkingConfig: isPro ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
          temperature: (serviceId === 'astro-weather' || serviceId === 'sports-oracle') ? 0.0 : undefined
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { contents } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key missing on server" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/horoscope", async (req, res) => {
    try {
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key missing on server" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Horoscope Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
