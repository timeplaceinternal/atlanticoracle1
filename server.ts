import express from "express";
import { createServer as createViteServer } from "vite";
import { put, head, list, del } from "@vercel/blob";
import multer from "multer";
import type { NewsPost } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.json({ limit: '10mb' }));

  const NEWS_FILE_PATH = 'data/news.json';

  // API Routes
  
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    console.log("POST /api/upload - Uploading file...");
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("BLOB_READ_WRITE_TOKEN is missing");
        return res.status(500).json({ error: "Storage configuration missing (BLOB_READ_WRITE_TOKEN)" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      console.log(`Uploading file: ${req.file.originalname} (${req.file.size} bytes)`);
      const filename = `uploads/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
      });

      console.log("File uploaded successfully:", blob.url);
      res.json({ url: blob.url });
    } catch (error) {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Upload failed: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

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
      console.warn("Failed to fetch news from Blob (check BLOB_READ_WRITE_TOKEN):", error instanceof Error ? error.message : String(error));
      res.json([]); // Return empty array instead of 500 to keep app functional
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
      console.warn("Sitemap: Could not fetch posts from Blob (likely missing/invalid token). Using defaults.");
      // Fallback to a basic sitemap if fetch fails
      const baseUrl = 'https://atlanticoracle.com';
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/news</loc><priority>0.8</priority></url>
</urlset>`;
      res.header('Content-Type', 'application/xml');
      res.send(sitemap.trim());
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
