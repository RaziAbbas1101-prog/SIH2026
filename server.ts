import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// SevaSync AI endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { query, language = 'English', platformContext } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid query string is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        answer: "SevaSync AI is active in directory mode. For personalized live AI queries, ensure GEMINI_API_KEY is configured in your secrets. You can still use the instant knowledge finder, eligibility wizard, and official portals below!"
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are "SevaSync AI", an expert official assistant for Indian Government digital public services (Digital India, UMANG, DigiLocker, UIDAI Aadhaar, Passport Seva, Parivahan Sewa, EPFO, Income Tax e-Filing, Ayushman Bharat, PM-KISAN, e-Shram, National Scholarship Portal, GeM, Cyber Crime Reporting 1930, etc.).

User Language Preference: ${language}.
Provide a clear, reassuring, structured, and accurate response in ${language}.

Citizen Query: "${query}"

${platformContext ? `Platform details currently being inspected: ${JSON.stringify(platformContext)}` : ''}

Format your guidance cleanly with:
1. Direct concise summary / solution
2. Exact official portal to visit (.gov.in / .nic.in only)
3. Essential prerequisites and required documents (e.g., Aadhaar OTP, mobile link, bank account)
4. Key safety warning (Never share OTP / UPI PIN, only use authentic .gov.in domains, official helpline numbers e.g. 1947 Aadhaar, 1930 Cyber Fraud, 14434 Ayushman)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('SevaSync AI backend error:', error);
    return res.status(500).json({
      error: error.message || 'Internal AI query failure',
      fallback: true
    });
  }
});

// Vite middleware in dev or static files in production
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const port = Number(process.env.PORT) || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
