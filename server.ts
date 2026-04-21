import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import { db } from './src/lib/db.ts';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Only standard images allowed'));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/history', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM predictions ORDER BY timestamp DESC');
      const rows = stmt.all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/api/result/:id', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM predictions WHERE id = ?');
      const row = stmt.get(req.params.id);
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.delete('/api/delete/:id', (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM predictions WHERE id = ?');
      const result = stmt.run(req.params.id);
      res.json({ success: result.changes > 0 });
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/api/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
      const filePath = req.file.path;
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString('base64');
      
      const prompt = `You are "MedScan AI", an advanced skin lesion classifier working via a Simulated AI model overlay.
      Analyze this skin image. We want to classify it among: melanoma, nevus, basal cell carcinoma, actinic keratosis, benign keratosis, dermatofibroma, vascular lesion.
      Since you are an AI, provide a highly probable classification.
      Return the output strictly in this JSON format:
      {
        "class": "Name of Class",
        "confidence": 0.XX, (a float between 0 and 1)
        "explanation": "A short, brutalist medical summary explaining features seen in the image."
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          { inlineData: { data: base64Data, mimeType: req.file.mimetype } },
          prompt
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const jsonText = response.text.trim();
      const aiResult = JSON.parse(jsonText);

      // Simulate heatmap generation path (using CSS filters on frontend instead of real OpenCV since we are in Node)
      const heatmapPath = 'frontend-generated';

      const stmt = db.prepare(
        'INSERT INTO predictions (filename, prediction, confidence, heatmap_path) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(req.file.filename, aiResult.class, aiResult.confidence, heatmapPath);

      res.json({
        id: result.lastInsertRowid,
        filename: req.file.filename,
        prediction: aiResult.class,
        confidence: aiResult.confidence,
        explanation: aiResult.explanation
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Prediction failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
