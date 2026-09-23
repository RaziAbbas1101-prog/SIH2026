import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { query, language = 'English', platformContext } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Valid query string is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        answer: null,
        fallback: true,
        notice: 'Directory mode active. Configure GEMINI_API_KEY in Vercel Environment Variables for live model inference.'
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
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ answer: response.text });
  } catch (error: any) {
    console.warn('SevaSync AI model fallback triggered:', error?.message || error);
    return res.status(200).json({
      answer: null,
      fallback: true,
      notice: 'High-demand period or transient upstream response. Instant verified directory guide provided.'
    });
  }
}
