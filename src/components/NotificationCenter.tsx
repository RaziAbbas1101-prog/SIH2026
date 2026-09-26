import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Settings } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
}

const exampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Scholarship Scheme',
    description: 'Deadline: 30 September',
    type: 'info',
  },
  {
    id: '2',
    title: 'Income Certificate Renewal',
    description: 'Action Required',
    type: 'warning',
  },
  {
    id: '3',
    title: 'Application INC123456',
    description: 'Status Updated',
    type: 'success',
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-100 dark:border-slate-800"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-500" />
              Notifications
            </h3>
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="text-[10px] flex items-center gap-1 font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              >
                <Settings className="w-3 h-3" />
                Turn On
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {permission === 'denied' && (
              <div className="p-4 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 text-center border-b border-amber-100 dark:border-amber-900/50">
                Please enable notifications in your browser settings to receive important updates.
              </div>
            )}
            
            {exampleNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 items-start"
              >
                <div className="mt-0.5">{getIcon(notif.type)}</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {notif.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 text-center bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
            <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
