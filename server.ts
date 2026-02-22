import express from "express";
import { createServer as createViteServer } from "vite";
import { put, head, list, del } from "@vercel/blob";
import type { NewsPost } from "./types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  const NEWS_FILE_PATH = 'data/news.json';

  // API Routes
  
  // Get all news posts
  app.get("/api/news", async (_req, res) => {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.warn("BLOB_READ_WRITE_TOKEN is not set. News will not be loaded from Vercel.");
        return res.json([]); 
      }

      // Check if file exists by listing
      const { blobs } = await list();
      const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);

      if (!newsBlob) {
        return res.json([]);
      }

      const response = await fetch(newsBlob.url);
      const posts = await response.json();
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch news from Blob:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Save news posts
  app.post("/api/news", async (req, res) => {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(500).json({ 
          error: "Storage configuration missing. Please set BLOB_READ_WRITE_TOKEN in environment variables." 
        });
      }

      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Upload/Overwrite the news file
      await put(NEWS_FILE_PATH, JSON.stringify(posts), {
        access: 'public',
        addRandomSuffix: false, // Keep the same filename
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to save news to Blob:", error);
      res.status(500).json({ error: "Failed to save news to storage" });
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
