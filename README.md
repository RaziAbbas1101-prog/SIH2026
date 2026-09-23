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

## 🛡️ License

Apache-2.0
