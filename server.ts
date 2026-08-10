import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", aiEnabled: !!ai });
  });

  // AI Stock Metadata Generation Endpoint
  app.post("/api/generate-metadata", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", customContext = "" } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }

      if (!ai) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured on the server."
        });
      }

      let cleanData = imageBase64;
      let finalMimeType = mimeType;

      // Handle HTTP/HTTPS URLs (e.g. sample photos)
      if (cleanData.startsWith("http://") || cleanData.startsWith("https://")) {
        const imageRes = await fetch(cleanData);
        if (!imageRes.ok) {
          throw new Error(`Failed to fetch image from URL: ${imageRes.statusText}`);
        }
        const contentType = imageRes.headers.get("content-type");
        if (contentType) {
          finalMimeType = contentType.split(";")[0];
        }
        const arrayBuffer = await imageRes.arrayBuffer();
        cleanData = Buffer.from(arrayBuffer).toString("base64");
      } else if (cleanData.startsWith("data:")) {
        const match = cleanData.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          finalMimeType = match[1];
          cleanData = match[2];
        } else {
          cleanData = cleanData.replace(/^data:image\/\w+;base64,/, "");
        }
      }

      const prompt = `You are an expert commercial microstock photography SEO specialist for Adobe Stock, Freepik, Shutterstock, and Getty Images.
Analyze this image and generate highly optimized, commercial metadata:

1. title: A concise, highly commercial English title (MAXIMUM 80 characters, action/subject focused, no punctuation or filler words).
2. description: A clear, descriptive, 1-2 sentence commercial photo description highlighting main subjects, environment, mood, and technical attributes.
3. keywords: An array of 30 to 50 relevant, high-ranking English microstock search keywords (combining main subjects, concepts, colors, lighting, location, mood, orientation, background, and stock themes).
4. category: Primary stock category (e.g. "Nature & Landscapes", "Business & Technology", "People & Lifestyle", "Architecture & Interior", "Food & Beverage", "Travel & Vacation", "Abstract & Backgrounds").
5. objects: An array of 4-8 specific subject/object labels detected in the photo.
6. dominantColors: An array of 3-5 dominant color names (e.g. "Warm Amber", "Deep Azure", "Soft Beige", "Earthy Green").
7. complianceTips: Array of 2-3 brief tips to boost stock acceptance (e.g. "Ensure no visible brand logos", "Excellent focal isolation", "Good commercial release potential").
${customContext ? `Additional User Context: ${customContext}` : ''}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: finalMimeType,
                  data: cleanData
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              category: { type: Type.STRING },
              objects: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              dominantColors: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              complianceTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "keywords", "category", "objects", "dominantColors", "complianceTips"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response generated from AI model");
      }

      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (err: any) {
      console.error("Metadata generation error:", err);
      res.status(500).json({
        error: err.message || "Failed to generate metadata"
      });
    }
  });

  // Simulated Python Engine Execution Log Endpoint
  app.post("/api/python/run-pipeline", (req, res) => {
    const { imageName, qualityScore, hasFaces, keywordsCount } = req.body;
    
    const logs = [
      `[INFO] [Wêne Engine v1.0] Starting processing for '${imageName || 'image.jpg'}'`,
      `[INFO] [SafetyChecker] Validating target directories: source vs export`,
      `[SUCCESS] [SafetyChecker] Export directory is safe (isolated buffer)`,
      `[INFO] [QualityAnalyzer] Running Laplacian sharpness & local variance noise calculation...`,
      `[INFO] [QualityAnalyzer] Calculated sharpness index: ${(Math.random() * 80 + 120).toFixed(1)} | Noise index: ${(Math.random() * 2 + 0.4).toFixed(2)}`,
      `[INFO] [QualityAnalyzer] Stock Compliance Score: ${qualityScore || 88}/100`,
      `[INFO] [FaceDetector] Executing MediaPipe/ONNX face isolation tensor graph...`,
      `[INFO] [FaceDetector] human_face_detected = ${hasFaces ? 'True' : 'False'} | Release Flag: ${hasFaces ? 'WARNING (Model Release Required)' : 'PASS'}`,
      `[INFO] [BaseTagger] Extracted dominant color palette and object bounding vectors`,
      `[INFO] [MetadataTagger] Local GGUF LLM generated ${keywordsCount || 42} English stock keywords & commercial title`,
      `[INFO] [Exporter] Invoking PyExifTool embedded binary wrapper...`,
      `[SUCCESS] [Exporter] EXIF, IPTC, and XMP headers losslessly injected into RAM canvas buffer.`,
      `[SUCCESS] [Wêne Engine] Pipeline execution completed successfully in 0.42s.`
    ];

    res.json({ success: true, logs });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wêne Master Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
