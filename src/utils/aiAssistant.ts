export interface AskAiResponse {
  answer: string;
  source: 'gemini' | 'verified_knowledge';
}

const KNOWLEDGE_BASE: { keywords: string[]; title: string; portal: string; steps: string[]; docs: string[]; warnings: string }[] = [
  {
    keywords: ['marksheet', 'certificate', 'cbse', 'degree', '10th', '12th', 'passing', 'board'],
    title: 'Download Educational Marksheets & Certificates Digitally',
    portal: 'DigiLocker (https://www.digilocker.gov.in/) & NAD',
    steps: [
      'Log in to DigiLocker with your Aadhaar number and OTP.',
      'Go to "Issued Documents" > "Search Documents".',
      'Select your education board (e.g. CBSE, CISCE, State Board) or University.',
      'Select "Class X / XII Marksheet" and enter your Roll Number and Passing Year.',
      'Click "Get Document". The digitally signed PDF will be permanently stored and legally accepted anywhere in India.'
    ],
    docs: ['Aadhaar linked mobile number', 'Exam Roll Number', 'School / College Code and Passing Year'],
    warnings: 'As per Rule 9A of the IT Rules 2016, DigiLocker digital marksheets are legally equivalent to physical original certificates for jobs and higher admissions.'
  },
  {
    keywords: ['aadhaar', 'address update', 'biometric', 'uidai', 'myaadhaar', 'pvc card', 'mobile link'],
    title: 'UIDAI Aadhaar Online Services & Address Update',
    portal: 'UIDAI myAadhaar Portal (https://myaadhaar.uidai.gov.in/)',
    steps: [
      'Visit myaadhaar.uidai.gov.in and click "Login" with your 12-digit Aadhaar & OTP.',
      'To update address: select "Address Update", enter your new address exactly as in your proof document.',
      'Upload a valid address proof (Passport, Voter ID, Bank Statement, Electricity Bill, or Head of Family HOF declaration).',
      'Pay nominal fee of ₹50 online and note down the Update Request Number (URN) to track status.',
      'To lock biometrics: Navigate to "Lock/Unlock Biometrics" and enable lock to prevent fingerprint fraud.'
    ],
    docs: ['Aadhaar registered mobile for OTP', 'Proof of Address (POA) document in PDF/JPEG'],
    warnings: 'UIDAI official helpline is 1947 (Toll-Free, 24x7). Never share Aadhaar OTP with any caller claiming to be an official.'
  },
  {
    keywords: ['passport', 'psk', 'tatkaal', 'police verification', 'pcc', 'arn'],
    title: 'Passport Application & Tatkaal Appointment Booking',
    portal: 'Passport Seva Portal (https://www.passportindia.gov.in/)',
    steps: [
      'Register on passportindia.gov.in and choose your Regional Passport Office (RPO).',
      'Fill the online application for "Fresh" or "Re-issue" under Normal (₹1,500) or Tatkaal (₹3,500) quota.',
      'Pay the processing fee and book an appointment slot at your nearest Passport Seva Kendra (PSK) or Post Office PSK (POPSK).',
      'Print the Application Reference Number (ARN) receipt and visit the PSK on scheduled date with original documents.',
      'Track police verification and dispatch through the Passport Seva status tracker.'
    ],
    docs: ['Proof of Date of Birth (Birth Cert, 10th Marksheet, Aadhaar)', 'Proof of Present Address', 'Old passport (if re-issue)'],
    warnings: 'Beware of fake copycat websites asking for money. The ONLY official government portal is passportindia.gov.in.'
  },
  {
    keywords: ['driving license', 'dl', 'learner', 'parivahan', 'sarathi', 'rto', 'challan', 'rc transfer'],
    title: 'Driving Licence, Learner Licence & Vehicle Services',
    portal: 'Parivahan Sewa (https://parivahan.gov.in/)',
    steps: [
      'Go to Parivahan Sewa > "Drivers/ Learners License" and select your State.',
      'Choose "Apply for Learner License". With Aadhaar authentication, you can take the computer test directly from home without visiting RTO.',
      'After holding Learner License for 30 days, apply for permanent Driving License and book driving test slot.',
      'For DL Renewal / Address change: use "Driving License Services" on Sarathi.',
      'To pay traffic fines, check Parivahan e-Challan portal with vehicle number.'
    ],
    docs: ['Aadhaar Card', 'Age proof', 'Form 1A Medical Fitness Certificate (for applicants age 40+ or transport vehicles)'],
    warnings: 'Official Parivahan helpline is 0120-4925572. Download mParivahan app for official mobile DL display.'
  },
  {
    keywords: ['pf', 'epf', 'epfo', 'uan', 'passbook', 'claim', 'pension', 'provident fund'],
    title: 'EPFO UAN Activation, Passbook & Online Claim Withdrawal',
    portal: 'EPFO Member Unified Portal (https://unifiedportal-mem.epfindia.gov.in/)',
    steps: [
      'Activate your 12-digit UAN by entering Member ID/Aadhaar and registered mobile on the Member Portal.',
      'Download your EPF Passbook through the EPFO Passbook portal (or UMANG app).',
      'For emergency funds: File an Online Claim (Form 31 Advance for illness, wedding, housing) or Form 19/10C on leaving employment.',
      'Complete e-Nomination with Aadhaar e-Sign to avoid claim delays.',
      'Check balance via SMS: Send "EPFOHO UAN" to 7738299899 or give missed call to 9966044425.'
    ],
    docs: ['Active UAN', 'Aadhaar linked to active mobile', 'Bank account verified with IFSC and name match'],
    warnings: 'EPFO never asks for bank passwords or OTP over phone. Official helpline: 1800-118-005.'
  },
  {
    keywords: ['ayushman', 'pmjay', 'abha', 'health insurance', 'hospital', '5 lakh', 'treatment'],
    title: 'Ayushman Bharat PM-JAY & ABHA Digital Health Card',
    portal: 'National Health Authority Beneficiary Portal (https://beneficiary.nha.gov.in/)',
    steps: [
      'Generate your 14-digit ABHA ID for free using Aadhaar on healthid.ndhm.gov.in.',
      'To check eligibility for ₹5 Lakh annual cashless hospital cover: Visit beneficiary.nha.gov.in.',
      'Search using Aadhaar number, Ration Card number, or PM-JAY Family ID.',
      'Complete Aadhaar e-KYC to immediately generate and download your Ayushman Golden Card.',
      'Senior citizens aged 70+ can now apply for ₹5 Lakh cover irrespective of income.'
    ],
    docs: ['Aadhaar Card', 'Ration Card / Family details', 'Active Mobile Number'],
    warnings: 'Treatment under PM-JAY is 100% cashless at all empaneled hospitals. Toll-Free Helpline: 14555.'
  },
  {
    keywords: ['kisan', 'pm-kisan', 'farmer', '6000', 'instalment', 'khasra', 'agriculture'],
    title: 'PM-KISAN Samman Nidhi Registration & Instalment Status',
    portal: 'PM-KISAN Official Portal (https://pmkisan.gov.in/)',
    steps: [
      'Visit pmkisan.gov.in and click "New Farmer Registration".',
      'Enter Rural/Urban category, Aadhaar Number, and State/District.',
      'Submit land ownership records (Khata / Khasra number and area in Hectares).',
      'Ensure your bank account is seeded with Aadhaar for Direct Benefit Transfer (DBT).',
      'Complete mandatory e-KYC using OTP or through the PM-KISAN mobile app using Face Authentication.'
    ],
    docs: ['Aadhaar Card', 'Land ownership document (RoR / Khatauni)', 'Aadhaar-seeded bank account with NPCI mapping'],
    warnings: 'Toll-Free Kisan Helpline: 155261 or 1800-115-526. Beware of unauthorized agents asking for processing fees.'
  },
  {
    keywords: ['tax', 'itr', 'pan', 'instant pan', 'income tax', 'refund', 'form 16'],
    title: 'Income Tax Return Filing & Instant e-PAN Generation',
    portal: 'Income Tax e-Filing Portal (https://www.incometax.gov.in/)',
    steps: [
      'For new PAN: Click "Instant e-PAN" to receive a valid PDF PAN card in 10 minutes free using Aadhaar.',
      'To file ITR: Log in with PAN, review pre-filled data from Annual Information Statement (AIS) and Form 26AS.',
      'Select ITR-1 (Sahaj for salaried) or appropriate ITR form, verify deductions (80C, 80D, 80CCD).',
      'Submit and e-Verify within 30 days using Aadhaar OTP or Netbanking.',
      'Track refund status directly on the dashboard under "Services" > "Know Your Refund Status".'
    ],
    docs: ['PAN & Aadhaar', 'Bank account pre-validated for refund', 'Form 16 / Salary slips / Interest certificates'],
    warnings: 'Helpline: 1800-103-0025. Verify your return immediately with Aadhaar OTP to avoid invalidation.'
  },
  {
    keywords: ['cyber', 'fraud', '1930', 'scam', 'cheated', 'money lost', 'upi fraud', 'bank fraud'],
    title: 'Emergency Financial Cyber Fraud & Online Crime Reporting',
    portal: 'National Cyber Crime Reporting Portal (https://cybercrime.gov.in/)',
    steps: [
      'DIAL 1930 IMMEDIATELY! This is the Citizen Financial Cyber Fraud reporting emergency helpline.',
      'Provide your bank account number, fraudster account/UPI ID, transaction UTR number, and time.',
      'The 1930 nodal network alerts the beneficiary bank in real time to freeze the stolen funds.',
      'Lodge a formal complaint ticket on cybercrime.gov.in using the acknowledgment SMS.',
      'Save all chat screenshots, SMS alerts, call logs, and bank statements for evidence.'
    ],
    docs: ['Bank statement showing debited amount', 'Transaction Reference (UTR / UPI Ref Number)', 'Screenshots of messages / fraudulent calls'],
    warnings: 'Act within the "Golden Hour" (first 2-3 hours) for the highest chance of freezing fraudulent money transfers.'
  },
  {
    keywords: ['scholarship', 'nsp', 'student', 'fellowship', 'tuition', 'post-matric', 'pre-matric'],
    title: 'National Scholarship Portal (NSP) Application',
    portal: 'National Scholarship Portal (https://scholarships.gov.in/)',
    steps: [
      'Complete One-Time Registration (OTR) on scholarships.gov.in using the NSP OTR App with Aadhaar Face Auth.',
      'Log in with your OTR credentials and verify the auto-matched scholarship schemes.',
      'Upload academic marksheets, institution bonafide certificate, and valid state income certificate.',
      'Submit the application and inform your School/College Nodal Officer (SNO/INO) to approve verification.',
      'Scholarship funds are credited directly to the student’s Aadhaar-linked bank account via DBT.'
    ],
    docs: ['Aadhaar Number / OTR', 'Previous Year Marksheet', 'Competent Authority Income Certificate', 'Caste/Community Certificate (if applicable)', 'Bank Passbook'],
    warnings: 'NSP official helpline: 0120-6619540. Ensure your bank account is active and seeded with Aadhaar on NPCI mapper.'
  }
];

