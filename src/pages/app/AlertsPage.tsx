import { useState } from 'react';
import { CheckCheck, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import { mockAlerts } from '../../data/mockData';
import { getRelativeTime, formatDateTime } from '../../utils/formatters';
import { AlertSeverity } from '../../types';

const severityOrder = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.High]: 1,
  [AlertSeverity.Medium]: 2,
  [AlertSeverity.Low]: 3,
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<string>('all');

  const filteredAlerts = alerts
    .filter((a) => filter === 'all' || a.severity === filter)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleMarkRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleMarkAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
  };

  const alertTypeIcons: Record<string, string> = {
    Disease: '🦠',
    Pest: '🐛',
    Weather: '🌤️',
    Irrigation: '💧',
    Nutrient: '🧪',
    General: '📋',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Alerts</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCheck className="w-4 h-4" />}
            onClick={handleMarkAllRead}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
        {['all', ...Object.values(AlertSeverity)].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilter(sev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap cursor-pointer ${
              filter === sev
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {sev === 'all' ? 'All' : sev}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card
            key={alert.id}
            hover
            onClick={() => handleMarkRead(alert.id)}
            className={`${!alert.isRead ? 'border-l-4 border-l-amber-400 bg-amber-50/30' : ''}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{alertTypeIcons[alert.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-800">{alert.title}</h3>
                  <StatusBadge status={alert.severity} />
                  <Badge variant="default">{alert.type}</Badge>
                  {!alert.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-slate-400">{getRelativeTime(alert.dateTime)}</span>
                  <span className="text-xs text-slate-400">{formatDateTime(alert.dateTime)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No alerts</h3>
            <p className="text-sm text-slate-500">No alerts match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
