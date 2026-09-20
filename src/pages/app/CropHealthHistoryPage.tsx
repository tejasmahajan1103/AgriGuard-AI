import Card, { CardTitle } from '../../components/ui/Card';
import HealthChart from '../../components/ui/HealthChart';
import StatusBadge from '../../components/ui/StatusBadge';
import { mockHealthHistory, mockCrops } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

export default function CropHealthHistoryPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Crop Health History</h1>
        <p className="text-slate-500">Track how your crops' health has changed over time.</p>
      </div>

      {/* Main Chart */}
      <Card>
        <CardTitle>Health Score Trend</CardTitle>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Overall health score across all crops over the past growing season.
        </p>
        <HealthChart data={mockHealthHistory} height={350} />
      </Card>

      {/* Health Timeline */}
      <Card>
        <CardTitle>Health Timeline</CardTitle>
        <div className="mt-4 relative">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-slate-200" />

          <div className="space-y-4">
            {mockHealthHistory.map((record, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                {/* Dot */}
                <div
                  className="w-[9px] h-[9px] rounded-full mt-1.5 flex-shrink-0 z-10 ring-4 ring-white"
                  style={{
                    backgroundColor:
                      record.healthScore >= 80
                        ? '#10b981'
                        : record.healthScore >= 60
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                />

                {/* Content */}
                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-800">
                        Score: {record.healthScore}%
                      </span>
                      <StatusBadge status={record.status} />
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(record.date)}</span>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-slate-500 mt-2">{record.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Crop Summary */}
      <Card>
        <CardTitle>Crop Health Summary</CardTitle>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockCrops.slice(0, 6).map((crop) => (
            <div key={crop.id} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">{crop.name}</span>
                <StatusBadge status={crop.healthStatus} />
              </div>
              <p className="text-xs text-slate-500">{crop.farmName}</p>
              <p className="text-xs text-slate-400 mt-1">
                Last scan: {crop.lastScanDate ? formatDate(crop.lastScanDate) : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
