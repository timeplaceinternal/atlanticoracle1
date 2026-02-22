import { put, list } from "@vercel/blob";
import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: any, res: any) {
  const NEWS_FILE_PATH = 'data/news.json';
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN is not set in Vercel settings." });
  }

  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ token });
      const newsBlob = blobs.find(b => b.pathname === NEWS_FILE_PATH);

      if (!newsBlob) {
        return res.status(200).json([]);
      }

      const response = await fetch(newsBlob.url);
      const posts = await response.json();
      return res.status(200).json(posts);
    } 
    
    if (req.method === 'POST') {
      const posts = req.body;
      if (!Array.isArray(posts)) {
        return res.status(400).json({ error: "Invalid data format: expected array" });
      }

      await put(NEWS_FILE_PATH, JSON.stringify(posts), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        token
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Vercel Function Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
