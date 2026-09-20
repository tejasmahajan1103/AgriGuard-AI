import { useNavigate } from 'react-router-dom';
import {
  Warehouse,
  Sprout,
  AlertTriangle,
  ScanLine,
  Plus,
  Bot,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card, { CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import HealthChart from '../../components/ui/HealthChart';
import { mockFarms, mockCrops, mockScans, mockAlerts, mockWeather, mockHealthHistory } from '../../data/mockData';
import { formatDate, getRelativeTime, formatTemperature } from '../../utils/formatters';
import { WeatherCondition } from '../../types';

const weatherIcons: Record<string, string> = {
  [WeatherCondition.Sunny]: '☀️',
  [WeatherCondition.PartlyCloudy]: '⛅',
  [WeatherCondition.Cloudy]: '☁️',
  [WeatherCondition.Rainy]: '🌧️',
  [WeatherCondition.Stormy]: '⛈️',
  [WeatherCondition.Windy]: '💨',
  [WeatherCondition.Foggy]: '🌫️',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const cropsNeedingAttention = mockCrops.filter(
    (c) => c.healthStatus === 'Poor' || c.healthStatus === 'Critical' || c.healthStatus === 'Fair'
  );
  const unreadAlerts = mockAlerts.filter((a) => !a.isRead);

  const quickActions = [
    { icon: <Plus className="w-5 h-5" />, label: 'Add Farm', onClick: () => navigate('/app/farms'), color: 'from-emerald-500 to-green-500' },
    { icon: <Sprout className="w-5 h-5" />, label: 'Add Crop', onClick: () => navigate('/app/crops'), color: 'from-blue-500 to-cyan-500' },
    { icon: <ScanLine className="w-5 h-5" />, label: 'Scan Crop', onClick: () => navigate('/app/scan'), color: 'from-purple-500 to-violet-500' },
    { icon: <Bot className="w-5 h-5" />, label: 'Ask AI', onClick: () => navigate('/app/assistant'), color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's your farm overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farms"
          value={mockFarms.length}
          icon={<Warehouse className="w-5 h-5" />}
          color="emerald"
          trend="up"
          trendValue="+1"
        />
        <StatCard
          title="Total Crops"
          value={mockCrops.length}
          icon={<Sprout className="w-5 h-5" />}
          color="blue"
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title="Need Attention"
          value={cropsNeedingAttention.length}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="amber"
          trend="down"
          trendValue="-1"
        />
        <StatCard
          title="Recent Scans"
          value={mockScans.length}
          icon={<ScanLine className="w-5 h-5" />}
          color="purple"
          trend="up"
          trendValue="+2"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              {action.icon}
            </div>
            <span className="text-sm font-semibold text-slate-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Crop Health Overview - Spans 2 cols */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Crop Health Overview</CardTitle>
            <button
              onClick={() => navigate('/app/health-history')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <HealthChart data={mockHealthHistory} height={250} />
        </Card>

        {/* Weather Summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Weather</CardTitle>
            <button
              onClick={() => navigate('/app/weather')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center py-2">
            <div className="text-5xl mb-2">{weatherIcons[mockWeather.condition]}</div>
            <div className="text-3xl font-bold text-slate-800">
              {formatTemperature(mockWeather.temperature)}
            </div>
            <div className="text-sm text-slate-500 mt-1">{mockWeather.condition}</div>
            <div className="text-xs text-slate-400 mt-0.5">{mockWeather.location}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-xs text-slate-500">Humidity</div>
              <div className="text-sm font-bold text-slate-700">{mockWeather.humidity}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">Rain</div>
              <div className="text-sm font-bold text-slate-700">{mockWeather.rainProbability}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500">Wind</div>
              <div className="text-sm font-bold text-slate-700">{mockWeather.windSpeed} km/h</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>
              Recent Alerts
              {unreadAlerts.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadAlerts.length}
                </span>
              )}
            </CardTitle>
            <button
              onClick={() => navigate('/app/alerts')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mockAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  alert.isRead ? 'bg-white' : 'bg-amber-50/50'
                }`}
              >
                <StatusBadge status={alert.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{alert.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getRelativeTime(alert.dateTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Scans */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Scans</CardTitle>
            <button
              onClick={() => navigate('/app/scan')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              New Scan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mockScans.slice(0, 4).map((scan) => (
              <div
                key={scan.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/scan/result/${scan.id}`)}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <ScanLine className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{scan.cropName}</p>
                  <p className="text-xs text-slate-500">{scan.farmName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-slate-700">
                    {scan.result.isHealthy ? '✅ Healthy' : `⚠️ ${scan.result.disease}`}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(scan.scanDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
