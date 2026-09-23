import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { platforms as fallbackPlatforms, PlatformItem } from '../utils/seedPlatforms';
import { getBookmarks, toggleBookmark, UserBookmark } from '../services/userService';
import { 
  Search, 
  Bookmark, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Clock, 
  Coins, 
  Building,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Identity & Documents',
  'Transport & Travel',
  'Taxes, Banking & Finance',
  'Labour & Employment',
  'Healthcare & Welfare',
  'Farmers & Agriculture',
  'Education & Students',
  'Public Grievances & Legal',
  'Citizen Hubs & Business'
];

export default function GovernmentPlatforms() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [platformsList, setPlatformsList] = useState<PlatformItem[]>(fallbackPlatforms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterApiOnly, setFilterApiOnly] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'platforms'));
        if (!querySnapshot.empty) {
          const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlatformItem));
          setPlatformsList(list);
        }
      } catch (err) {
        console.warn('Using seeded platforms list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatforms();
  }, []);

  useEffect(() => {
    const loadBookmarks = async () => {
      const items = await getBookmarks(user ? user.uid : null);
      setBookmarks(items);
    };
    loadBookmarks();
  }, [user]);

  const handleBookmarkToggle = async (platform: PlatformItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = await toggleBookmark(user ? user.uid : null, {
      id: platform.id,
      name: platform.name,
      category: platform.category,
      officialUrl: platform.officialUrl
    });

    if (isNowSaved) {
      setBookmarks(prev => [
        ...prev,
        {
          id: platform.id,
          userId: user ? user.uid : 'guest',
          platformId: platform.id,
          platformName: platform.name,
          category: platform.category,
          officialUrl: platform.officialUrl,
          createdAt: new Date().toISOString()
        }
      ]);
    } else {
      setBookmarks(prev => prev.filter(b => b.platformId !== platform.id));
    }
  };

  const isBookmarked = (id: string) => bookmarks.some(b => b.platformId === id);

  const filteredPlatforms = useMemo(() => {
    return platformsList.filter(platform => {
      // Category filter
      if (selectedCategory !== 'All' && platform.category !== selectedCategory) {
        return false;
      }

      // API filter
      if (filterApiOnly && !platform.apiAvailable) {
        return false;
      }

      // Saved only filter
      if (showSavedOnly && !isBookmarked(platform.id)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = platform.name.toLowerCase().includes(q);
        const matchesHindi = platform.hindiName ? platform.hindiName.toLowerCase().includes(q) : false;
        const matchesDesc = platform.description.toLowerCase().includes(q);
        const matchesCat = platform.category.toLowerCase().includes(q);
        const matchesServices = platform.keyServices ? platform.keyServices.some(s => s.toLowerCase().includes(q)) : false;
        return matchesName || matchesHindi || matchesDesc || matchesCat || matchesServices;
      }

      return true;
    });
  }, [platformsList, selectedCategory, filterApiOnly, showSavedOnly, searchQuery, bookmarks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {/* Directory Hero Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Digital Public Goods Directory
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('directoryTitle')}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                Browse verified Central and State Government digital portals, citizen services, helplines, and turnaround times under the Digital India mission.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all ${
                  showSavedOnly
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
                <span>{t('myBookmarks')} ({bookmarks.length})</span>
              </button>

              <button
                onClick={() => setFilterApiOnly(!filterApiOnly)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-all ${
                  filterApiOnly
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>API Available</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pt-5 pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'All' ? t('allCategories') : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPlatforms.length}</strong> government platforms
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </p>
        </div>

        {filteredPlatforms.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No government portals found</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search keywords, clear category filters, or search for generic terms like "identity", "tax", "license", or "pension".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowSavedOnly(false);
                setFilterApiOnly(false);
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map((platform) => {
              const saved = isBookmarked(platform.id);

              return (
                <div
                  key={platform.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="p-5 sm:p-6">
                    {/* Header: Category + Badges + Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
                        {platform.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          .gov.in
                        </span>
                        <button
                          onClick={(e) => handleBookmarkToggle(platform, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            saved
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={saved ? t('savedPortal') : t('savePortal')}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Platform Title */}
                    <Link to={`/government-platforms/${platform.id}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {platform.name}
                        {platform.hindiName && (
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            ({platform.hindiName})
                          </span>
                        )}
                      </h3>
                    </Link>

                    {/* Ministry */}
                    {platform.ministry && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        {platform.ministry}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 mb-4 line-clamp-2 leading-relaxed">
                      {platform.description}
                    </p>

                    {/* Key Services Offered Pills */}
                    {platform.keyServices && platform.keyServices.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Key Citizen Services:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {platform.keyServices.slice(0, 2).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                            >
                              • {srv}
                            </span>
                          ))}
                          {platform.keyServices.length > 2 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{platform.keyServices.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {platform.helpline && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span className="truncate">{platform.helpline}</span>
                        </div>
                      )}
                      {platform.turnaroundTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="truncate">{platform.turnaroundTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-slate-50/80 dark:bg-slate-850 px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <Link
                      to={`/government-platforms/${platform.id}`}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      {t('viewDetails')} <ArrowRight className="w-3 h-3" />
                    </Link>

                    <a
                      href={platform.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t('openPortal')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
