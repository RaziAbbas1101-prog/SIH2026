import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export interface PlatformItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  category: string;
  officialUrl: string;
  integrationStatus: 'OFFICIAL PORTAL' | 'AUTHORISED API' | 'DIRECT INTEGRATION';
  apiAvailable: boolean;
  requiresAuthentication: boolean;
  helpline: string;
  fees: string;
  turnaroundTime: string;
  popular: boolean;
  ministry: string;
  keyServices: string[];
  requiredDocs: string[];
  faq: { q: string; a: string }[];
  lastVerified?: string;
}

export const platforms: PlatformItem[] = [
  {
    id: 'digilocker',
    name: 'DigiLocker',
    hindiName: 'डिजिलॉकर',
    description: 'Flagship initiative of Ministry of Electronics & IT under Digital India. A secure cloud platform for issuance and verification of legally valid documents & certificates under the IT Act 2000.',
    category: 'Identity & Documents',
    officialUrl: 'https://www.digilocker.gov.in/',
    integrationStatus: 'AUTHORISED API',
    apiAvailable: true,
    requiresAuthentication: true,
    helpline: '011-24303714',
    fees: 'Free of cost for all Indian citizens',
    turnaroundTime: 'Instant digital issuance',
    popular: true,
    ministry: 'Ministry of Electronics & Information Technology (MeitY)',
    keyServices: [
      'Digital Aadhaar & PAN Card download',
      'Driving Licence & Vehicle RC issuance',
      'CBSE, ICSE, and State Board Marksheets & Degrees',
      'COVID-19 Vaccination Certificate',
      'Insurance policies & Ration Cards'
    ],
    requiredDocs: ['Aadhaar Number', 'Mobile Number linked to Aadhaar for OTP verification'],
    faq: [
      { q: 'Is a DigiLocker document legally valid?', a: 'Yes. Issued documents in DigiLocker are treated at par with original physical documents as per Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016.' },
      { q: 'Can traffic police reject DigiLocker DL/RC?', a: 'No. The Ministry of Road Transport and Highways (MoRTH) has issued explicit advisories to all state police departments that Driving Licences and Vehicle RCs in DigiLocker or mParivahan are valid.' }
    ]
  },
  {
    id: 'umang',
    name: 'UMANG',
    hindiName: 'उमंग (UMANG)',
    description: 'Unified Mobile Application for New-age Governance provides a single platform for all Indian citizens to access pan-India e-Gov services ranging from Central to local government bodies.',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://web.umang.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-11-5246',
    fees: 'Free government portal',
    turnaroundTime: 'Real-time service routing',
    popular: true,
    ministry: 'National e-Governance Division (NeGD), MeitY',
    keyServices: [
      'EPFO EPF Passbook & Claim Tracking',
      'LPG Cylinder Booking (Indane, Bharat, HP)',
      'NPS (National Pension System) Account',
      'PMKVY & Skill India registration',
      'Electricity & Utility Bill payments across states'
    ],
    requiredDocs: ['Mobile number', 'Aadhaar (optional for certain authenticated services)'],
    faq: [
      { q: 'What is the full form of UMANG?', a: 'Unified Mobile Application for New-age Governance.' },
      { q: 'How many government services are accessible through UMANG?', a: 'Over 1,200+ Central and State Government public services across 180+ departments are available on UMANG.' }
    ]
  },
  {
    id: 'uidai',
    name: 'UIDAI myAadhaar',
    hindiName: 'यूआईडीएआई मेरा आधार',
    description: 'Official portal of the Unique Identification Authority of India. Manage your 12-digit Aadhaar identity, update demographic details, download e-Aadhaar, and verify authentication history.',
    category: 'Identity & Documents',
    officialUrl: 'https://myaadhaar.uidai.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: true,
    requiresAuthentication: true,
    helpline: '1947 (Toll-Free, 24x7)',
    fees: 'Online demographic update ₹50; PVC Card ₹50',
    turnaroundTime: 'Demographic update: 3 to 15 days',
    popular: true,
    ministry: 'Unique Identification Authority of India (UIDAI)',
    keyServices: [
      'Download Password-protected e-Aadhaar PDF',
      'Order Aadhaar PVC Card with QR code',
      'Online Address Update with valid proof or Head of Family consent',
      'Lock / Unlock Biometrics for fraud protection',
      'Check Aadhaar - Bank Account seeding status'
    ],
    requiredDocs: ['Aadhaar Number or Enrolment ID (EID)', 'Valid Address Proof for updates', 'Registered Mobile Number'],
    faq: [
      { q: 'How can I lock my Aadhaar biometrics?', a: 'Log in to myAadhaar with your Aadhaar number and OTP, click on "Lock/Unlock Biometrics" and toggle the lock. This prevents unauthorized fingerprint/iris authentication.' },
      { q: 'What is the default password to open downloaded e-Aadhaar PDF?', a: 'The first 4 letters of your name in CAPITAL letters followed by your birth year (YYYY). Example: NEER1989.' }
    ]
  },
  {
    id: 'passport-seva',
    name: 'Passport Seva',
    hindiName: 'पासपोर्ट सेवा',
    description: 'Administered by the Consular, Passport and Visa (CPV) Division of the Ministry of External Affairs. Online appointment booking, application submission, police verification tracking, and Tatkaal passport processing.',
    category: 'Identity & Documents',
    officialUrl: 'https://www.passportindia.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-258-1800',
    fees: 'Normal 36-page: ₹1,500; Tatkaal: ₹3,500',
    turnaroundTime: 'Normal: 7 to 20 days; Tatkaal: 1 to 3 days post-verification',
    popular: true,
    ministry: 'Ministry of External Affairs (MEA)',
    keyServices: [
      'Fresh Passport & Re-issue of Passport application',
      'Tatkaal scheme expedited appointment booking',
      'Police Clearance Certificate (PCC) application',
      'Application Status tracking via ARN',
      'Locate nearest Passport Seva Kendra (PSK) / Post Office PSK (POPSK)'
    ],
    requiredDocs: ['Proof of Date of Birth (Birth Cert/10th Marksheet/Aadhaar)', 'Proof of Present Address', 'Standard Annexures if applying under Tatkaal'],
    faq: [
      { q: 'Can I reschedule my PSK appointment?', a: 'Yes, up to 3 times within 1 year from the initial appointment date without paying extra fees.' },
      { q: 'Is police verification mandatory for all applicants?', a: 'Pre-police verification is standard for fresh passports, whereas Tatkaal applications typically undergo post-police verification.' }
    ]
  },
  {
    id: 'parivahan',
    name: 'Parivahan Sewa',
    hindiName: 'परिवहन सेवा (सारथी एवं वाहन)',
    description: 'National citizen transport portal powered by Sarathi (for Driving Licences) and Vahan (for Vehicle Registrations). Unified portal for all RTO services across all Indian States and Union Territories.',
    category: 'Transport & Travel',
    officialUrl: 'https://parivahan.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '0120-4925572',
    fees: 'Learner Licence: ~₹200; Permanent DL: ~₹300-₹500 (state specific)',
    turnaroundTime: 'Contactless services: 24 to 72 hours',
    popular: true,
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    keyServices: [
      'Apply for Learner Licence (LL) with online Aadhaar proctored test',
      'Driving Licence renewal & Address change',
      'Duplicate DL / International Driving Permit (IDP)',
      'Vehicle RC Transfer of Ownership & Hypothecation termination',
      'Check pending Traffic e-Challan & online payment'
    ],
    requiredDocs: ['Aadhaar Card (for faceless contactless services)', 'Medical Certificate Form 1A (for age 40+ or transport DL)', 'Existing DL copy (for renewal)'],
    faq: [
      { q: 'Can I take the Learner Licence test from home?', a: 'Yes! In most Indian states, Aadhaar-authenticated candidates can take the online computerised LL test from home 24x7 without visiting the RTO.' },
      { q: 'How do I pay a traffic e-Challan?', a: 'Go to the Parivahan e-Challan portal, enter your vehicle number or challan number, view photographic proof, and pay via Netbanking/UPI.' }
    ]
  },
  {
    id: 'income-tax',
    name: 'Income Tax e-Filing 2.0',
    hindiName: 'आयकर ई-फाइलिंग पोर्टल',
    description: 'Central portal by the Central Board of Direct Taxes (CBDT) for seamless electronic filing of Income Tax Returns (ITR-1 through ITR-7), instant e-PAN generation, refund tracking, and tax payment via e-Pay Tax.',
    category: 'Taxes, Banking & Finance',
    officialUrl: 'https://www.incometax.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-103-0025 / 1800-419-0025',
    fees: 'Free filing; Late fee u/s 234F up to ₹1,000 or ₹5,000 after deadline',
    turnaroundTime: 'ITR processing: 2 to 30 days',
    popular: true,
    ministry: 'Department of Revenue, Ministry of Finance',
    keyServices: [
      'Instant e-PAN generation in 10 minutes using Aadhaar e-KYC',
      'File Income Tax Return (Pre-filled AIS/TIS data)',
      'Link Aadhaar with PAN card',
      'Check Income Tax Refund status & e-Verify return',
      'View Annual Information Statement (AIS) and Form 26AS'
    ],
    requiredDocs: ['PAN Card', 'Aadhaar Card linked with mobile', 'Bank Account details for refund credit', 'Form 16 / TDS Certificates'],
    faq: [
      { q: 'How to e-Verify my filed ITR immediately?', a: 'The easiest way is via Aadhaar OTP: enter the 6-digit OTP sent to your Aadhaar-registered mobile number to complete e-Verification in 30 seconds.' },
      { q: 'What is Instant e-PAN?', a: 'It is a digital, digitally signed PAN card issued in PDF format free of charge using Aadhaar KYC within minutes.' }
    ]
  },
  {
    id: 'epfo',
    name: 'EPFO Member Unified Portal',
    hindiName: 'ईपीएफओ यूएएन सदस्य पोर्टल',
    description: 'Employees’ Provident Fund Organisation portal for Indian formal sector workforce. Manage Universal Account Number (UAN), download passbook, transfer PF balance across job switches, and file online withdrawal claims.',
    category: 'Labour & Employment',
    officialUrl: 'https://unifiedportal-mem.epfindia.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-118-005',
    fees: 'Free government service',
    turnaroundTime: 'Online claims settled within 3 to 7 working days',
    popular: true,
    ministry: 'Ministry of Labour & Employment',
    keyServices: [
      'UAN Activation & Password generation',
      'Download EPF Passbook & Interest credit statement',
      'One Member One EPF Account (Transfer old PF to new employer)',
      'Online Advance PF withdrawal for illness, house purchase, marriage',
      'E-Nomination filing with Aadhaar e-Sign'
    ],
    requiredDocs: ['Universal Account Number (UAN)', 'Aadhaar linked to mobile', 'Verified Bank Account IFSC & cancelled cheque'],
    faq: [
      { q: 'How do I check my EPF balance on mobile?', a: 'Send SMS "EPFOHO UAN ENG" to 7738299899, or give a missed call to 9966044425 from your registered mobile number.' },
      { q: 'Is e-Nomination mandatory?', a: 'Yes, having an active e-nomination on the UAN portal is mandatory to access passbook viewing and seamless claim settlements.' }
    ]
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat (ABHA & PM-JAY)',
    hindiName: 'आयुष्मान भारत (आभा एवं पीएम-जय)',
    description: 'World’s largest government-funded healthcare scheme under the National Health Authority (NHA). Provides ₹5 Lakh annual cashless hospitalisation cover per eligible family and digital 14-digit ABHA Health IDs for all citizens.',
    category: 'Healthcare & Welfare',
    officialUrl: 'https://beneficiary.nha.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: true,
    requiresAuthentication: true,
    helpline: '14555 / 1800-111-565',
    fees: 'Completely free; ₹5 Lakh cashless treatment cover',
    turnaroundTime: 'Instant ABHA Card; PM-JAY card approval 24 to 48 hrs',
    popular: true,
    ministry: 'National Health Authority (NHA), MoHFW',
    keyServices: [
      'Create 14-digit ABHA (Ayushman Bharat Health Account) ID',
      'Check family eligibility for PM-JAY ₹5 Lakh cashless coverage',
      'Ayushman Card download & e-KYC approval',
      'Find empaneled public & private hospitals in your district',
      'Link lab reports and digital prescriptions to ABHA app'
    ],
    requiredDocs: ['Aadhaar Card', 'Ration Card / SECC Data details', 'Mobile Number'],
    faq: [
      { q: 'Who is eligible for Ayushman PM-JAY card?', a: 'Families identified based on deprivation and occupational criteria of the Socio-Economic Caste Census 2011 (SECC 2011), plus recently expanded senior citizens aged 70+ across all income brackets.' },
      { q: 'What is an ABHA card?', a: 'ABHA is a 14-digit health identification number that lets you digitally store, access, and share your medical records securely across doctors and hospitals nationwide.' }
    ]
  },
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    hindiName: 'पीएम-किसान सम्मान निधि',
    description: 'Direct Benefit Transfer (DBT) scheme providing ₹6,000 annually in three equal four-monthly instalments of ₹2,000 directly into the Aadhaar-linked bank accounts of landholding farmer families across India.',
    category: 'Farmers & Agriculture',
    officialUrl: 'https://pmkisan.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '155261 / 1800-115-526 / 011-23381092',
    fees: 'Free of cost',
    turnaroundTime: 'Instalment cycles: April-July, Aug-Nov, Dec-March',
    popular: true,
    ministry: 'Department of Agriculture & Farmers Welfare',
    keyServices: [
      'Farmer New Registration with land details (Khata / Khasra)',
      'Mandatory e-KYC via Aadhaar OTP or Face Authentication app',
      'Beneficiary Status & Payment instalment history check',
      'Update Aadhaar Name / Bank details correction',
      'Surrender / Voluntary opt-out of scheme'
    ],
    requiredDocs: ['Aadhaar Card', 'Land Ownership document (RoR / Khasra-Khatauni)', 'Aadhaar-seeded bank account with NPCI DBT enabled'],
    faq: [
      { q: 'Why did my PM-KISAN instalment stop?', a: 'Common reasons: pending e-KYC, land records not verified by district revenue officer, or bank account not seeded with Aadhaar on NPCI mapping.' },
      { q: 'Can I complete PM-KISAN e-KYC using Face Authentication?', a: 'Yes, download the PM-KISAN Mobile App and Aadhaar FaceRD app from Google Play Store to perform OTP-less face scan e-KYC directly on smartphone.' }
    ]
  },
  {
    id: 'eshram',
    name: 'e-Shram Portal',
    hindiName: 'ई-श्रम पोर्टल',
    description: 'Comprehensive national database of unorganised workers created by Ministry of Labour & Employment. Issues a 12-digit Universal Account Number (UAN) e-Shram card and links workers with social security schemes.',
    category: 'Labour & Employment',
    officialUrl: 'https://eshram.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '14434 (Toll-Free)',
    fees: 'Free on portal / CSC assisted',
    turnaroundTime: 'Instant UAN e-Shram Card PDF download',
    popular: true,
    ministry: 'Ministry of Labour & Employment',
    keyServices: [
      'Self-registration for gig workers, construction laborers, domestic helps, street vendors, agriculture labor',
      'Download 12-digit Universal Account Number (UAN) e-Shram card',
      'Automatic linkage with PMSBY accidental insurance cover',
      'Skill upgradation and National Career Service integration',
      'Migrant worker interstate benefits eligibility'
    ],
    requiredDocs: ['Aadhaar Number', 'Aadhaar-linked mobile number', 'Bank Account details', 'Age between 16 and 59 years'],
    faq: [
      { q: 'Can income tax payers or EPFO members register on e-Shram?', a: 'No. The e-Shram portal is solely for unorganised workers who are not members of EPFO, ESIC, or income tax payers.' },
      { q: 'What is the validity of the e-Shram card?', a: 'The e-Shram card is valid for a lifetime with no renewal required; workers should update their address/occupation once a year if changed.' }
    ]
  },
  {
    id: 'scholarship-portal',
    name: 'National Scholarship Portal (NSP)',
    hindiName: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP)',
    description: 'Single online gateway for student scholarships across Central Ministries (UGC, AICTE, Minority Affairs, Social Justice, Tribal Affairs, Higher Education) and state governments from Pre-Matric to Ph.D.',
    category: 'Education & Students',
    officialUrl: 'https://scholarships.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '0120-6619540',
    fees: 'Free application',
    turnaroundTime: 'Academic session deadlines (typically July - November)',
    popular: true,
    ministry: 'Ministry of Electronics & Information Technology / Ministry of Education',
    keyServices: [
      'One-Time Registration (OTR) with Aadhaar Face authentication',
      'Central Sector Scheme of Scholarships for College and University Students',
      'Post-Matric and Merit-cum-Means scholarships',
      'Application tracking & Institutional verification status',
      'Direct DBT disbursement into student bank accounts'
    ],
    requiredDocs: ['Aadhaar / OTR Number', 'Previous Academic Marksheet', 'Income Certificate issued by competent state authority', 'Caste/Community Certificate (where applicable)', 'Fee receipt & Student Bonafide from Institute'],
    faq: [
      { q: 'Can a student apply for more than one scholarship on NSP?', a: 'A student can be considered for multiple schemes based on eligibility, but can only avail scholarship under ONE government scheme per academic year.' },
      { q: 'What is NSP One-Time Registration (OTR)?', a: 'OTR is a 14-digit unique number issued upon Aadhaar biometric or face authentication to eliminate redundant registration paperwork every year.' }
    ]
  },
  {
    id: 'cpgrams',
    name: 'CPGRAMS Grievance Portal',
    hindiName: 'सीपीजीआरएएमएस लोक शिकायत निवारण',
    description: 'Centralised Public Grievance Redress and Monitoring System by the Department of Administrative Reforms and Public Grievances (DARPG). Citizens can lodge public grievances 24x7 against any Central or State Govt organization.',
    category: 'Public Grievances & Legal',
    officialUrl: 'https://pgportal.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-11-0031',
    fees: 'Free of cost',
    turnaroundTime: 'Target resolution within 30 to 45 days',
    popular: true,
    ministry: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    keyServices: [
      'File online citizen grievances against any Ministry/Department',
      'Appeal mechanism if dissatisfied with resolution of first officer',
      'Track grievance status with Registration / Docket Number',
      'SMS alerts on progress and disposal',
      'Feedback rating on officer resolution quality'
    ],
    requiredDocs: ['Valid citizen contact information', 'Supporting PDF documents / previous correspondence up to 4MB'],
    faq: [
      { q: 'What matters cannot be lodged on CPGRAMS?', a: 'RTI matters, court-subjudice matters, religious matters, and suggestions/opinions are not entertained as grievances.' },
      { q: 'What if I am unhappy with the reply to my grievance?', a: 'You can file an Appeal within 30 days of grievance closure to an Appellate Authority through the portal.' }
    ]
  },
  {
    id: 'cybercrime',
    name: 'National Cyber Crime Reporting Portal',
    hindiName: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल',
    description: 'Official initiative of Ministry of Home Affairs (MHA) to report cyber crimes online with special focus on online financial fraud, identity theft, child sexual abuse material (CSAM), and online harassment.',
    category: 'Public Grievances & Legal',
    officialUrl: 'https://cybercrime.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: false,
    helpline: '1930 (Citizen Financial Cyber Fraud Hotline - 24x7)',
    fees: 'Free emergency reporting',
    turnaroundTime: 'Immediate bank debit freeze upon call to 1930',
    popular: true,
    ministry: 'Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs',
    keyServices: [
      'Dial 1930 immediate financial fraud helpline to freeze siphoned funds',
      'Report UPI, Credit Card, SIM Swap, and Netbanking financial frauds',
      'Report Social Media impersonation and cyber blackmail',
      'Anonymous reporting of child exploitation & women abuse content',
      'Track police investigation status using Acknowledgement Number'
    ],
    requiredDocs: ['Bank transaction reference / UTR number', 'Screenshot of fraud messages / URL links', 'Victim ID details'],
    faq: [
      { q: 'What should I do immediately after falling victim to an online UPI scam?', a: 'Call 1930 immediately within the golden hour! The Citizen Financial Cyber Fraud Reporting System alerts beneficiary banks to freeze the fraudulent money in real time.' },
      { q: 'Can I report without revealing my identity?', a: 'Yes, for offenses related to women/children abuse, the portal permits anonymous reporting.' }
    ]
  },
  {
    id: 'myscheme',
    name: 'myScheme',
    hindiName: 'माई स्कीम',
    description: 'National platform designed to search and discover Central and State government welfare schemes tailored to your specific age, gender, caste, income, occupation, and residence eligibility in just a few clicks.',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://www.myscheme.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: false,
    helpline: '011-24303714',
    fees: 'Free scheme discovery',
    turnaroundTime: 'Instant personalised matching',
    popular: true,
    ministry: 'MeitY & Digital India Corporation',
    keyServices: [
      'Smart eligibility questionnaire matching 1,500+ government schemes',
      'Detailed breakdown of scheme benefits, eligibility criteria, and required papers',
      'Direct application links to state and central portals',
      'Save scheme checklists for family members',
      'Filter schemes by domain (Education, Health, Agriculture, Business, Housing)'
    ],
    requiredDocs: ['No documents required to search and discover eligible schemes'],
    faq: [
      { q: 'Does myScheme accept applications directly?', a: 'myScheme acts as an intelligent aggregator; after identifying your eligible schemes, it redirects you to the designated official department portal to submit your form.' }
    ]
  },
  {
    id: 'jeevan-pramaan',
    name: 'Jeevan Pramaan',
    hindiName: 'जीवन प्रमाण (डिजिटल जीवन प्रमाण पत्र)',
    description: 'Biometric and face-authenticated Digital Life Certificate (DLC) for Central Govt, State Govt, Defense, and EPFO pensioners. Eliminates physical visits to banks, post offices, or pension disbursing agencies.',
    category: 'Taxes, Banking & Finance',
    officialUrl: 'https://jeevanpramaan.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-111-555',
    fees: 'Free of cost',
    turnaroundTime: 'Instant generation & automated transmission to Bank/PPO',
    popular: false,
    ministry: 'Ministry of Electronics & Information Technology (MeitY)',
    keyServices: [
      'Generate Digital Life Certificate from home using smartphone Face RD',
      'Download Pramaan Certificate PDF using Pramaan ID',
      'Locate nearest Citizen Service Centre / Post Office for assisted DLC',
      'Automated dispatch to Pension Disbursing Agency (PDA)',
      'Defense SPARSH pensioner integration'
    ],
    requiredDocs: ['Pension Payment Order (PPO) Number', 'Pension Bank Account details', 'Aadhaar Number'],
    faq: [
      { q: 'Can a pensioner submit life certificate without biometric hardware?', a: 'Yes! The Jeevan Pramaan Face App uses your Android smartphone camera and Aadhaar FaceRD to verify your life certificate via facial recognition.' }
    ]
  },
  {
    id: 'digiyatra',
    name: 'DigiYatra',
    hindiName: 'डिजीयात्रा',
    description: 'Biometric passenger processing system based on Facial Recognition Technology (FRT) for paperless, contactless, and seamless boarding at major Indian airports.',
    category: 'Transport & Travel',
    officialUrl: 'https://www.digiyatrafoundation.com/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: 'support@digiyatrafoundation.com',
    fees: 'Free passenger amenity',
    turnaroundTime: 'Entry gate clearance in less than 3 seconds',
    popular: true,
    ministry: 'Ministry of Civil Aviation (MoCA)',
    keyServices: [
      'Express entry at airport departure gates via dedicated DigiYatra e-gates',
      'Contactless security hold area (SHA) validation',
      'Integration with DigiLocker and Indian boarding passes (2D barcode)',
      'Decentralised passenger data storage on device for privacy'
    ],
    requiredDocs: ['DigiLocker account / Aadhaar credentials', 'Selfie for biometric face capture', 'Valid flight Boarding Pass / PNR'],
    faq: [
      { q: 'Is DigiYatra mandatory for domestic flying in India?', a: 'No. DigiYatra is 100% voluntary. Passengers can always choose standard physical ID and printed/digital boarding pass verification.' }
    ]
  },
  {
    id: 'ecourts',
    name: 'eCourts Services',
    hindiName: 'ई-कोर्ट सेवाएं',
    description: 'Pan-India judicial service portal monitoring over 3,000+ court complexes. Access real-time case status, daily court cause lists, certified court orders, and judgments of District and High Courts.',
    category: 'Public Grievances & Legal',
    officialUrl: 'https://ecourts.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: false,
    helpline: 'ecommittee-sc@nic.in',
    fees: 'Free public information access',
    turnaroundTime: 'Real-time updates posted after court hours',
    popular: false,
    ministry: 'e-Committee, Supreme Court of India / Department of Justice',
    keyServices: [
      'Case Status by CNR (Case Number Record) 16-digit unique number',
      'Search by Case Number, Party Name, Advocate Name, or FIR Number',
      'Download signed Judgments & Interim Court Orders',
      'View Daily Cause List for District & Taluka Courts',
      'Virtual Courts for instant online disposal of traffic challans'
    ],
    requiredDocs: ['16-digit CNR Number OR Court name, case type and year'],
    faq: [
      { q: 'What is a CNR Number?', a: 'CNR (Case Number Record) is a unique 16-character alphanumeric number assigned to every court case filed across any district or subordinate court in India.' }
    ]
  },
  {
    id: 'startup-india',
    name: 'Startup India Portal',
    hindiName: 'स्टार्टअप इंडिया',
    description: 'Flagship initiative by the Department for Promotion of Industry and Internal Trade (DPIIT) to nurture innovation, provide tax exemptions (Section 80-IAC), fast-tracked patent examination, and seed funding support.',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://www.startupindia.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-115-565',
    fees: 'Free DPIIT Recognition',
    turnaroundTime: 'DPIIT Recognition certificate: 2 to 4 working days',
    popular: true,
    ministry: 'DPIIT, Ministry of Commerce and Industry',
    keyServices: [
      'DPIIT Startup Recognition certificate with 80-IAC tax holiday eligibility',
      'Startup India Seed Fund Scheme (SISFS) grants & debt funding up to ₹50 Lakh',
      '80% rebate on Patent filing fees and 50% rebate on Trademark fees',
      'Self-certification under 6 Labour Laws and 3 Environmental Laws',
      'Fast-track public procurement exemptions on GeM (no prior turnover requirement)'
    ],
    requiredDocs: ['Certificate of Incorporation (Pvt Ltd / LLP / Partnership)', 'PAN of Entity', 'Pitch deck / Write-up on innovation and scalability'],
    faq: [
      { q: 'Can an individual sole proprietorship get DPIIT recognition?', a: 'No. The entity must be registered as a Private Limited Company, a Limited Liability Partnership (LLP), or a Registered Partnership Firm.' }
    ]
  },
  {
    id: 'gem-portal',
    name: 'GeM (Government e-Marketplace)',
    hindiName: 'जेम (गवर्नमेंट ई-मार्केटप्लेस)',
    description: 'National public procurement portal for all Central & State Government Ministries, Departments, and Public Sector Undertakings to buy common goods and services transparently from registered MSMEs and sellers.',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://gem.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-419-3436 / 1800-102-3436',
    fees: 'Free seller registration; modest transaction fee on high-value orders',
    turnaroundTime: 'Seller assessment: 5 to 7 days',
    popular: false,
    ministry: 'Department of Commerce, Ministry of Commerce & Industry',
    keyServices: [
      'Direct government procurement bidding without middlemen',
      'Direct purchase up to ₹25,000 and reverse auctions for large contracts',
      'MSME and Women entrepreneur preferential procurement quotas',
      'Prompt payment guarantee under statutory government timelines'
    ],
    requiredDocs: ['PAN Card', 'GSTIN', 'Aadhaar of authorized signatory', 'Bank account details'],
    faq: [
      { q: 'Can small businesses and artisans sell on GeM?', a: 'Yes! GeM has special programs like "Womaniya" and "GeM Outlet Stores" for weavers, SHGs, and local artisans with zero entry barriers.' }
    ]
  },
  {
    id: 'abc-apaar',
    name: 'Academic Bank of Credits (ABC / APAAR ID)',
    hindiName: 'एकेडेमिक बैंक ऑफ क्रेडिट्स (अपार आईडी)',
    description: 'Envisioned under the National Education Policy (NEP 2020). Serves as a digital repository of credits earned by students throughout their academic journey, enabling multiple entry-and-exit flexibility across universities.',
    category: 'Education & Students',
    officialUrl: 'https://www.abc.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: 'abc.support@gov.in',
    fees: 'Free student service',
    turnaroundTime: 'Instant APAAR / ABC ID generation',
    popular: false,
    ministry: 'Ministry of Education',
    keyServices: [
      'Create 12-digit permanent APAAR (Automated Permanent Academic Account Registry) ID',
      'Seamless digital credit transfer between recognized Indian Universities',
      'Integration with DigiLocker for verified degree certificates',
      'Support for National Credit Framework (NCrF) vocational credits'
    ],
    requiredDocs: ['Aadhaar Number', 'Student Admission Roll Number / University Name', 'Registered Mobile Number'],
    faq: [
      { q: 'What is APAAR ID / One Nation One Student ID?', a: 'APAAR is a lifelong 12-digit unique ID issued to all students in India to track their academic achievements, scholarships, and skill credentials digitally.' }
    ]
  },
  {
    id: 'gst-portal',
    name: 'GST Portal',
    hindiName: 'जीएसटी पोर्टल',
    description: 'Goods and Services Tax Network (GSTN) portal for indirect tax administration. Register for GSTIN, file monthly/quarterly returns (GSTR-1, GSTR-3B, GSTR-9), create e-Way bills, and claim input tax credit (ITC).',
    category: 'Taxes, Banking & Finance',
    officialUrl: 'https://www.gst.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-103-4786',
    fees: 'Registration is free; late fees apply on delayed returns',
    turnaroundTime: 'Aadhaar-authenticated GSTIN issued within 7 working days',
    popular: false,
    ministry: 'Goods and Services Tax Network (GSTN)',
    keyServices: [
      'New GSTIN Registration with Aadhaar biometric authentication',
      'Monthly / Quarterly Return filing (GSTR-1, GSTR-3B, CMP-08)',
      'Generate Electronic Way (e-Way) Bills and e-Invoices',
      'Input Tax Credit (ITC) reconciliation with GSTR-2B',
      'File GST Refund applications'
    ],
    requiredDocs: ['PAN of Business / Proprietor', 'Proof of Principal Place of Business (Electricity Bill / Rent Agreement)', 'Bank Account details', 'Authorized Signatory Aadhaar'],
    faq: [
      { q: 'What is the turnover threshold for mandatory GST registration?', a: 'Generally ₹40 Lakh for goods (₹20 Lakh for special category northeastern states) and ₹20 Lakh for services (₹10 Lakh for special states).' }
    ]
  },
  {
    id: 'ncs',
    name: 'National Career Service (NCS)',
    hindiName: 'राष्ट्रीय करियर सेवा (NCS)',
    description: 'Mission mode project by the Ministry of Labour & Employment connecting jobseekers, employers, skill providers, and placement agencies across India, with special career counselling tools.',
    category: 'Labour & Employment',
    officialUrl: 'https://www.ncs.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1800-425-1514',
    fees: 'Free government job portal',
    turnaroundTime: 'Instant candidate profile matching',
    popular: false,
    ministry: 'Ministry of Labour & Employment',
    keyServices: [
      'Search verified Central & State Government and Private sector vacancies',
      'Register for District Job Fairs (Rojgar Melas) nationwide',
      'Free psychometric Career Counselling and skill assessment tests',
      'Search vocational training programs under PMKVY',
      'Inter-linkage with e-Shram for unorganised skilled workers'
    ],
    requiredDocs: ['Aadhaar / National ID', 'Educational Marksheets', 'Updated Resume / Skill summary'],
    faq: [
      { q: 'Does NCS charge candidates for job placements?', a: 'No! National Career Service is a 100% free public service. Beware of any fraudsters demanding money for interviews or jobs.' }
    ]
  },
  {
    id: 'esanjeevani',
    name: 'eSanjeevani Teleconsultation',
    hindiName: 'ई-संजीवनी टेलीमेडिसिन',
    description: 'National Doctor-to-Citizen Teleconsultation service by Ministry of Health & Family Welfare. Connect with registered government specialist doctors and MBBS physicians via video call from home completely free.',
    category: 'Healthcare & Welfare',
    officialUrl: 'https://esanjeevani.mohfw.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '011-23063496',
    fees: '100% Free consultation & digital prescription',
    turnaroundTime: 'Typical queue wait time: 5 to 20 minutes',
    popular: false,
    ministry: 'Ministry of Health and Family Welfare (MoHFW)',
    keyServices: [
      'Free audio/video consultation with specialist government doctors',
      'Instantly download legally valid digital e-Prescription with doctor stamp',
      'Specialist clinics (General Medicine, Gynecology, Pediatrics, Dermatology, Mental Health)',
      'Automated integration with ABHA Health ID'
    ],
    requiredDocs: ['Mobile number for OTP verification', 'Past medical reports / scans (optional)'],
    faq: [
      { q: 'Is the prescription issued on eSanjeevani valid at private pharmacies?', a: 'Yes. e-Prescriptions generated on eSanjeevani comply with Telemedicine Practice Guidelines issued by National Medical Commission (NMC).' }
    ]
  },
  {
    id: 'consumer-helpline',
    name: 'National Consumer Helpline (NCH / INGRAM)',
    hindiName: 'राष्ट्रीय उपभोक्ता हेल्पलाइन',
    description: 'Operated by the Department of Consumer Affairs. Enables consumers to lodge complaints against misleading advertisements, defective products, deficient services, overcharging, and ecommerce refund disputes.',
    category: 'Public Grievances & Legal',
    officialUrl: 'https://consumerhelpline.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: true,
    helpline: '1915 / 1800-11-4000 (SMS: 8800001915)',
    fees: 'Free of cost',
    turnaroundTime: 'Company response typically within 15 to 30 days',
    popular: false,
    ministry: 'Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution',
    keyServices: [
      'Dial 1915 to lodge consumer complaints in 17 languages',
      'Direct mediation with 900+ convergence partner companies (ecommerce, electronics, airlines, telecom)',
      'Pre-litigation dispute redressal before filing in District Consumer Forum (e-Daakhil)',
      'Track complaint resolution using Docket Number'
    ],
    requiredDocs: ['Purchase Invoice / Bill', 'Proof of complaint to company customer service', 'Transaction / Order ID'],
    faq: [
      { q: 'What is the difference between NCH and Consumer Court (e-Daakhil)?', a: 'NCH works as an informal grievance redressal and company convergence mechanism. If the company fails to resolve it here, you can file a formal legal case on e-Daakhil without a lawyer.' }
    ]
  },
  {
    id: 'csc',
    name: 'CSC Digital Seva (Common Service Centres)',
    hindiName: 'सीएससी डिजिटल सेवा',
    description: 'Access points in rural and semi-urban India for delivering essential public utility services, social welfare schemes, healthcare, financial, education, and agriculture services to citizens with Village Level Entrepreneurs (VLEs).',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://www.csc.gov.in/',
    integrationStatus: 'OFFICIAL PORTAL',
    apiAvailable: false,
    requiresAuthentication: false,
    helpline: '14599 (Toll-Free)',
    fees: 'Government regulated nominal service charges (~₹20 - ₹50)',
    turnaroundTime: 'Assisted physical counter service',
    popular: false,
    ministry: 'CSC e-Governance Services India Limited, MeitY',
    keyServices: [
      'Assisted Aadhaar address change and PVC ordering',
      'PM-KISAN registration, e-KYC, and land record linking',
      'Ayushman Bharat Golden Card printing and registration',
      'Electricity, Water, and Fastag recharge points',
      'DigiPay rural banking, cash withdrawal, and pension disbursement'
    ],
    requiredDocs: ['Aadhaar Card', 'Mobile phone for OTP', 'Relevant scheme documents'],
    faq: [
      { q: 'How can I find my nearest CSC centre?', a: 'Visit locator.csccloud.in and select your State, District, and Sub-district to find certified active VLE centres with contact details.' }
    ]
  },
  {
    id: 'api-setu',
    name: 'API Setu',
    hindiName: 'एपीआई सेतु',
    description: 'Open API platform under Digital India building an interoperable digital public infrastructure. Enables government and private entities to consume digital public goods and verified credentials securely.',
    category: 'Citizen Hubs & Business',
    officialUrl: 'https://apisetu.gov.in/',
    integrationStatus: 'AUTHORISED API',
    apiAvailable: true,
    requiresAuthentication: true,
    helpline: 'support@apisetu.gov.in',
    fees: 'Open public infrastructure',
    turnaroundTime: 'Developer onboarding: 3 to 5 days',
    popular: false,
    ministry: 'National e-Governance Division (NeGD), MeitY',
    keyServices: [
      'Access to 2,500+ published government department APIs',
      'Digital India KYC and Document verification endpoints',
      'Secure OAuth2-based citizen consent architecture',
      'Standardized schemas for driving licenses, vehicle RCs, and academic degrees'
    ],
    requiredDocs: ['Entity registration document', 'Application proposal for API sandbox access'],
    faq: [
      { q: 'Who can register on API Setu?', a: 'Both government departments and verified private tech entities building citizen-centric services can consume APIs subject to consent protocols.' }
    ]
  }
];

export const seedPlatforms = async () => {
  const colRef = collection(db, 'platforms');
  const now = new Date().toISOString();
  for (const platform of platforms) {
    await setDoc(doc(colRef, platform.id), {
      ...platform,
      lastVerified: now
    }, { merge: true });
  }
};
