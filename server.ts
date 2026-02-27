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
    console.log("GET /api/news - Fetching news...");
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.warn("BLOB_READ_WRITE_TOKEN is missing");
        return res.json([]); 
      }

      const { blobs } = await list();
      const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);

      if (!newsBlob) {
        console.log("No news file found in blob storage");
        return res.json([]);
      }

      const response = await fetch(newsBlob.url);
      const posts = await response.json();
      console.log(`Successfully fetched ${posts.length} posts`);
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch news from Blob:", error);
      res.status(500).json({ error: "Failed to fetch news: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Save news posts
  app.post("/api/news", async (req, res) => {
    console.log("POST /api/news - Saving news...");
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("BLOB_READ_WRITE_TOKEN is missing during POST");
        return res.status(500).json({ 
          error: "Storage configuration missing. Please set BLOB_READ_WRITE_TOKEN in Vercel environment variables." 
        });
      }

      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format: expected array" });
      }

      console.log(`Uploading ${posts.length} posts to ${NEWS_FILE_PATH}`);
      const blob = await put(NEWS_FILE_PATH, JSON.stringify(posts), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      });

      console.log("Upload successful:", blob.url);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to save news to Blob:", error);
      res.status(500).json({ error: "Failed to save news: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Dynamic Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      let posts: NewsPost[] = [];
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { blobs } = await list();
        const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);
        if (newsBlob) {
          const response = await fetch(newsBlob.url);
          posts = await response.json();
        }
      }
      
      const baseUrl = 'https://atlanticoracle.com';
      const initialNewsSlugs = ['the-saturn-shift-navigating-the-great-restructuring'];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/news</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${initialNewsSlugs.map(slug => `
  <url>
    <loc>${baseUrl}/news/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/news/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap.trim());
    } catch (e) {
      res.status(500).send("Error generating sitemap");
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
