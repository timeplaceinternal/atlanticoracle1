import express from "express";
import { createServer as createViteServer } from "vite";
import { put, list } from "@vercel/blob";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { NewsPost } from "./src/types";
import Stripe from "stripe";

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

  // Stripe Webhook Endpoint
  // Note: Stripe needs the raw body for signature verification.
  // We MUST place this BEFORE express.json() middleware.
  app.post("/api/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      console.error("Missing stripe-signature or STRIPE_WEBHOOK_SECRET");
      return res.status(400).send("Webhook Error: Missing signature or secret");
    }

    let event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Handle the event
    const WEBHOOK_LOG_PATH = path.join(LOCAL_DATA_DIR, 'webhook_events.json');
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Payment successful for session: ${session.id}`);
        
        // Log the event to a file
        try {
          let events = [];
          if (fs.existsSync(WEBHOOK_LOG_PATH)) {
            events = JSON.parse(fs.readFileSync(WEBHOOK_LOG_PATH, 'utf-8'));
          }
          events.push({
            id: event.id,
            type: event.type,
            sessionId: session.id,
            customerEmail: session.customer_details?.email,
            amount: session.amount_total,
            currency: session.currency,
            timestamp: new Date().toISOString(),
            metadata: session.metadata
          });
          fs.writeFileSync(WEBHOOK_LOG_PATH, JSON.stringify(events, null, 2));
        } catch (err) {
          console.error("Failed to log webhook event:", err);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // Increased to 5MB
    },
    fileFilter: (_req, file, cb) => {
      console.log(`>>> Multer filtering file: ${file.originalname}, mimetype: ${file.mimetype}`);
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/webp', 
        'image/gif', 
        'image/jpg', 
        'image/pjpeg',
        'image/x-citrix-pjpeg',
        'image/svg+xml', 
        'image/bmp', 
        'image/tiff',
        'image/x-png'
      ];
      if (allowedTypes.includes(file.mimetype.toLowerCase())) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Please use standard image formats (JPG, PNG, WEBP).`));
      }
    }
  });

  app.use(express.json({ limit: '10mb' }));

  // Serve local uploads - Ensure public/uploads is served at /uploads
  const uploadsPath = path.join(__dirname, 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  const NEWS_FILE_PATH = 'data/news.json';
  const KB_FILE_PATH = 'data/kb.json';
  const LOCAL_NEWS_PATH = path.join(LOCAL_DATA_DIR, 'news.json');
  const LOCAL_KB_PATH = path.join(LOCAL_DATA_DIR, 'kb.json');

  // API Routes
  
  // File upload endpoint
  app.post("/api/upload", (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: "File too large. Max size is 5MB." });
          }
          return res.status(400).json({ error: "Upload error: " + err.message });
        }
        return res.status(400).json({ error: err.message });
      }

      console.log(">>> POST /api/upload - File received:", req.file?.originalname);
      try {
        if (!req.file) {
          console.error("Upload error: No file in request");
          return res.status(400).json({ error: "No file provided" });
        }

        const ext = path.extname(req.file.originalname) || '.jpg';
        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${Date.now()}-${safeName}${ext}`;
        
        // Try Vercel Blob first
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (token && token.trim() !== "") {
          try {
            console.log(`Attempting to put to Vercel Blob: uploads/${filename}`);
            const blob = await put(`uploads/${filename}`, req.file.buffer, {
              access: 'public',
              contentType: req.file.mimetype,
            });
            console.log("Vercel Blob upload successful! URL:", blob.url);
            return res.json({ url: blob.url });
          } catch (blobError) {
            console.warn("Vercel Blob upload failed (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
            // Continue to local fallback
          }
        } 
        
        // Fallback to local filesystem
        console.log(`Falling back to local upload: ${filename}`);
        const localPath = path.join(LOCAL_UPLOADS_DIR, filename);
        fs.writeFileSync(localPath, req.file.buffer);
        
        // Construct local URL - Use relative path for better compatibility
        const url = `/uploads/${filename}`;
        
        console.log("Local upload successful! URL:", url);
        res.json({ url });
      } catch (error) {
        console.error("!!! Upload failed with error:", error);
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: "Upload failed: " + message });
      }
    });
  });

  // Get all news posts
  app.get("/api/news", async (req, res) => {
    console.log(">>> GET /api/news - Fetching news...");
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && token.trim() !== "") {
        try {
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
        } catch (blobError) {
          console.warn("Vercel Blob list/fetch failed (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
          // Continue to local fallback
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

      let savedToBlob = false;
      // Try Vercel Blob
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && token.trim() !== "") {
        try {
          console.log(`Syncing to Vercel Blob: ${NEWS_FILE_PATH}`);
          await put(NEWS_FILE_PATH, JSON.stringify(posts), {
            access: 'public',
            addRandomSuffix: false,
            allowOverwrite: true,
          });
          savedToBlob = true;
        } catch (blobError) {
          console.warn("Vercel Blob put failed (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
        }
      }

      // Try local storage but don't fail the whole request if it's read-only
      try {
        console.log(`Saving to local filesystem: ${LOCAL_NEWS_PATH}`);
        const dir = path.dirname(LOCAL_NEWS_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(LOCAL_NEWS_PATH, JSON.stringify(posts, null, 2));
      } catch (localError) {
        console.warn(">>> POST /api/news - Local storage save failed:", localError instanceof Error ? localError.message : localError);
        if (!savedToBlob) {
          throw new Error("Failed to save to both Vercel Blob and local storage");
        }
      }

      res.json({ success: true, savedToBlob });
    } catch (error) {
      console.error("!!! Failed to save news:", error);
      res.status(500).json({ error: "Failed to save news: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Dynamic Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      let posts: NewsPost[] = [];
      let kbPosts: any[] = [];
      
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && token.trim() !== "") {
        try {
          const { blobs } = await list();
          const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);
          if (newsBlob) {
            const response = await fetch(newsBlob.url);
            posts = await response.json();
          }
          const kbBlob = blobs.find(b => b.pathname === KB_FILE_PATH);
          if (kbBlob) {
            const response = await fetch(kbBlob.url);
            kbPosts = await response.json();
          }
        } catch (blobError) {
          console.warn("Sitemap: Vercel Blob access failed (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
          // Fallback to local
          if (fs.existsSync(LOCAL_NEWS_PATH)) {
            posts = JSON.parse(fs.readFileSync(LOCAL_NEWS_PATH, 'utf-8'));
          }
          if (fs.existsSync(LOCAL_KB_PATH)) {
            kbPosts = JSON.parse(fs.readFileSync(LOCAL_KB_PATH, 'utf-8'));
          }
        }
      } else {
        // Local fallback for sitemap
        if (fs.existsSync(LOCAL_NEWS_PATH)) {
          posts = JSON.parse(fs.readFileSync(LOCAL_NEWS_PATH, 'utf-8'));
        }
        if (fs.existsSync(LOCAL_KB_PATH)) {
          kbPosts = JSON.parse(fs.readFileSync(LOCAL_KB_PATH, 'utf-8'));
        }
      }
      
      const baseUrl = 'https://atlanticoracle.com';
      
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
  <url>
    <loc>${baseUrl}/database</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/news/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${kbPosts.map(post => `
  <url>
    <loc>${baseUrl}/database/${post.category}/${post.slug}</loc>
    <lastmod>${post.dateModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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

  // Get all KB posts
  app.get("/api/kb", async (req, res) => {
    console.log(">>> GET /api/kb - Fetching KB...");
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && token.trim() !== "") {
        try {
          const { blobs } = await list({ prefix: KB_FILE_PATH });
          const kbBlob = blobs.find(b => b.pathname === KB_FILE_PATH);

          if (kbBlob) {
            const response = await fetch(kbBlob.url);
            if (response.ok) {
              const posts = await response.json();
              return res.json(posts);
            }
          }
        } catch (blobError) {
          console.warn("Vercel Blob list/fetch failed for KB (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
          // Continue to local fallback
        }
      }

      if (fs.existsSync(LOCAL_KB_PATH)) {
        const data = fs.readFileSync(LOCAL_KB_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }

      res.json([]);
    } catch (error) {
      console.error("!!! Failed to fetch KB:", error);
      res.json([]); 
    }
  });

  // Save KB posts
  app.post("/api/kb", async (req, res) => {
    console.log(">>> POST /api/kb - Saving KB...");
    try {
      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format: expected array" });
      }

      let savedToBlob = false;
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && token.trim() !== "") {
        try {
          await put(KB_FILE_PATH, JSON.stringify(posts), {
            access: 'public',
            addRandomSuffix: false,
            allowOverwrite: true,
          });
          savedToBlob = true;
        } catch (blobError) {
          console.warn("Vercel Blob put failed for KB (likely invalid token):", blobError instanceof Error ? blobError.message : blobError);
        }
      }

      // Try local storage but don't fail the whole request if it's read-only
      try {
        const dir = path.dirname(LOCAL_KB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(LOCAL_KB_PATH, JSON.stringify(posts, null, 2));
      } catch (localError) {
        console.warn(">>> POST /api/kb - Local storage save failed:", localError instanceof Error ? localError.message : localError);
        if (!savedToBlob) {
          throw new Error("Failed to save to both Vercel Blob and local storage");
        }
      }

      res.json({ success: true, savedToBlob });
    } catch (error) {
      console.error("!!! Failed to save KB:", error);
      res.status(500).json({ error: "Failed to save KB: " + (error instanceof Error ? error.message : String(error)) });
    }
  });

  // Get Webhook Logs
  app.get("/api/webhooks", async (req, res) => {
    try {
      const WEBHOOK_LOG_PATH = path.join(LOCAL_DATA_DIR, 'webhook_events.json');
      if (fs.existsSync(WEBHOOK_LOG_PATH)) {
        const data = fs.readFileSync(WEBHOOK_LOG_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch webhook logs" });
    }
  });

  // Dealer Registration Endpoint
  app.post("/api/dealer-registration", async (req, res) => {
    console.log(">>> POST /api/dealer-registration - New application received...");
    try {
      const registration = req.body;
      const DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
      
      // Log to console as requested
      console.log("Dealer Registration Details:", JSON.stringify(registration, null, 2));
      console.log("Email to: astrologforme@gmail.com");

      // Save to local file as fallback/log
      let registrations = [];
      if (fs.existsSync(DEALER_REG_PATH)) {
        registrations = JSON.parse(fs.readFileSync(DEALER_REG_PATH, 'utf-8'));
      }
      registrations.push({
        ...registration,
        timestamp: new Date().toISOString()
      });
      fs.writeFileSync(DEALER_REG_PATH, JSON.stringify(registrations, null, 2));

      // Note: In a real production environment, you would use Nodemailer or an API like SendGrid
      // to send the actual email to astrologforme@gmail.com.
      
      res.json({ success: true });
    } catch (error) {
      console.error("!!! Failed to process dealer registration:", error);
      res.status(500).json({ error: "Failed to process application" });
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
