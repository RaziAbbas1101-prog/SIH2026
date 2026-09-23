# Remix SevaSync AI 🇮🇳

> An intelligent, accessible digital public services interface and guidance platform for Indian citizens.

Remix SevaSync AI simplifies navigation through India's vast Digital Public Infrastructure (DPI) — connecting citizens with verified Central and State Government digital portals, welfare schemes, identity services, and official grievance mechanisms.

---

## 🌟 Key Features

- **Verified Digital Services Directory**: 26+ Central and State digital platforms catalogued with verified `.gov.in` and `.nic.in` domains, official fees, processing times, and 24x7 toll-free helplines.
- **Multilingual Support (11 Indian Languages)**: Accessible in English, हिन्दी, বাংলা, తెలుగు, मराठी, தமிழ், اردو, ગુજરાતી, ಕನ್ನಡ, മലയാളം, and ਪੰਜਾਬੀ.
- **SevaSync AI Assistant**: Hybrid intelligence powered by Google Gemini (`gemini-2.5-flash`) with prompt steering specialized for Indian public services, coupled with a fast offline verified knowledge synthesizer.
- **Citizen Service Finder Wizard**: 2-step interactive questionnaire matching citizens (Students, Farmers, Salaried Workers, Gig Workers, Senior Citizens, Entrepreneurs) to eligible public schemes and portals.
- **Citizen Application Tracker**: Private tracking of official acknowledgement and docket numbers (e.g. Passport ARN, Driving Licence application, UIDAI URN, CPGRAMS grievances).
- **Security & Fraud Prevention**: Dedicated warnings for fake phishing websites, Aadhaar biometrics locking guidance, and direct integration with the National Cyber Fraud Reporting helpline (1930).
- **Official Portal Categories**:
  - Identity & Documents (DigiLocker, UIDAI myAadhaar, Passport Seva)
  - Transport & Travel (Parivahan Sewa, DigiYatra)
  - Taxes, Banking & Finance (Income Tax e-Filing 2.0, GST Portal, Jeevan Pramaan)
  - Labour & Employment (EPFO UAN Portal, e-Shram, National Career Service)
  - Healthcare & Welfare (Ayushman Bharat PM-JAY & ABHA, eSanjeevani Teleconsultation)
  - Farmers & Agriculture (PM-KISAN Samman Nidhi)
  - Education & Students (National Scholarship Portal, Academic Bank of Credits / APAAR)
  - Public Grievances & Legal (CPGRAMS, National Consumer Helpline 1915, National Cyber Crime Reporting Portal 1930, eCourts)
  - Citizen Hubs & Business (UMANG, myScheme, Startup India, GeM, CSC Digital Seva, API Setu)

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / API**: Node.js, Express, Vite middleware mode
- **AI & LLM**: `@google/genai` TypeScript SDK (Gemini 2.5 Flash)
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **Build Tool**: Vite 8, `tsx`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RaziAbbas1101-prog/SIH2026.git
   cd SIH2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   PORT=3000
   ```

4. Start Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. Build for Production:
   ```bash
   npm run build
   npm start
   ```

---

## ⚡ Deployment on Vercel

The repository is pre-configured with zero-configuration Vercel deployment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
2. Select and import **`RaziAbbas1101-prog/SIH2026`**.
3. **Build & Development Settings** (detected automatically):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   Add the following in your Vercel Project Settings > Environment Variables:
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key for real-time model inference.
5. Click **Deploy**!

### Continuous Integration & Continuous Deployment (CI/CD)
- **Automatic Deployments**: Every commit pushed to the `main` branch triggers an instant production build and deployment on Vercel.
- **Preview Environments**: Any Pull Request receives a dedicated live preview URL with automatic comment updates.
- **GitHub Actions**: Automated CI workflow (`.github/workflows/ci.yml`) runs linting and build validation across all PRs.
- **SPA & API Routing**: `vercel.json` and `/api` serverless functions ensure deep routes (`/government-platforms/:id`, `/login`) and API endpoints (`/api/ai/ask`, `/api/health`) resolve seamlessly.

---

## 🛡️ License

Apache-2.0