export async function askSevaSyncAi(
  query: string,
  language: string = 'English',
  platformContext?: any
): Promise<AskAiResponse> {
  const cleanQuery = query.trim().toLowerCase();

  // Try server-side Gemini API first
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, platformContext })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer && !data.fallback) {
        return {
          answer: data.answer,
          source: 'gemini'
        };
      }
    }
  } catch (err) {
    console.warn('Backend AI query fallback triggered:', err);
  }

  // Authoritative Fallback / Offline Knowledge Synthesizer
  const matched = KNOWLEDGE_BASE.find(item => 
    item.keywords.some(kw => cleanQuery.includes(kw))
  );

  if (matched) {
    const text = `### ${matched.title}

**Official Verified Portal:**
🔗 ${matched.portal}

**Step-by-Step Procedure:**
${matched.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Required Prerequisites & Documents:**
${matched.docs.map(d => `• ${d}`).join('\n')}

**Official Advisory & Security Notice:**
⚠️ ${matched.warnings}`;

    return {
      answer: text,
      source: 'verified_knowledge'
    };
  }

  // General Guidance fallback
  return {
    answer: `### Citizen Information for: "${query}"

To resolve this service request under Indian Digital Public Infrastructure:

1. **Verify Your Digital Identity:** Ensure you have your 12-digit Aadhaar number with an active mobile number linked for OTP verification.
2. **Access Central Hubs:** Most citizen services are integrated on either **DigiLocker** (for issuing documents and marksheets) or **UMANG** (for welfare schemes, PF, and utility services).
3. **Official Portals:** Always verify that the portal URL ends strictly with **.gov.in** or **.nic.in**. Avoid third-party commercial portals that charge unofficial service fees.
4. **Helpline Assistance:** 
   • General Government Services: Dial **1800-11-5246** (UMANG)
   • Aadhaar UIDAI: Dial **1947**
   • Cyber / Financial Fraud: Dial **1930**
   • Consumer Grievances: Dial **1915**`,
    source: 'verified_knowledge'
  };
}
