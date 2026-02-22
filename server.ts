import express from "express";
import { createServer as createViteServer } from "vite";
import { kv } from "@vercel/kv";
import type { NewsPost } from "./types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // API Routes
  
  // Get all news posts
  app.get("/api/news", async (_req, res) => {
    try {
      const posts = await kv.get<NewsPost[]>("atlantic_oracle_news") || [];
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch news from KV:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Save news posts
  app.post("/api/news", async (req, res) => {
    try {
      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format" });
      }
      await kv.set("atlantic_oracle_news", posts);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to save news to KV:", error);
      res.status(500).json({ error: "Failed to save news" });
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
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
