import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ScanLine, Sprout, CloudSun, Lightbulb } from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import HealthChart from '../../components/ui/HealthChart';
import { mockCrops, mockScans, mockHealthHistory, mockWeather } from '../../data/mockData';
import { formatDate, formatTemperature } from '../../utils/formatters';

export default function CropDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const crop = mockCrops.find((c) => c.id === id);
  const cropScans = mockScans.filter((s) => s.cropId === id);
  const latestScan = cropScans[0];

  if (!crop) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Crop not found.</p>
        <Button variant="outline" onClick={() => navigate('/app/crops')} className="mt-4">
          Back to Crops
        </Button>
      </div>
    );
  }

  const recommendations = [
    'Apply balanced NPK fertilizer (10-10-10) bi-weekly',
    'Monitor soil moisture levels daily',
    'Inspect for pest activity twice a week',
    'Ensure adequate drainage during rainy season',
    'Consider pruning lower branches for airflow',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/app/crops')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Crops
      </button>

      {/* Crop Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{crop.name}</h1>
                <p className="text-sm text-slate-500">
                  {crop.farmName} {crop.variety ? `· ${crop.variety}` : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={crop.healthStatus} size="md" />
            <Badge variant="purple" size="md">{crop.growthStage}</Badge>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Planted
            </div>
            <div className="text-sm font-semibold text-slate-700 mt-1">
              {formatDate(crop.plantingDate)}
            </div>
          </div>
          {crop.expectedHarvestDate && (
            <div>
              <div className="text-xs text-slate-500">Expected Harvest</div>
              <div className="text-sm font-semibold text-slate-700 mt-1">
                {formatDate(crop.expectedHarvestDate)}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-slate-500">Growth Stage</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{crop.growthStage}</div>
          </div>
          {crop.lastScanDate && (
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <ScanLine className="w-3 h-3" /> Last Scan
              </div>
              <div className="text-sm font-semibold text-slate-700 mt-1">
                {formatDate(crop.lastScanDate)}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Health History</CardTitle>
            <button
              onClick={() => navigate('/app/health-history')}
              className="text-sm text-emerald-600 font-medium cursor-pointer"
            >
              View Full History
            </button>
          </div>
          <HealthChart data={mockHealthHistory} height={220} />
        </Card>

        {/* Latest Scan */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Latest Scan Result</CardTitle>
            <Button
              variant="secondary"
              size="sm"
              icon={<ScanLine className="w-3.5 h-3.5" />}
              onClick={() => navigate('/app/scan')}
            >
              New Scan
            </Button>
          </div>
          {latestScan ? (
            <div
              className="p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => navigate(`/app/scan/result/${latestScan.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">
                  {latestScan.result.isHealthy ? '✅ Healthy' : `⚠️ ${latestScan.result.disease}`}
                </span>
                <span className="text-xs text-slate-500">{formatDate(latestScan.scanDate)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Confidence: {latestScan.result.confidence}%</span>
                <span>Severity: {latestScan.result.severity}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ScanLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No scans yet</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/app/scan')}
              >
                Scan Now
              </Button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weather */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            Weather Conditions
          </CardTitle>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Temperature</div>
              <div className="text-lg font-bold text-slate-800">{formatTemperature(mockWeather.temperature)}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Humidity</div>
              <div className="text-lg font-bold text-slate-800">{mockWeather.humidity}%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Rain Probability</div>
              <div className="text-lg font-bold text-slate-800">{mockWeather.rainProbability}%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Wind</div>
              <div className="text-lg font-bold text-slate-800">{mockWeather.windSpeed} km/h</div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Recommendations
          </CardTitle>
          <div className="mt-4 space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-600">{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
