import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { platforms as fallbackPlatforms, PlatformItem } from '../utils/seedPlatforms';
import { getBookmarks, toggleBookmark } from '../services/userService';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Clock, 
  Coins, 
  Building, 
  Bookmark, 
  CheckCircle, 
  FileText, 
  HelpCircle, 
  Sparkles,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import AiAssistant from '../components/AiAssistant';

export default function PlatformDetails() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [platform, setPlatform] = useState<PlatformItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);

  useEffect(() => {
    const fetchPlatform = async () => {
      if (!id) return;
      setLoading(true);

      // Try local fallback first for instant load
      const localMatch = fallbackPlatforms.find(p => p.id === id);
      if (localMatch) {
        setPlatform(localMatch);
      }

      // Check Firestore doc
      try {
        const docRef = doc(db, 'platforms', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlatform({ id: docSnap.id, ...docSnap.data() } as PlatformItem);
        }
      } catch (err) {
        console.warn('Fetched platform from fallback dataset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatform();
  }, [id]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!id) return;
      const bookmarks = await getBookmarks(user ? user.uid : null);
      setIsSaved(bookmarks.some(b => b.platformId === id));
    };
    checkBookmarkStatus();
  }, [id, user]);

  const handleToggleBookmark = async () => {
    if (!platform) return;
    const nextSavedState = await toggleBookmark(user ? user.uid : null, {
      id: platform.id,
      name: platform.name,
      category: platform.category,
      officialUrl: platform.officialUrl
    });
    setIsSaved(nextSavedState);
  };

  if (loading && !platform) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Platform Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The requested government platform directory entry could not be located.</p>
        <Link to="/government-platforms" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium">
          &larr; {t('backToDirectory')}
        </Link>
      </div>
    );
  }

  const relatedPlatforms = fallbackPlatforms
    .filter(p => p.category === platform.category && p.id !== platform.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {/* Top Banner Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <Link
            to="/government-platforms"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToDirectory')}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
              <span>{isSaved ? t('savedPortal') : t('savePortal')}</span>
            </button>

            <button
              onClick={() => setShowAiHelper(!showAiHelper)}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Guide</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        {/* Security Warning Box */}
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            <strong className="font-bold">Official Domain Guarantee:</strong> {t('officialWarning')}
          </div>
        </div>

        {/* Main Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
                  {platform.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {platform.integrationStatus}
                </span>
                {platform.apiAvailable && (
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full">
                    API Setu Integrated
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {platform.name}
              </h1>
              {platform.hindiName && (
                <div className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {platform.hindiName}
                </div>
              )}

              {platform.ministry && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{platform.ministry}</span>
                </div>
              )}
            </div>

            <a
              href={platform.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
            >
              <span>{t('openPortal')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pb-6 border-b border-slate-100 dark:border-slate-800">
            {platform.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            {platform.helpline && (
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('helpline')}</span>
                </div>
                <a
                  href={`tel:${platform.helpline.split('/')[0].trim()}`}
                  className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {platform.helpline}
                </a>
              </div>
            )}

            {platform.fees && (
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('fees')}</span>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {platform.fees}
                </div>
              </div>
            )}

            {platform.turnaroundTime && (
              <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('turnaround')}</span>
                </div>
                <div className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {platform.turnaroundTime}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Helper Dropdown if toggled */}
        {showAiHelper && (
          <div className="mb-8">
            <AiAssistant />
          </div>
        )}

        {/* Two-Column Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Key Services Offered */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>{t('keyServices')}</span>
            </h3>
            {platform.keyServices && platform.keyServices.length > 0 ? (
              <ul className="space-y-3">
                {platform.keyServices.map((srv, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Access full list of electronic services on the official portal.</p>
            )}
          </div>

          {/* Prerequisites and Required Documents */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <span>{t('requiredDocs')}</span>
            </h3>
            {platform.requiredDocs && platform.requiredDocs.length > 0 ? (
              <ul className="space-y-3">
                {platform.requiredDocs.map((docItem, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{docItem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Standard citizen identity documents (Aadhaar, registered mobile number for OTP).</p>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        {platform.faq && platform.faq.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>{t('officialFaqs')}</span>
            </h3>
            <div className="space-y-4">
              {platform.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800"
                >
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2">
                    {item.q}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Platforms */}
        {relatedPlatforms.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
              More Services in {platform.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPlatforms.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/government-platforms/${rel.id}`}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-850/50 transition-all group"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
