import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { 
  getTrackedApplications, 
  saveTrackedApplication, 
  deleteTrackedApplication,
  UserApplication 
} from '../services/userService';
import { platforms } from '../utils/seedPlatforms';
import { 
  FileCheck2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  'Submitted': { label: 'Submitted', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300', icon: Clock },
  'In Verification': { label: 'In Verification', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300', icon: Clock },
  'Approved': { label: 'Approved', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300', icon: CheckCircle },
  'Action Required': { label: 'Action Required', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300', icon: AlertCircle },
  'Dispatched / Completed': { label: 'Dispatched / Completed', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300', icon: CheckCircle }
};

export default function ApplicationTracker() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [platformId, setPlatformId] = useState('passport-seva');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [status, setStatus] = useState<UserApplication['status']>('Submitted');
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await getTrackedApplications(user ? user.uid : null);
      setApplications(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !referenceNumber.trim()) return;

    const matchedPlatform = platforms.find(p => p.id === platformId);
    await saveTrackedApplication(user ? user.uid : null, {
      platformId,
      platformName: matchedPlatform ? matchedPlatform.name : 'Government Service',
      serviceName: serviceName.trim(),
      referenceNumber: referenceNumber.trim(),
      status,
      submissionDate,
      notes: notes.trim()
    });

    setServiceName('');
    setReferenceNumber('');
    setNotes('');
    setShowAddModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this tracked application?')) {
      await deleteTrackedApplication(user ? user.uid : null, id);
      setApplications(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('myTracker')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t('myTrackerDesc')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addApplication')}</span>
        </button>
      </div>

      {/* Applications list */}
      {loading ? (
        <div className="py-8 text-center text-sm text-slate-500 animate-pulse">
          Loading application records...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
            {t('noApplications')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Application</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => {
            const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG['Submitted'];
            const StatusIcon = statusConfig.icon;
            const matchedPlatform = platforms.find(p => p.id === app.platformId);

            return (
              <div
                key={app.id}
                className="bg-slate-50/80 dark:bg-slate-850 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {app.platformName}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {app.serviceName}
                  </h4>

                  <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-800 my-2.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Acknowledgement / Reference Ref:
                    </div>
                    <div className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 select-all">
                      {app.referenceNumber}
                    </div>
                  </div>

                  {app.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 italic bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded border border-amber-200/50 dark:border-amber-900/30">
                      "{app.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Submitted on: {app.submissionDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  {matchedPlatform ? (
                    <a
                      href={matchedPlatform.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Check Status on Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span></span>
                  )}
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              {t('addApplication')}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service / Purpose
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Passport Re-issue / Address Update in Aadhaar"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Government Portal
                </label>
                <select
                  value={platformId}
                  onChange={(e) => setPlatformId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Application / ARN / Docket #
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLR10982348 or URN 0000/1234"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="In Verification">In Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Action Required">Action Required</option>
                    <option value="Dispatched / Completed">Dispatched / Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Date
                </label>
                <input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Private Notes / Next Action (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Appointment scheduled for 10 AM, take original 10th marksheet."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
