/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import GovernmentPlatforms from './pages/GovernmentPlatforms';
import PlatformDetails from './pages/PlatformDetails';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LANGUAGES } from './constants/languages';
import { useTranslation } from '../src/hooks/useTranslation';
import AiAssistant from './components/AiAssistant';
import EligibilityWizard from './components/EligibilityWizard';
import ApplicationTracker from './components/ApplicationTracker';
import { platforms } from './utils/seedPlatforms';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  FileCheck, 
  Bookmark, 
  Phone, 
  ExternalLink, 
  ArrowRight, 
  Moon, 
  Sun, 
  Globe, 
  Compass, 
  CheckCircle,
  HelpCircle,
  LogIn,
  LogOut,
  User,
  Building,
  Menu,
  X
} from 'lucide-react';

function Navbar({ theme, toggleTheme }: { theme: 'light' | 'dark'; toggleTheme: () => void }) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Tiranga Subtle Micro-Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <nav className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:shadow-md transition-shadow">
            🇮🇳
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              <span>{t('title')}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 rounded">
                Gov.in
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
              {t('subBrand')}
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link 
            to="/" 
            className={`transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${
              location.pathname === '/' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''
            }`}
          >
            Home & AI Guide
          </Link>
          <Link 
            to="/government-platforms" 
            className={`transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${
              location.pathname === '/government-platforms' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''
            }`}
          >
            Services Directory
          </Link>
          <Link 
            to="/tracker" 
            className={`transition-colors hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 ${
              location.pathname === '/tracker' ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Application Tracker</span>
          </Link>
        </div>

        {/* Actions (Language, Theme, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select preferred language"
              className="text-xs font-semibold pl-6 pr-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-xs font-medium text-slate-600 dark:text-slate-400">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-1"
                title={t('logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 text-sm">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600"
          >
            Home & AI Guide
          </Link>
          <Link
            to="/government-platforms"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600"
          >
            Services Directory
          </Link>
          <Link
            to="/tracker"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-blue-500" />
            <span>My Application Tracker</span>
          </Link>
        </div>
      )}
    </header>
  );
}

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [homeSearch, setHomeSearch] = useState('');

  const popularPlatforms = platforms.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/government-platforms?q=${encodeURIComponent(homeSearch.trim())}`);
    } else {
      navigate('/government-platforms');
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl space-y-12">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200 dark:border-orange-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Official Public Services Discovery Engine • Digital India</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {t('exploreTitle')}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('exploreDesc')}
        </p>

        {/* Quick Search Jump */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative mb-6">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search e.g. 'Aadhaar update', 'DigiLocker marksheet', 'Passport appointment', 'PF balance'..."
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
            className="w-full pl-12 pr-28 sm:pr-36 py-3.5 sm:py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-md focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm sm:text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Find Portal
          </button>
        </form>

        {/* Key Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full font-medium shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 26+ Central & State Platforms
          </span>
          <span className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full font-medium shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Verified .gov.in Domain Directory
          </span>
          <span className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full font-medium shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 11 Indian Languages
          </span>
        </div>
      </section>

      {/* SevaSync AI Assistant Interactive Section */}
      <section id="ai-assistant">
        <AiAssistant />
      </section>

      {/* Citizen Eligibility & Scheme Finder Wizard */}
      <section id="scheme-wizard">
        <EligibilityWizard />
      </section>

      {/* Essential Government Portals Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-500" />
              Essential Indian Government Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Direct access to the most frequently used public services across the country.
            </p>
          </div>
          <Link
            to="/government-platforms"
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({platforms.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                    {platform.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    .gov.in
                  </span>
                </div>

                <Link to={`/government-platforms/${platform.id}`}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {platform.name}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 mb-4 line-clamp-2 leading-relaxed">
                  {platform.description}
                </p>

                {platform.keyServices && (
                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Featured Services:</div>
                    <div className="flex flex-wrap gap-1">
                      {platform.keyServices.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <Link
                  to={`/government-platforms/${platform.id}`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                </Link>
                <a
                  href={platform.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium flex items-center gap-1 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Citizen Application Tracker Section */}
      <section id="application-tracker">
        <ApplicationTracker />
      </section>

      {/* Emergency Official Helplines Strip */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              Official National Citizen Emergency & Service Helplines
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Direct toll-free numbers operated by Central Ministries and Law Enforcement agencies.
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 self-start md:self-auto">
            Toll-Free 24x7 Services
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Cyber Financial Scam</div>
            <a href="tel:1930" className="text-emerald-400 font-extrabold text-lg hover:underline block mt-0.5">
              1930
            </a>
            <div className="text-[10px] text-slate-400">Immediate bank debit freeze</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Aadhaar Helpline</div>
            <a href="tel:1947" className="text-amber-400 font-extrabold text-lg hover:underline block mt-0.5">
              1947
            </a>
            <div className="text-[10px] text-slate-400">UIDAI Citizen Support</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Ayushman Bharat</div>
            <a href="tel:14555" className="text-blue-400 font-extrabold text-lg hover:underline block mt-0.5">
              14555
            </a>
            <div className="text-[10px] text-slate-400">PM-JAY Hospital Cover</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Consumer Helpline</div>
            <a href="tel:1915" className="text-purple-400 font-extrabold text-lg hover:underline block mt-0.5">
              1915
            </a>
            <div className="text-[10px] text-slate-400">NCH Dispute Redressal</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">Kisan Call Centre</div>
            <a href="tel:18001801551" className="text-lime-400 font-extrabold text-base hover:underline block mt-0.5">
              1800-180-1551
            </a>
            <div className="text-[10px] text-slate-400">Agri & Farmer Queries</div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
            <div className="text-slate-400 text-[10px] uppercase font-bold">UMANG Governance</div>
            <a href="tel:1800115246" className="text-teal-400 font-extrabold text-base hover:underline block mt-0.5">
              1800-11-5246
            </a>
            <div className="text-[10px] text-slate-400">Pan-India e-Gov Hub</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Remix SevaSync AI • Dedicated to empowering 1.4 Billion Indian citizens through accessible Digital Public Infrastructure.
        </p>
        <p>
          Information compiled from official Government of India portals under open citizen access guidelines. Always verify URLs end with .gov.in or .nic.in before transacting.
        </p>
      </footer>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference or default
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/government-platforms" element={<GovernmentPlatforms />} />
              <Route path="/government-platforms/:id" element={<PlatformDetails />} />
              <Route 
                path="/tracker" 
                element={
                  <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl">
                    <ApplicationTracker />
                  </div>
                } 
              />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
