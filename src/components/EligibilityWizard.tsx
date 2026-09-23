import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Tractor, 
  Briefcase, 
  HeartHandshake, 
  UserCheck, 
  Building2, 
  Compass, 
  ArrowRight, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface WizardOption {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const CITIZEN_ROLES: WizardOption[] = [
  { id: 'student', label: 'Student / Scholar', icon: GraduationCap, description: 'School, college, degrees, scholarships & admissions' },
  { id: 'farmer', label: 'Farmer / Agriculture', icon: Tractor, description: 'Landholder, Kisan benefits, subsidies & crop insurance' },
  { id: 'employee', label: 'Salaried Professional', icon: Briefcase, description: 'Private/Govt sector, EPF, ITR, NPS & pension' },
  { id: 'worker', label: 'Unorganised / Gig Worker', icon: HeartHandshake, description: 'Construction, delivery, domestic labor & artisans' },
  { id: 'senior', label: 'Senior Citizen / Pensioner', icon: UserCheck, description: 'Digital life certificates, healthcare & old-age pensions' },
  { id: 'business', label: 'Entrepreneur / MSME', icon: Building2, description: 'Startups, GST, company incorporation & GeM tenders' }
];

const NEED_AREAS: WizardOption[] = [
  { id: 'identity', label: 'Identity & Official Proofs', icon: ShieldCheck, description: 'Aadhaar, Passport, DigiLocker, Voter ID & Certificates' },
  { id: 'health', label: 'Healthcare & Medical Cover', icon: HeartHandshake, description: 'Ayushman Bharat ₹5L card, ABHA ID & Teleconsultation' },
  { id: 'finance', label: 'Taxes, Banking & Direct Benefit', icon: Briefcase, description: 'Income Tax e-Filing, PM-KISAN ₹6K, EPFO UAN, GST' },
  { id: 'career', label: 'Jobs, Training & Skill Melas', icon: GraduationCap, description: 'National Career Service, PMKVY & Rozgar Melas' },
  { id: 'transport', label: 'Vehicles, License & Travel', icon: Compass, description: 'Learner DL test, DL renewal, RC transfer, DigiYatra' },
  { id: 'grievance', label: 'File Complaint or Dispute', icon: ShieldCheck, description: 'CPGRAMS, Consumer Helpline 1915, Cyber Crime 1930' }
];

interface Recommendation {
  id: string;
  title: string;
  badge: string;
  reason: string;
  url: string;
  link: string;
}

export default function EligibilityWizard() {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>('student');
  const [selectedNeed, setSelectedNeed] = useState<string>('identity');

  // Recommendation engine based on role and need
  const getRecommendations = (): Recommendation[] => {
    const list: Recommendation[] = [];

    // General Identity
    if (selectedNeed === 'identity') {
      list.push({
        id: 'digilocker',
        title: 'DigiLocker',
        badge: 'Legally Valid Cloud',
        reason: 'Store and instantly issue legally valid Aadhaar, PAN, Marksheets, and Driving Licences directly on mobile.',
        url: 'https://www.digilocker.gov.in/',
        link: '/government-platforms/digilocker'
      });
      list.push({
        id: 'uidai',
        title: 'UIDAI myAadhaar',
        badge: 'Universal Identity',
        reason: 'Download password-protected e-Aadhaar, order PVC card, lock biometric authentication, and update residential address.',
        url: 'https://myaadhaar.uidai.gov.in/',
        link: '/government-platforms/uidai'
      });
      list.push({
        id: 'passport-seva',
        title: 'Passport Seva',
        badge: 'Travel Document',
        reason: 'Book online appointment slots for Fresh or Tatkaal passport issuance and track police verification.',
        url: 'https://www.passportindia.gov.in/',
        link: '/government-platforms/passport-seva'
      });
    }

    // Health
    if (selectedNeed === 'health') {
      list.push({
        id: 'ayushman-bharat',
        title: 'Ayushman Bharat (PM-JAY & ABHA)',
        badge: '₹5 Lakh Cashless Cover',
        reason: selectedRole === 'senior' 
          ? 'Senior citizens aged 70+ can now receive ₹5 Lakh annual cashless hospital cover regardless of family income.'
          : 'Check SECC eligibility for ₹5 Lakh family health coverage and generate your 14-digit digital ABHA health ID.',
        url: 'https://beneficiary.nha.gov.in/',
        link: '/government-platforms/ayushman-bharat'
      });
      list.push({
        id: 'esanjeevani',
        title: 'eSanjeevani Teleconsultation',
        badge: '100% Free Doctors',
        reason: 'Consult verified government specialist doctors and MBBS doctors over video call from home with digital prescription.',
        url: 'https://esanjeevani.mohfw.gov.in/',
        link: '/government-platforms/esanjeevani'
      });
    }

    // Finance & Benefit
    if (selectedNeed === 'finance') {
      if (selectedRole === 'farmer') {
        list.push({
          id: 'pm-kisan',
          title: 'PM-KISAN Samman Nidhi',
          badge: '₹6,000 Annual Direct Transfer',
          reason: 'Direct bank benefit transfer of ₹2,000 every 4 months for landholding farmer families. Perform face e-KYC directly on phone.',
          url: 'https://pmkisan.gov.in/',
          link: '/government-platforms/pm-kisan'
        });
      }
      if (selectedRole === 'employee') {
        list.push({
          id: 'epfo',
          title: 'EPFO Member Portal (UAN)',
          badge: 'PF Balance & Pension',
          reason: 'Check your employer EPF monthly contribution, download passbook, submit advance withdrawal claim, and file e-nomination.',
          url: 'https://unifiedportal-mem.epfindia.gov.in/',
          link: '/government-platforms/epfo'
        });
      }
      if (selectedRole === 'senior') {
        list.push({
          id: 'jeevan-pramaan',
          title: 'Jeevan Pramaan (DLC)',
          badge: 'Pension Life Certificate',
          reason: 'Submit digital life certificate from home using smartphone facial authentication without visiting bank or post office.',
          url: 'https://jeevanpramaan.gov.in/',
          link: '/government-platforms/jeevan-pramaan'
        });
      }
      list.push({
        id: 'income-tax',
        title: 'Income Tax e-Filing 2.0',
        badge: 'Tax Returns & Instant PAN',
        reason: 'Generate instant free e-PAN in 10 minutes using Aadhaar and file annual income tax return with prefilled data.',
        url: 'https://www.incometax.gov.in/',
        link: '/government-platforms/income-tax'
      });
    }

    // Career & Education
    if (selectedNeed === 'career') {
      if (selectedRole === 'worker') {
        list.push({
          id: 'eshram',
          title: 'e-Shram National Worker Portal',
          badge: 'Unorganised Worker Social Security',
          reason: 'Obtain 12-digit UAN e-Shram card, ₹2 Lakh PMSBY accident insurance cover, and direct access to state welfare schemes.',
          url: 'https://eshram.gov.in/',
          link: '/government-platforms/eshram'
        });
      }
      list.push({
        id: 'ncs',
        title: 'National Career Service (NCS)',
        badge: 'Government & Private Jobs',
        reason: 'Search verified job vacancies, register for state Rojgar Melas, and take free vocational counselling assessments.',
        url: 'https://www.ncs.gov.in/',
        link: '/government-platforms/ncs'
      });
    }

    // Transport
    if (selectedNeed === 'transport') {
      list.push({
        id: 'parivahan',
        title: 'Parivahan Sewa (Sarathi & Vahan)',
        badge: 'RTO Services Online',
        reason: 'Apply for Learner License online with Aadhaar authentication from home, renew Driving License, and pay e-Challan.',
        url: 'https://parivahan.gov.in/',
        link: '/government-platforms/parivahan'
      });
      list.push({
        id: 'digiyatra',
        title: 'DigiYatra Airport Gate Pass',
        badge: 'Paperless Airport Entry',
        reason: 'Use facial recognition biometric gates at major airports across India for seamless 3-second contactless entry.',
        url: 'https://www.digiyatrafoundation.com/',
        link: '/government-platforms/digiyatra'
      });
    }

    // Grievance
    if (selectedNeed === 'grievance') {
      list.push({
        id: 'cybercrime',
        title: 'National Cyber Crime Portal (1930)',
        badge: 'Financial Scam 24x7 Emergency',
        reason: 'Dial 1930 to alert banks to immediately freeze fraudulently debited funds from UPI, netbanking, or credit card scams.',
        url: 'https://cybercrime.gov.in/',
        link: '/government-platforms/cybercrime'
      });
      list.push({
        id: 'cpgrams',
        title: 'CPGRAMS Central Grievances',
        badge: 'Direct Ministry Escalation',
        reason: 'Lodge formal public grievance against any Central/State Govt ministry with tracking and 30-day appeal mechanism.',
        url: 'https://pgportal.gov.in/',
        link: '/government-platforms/cpgrams'
      });
    }

    // Student specific scholarships
    if (selectedRole === 'student' && selectedNeed !== 'grievance') {
      list.unshift({
        id: 'scholarship-portal',
        title: 'National Scholarship Portal (NSP)',
        badge: 'Central & State Scholarships',
        reason: 'Single window for Central Sector, Post-Matric, and Merit-cum-Means scholarships with direct bank credit via DBT.',
        url: 'https://scholarships.gov.in/',
        link: '/government-platforms/scholarship-portal'
      });
    }

    // Business specific
    if (selectedRole === 'business' && (selectedNeed === 'finance' || selectedNeed === 'career')) {
      list.unshift({
        id: 'startup-india',
        title: 'Startup India Portal',
        badge: 'Tax Holiday & DPIIT Recognition',
        reason: 'Obtain DPIIT Startup Recognition, 80-IAC tax holiday, 80% rebate on patent filings, and seed fund grants up to ₹50 Lakh.',
        url: 'https://www.startupindia.gov.in/',
        link: '/government-platforms/startup-india'
      });
    }

    return list.slice(0, 3);
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 dark:bg-orange-950/60 rounded-xl text-orange-600 dark:text-orange-400">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t('eligibilityWizard')}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('eligibilityWizardDesc')}
          </p>
        </div>
      </div>

      {/* Step 1: Who are you? */}
      <div className="mb-6">
        <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-3">
          Step 1: {t('iAmA')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CITIZEN_ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`} />
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{role.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{role.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: What do you need? */}
      <div className="mb-8">
        <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-3">
          Step 2: {t('lookingFor')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {NEED_AREAS.map((need) => {
            const Icon = need.icon;
            const isSelected = selectedNeed === need.id;
            return (
              <button
                key={need.id}
                onClick={() => setSelectedNeed(need.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{need.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{need.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results / Recommended Government Portals */}
      <div className="bg-slate-50 dark:bg-slate-850/80 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Recommended Official Portals For You
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {recommendations.length} matched public services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h5 className="font-bold text-base text-slate-900 dark:text-white">
                    {rec.title}
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full whitespace-nowrap">
                    {rec.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <Link
                  to={rec.link}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View Details & Guide <ArrowRight className="w-3 h-3" />
                </Link>
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                  title="Open Official Portal"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
