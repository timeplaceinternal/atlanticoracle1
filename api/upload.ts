import { put } from "@vercel/blob";
import multer from "multer";
import path from "path";

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Vercel specific config to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to run middleware
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN is not set." });
  }

  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single("file"));

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Validate file type
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
    
    if (!allowedTypes.includes(file.mimetype.toLowerCase())) {
      return res.status(400).json({ 
        error: `Invalid file type: ${file.mimetype}. Please use standard image formats (JPG, PNG, WEBP).` 
      });
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const safeName = file.originalname.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `uploads/${Date.now()}-${safeName}${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file.buffer, {
      access: "public",
      contentType: file.mimetype,
      token,
    });

    return res.status(200).json({ url: blob.url });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
