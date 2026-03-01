import express from "express";
import { createServer as createViteServer } from "vite";
import { put, list } from "@vercel/blob";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { NewsPost } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure local storage directories exist
  const LOCAL_DATA_DIR = path.join(__dirname, 'data');
  const LOCAL_UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
  
  if (!fs.existsSync(LOCAL_DATA_DIR)) fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });

  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.json({ limit: '10mb' }));
  // Serve local uploads
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  const NEWS_FILE_PATH = 'data/news.json';
  const LOCAL_NEWS_PATH = path.join(LOCAL_DATA_DIR, 'news.json');

  // API Routes
  
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    console.log(">>> POST /api/upload - Start");
    try {
      if (!req.file) {
        console.error("Upload error: No file in request");
        return res.status(400).json({ error: "No file provided" });
      }

      const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      
      // Try Vercel Blob first
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        console.log(`Attempting to put to Vercel Blob: uploads/${filename}`);
        const blob = await put(`uploads/${filename}`, req.file.buffer, {
          access: 'public',
          contentType: req.file.mimetype,
        });
        console.log("Vercel Blob upload successful! URL:", blob.url);
        return res.json({ url: blob.url });
      } 
      
      // Fallback to local filesystem
      console.log(`Falling back to local upload: ${filename}`);
      const localPath = path.join(LOCAL_UPLOADS_DIR, filename);
      fs.writeFileSync(localPath, req.file.buffer);
      
      // Construct local URL
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const url = `${protocol}://${host}/uploads/${filename}`;
      
      console.log("Local upload successful! URL:", url);
      res.json({ url });
    } catch (error) {
      console.error("!!! Upload failed with error:", error);
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Upload failed: " + message });
    }
  });

  // Get all news posts
  app.get("/api/news", async (req, res) => {
    console.log(">>> GET /api/news - Fetching news...");
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        // Try Vercel Blob
        const { blobs } = await list({ prefix: NEWS_FILE_PATH });
        const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);

        if (newsBlob) {
          console.log(`Found news blob at: ${newsBlob.url}`);
          const response = await fetch(newsBlob.url);
          if (response.ok) {
            const posts = await response.json();
            return res.json(posts);
          }
        }
      }

      // Fallback to local filesystem
      if (fs.existsSync(LOCAL_NEWS_PATH)) {
        console.log("Reading news from local filesystem...");
        const data = fs.readFileSync(LOCAL_NEWS_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }

      console.log("No news file found anywhere.");
      res.json([]);
    } catch (error) {
      console.error("!!! Failed to fetch news:", error);
      res.json([]); 
    }
  });

  // Save news posts
  app.post("/api/news", async (req, res) => {
    console.log(">>> POST /api/news - Saving news...");
    try {
      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format: expected array" });
      }

      // Try Vercel Blob
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        console.log(`Syncing to Vercel Blob: ${NEWS_FILE_PATH}`);
        await put(NEWS_FILE_PATH, JSON.stringify(posts), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
        });
      }

      // Always save locally as well (or as fallback)
      console.log(`Saving to local filesystem: ${LOCAL_NEWS_PATH}`);
      fs.writeFileSync(LOCAL_NEWS_PATH, JSON.stringify(posts, null, 2));

      res.json({ success: true });
    } catch (error) {
      console.error("!!! Failed to save news:", error);
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
