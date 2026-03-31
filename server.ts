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
  try {
    const testFile = path.join(LOCAL_DATA_DIR, '.write_test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log("Data directory is writable.");
  } catch (err) {
    console.error("!!! Data directory is NOT writable:", err);
  }
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

  // Send Telegram notification
  async function sendTelegramMessage(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("Telegram notification skipped: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Telegram API error:", error);
        return false;
      } else {
        console.log("Telegram notification sent successfully.");
        return true;
      }
    } catch (err) {
      console.error("Failed to send Telegram notification:", err);
      return false;
    }
  }

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

  // Get Dealer Registrations
  app.get("/api/dealer-registrations", async (req, res) => {
    try {
      const DEALER_REG_PATH = 'data/dealer_registrations.json';
      const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
      
      if (BLOB_TOKEN) {
        const { blobs } = await list({ prefix: DEALER_REG_PATH, token: BLOB_TOKEN });
        if (blobs.length > 0) {
          const response = await fetch(blobs[0].url);
          if (response.ok) {
            const data = await response.json();
            return res.json(data);
          }
        }
      }

      // Fallback to local
      const LOCAL_DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
      if (fs.existsSync(LOCAL_DEALER_REG_PATH)) {
        const data = fs.readFileSync(LOCAL_DEALER_REG_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }
      res.json([]);
    } catch (error) {
      console.error("Failed to fetch dealer registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/debug-paths", (req, res) => {
    const dataDir = LOCAL_DATA_DIR;
    let writeTest = "Not tested";
    try {
      const testFile = path.join(dataDir, '.debug_write_test');
      fs.writeFileSync(testFile, 'test-' + Date.now());
      const readBack = fs.readFileSync(testFile, 'utf-8');
      fs.unlinkSync(testFile);
      writeTest = `Success (read back: ${readBack})`;
    } catch (err) {
      writeTest = `Failed: ${err instanceof Error ? err.message : String(err)}`;
    }

    res.json({
      __filename,
      __dirname,
      process_cwd: process.cwd(),
      LOCAL_DATA_DIR: dataDir,
      exists: fs.existsSync(dataDir),
      writable: writeTest,
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "SET (length: " + process.env.TELEGRAM_BOT_TOKEN.length + ")" : "NOT SET",
        TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID ? "SET" : "NOT SET",
        BLOB_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? "SET" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV
      },
      contents: fs.existsSync(dataDir) ? fs.readdirSync(dataDir) : null
    });
  });

  app.post("/api/test-telegram", async (req, res) => {
    try {
      const success = await sendTelegramMessage("🔔 Test notification from TimePlace.me Admin Panel");
      if (success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to send Telegram message. Check your BOT_TOKEN and CHAT_ID." });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dealer Registration Endpoint
  app.post("/api/dealer-registration", async (req, res) => {
    console.log(">>> POST /api/dealer-registration - New application received...");
    try {
      const registration = req.body;
      console.log(">>> Received data:", JSON.stringify(registration));

      if (!registration || !registration.email) {
        console.error("!!! Invalid registration data received - missing email or body:", registration);
        return res.status(400).json({ error: "Invalid registration data: email is required" });
      }

      const DEALER_REG_PATH = 'data/dealer_registrations.json';
      const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
      
      // Save to Vercel Blob if token exists
      let registrations = [];
      if (BLOB_TOKEN) {
        try {
          const { blobs } = await list({ prefix: DEALER_REG_PATH, token: BLOB_TOKEN });
          if (blobs.length > 0) {
            const response = await fetch(blobs[0].url);
            if (response.ok) {
              registrations = await response.json();
            }
          }
        } catch (readError) {
          console.error("!!! Error reading dealer registrations from blob:", readError);
        }
      } else {
        // Fallback to local file
        const LOCAL_DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
        try {
          if (fs.existsSync(LOCAL_DEALER_REG_PATH)) {
            const fileContent = fs.readFileSync(LOCAL_DEALER_REG_PATH, 'utf-8');
            if (fileContent.trim()) {
              registrations = JSON.parse(fileContent);
            }
          }
        } catch (readError) {
          console.error("!!! Error reading dealer registrations file:", readError);
        }
      }

      const newEntry = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        ...registration,
        timestamp: new Date().toISOString()
      };
      registrations.push(newEntry);

      try {
        if (BLOB_TOKEN) {
          await put(DEALER_REG_PATH, JSON.stringify(registrations), {
            access: 'public',
            addRandomSuffix: false,
            token: BLOB_TOKEN
          });
          console.log(">>> Application saved to Vercel Blob successfully.");
        } else {
          const LOCAL_DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
          fs.writeFileSync(LOCAL_DEALER_REG_PATH, JSON.stringify(registrations, null, 2));
          console.log(">>> Application saved to local storage successfully.");
        }
      } catch (writeError) {
        console.error("!!! Error writing dealer registrations:", writeError);
        throw new Error(`Failed to save application: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
      }

      // Send Telegram notification - COMPLETELY ISOLATED
      const telegramMessage = `
🔔 <b>New Dealer Application</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Name:</b> ${registration.legalName || 'N/A'}
📧 <b>Email:</b> ${registration.email}
📱 <b>Messenger:</b> ${registration.messenger || 'N/A'}
📺 <b>Channel:</b> ${registration.channelName || 'N/A'}
👥 <b>Audience:</b> ${registration.audience || 'N/A'}
📅 <b>Date:</b> ${new Date().toLocaleString()}
`;
      
      // Fire and forget, with its own catch to ensure it never bubbles up
      sendTelegramMessage(telegramMessage)
        .then(success => console.log(success ? ">>> Telegram sent." : ">>> Telegram failed (check config)."))
        .catch(err => console.error(">>> Telegram background error:", err));

      return res.json({ success: true });
    } catch (error) {
      console.error("!!! Critical failure in dealer registration:", error);
      return res.status(500).json({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Delete Dealer Registration
  app.delete("/api/dealer-registration/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const DEALER_REG_PATH = 'data/dealer_registrations.json';
      const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
      
      let registrations = [];
      let found = false;

      if (BLOB_TOKEN) {
        const { blobs } = await list({ prefix: DEALER_REG_PATH, token: BLOB_TOKEN });
        if (blobs.length > 0) {
          const response = await fetch(blobs[0].url);
          if (response.ok) {
            registrations = await response.json();
          }
        }
      } else {
        const LOCAL_DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
        if (fs.existsSync(LOCAL_DEALER_REG_PATH)) {
          registrations = JSON.parse(fs.readFileSync(LOCAL_DEALER_REG_PATH, 'utf-8'));
        }
      }

      const initialLength = registrations.length;
      registrations = registrations.filter((reg: any) => reg.id !== id);
      found = registrations.length < initialLength;

      if (found) {
        if (BLOB_TOKEN) {
          await put(DEALER_REG_PATH, JSON.stringify(registrations), {
            access: 'public',
            addRandomSuffix: false,
            token: BLOB_TOKEN
          });
        } else {
          const LOCAL_DEALER_REG_PATH = path.join(LOCAL_DATA_DIR, 'dealer_registrations.json');
          fs.writeFileSync(LOCAL_DEALER_REG_PATH, JSON.stringify(registrations, null, 2));
        }
        return res.json({ success: true });
      }
      res.status(404).json({ error: "Application not found" });
    } catch (error) {
      console.error("Failed to delete application:", error);
      res.status(500).json({ error: "Failed to delete application" });
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
